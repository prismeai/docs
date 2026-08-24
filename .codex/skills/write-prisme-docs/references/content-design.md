# Content design reference

Use this reference to select the appropriate page structure and write scannable, accessible, and maintainable documentation for Prisme.ai.

## Contents

1. Page-type rules
2. Information architecture
3. Task-page contract
4. Procedures and examples
5. Style and terminology
6. Accessibility and localization
7. Images and diagrams
8. Search and freshness
9. Anti-patterns

## 1. Page-type rules

Apply the Diátaxis framework as an editorial benchmark to ensure every page serves a single primary intent:

| Type | Reader state | Include | Exclude |
|---|---|---|---|
| Tutorial | Learning | Guided, safe, reproducible experience; early visible result | Alternatives, exhaustive options, long theory |
| How-to | Working | One real outcome; prerequisites; actions; verification | Teaching digressions, full parameter catalog |
| Concept | Understanding | Relationships, boundaries, architecture, rationale, tradeoffs | Step-by-step setup |
| Reference | Looking up | Complete, terse, predictable facts | Narrative and persuasion |
| Troubleshooting | Recovering | Searchable symptom, cause, owner, resolution, verification | Generic “try again” advice |

A compact page may include a brief supporting concept before a procedure or a short troubleshooting table after it. Split content into separate pages whenever readers must switch user roles, when their core intent changes, or when supplementary material becomes independently valuable.

## 2. Information architecture

Structure navigation and page hierarchies around user personas and operational goals rather than internal codebase boundaries or software menu trees.

1. Map all actors, entry points, workflows, decision forks, dependencies, handoffs, and failure states.
2. Use natural, task-oriented language in page titles and navigation labels.
3. Introduce foundational concepts before the procedures that depend on them.
4. Assign every distinct, high-value task its own permanent, granular URL.
5. Create overview pages only when readers need guidance to select between alternative paths.
6. Place cross-references directly at the point of decision or handoff.
7. Avoid link-only landing pages unless they serve as intentional navigation hubs.

### Progressive disclosure

- Present the standard, recommended, and safe path first.
- Label alternative workflows by the specific requirement they address (for example, "For automated environments," rather than "Alternative method").
- Keep prerequisites, permission changes, destructive actions, and verification checks visible in the main body.
- Never place mandatory instructions exclusively inside collapsed accordions.
- Use dedicated role-specific pages instead of tabbed UI components when users need distinct entry points, stable bookmarkable URLs, or clean search results.

## 3. Task-page contract

Every task-oriented page must explicitly answer:

- Who performs this task?
- In which UI surface, interface, or environment do they perform it?
- What initial system state, access rights, and prerequisites are required?
- What configuration values, credentials, or upstream artifacts must be available?
- What changes occur as a result of these actions, and what is their operational scope?
- How does the user verify that the procedure succeeded?
- What downstream actor or next step continues the workflow?
- How can the user roll back or reverse the changes?

Recommended section order:

1. Outcome-focused page title.
2. Summary paragraph (1 to 3 sentences) defining the persona, scope, and applicability.
3. Availability constraints or operating-model warnings (if applicable).
4. Before you begin (prerequisites).
5. Numbered procedure, organized into logical phases when extensive.
6. Verification.
7. Next steps or handoff.
8. Troubleshooting.
9. Rollback, removal, or credential revocation instructions (when applicable).

Specify prerequisites with precision:

- Exact product tier, plan, environment, or deployment model.
- Exact Prisme.ai roles and third-party provider permissions required.
- Specific accounts, base URLs, credentials, CLI tools, software versions, and completed setup tasks.
- Values that must exist beforehand versus values generated during the procedure.
- Who provides sensitive credentials and the exact fields where they must be entered.
- Scope of configuration: personal, agent, workspace, organization, platform, or provider level.

## 4. Procedures and examples

### Step grammar

Format procedural steps using this structure:

> [Context, condition, or location], [imperative action]. [Expected result, if applicable.]

Examples:

- In Agent Factory, open the agent and select **Capabilities**.
- For **Authentication mode**, select **Central OAuth**.
- Select **Publish**. The agent status updates to **Live**.

Procedural rules:

- Use numbered lists for sequential tasks.
- Assign one distinct action to each step; combine actions only when they are brief and occur within the immediate UI context.
- State conditions, prerequisites, and branch choices before the action to take.
- Label non-mandatory steps clearly with `Optional:`.
- Always include the final action required to save or apply the state (**Save**, **Publish**, **Authorize**).
- Insert clear checkpoints following failure-prone, asynchronous, shared, resource-intensive, or destructive operations.
- Avoid interrupting a procedure with extensive conceptual background; link out to concepts instead.
- Do not duplicate shared setup procedures across multiple pages; link directly to the canonical source page.

### Examples

- Provide the simplest complete example that demonstrates the intended result.
- Maintain a single, consistent real-world scenario throughout a tutorial.
- Define all placeholders and variables immediately adjacent to the code or command block.
- Specify the required execution context, shell, and user identity.
- Show realistic output and expected final states.
- Use reserved domains (such as `example.com`) and synthetic IDs in samples.
- Never expose real API keys, secrets, personal data, production identifiers, internal URLs, or insecure defaults.
- Pin dependency and package versions whenever reproducibility depends on them.
- Validate and test commands and code samples directly before publishing.

