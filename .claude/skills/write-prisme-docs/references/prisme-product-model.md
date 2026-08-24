# Prisme.ai product and audience model

Use this reference to align documentation with the current product architecture and prevent the introduction of obsolete terminology or connector patterns.

## Contents

1. Positioning
2. Product surfaces
3. Personas
4. How the surfaces connect
5. Terminology
6. Evidence hierarchy
7. Known documentation drift

## 1. Positioning

Prisme.ai is an enterprise platform for building, deploying, operating, and governing AI agents. The platform integrates no-code and low-code agent creation, secure chat interfaces, knowledge management with RAG, workflow and application development, a governed catalog of capabilities, third-party SaaS and MCP integrations, analytics, and flexible cloud or on-premises deployment models.

Document Prisme.ai as an integrated platform, but ensure every page clearly targets a specific persona and delivers a concrete outcome.

## 2. Product surfaces

| Surface | Primary purpose | Typical documentation |
|---|---|---|
| Chat / SecureChat | Provides the conversational interface for end users, supporting tools, file handling, Canvas rendering, and in-chat authorization. | Interacting with agents, connecting third-party accounts, approving actions, and resolving runtime errors. |
| Agent Factory | Allows builders to create, configure, test, evaluate, publish, and share AI agents. | Writing system instructions, attaching capabilities, assigning tools and models, configuring knowledge sources, setting safeguards, and running evaluations. |
| Knowledges / AI Knowledge | Manages document stores and RAG data sources. | Ingesting documents, connecting external sources, processing content, configuring retrieval, and sharing knowledge collections. |
| Builder | Enables development of deterministic workspace automations, custom applications, pages, data imports, integrations, secrets, and APIs. | Writing DSUL code, configuring App mode, building workflows, writing custom scripts, running tests, and managing deployments. |
| Apps Marketplace / App Store | Houses reusable applications and connectors available for installation into Builder workspaces. | Installing, configuring, executing instructions from, updating, and uninstalling apps and connectors. |
| Governance | Provides administrative control over identities, roles, model access, capability catalogs, policies, usage quotas, audit logging, and platform settings. | Enabling capabilities, granting permissions, applying restrictions, monitoring usage, rotating secrets, and revoking access. |
| Insights | Delivers analytics on platform adoption, conversation metrics, user feedback, response quality, and operational impact. | Tracking key metrics, filtering analytics dashboards, exporting data, and analyzing performance trends. |

Always distinguish the Builder Apps Marketplace (for developer components) from the end-user agent discovery Store or Agents Space.

## 3. Personas

### End user

Interacts with published agents in Chat, triggers tools through natural language, reviews and confirms operational approvals, authorizes personal third-party accounts, and manages or revokes active connections.

### Agent builder

Creates agents in Agent Factory, authors system instructions, attaches governed capabilities, selects models, tools, and guardrail policies, validates behavior in the playground and evaluation suites, and publishes or shares completed agents.

### Workspace builder

Develops deterministic workflows and custom applications in Builder, installs App-mode connectors from the marketplace, defines workspace-scoped variables and credentials, executes connector instructions using DSUL, and tests, monitors, and deploys workspace assets.

### Organization administrator

Manages organization-level members, assigns roles, controls agent and capability availability, sets organizational policies and usage quotas, and governs access across the organization.

### Platform administrator

Manages system-wide operations, multi-tenant organizations, infrastructure configurations, shared global capability definitions, and centralized OAuth application registrations across the platform.

### Provider administrator

Manages third-party SaaS systems integrated with Prisme.ai, including OAuth app registration and approvals, redirect URL configurations, permission scopes, site-level policies, service accounts, network/IP allowlists, and provider-side audit logging.

### Connector maintainer

Develops and maintains reusable App and MCP packages, including schema definitions, API endpoints, authentication flows, configuration single-page apps (SPAs), tool descriptions, input validation, and release lifecycles.

Never combine these roles into a generic “administrator” label. Always specify the exact administrative role and the system being configured.

## 4. How the surfaces connect

### Governed agent path

1. A platform or organization administrator enables and configures a capability within Governance.
2. An agent builder attaches and configures that capability for an agent in Agent Factory.
3. The agent builder tests the agent and publishes it.
4. An end user interacts with the published agent in Chat.
5. When delegated authentication is required, Chat pauses the initial tool call and prompts the user to authenticate with the provider.
6. The third-party provider validates the user's identity and enforces downstream access permissions.

### Builder App path

1. A workspace builder installs an application or connector from the Apps Marketplace into a Builder workspace.
2. The builder configures workspace-level or user-level credentials through the designated interface.
3. Automations invoke specific App instructions deterministically through DSUL.
4. The builder monitors, tests, and deploys the completed workspace.

### Connector dual surface

A single connector implementation may provide two operational modes:

- App mode: deterministic operations invoked directly through DSUL within Builder workflows.
- MCP mode: dynamic tool endpoints discovered and invoked autonomously by agents.

While both modes can share underlying codebase logic and provider APIs, they differ significantly in caller identity models, credential management, approval workflows, and runtime execution. Never treat these two modes as interchangeable without clearly defining the target operating model.

