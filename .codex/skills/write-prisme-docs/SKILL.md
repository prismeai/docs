---
name: write-prisme-docs
description: Research, plan, write, rewrite, and audit Prisme.ai product documentation in Mintlify MDX. Use for Prisme.ai concepts, tutorials, how-to guides, reference pages, troubleshooting, product overviews, navigation, or multi-role App+MCP connector documentation for end users, agent builders, workspace builders, organization administrators, platform administrators, and provider administrators.
---

# Write Prisme.ai documentation

Create task-oriented, technically verified documentation that enables readers to achieve concrete outcomes without contacting support. Verify all product behavior against authoritative sources, design each page around a single primary purpose, and validate your work before delivery.

## Scale the effort to the change

- **Small change** (fixing a typo, UI label, or link, or updating a single verified fact): Check `git status --short` and leave unrelated changes untouched. Verify the target fact against the current implementation or UI, apply the edit, run the auditor (step 8.1), and report your findings. You can skip the rest of the workflow. Any edit that alters a behavioral claim, such as a default value, scope, required permission, or supported version, is not a small change; apply the full workflow instead.
- **New page or substantial rewrite**: Follow the full workflow from start to finish.
- **Audit of an existing page**: Run the auditor, evaluate the page against [references/quality-gates.md](references/quality-gates.md), check for known drift ([references/prisme-product-model.md](references/prisme-product-model.md) §7), and report your findings without editing the file unless explicitly requested.

## Route the work

Consult only the reference documents necessary for your task:

- [references/content-design.md](references/content-design.md) - Page types, structural patterns, procedural formatting, accessibility, and style rules (the canonical style source).
- [references/prisme-product-model.md](references/prisme-product-model.md) - Product surfaces, user personas, approved terminology, evidence hierarchy, and known product drift.
- [references/connector-journeys.md](references/connector-journeys.md) - Workflows involving Apps, connectors, Model Context Protocol (MCP), OAuth, capabilities, or third-party SaaS integrations.
- [references/quality-gates.md](references/quality-gates.md) - Verification criteria to review before delivering any change.
- [references/research-sources.md](references/research-sources.md) - External provenance and background methodology; consult only when modifying the documentation framework itself.

Use the starter files in `assets/templates/` as initial structural guides rather than boilerplate to copy verbatim: `concept`, `how-to`, `tutorial`, `reference`, `troubleshooting`, `connector-overview`, and `connector-role-guide` (each stored as `<name>.mdx.tpl` so the docs site build does not parse them as pages).

## Follow the workflow

### 1. Protect the working context

1. Run `git status --short`. Treat existing workspace modifications as user-owned: do not overwrite, reformat, stage, or revert unrelated work.
2. Review `docs.json` and surrounding documentation pages to match existing site hierarchy and MDX patterns.
3. Verify all system behavior against local product code, workspace YAML definitions, schemas, OpenAPI specifications, UI copy, and automated tests before consulting external web sources. Inspect official external documentation only when third-party provider UIs, scopes, or endpoints may have changed.

### 2. Write a content contract

Do not begin drafting until you have defined the page's core contract by completing this template:

> For **[actor]**, who already knows **[assumed knowledge]**, this page helps them **[achieve one outcome]** in **[surface and environment]**; success is visible when **[observable result]**.

Explicitly identify:
- Required Prisme.ai roles and external provider permissions.
- Preconditions, artifacts, and configuration values provided by earlier steps or upstream actors.
- Expected side effects and rollback instructions.
- The handoff point and artifacts passed to the downstream actor.

If a technical detail cannot be verified against authoritative sources, annotate the exact statement with `{/* REVIEW: ... */}` (using MDX comment syntax, as standard HTML `<!-- -->` comments are invalid in MDX). Never invent or guess UI labels, routes, commands, fields, OAuth scopes, defaults, error messages, or permission names.

### 3. Choose one primary page type