## 5. Style and terminology

- Write in a direct, neutral, and factual tone.
- Address the reader directly as "you."
- Use the active voice and imperative mood throughout procedural instructions.
- Write short, clear sentences, front-loading the most critical information.
- Use sentence case for all titles, headings, and table headers.
- Begin task titles with active verbs and concept/reference titles with descriptive nouns.
- Maintain a strict, unbroken heading hierarchy with unique heading titles.
- Write descriptive link text that remains meaningful when read out of context.
- Avoid "click here," ambiguous pronouns, conversational filler, idioms, metaphors, humor, and stacked modifiers.
- Define uncommon abbreviations and acronyms on first mention.
- Use exactly one canonical term per concept; do not introduce synonyms for stylistic variation.
- Match product and UI capitalization exactly.
- Do not use em dashes or en dashes. Use a comma, a colon, parentheses, a hyphen, or a new sentence instead; write numeric ranges as `1 to 3`.
- Use `code font` for literal values, parameters, configuration flags, statuses, terminal commands, file paths, IDs, and error strings.
- Avoid transient temporal words such as "new," "latest," "currently," and "soon" in evergreen documentation; record dated version changes in release notes instead.

## 6. Accessibility and localization

### Structure

- Use semantic markdown headings without skipping intermediate levels.
- Format structured items using native markdown numbered or bulleted lists.
- Use tables exclusively for structured, tabular data or direct comparisons, and introduce each table with explanatory prose.
- Keep table structures straightforward and always include clear column header cells.
- Ensure critical meaning is never conveyed solely through color, visual positioning, standalone icons, or images.
- Write descriptive link text that clearly identifies the target resource.

### Interaction language

- Use device-neutral verbs such as "select" rather than hardware-specific terms like "click" or "tap."
- Identify UI components through clear naming rather than spatial references like "above," "below," "on the left," or "on the right."
- If navigation paths use breadcrumb delimiters (such as `>`), ensure the rendering engine exposes them accessibly to screen readers, or express the path in prose.

### Localization-ready prose

- Follow standard subject-verb-object sentence structures.
- Keep grammatical subjects and articles explicit.
- Place conditions before instructions in procedural steps.
- Avoid culture-specific references, ambiguous date formats, regional idioms, and phrasal verbs.
- Maintain strict consistency in terminology and casing across pages.
- Avoid embedding text directly inside raster images.
- Allow for visual layout expansion resulting from translated text.

## 7. Images and diagrams

Include screenshots only when an interface element is difficult to locate, visually subtle, or surrounded by similar controls. Text instructions must always be complete enough to follow without the image.

- Crop images tightly around the relevant UI components.
- Remove all sensitive credentials, personal information, internal hostnames, and extraneous browser frames.
- Provide descriptive, purpose-driven alt text; use empty alt text (`alt=""`) only for purely decorative graphics.
- Never present code blocks, terminal output, or critical procedural steps solely inside an image.
- Use SVG format for architectural and workflow diagrams whenever practical.
- Keep asset filenames stable when updating images that are referenced across multiple pages.
- Update screenshots whenever UI layouts or deployment configurations change.
- Provide captions, summaries, or text transcripts for video demonstrations and animations.
- Verify that visual assets render legibly across mobile viewports, high zoom levels, and dark/light display themes.

Use diagrams when they clarify complex authorization flows, ownership boundaries, state transitions, or interactions across three or more components. Always accompany diagrams with explanatory prose that conveys the same essential information.

## 8. Search and freshness

### Findability

- Incorporate natural search terms used by the target persona into page titles, descriptions, headings, and introductory paragraphs.
- Ensure the page title and meta description complement each other rather than repeating the exact same sentence.
- Use literal error strings and symptom descriptions in troubleshooting section headings.
- Add targeted cross-links to directly related task and concept pages.
- Configure and maintain URL redirects whenever page paths or slugs change.

### Freshness

- Document current, actively supported system behavior by default.
- Clearly identify differences across pricing tiers, software versions, environments, deployments, and feature flags.
- Record content owners and review triggers when supported by repository metadata.
- Update documentation in the same development cycle as the corresponding product changes.
- Automatically generate reference documentation from authoritative schemas and API specifications where possible.

## 9. Anti-patterns

Avoid the following practices:

- Combining setup instructions for administrators, workspace builders, and end users into a single monolithic guide.
- Mirroring internal code architectures or menu trees in the user-facing navigation structure.
- Presenting a simple sandbox walkthrough as if it were a production-ready implementation guide.
- Introducing mandatory prerequisites midway through a procedural workflow.
- Listing multiple authentication mechanisms without explaining when to use each one.
- Instructing users to "configure the appropriate permissions" without specifying exact roles, scopes, or policies.
- Providing code samples containing undefined or unexplained placeholder variables.
- Publishing procedures that lack explicit verification steps, rollback guidance, or handoff criteria.
- Describing error resolutions vaguely as "try again later" or "contact support."
- Relying on screenshots as the sole source of instructional steps.
- Duplicating manually maintained facts across multiple documentation pages.
- Framing evergreen capabilities with transient phrases like "new" or "recently updated."
- Generating procedural instructions from AI guesses rather than verified implementation code or authoritative specifications.
