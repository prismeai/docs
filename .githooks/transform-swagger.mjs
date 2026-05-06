#!/usr/bin/env node
/**
 * Apply Mintlify-friendly transformations to an OpenAPI spec dropped into this repo.
 *
 * Upstream source of truth:
 *   https://gitlab.com/prisme.ai/prisme.ai/-/blob/main/specifications/swagger.yml
 *
 * The upstream spec is optimized for code generation (dtsgen, AJV validation),
 * not for documentation UX. This script normalizes the copy used by Mintlify so
 * the API Reference sidebar renders cleanly without requiring upstream changes.
 *
 * Transformations (all idempotent — re-running is a no-op):
 *   1. Add `summary:` to every operation missing one, derived from `operationId`.
 *   2. Normalize acronym casing in summaries (API, OAuth, MFA, SSO, …).
 *   3. Disambiguate duplicate `operationId`s by appending the HTTP method.
 *      Required by Mintlify (and by OpenAPI spec) to render distinct sidebar entries.
 *   4. Capitalize first letter of tag names (e.g. `permissions` -> `Permissions`).
 *   5. Insert a root `tags:` block with descriptions if missing.
 *   6. Replace placeholder/legacy server URLs with the canonical set.
 *
 * Usage:
 *   npm run swagger:transform                              # canonical entry point
 *   node .githooks/transform-swagger.mjs <path>            # direct invocation
 *
 * Auto-runs as a pre-commit hook on `api-reference/swagger.yml` once
 * `npm install` has configured `core.hooksPath` via the `prepare` script.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { parseDocument, isMap, Pair } from 'yaml';

const HTTP_METHODS = new Set([
  'get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace',
]);

const ACRONYMS = {
  api: 'API', apis: 'APIs', url: 'URL', urls: 'URLs',
  id: 'ID', ids: 'IDs', sso: 'SSO', mfa: 'MFA',
  oauth: 'OAuth', oidc: 'OIDC', jwt: 'JWT', rbac: 'RBAC',
  acl: 'ACL', acls: 'ACLs', json: 'JSON', yaml: 'YAML',
  csv: 'CSV', ui: 'UI', sdk: 'SDK', sdks: 'SDKs',
  http: 'HTTP', https: 'HTTPS', ip: 'IP', ips: 'IPs',
  saml: 'SAML', smtp: 'SMTP', rag: 'RAG', llm: 'LLM',
  tls: 'TLS', ssl: 'SSL', vpc: 'VPC',
};

const TAG_DESCRIPTIONS = [
  ['API Gateway', 'Authentication, session management, SSO providers, and user profile endpoints.'],
  ['Prisme.ai Workspaces', 'CRUD operations for workspaces and their resources (pages, apps, automations, imports, variables).'],
  ['Prisme.ai Runtime', 'Execute workspace automations and manage their runtime lifecycle.'],
  ['Prisme.ai Events', 'Event ingestion, delivery, and subscription filtering across the platform.'],
  ['Organizations', 'Manage organizations, members, roles, invites, groups, and org-level service accounts.'],
  ['Subscriptions', 'Manage organization subscription plans and tier assignments (SuperAdmin only).'],
  ['Secrets', 'Read and patch encrypted key-value secrets scoped to a workspace.'],
  ['ApiKeys', 'Create, list, rotate, and validate workspace-scoped API keys.'],
  ['Permissions', 'Share or unshare resources (workspaces, pages, …) with users via roles or fine-grained rules.'],
  ['Monitoring', 'Platform readiness checks across services (SuperAdmin only).'],
];

const TAG_CAPITALIZATIONS = { permissions: 'Permissions', monitoring: 'Monitoring' };

const CANONICAL_SERVERS = [
  { url: 'https://api.studio.prisme.ai', description: 'Prisme.ai Cloud' },
  {
    url: 'https://{customDomain}',
    description: 'Self-hosted Prisme.ai instance',
    variables: {
      customDomain: {
        default: 'api.your-prisme-instance.com',
        description: 'API hostname of your self-hosted Prisme.ai deployment',
      },
    },
  },
  { url: 'http://localhost:3001', description: 'Local development' },
];

function humanize(opId) {
  let s = opId.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  s = s.replace(/([A-Z]+)(?=[A-Z][a-z])/g, '$1 ');
  s = s.replace(/\s+/g, ' ').trim();
  return s ? s[0].toUpperCase() + s.slice(1) : opId;
}

function fixAcronyms(s) {
  return s.replace(/[A-Za-z]+/g, (w) => ACRONYMS[w.toLowerCase()] ?? w);
}

function strVal(node) {
  if (node == null) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'object' && 'value' in node) return String(node.value ?? '');
  return String(node);
}

function* operations(doc) {
  const paths = doc.get('paths');
  if (!isMap(paths)) return;
  for (const pathPair of paths.items) {
    const item = pathPair.value;
    if (!isMap(item)) continue;
    for (const opPair of item.items) {
      const method = strVal(opPair.key).toLowerCase();
      if (!HTTP_METHODS.has(method)) continue;
      const op = opPair.value;
      if (!isMap(op)) continue;
      yield { pathKey: strVal(pathPair.key), method, op };
    }
  }
}

function transform(filePath) {
  const doc = parseDocument(readFileSync(filePath, 'utf-8'));
  const counters = {
    summariesAdded: 0, acronymsFixed: 0, tagsCapitalized: 0,
    duplicateIdsResolved: 0, opsDisambiguated: 0,
    rootTagsAdded: false, serversUpdated: false,
  };

  // 1. Add summaries from operationId where missing.
  for (const { op } of operations(doc)) {
    const existing = strVal(op.get('summary')).trim();
    if (existing) continue;
    const opId = strVal(op.get('operationId')).trim();
    if (!opId) continue;
    const summary = humanize(opId);
    op.items.unshift(new Pair('summary', summary));
    counters.summariesAdded++;
  }

  // 2. Fix acronyms in summaries.
  for (const { op } of operations(doc)) {
    const node = op.get('summary', true);
    if (!node) continue;
    const current = strVal(node);
    if (!current) continue;
    const fixed = fixAcronyms(current);
    if (fixed !== current) {
      op.set('summary', fixed);
      counters.acronymsFixed++;
    }
  }

  // 3. Disambiguate duplicate operationIds.
  const seen = new Map();
  for (const entry of operations(doc)) {
    const opId = strVal(entry.op.get('operationId')).trim();
    if (!opId) continue;
    if (!seen.has(opId)) seen.set(opId, []);
    seen.get(opId).push(entry);
  }
  for (const [opId, occurrences] of seen) {
    if (occurrences.length < 2) continue;
    counters.duplicateIdsResolved++;
    for (const { method, op } of occurrences) {
      const cap = method[0].toUpperCase() + method.slice(1);
      op.set('operationId', `${opId}${cap}`);
      const existing = strVal(op.get('summary')).trim();
      const suffix = `(${method.toUpperCase()})`;
      if (existing && !existing.endsWith(suffix)) {
        op.set('summary', `${existing} ${suffix}`);
      } else if (!existing) {
        op.set('summary', `${opId} ${suffix}`);
      }
      counters.opsDisambiguated++;
    }
  }

  // 4. Capitalize tag names in operation refs and root tags block.
  for (const { op } of operations(doc)) {
    const tags = op.get('tags', true);
    if (!tags || !tags.items) continue;
    for (let i = 0; i < tags.items.length; i++) {
      const cur = strVal(tags.items[i]);
      if (cur in TAG_CAPITALIZATIONS) {
        tags.set(i, TAG_CAPITALIZATIONS[cur]);
        counters.tagsCapitalized++;
      }
    }
  }
  const rootTags = doc.get('tags', true);
  if (rootTags && rootTags.items) {
    for (const t of rootTags.items) {
      if (!isMap(t)) continue;
      const name = strVal(t.get('name'));
      if (name in TAG_CAPITALIZATIONS) {
        t.set('name', TAG_CAPITALIZATIONS[name]);
      }
    }
  }

  // 5. Add root tags block if missing.
  if (!doc.has('tags')) {
    const used = new Set();
    for (const { op } of operations(doc)) {
      const tags = op.get('tags', true);
      if (!tags || !tags.items) continue;
      for (const t of tags.items) used.add(strVal(t));
    }
    const known = TAG_DESCRIPTIONS
      .filter(([n]) => used.has(n))
      .map(([name, description]) => ({ name, description }));
    const knownNames = new Set(TAG_DESCRIPTIONS.map(([n]) => n));
    const extras = [...used].filter((n) => !knownNames.has(n)).sort()
      .map((name) => ({ name }));
    const block = [...known, ...extras];
    if (block.length) {
      // Insert as new root key just before `paths`.
      const root = doc.contents;
      if (isMap(root)) {
        const idx = root.items.findIndex((p) => strVal(p.key) === 'paths');
        const pair = new Pair('tags', doc.createNode(block));
        if (idx >= 0) root.items.splice(idx, 0, pair);
        else root.items.push(pair);
        counters.rootTagsAdded = true;
      }
    }
  }

  // 6. Force canonical servers list.
  const currentServers = doc.toJS().servers;
  if (JSON.stringify(currentServers) !== JSON.stringify(CANONICAL_SERVERS)) {
    const root = doc.contents;
    if (isMap(root)) {
      const existingIdx = root.items.findIndex((p) => strVal(p.key) === 'servers');
      const pair = new Pair('servers', doc.createNode(CANONICAL_SERVERS));
      if (existingIdx >= 0) {
        root.items.splice(existingIdx, 1, pair);
      } else {
        const infoIdx = root.items.findIndex((p) => strVal(p.key) === 'info');
        root.items.splice(infoIdx >= 0 ? infoIdx + 1 : 0, 0, pair);
      }
      counters.serversUpdated = true;
    }
  }

  // lineWidth defaults to 80: keeps long descriptions wrapped on multiple lines
  // rather than collapsing them. YAML 1.2 plain-scalar folding means we can't
  // reproduce the exact original wrap points, but the layout stays readable.
  writeFileSync(filePath, doc.toString({ flowCollectionPadding: false }));
  return counters;
}

function main() {
  const target = process.argv[2];
  if (!target) {
    console.error('Usage: transform-swagger.mjs <path-to-swagger.yml>');
    process.exit(2);
  }
  if (!existsSync(target)) {
    console.error(`File not found: ${target}`);
    process.exit(2);
  }
  const counters = transform(target);
  const summary = Object.entries(counters)
    .filter(([, v]) => v && v !== 0 && v !== false)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ');
  console.log(
    summary
      ? `transform-swagger: ${target} updated (${summary})`
      : `transform-swagger: ${target} already canonical (no changes)`,
  );
}

main();
