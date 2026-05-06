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

`npm install` is the only setup step — it configures the git hook (via the `prepare` script) and installs the `yaml` parser used by the transform. To run the transform manually at any time:

```
npm run swagger:transform
```

### Publishing Changes

Install our Github App to auto propagate changes from your repo to your deployment. Changes will be deployed to production automatically after pushing to the default branch. Find the link to install on your dashboard. 

#### Troubleshooting

- Mintlify dev isn't running - Run `mintlify install` it'll re-install dependencies.
- Page loads as a 404 - Make sure you are running in a folder with `docs.json`
