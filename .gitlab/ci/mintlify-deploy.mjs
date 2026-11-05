#!/usr/bin/env node
/**
 * Trigger a Mintlify deployment and wait for its outcome, so that a failed
 * Mintlify build fails the GitLab pipeline.
 *
 * Mintlify builds from the Git source configured in its dashboard (Git
 * Settings), not from this job's checkout: the job only asks for an update.
 *
 * Environment:
 *   MINTLIFY_API_KEY          admin API key (dashboard > Settings > API keys)
 *   MINTLIFY_PROJECT_ID       project ID, shown on the same page
 *   MINTLIFY_DEPLOY_TIMEOUT   seconds to wait before giving up (default 900)
 *
 * API: https://www.mintlify.com/docs/api/update/trigger
 *      https://www.mintlify.com/docs/api/update/status
 */

const API = 'https://api.mintlify.com/v1/project';
const POLL_MS = 10_000; // status endpoint allows 20 requests per 10 s per organization

const { MINTLIFY_API_KEY: key, MINTLIFY_PROJECT_ID: project, CI_COMMIT_SHA: sha } = process.env;
const timeoutMs = Number(process.env.MINTLIFY_DEPLOY_TIMEOUT ?? 900) * 1000;

if (!key || !project) {
  console.error('MINTLIFY_API_KEY and MINTLIFY_PROJECT_ID must be set.');
  process.exit(2);
}

async function call(path, method = 'GET') {
  const res = await fetch(API + path, { method, headers: { Authorization: `Bearer ${key}` } });
  const body = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> HTTP ${res.status}: ${body}`);
  return JSON.parse(body);
}

const { statusId } = await call(`/update/${encodeURIComponent(project)}`, 'POST');
console.log(`Mintlify update queued (status ${statusId}).`);

const deadline = Date.now() + timeoutMs;
let last;
while (Date.now() < deadline) {
  await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  const update = await call(`/update-status/${encodeURIComponent(statusId)}`);
  if (update.status !== last) {
    last = update.status;
    console.log(`Mintlify update ${last}.`);
  }
  if (update.status !== 'success' && update.status !== 'failure') continue;

  if (update.commit?.sha && sha && update.commit.sha !== sha) {
    console.log(`Note: Mintlify built ${update.commit.sha}, the pipeline is on ${sha}.`);
  }
  if (update.summary) console.log(update.summary);
  if (update.status === 'success') process.exit(0);
  for (const line of update.logs ?? []) console.error(line);
  process.exit(1);
}

console.error(`Mintlify update ${statusId} still "${last}" after ${timeoutMs / 1000} s.`);
process.exit(1);
