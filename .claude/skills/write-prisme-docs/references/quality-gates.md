# Documentation quality gates

Quality gates are divided into three tiers. Only the first two tiers can block content delivery. For the third tier, state clearly which checks were not performed, never claim human verification that did not take place.

## Machine-checked (must pass)

- [ ] `audit_page.py` completes with zero errors.
- [ ] All internal cross-references and asset links resolve correctly, and external URLs are well-formed.
- [ ] All repository-level lint, build, and schema validation checks pass.

## Agent-checked (verify before delivery)

### Content

- [ ] Identifies one primary actor, one concrete goal, and an observable success state, adhering to a single primary Diátaxis page type.
- [ ] Prerequisites explicitly name required roles, account types, configuration values, and prerequisite workflows.
- [ ] Procedural steps are sequentially numbered and imperative, explicitly include persistence actions (**Save**, **Apply**, **Publish**, **Authorize**), and conclude with an independent verification check.
- [ ] System behaviors, UI labels, routes, commands, parameters, defaults, roles, scopes, and error messages are verified against authoritative code or specifications rather than outdated neighboring docs.
- [ ] Differences across versions, pricing plans, environments, and deployment targets are clearly stated where relevant.
- [ ] External links direct users to official, up-to-date vendor documentation.
- [ ] The content contains no exposed secrets, personal data (PII), internal hostnames, production IDs, or insecure default configurations.

### Connector pages

- [ ] Operating models and credential options are fully explained before configuration instructions begin.
- [ ] The runtime provider identity and credential source are explicitly stated, and capability assignment is clearly distinguished from third-party authorization.
- [ ] Shared and maker credentials include explicit warnings regarding administrative blast radius and scope of access.
- [ ] Full procedures for credential revocation, secret rotation, user offboarding, and connector removal are documented.
- [ ] Handoffs between organization administrators, workspace builders, and end users define concrete entry prerequisites and exit criteria.

### Editorial and accessibility

- [ ] Content uses sentence case, logical and unbroken heading hierarchies, consistent terminology, and descriptive link text.
- [ ] Literal inputs, parameters, and code tokens use code formatting; exact UI elements use bold formatting.
- [ ] The page contains no em dashes or en dashes.
- [ ] Prose remains neutral and evergreen, avoiding promotional phrasing and transient terms like "new," "latest," "currently," or unreleased roadmap commitments.
- [ ] Images include purposeful alt text and never serve as the exclusive source of essential instructions or data.
- [ ] Required procedural instructions are never hidden inside collapsed accordions, and guidance never relies solely on spatial position or color cues.

### Delivery

- [ ] The handoff summary reports all modified files, executed validation checks, remaining `REVIEW` tags, and untested branches.
- [ ] Unrelated workspace modifications remain untouched, with no files staged, committed, or pushed without explicit permission.

## Human-only (report, do not claim)

- Executing procedures end-to-end from a clean, representative testing environment.
- Conducting negative permission testing and failure-mode validation against live third-party providers.
- Visual inspection of rendered layouts across varying viewport widths, zoom levels, and color themes (perform this only if a local rendering tool is available; otherwise, explicitly report that it was omitted).

## Severity

- **ERROR**: An inaccurate or unsafe instruction; a missing prerequisite, identity definition, or permission requirement; a broken link; an exposed secret; an unverified destructive workflow; or a build failure.
- **WARNING**: An ambiguous term, excessively dense section, untested alternative workflow, or maintainability concern.
- **REVIEW**: A factual claim that requires confirmation from a designated product owner, system administrator, or integration provider. Mark the claim inline using `{/* REVIEW: ... */}`.

Never downgrade an ERROR to bypass a delivery block. If a procedure cannot be safely verified, deliver a structured draft that clearly identifies the missing technical evidence and authoritative review needed.