| Reader intent | Page type | Shape |
|---|---|---|
| Learn by doing | Tutorial | Safe, reproducible path with early results |
| Complete a real task | How-to | Prerequisites, numbered actions, verification, next step |
| Understand why or how parts relate | Concept | Context, model, tradeoffs, boundaries |
| Look up exact facts | Reference | Complete, terse, predictable tables or sections |
| Recover from a problem | Troubleshooting | Symptom, cause, resolution, verification |

Limit each page to one primary Diátaxis type. If secondary material grows substantial, extract it into a separate linked page. For complex journeys that span multiple personas, provide an overview and routing page alongside dedicated, role-specific task pages.

### 4. Verify claims in order of authority

Resolve technical questions using the following hierarchy of sources:

1. Current product source code, schemas, automated tests, and exact UI copy.
2. Current canonical Prisme.ai product documentation.
3. Active connector workspace configurations and provider API specifications.
4. Official third-party product and API documentation.
5. Neighboring documentation pages (use these only for voice and MDX patterns, never as sources of behavioral truth).

Reconcile conflicting claims explicitly. Prioritize the currently supported path as primary; document legacy behaviors only when active users still require them, clearly labeling them as legacy and isolating them from the main workflow.

### 5. Design the page

1. State the user's primary goal, applicability constraints, and expected result in the page title and opening paragraph.
2. List all prerequisites before the first action, detailing required roles, accounts, and input values.
3. Present the recommended, safe path first; introduce alternatives only with clear decision criteria.
4. Include an explicit verification step that provides an independent, observable check for success.
5. Define a concrete handoff whenever a downstream actor must continue the workflow.
6. Place contextual troubleshooting next to the relevant procedure, or extract it to a dedicated troubleshooting page when extensive.
7. Add contextual links at decision and handoff points using descriptive text; avoid generic "Related links" sections at the bottom of pages.

For connector documentation, clearly explain the underlying operating model and specify whose identity the external provider sees before detailing setup procedures ([references/connector-journeys.md](references/connector-journeys.md)).

### 6. Write executable content

Follow core editorial standards (consult [references/content-design.md](references/content-design.md) for full style guidance):

- Write in the second person ("you"), using sentence case and direct, neutral English.
- Use one imperative action per numbered step, and explicitly include the final action that persists the change (such as clicking **Save**, **Publish**, or **Authorize**).
- Format exact UI labels in **bold**; format literal values, field names, statuses, routes, and errors in `code font`.
- Describe the expected system response after any failure-prone, asynchronous, or irreversible action.
- Name exact roles, OAuth scopes, or provider permissions, never use vague placeholders like "appropriate permissions."
- Use a single consistent term for each technical concept; follow the terminology table in [references/prisme-product-model.md](references/prisme-product-model.md).

### 7. Make troubleshooting searchable

Title every troubleshooting entry with the exact error string or visible symptom. Structure each entry in this sequence: symptom → most probable cause → responsible persona who can fix it → step-by-step resolution → verification check.

### 8. Validate the result

1. Run the documentation audit script (include `--profile connector` for connector pages):

   ```bash
   python3 .codex/skills/write-prisme-docs/scripts/audit_page.py <page.mdx> --docs-root .
   ```

2. Run any applicable repository linting, schema, or build checks.
3. Execute and test commands and code examples where safe and within scope.
4. Preview the rendered page using an available local preview tool (such as `mintlify dev`); if no preview environment is available, explicitly state in your handoff report that rendering was not verified.
5. Review the page against the criteria in [references/quality-gates.md](references/quality-gates.md).

Never claim full verification when steps were skipped; report untested procedures, unverified claims, and remaining `REVIEW` annotations transparently.

### 9. Report the handoff

Begin your summary by stating what the reader can now accomplish. Then detail:
- All files created, modified, or moved.
- The page type and target persona.
- Authoritative sources used for technical verification.
- Audit and validation checks executed along with their results.
- Any unresolved `{/* REVIEW: ... */}` annotations, unverified assumptions, or untested paths.

Do not stage, commit, publish, deploy, or push changes unless explicitly instructed to do so.