## 5. Terminology

Use these preferred terms consistently unless reproducing exact, verified UI labels:

| Preferred term | Meaning | Avoid or qualify |
|---|---|---|
| Agent Factory | The dedicated product for building, configuring, and managing AI agents. | Do not use “Agent Creator” unless citing verified legacy UI or historical release notes. |
| Agent builder | The persona configuring and managing AI agents. | Do not use “Builder” alone when the user is working in Agent Factory rather than the Builder product. |
| Builder | The low-code workspace product used to create apps and automations. | Do not use “Agent builder” to refer to this product surface. |
| Governance | The administrative product for managing policies, identity, catalog capabilities, and compliance. | Do not use “Governe” unless matching an unlocalized UI string. |
| Chat / SecureChat | The conversational client interface for end users. | Select the exact UI label appropriate to the specific product edition and context. |
| Knowledges / AI Knowledge | The product surface dedicated to managing document stores and RAG sources. | Do not describe this surface as the primary interface for building agents. |
| Capability | A governed, reusable resource or integration that can be attached to an agent. | Do not use as an interchangeable synonym for an individual tool. |
| MCP server | A server implementation that exposes discoverable tools via the Model Context Protocol. | Do not refer to an entire MCP server as a single tool. |
| Tool | An individual executable function or MCP operation available to an agent. | Do not label standard Builder App instructions as tools unless explicitly exposed as MCP tools. |
| App instruction | A deterministic operation executed within Builder workflows using DSUL. | Do not refer to an App instruction as an MCP tool unless exposed through an MCP server. |
| Connection | An authenticated session or credential configuration established with an external provider. | Always specify whether the connection is user-specific (personal) or shared at the workspace level. |
| Apps Marketplace | The catalog in Builder used to browse and install packages, apps, and connectors. | Distinguish clearly from the end-user agent discovery Store or Agents Space. |

Maintain consistent terminology throughout each document. When documenting a legacy term that remains searchable, cite it once as an alias and direct readers to the preferred current term.

## 6. Evidence hierarchy

When determining product behavior, resolve conflicts by consulting sources in the following order of precedence:

1. Current local implementation code: workspace YAML files, `index.yml`, automation definitions, configuration schemas, OpenAPI specifications, automated test suites, and current UI strings.
2. Canonical product documentation for Agent Factory, Governance, Builder, Chat, and the core connector architecture.
3. Canonical connector documentation representing the same integration archetype.
4. Official documentation from third-party providers regarding OAuth flows, required scopes, permissions, rate limits, and administrative paths.
5. Legacy connector documentation (consult strictly for tone and style, not technical accuracy).

Use these primary local references for architectural orientation, and verify their current state:

- `get-started/introduction.mdx`
- `get-started/platform-navigation.mdx`
- `products/overview.mdx`
- `products/agent-factory/overview.mdx`
- `products/agent-factory/capabilities.mdx`
- `products/ai-builder/overview.mdx`
- `products/ai-builder/integrations.mdx`
- `products/ai-governance/overview.mdx`
- `products/ai-governance/capabilities.mdx`
- `products/ai-securechat/mcp-connections.mdx`
- `apps-store/marketplace/connectors/overview.mdx`

Before documenting any App+MCP connector, inspect its underlying workspace implementation. Determine its authentication archetype directly from configuration schemas and automation logic; do not extrapolate authentication models from page titles or unrelated connectors.

## 7. Known documentation drift

Be aware of and resolve the following historical discrepancies across documentation sets:

- Inconsistent naming across product generations, where “Agent Factory,” “Agent Creator,” and “Agent Builder” are used interchangeably.
- Overlapping naming for governance interfaces, including “Governance,” “AI Governance,” and “Governe.”
- Legacy connector documentation directing users to configure MCP tools via Knowledges **Advanced > Tools**, whereas modern workflows manage tools through Agent Factory capabilities and Governance.
- Outdated connector guides detailing client-side credentials in request headers (including deprecated `mcp-api-key` headers), whereas current architecture resolves credentials securely server-side.
- Ambiguity among discovery surfaces, conflating the developer “Apps Marketplace” / “App Store” with the end-user agent “Store” / “Agents Space.”
- Outdated claims that every connector requires two dedicated workspaces, whereas modern deployments may use a single central connector workspace paired with tenant app instances or a dedicated configuration SPA.
- Imprecise use of the term “Admin,” which often fails to distinguish between workspace, organization, platform, provider, or infrastructure administrators.

When documentation sources conflict:

1. Identify the implementation currently deployed and officially supported in production.
2. Determine the exact product version, environment, or connector archetype affected by the discrepancy.
3. Structure the document so that the officially supported path is presented as the primary instruction.
4. Isolate any ongoing legacy behavior within clearly designated callouts or dedicated legacy guides.
5. Remove obsolete and insecure instructions, such as passing secrets in headers or legacy agent-creation steps, rather than carrying them forward.
6. Insert an explicit review marker if technical discrepancies cannot be definitively resolved from the codebase.
