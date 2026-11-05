# Prisme.ai documentation

*Works best with node 22*

### Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mintlify) to preview the documentation changes locally. To install, use the following command

```
npm i -g mintlify
```

Run the following command at the root of your documentation (where docs.json is)

```
mintlify dev
```

### Syncing the API reference spec

The OpenAPI spec at `api-reference/swagger.yml` is a copy of the [upstream spec](https://gitlab.com/prisme.ai/prisme.ai/-/blob/main/specifications/swagger.yml), normalized for Mintlify (summaries, tag descriptions, deduplicated operation IDs, …). When you drop in a fresh upstream copy, a pre-commit hook auto-applies the transformations.

`npm install` is the only setup step; it configures the git hook (via the `prepare` script) and installs the `yaml` parser used by the transform. To run the transform manually at any time:

```
npm run swagger:transform
```

### Publishing Changes

Install our Github App to auto propagate changes from your repo to your deployment. Changes will be deployed to production automatically after pushing to the default branch. Find the link to install on your dashboard. 

### Deploying from GitLab

The GitLab copy of this repository ([prisme.ai/docs](https://gitlab.com/prisme.ai/docs)) runs `.gitlab-ci.yml`:

- **`validate`** and **`broken-links`** run `mint validate` and `mint broken-links` on every merge request and on `main`. They do not block yet, because `main` still has errors; make them blocking (`allow_failure: false`) once `main` passes.
- **`deploy`** runs on `main` and calls the Mintlify API (`.gitlab/ci/mintlify-deploy.mjs`). It waits for the build and fails the pipeline if Mintlify fails.

To turn on deployment from GitLab:

1. In the Mintlify dashboard, **Git Settings**: connect GitLab with the project ID and a project access token (role Maintainer, scopes `api` and `read_api`), branch `main`. Mintlify builds from this source, so do this first: until then the API redeploys the GitHub repository.
2. In GitLab, **Settings > CI/CD > Variables**: add `MINTLIFY_API_KEY` (admin API key, masked and protected) and `MINTLIFY_PROJECT_ID` (both from the dashboard's **API keys** page). The `deploy` job only runs when both are set.
3. In GitLab, **Settings > Webhooks**: add `https://leaves.mintlify.com/gitlab-webhook` with the dashboard's webhook token as **Secret token**, and tick **Merge request events** only, for preview deployments. Leave **Push events** off: the `deploy` job already deploys `main`, and the webhook would deploy it a second time, outside the pipeline.
4. Uninstall the Mintlify GitHub App from the GitHub repository.

#### Troubleshooting

- Mintlify dev isn't running - Run `mintlify install` it'll re-install dependencies.
- Page loads as a 404 - Make sure you are running in a folder with `docs.json`
