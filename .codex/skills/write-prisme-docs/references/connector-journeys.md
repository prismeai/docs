# Connector documentation journeys

Use this reference when documenting any App, connector, Model Context Protocol (MCP) server, OAuth integration, third-party SaaS integration, capability catalog entry, or custom integration.

## Contents

1. First decision: operating model
2. Actor journey
3. Credential models
4. Recommended documentation set
5. Single-page fallback
6. Required connector content
7. Auth archetypes
8. Verification and troubleshooting

## 1. First decision: operating model

Before documenting or implementing setup procedures, guide the solution owner through the following architectural decisions:

- Is the integration executing interactive user actions or unattended background automation?
- Does the integration rely on per-user delegated identity or a shared service identity?
- Is access restricted to read and search operations, or does it include write and destructive actions?
- Will the integration run in Agent Factory / Chat mode or Builder / App mode?
- Is the target deployment hosted on Provider Cloud, Data Center, or a self-hosted instance?
- Will this integration connect to a single provider site/tenant or span multiple tenants?
- Is the OAuth client managed centrally by the platform or managed independently by the customer?
- Is this configuration intended for a draft/test environment or a live production environment?

Always state the recommended operating model alongside its explicit decision criteria. Never present authentication options as an unguided list of equivalent alternatives.

## 2. Actor journey

| Phase | Actor | Required outcome and handoff |
|---|---|---|
| Choose model | Solution owner / security architect | Select the integration entry point, identity model, authentication method, required scopes, target environment, and risk profile. |
| Approve | Governance / organization admin | Enable the connector, configure allowed environments, assign roles/groups, register client applications, and set tool/action execution policies. |
| Trust provider | Provider admin | Register or approve the OAuth application, configure redirect URIs, assign scopes, provision service accounts, and apply network and application access policies. |
| Publish connection | Connector maintainer | Configure endpoint URLs, authentication parameters, request/response schemas, secret storage, health checks, and environment mappings. |
| Wire agent | Agent builder | Attach the capability to the agent, select permitted tools and authentication modes, write system instructions, test behavior, and publish the agent. |
| Wire app | Workspace builder | Install or bind the App to the workspace, map input/output parameters, verify runtime identity handling, and deploy the application. |
| Connect | End user | Authenticate with the provider, select the target site/tenant, review requested permissions, grant consent, retry failed connections, and manage active sessions. |
| Verify | Admin + builder + user | Validate runtime identity, test read operations, confirm that unauthorized access is blocked, execute controlled write operations, and verify audit log capture. |
| Operate | Security / operations team | Monitor activity, rotate secrets, revoke credentials, handle re-consent requests, offboard departing users, disable inactive connectors, and remove decommissioned integrations. |

Every role-specific documentation page must specify:

- Who executes the procedure and which product interface they use.
- The required permissions, roles, and prerequisite completion states.
- The configuration values and artifacts received from the previous actor.
- The exact scope of changes and configuration settings being applied.
- The credential identity used and the downstream permissions it grants.
- An observable checkpoint that confirms successful completion.
- The output values or readiness state handed off to the next actor.
- The exact procedure for rolling back changes, revoking access, or cleaning up resources.

## 3. Credential models

| Model | Provider sees | Best fit | Setup/consent | Main risk |
|---|---|---|---|---|
| Per-user delegated OAuth | Invoking user | Interactive Chat experiences and accessing user-owned data | An administrator configures the OAuth client once; each end user connects individually | Ongoing support burden for user consent and token refresh failures |
| Enterprise-managed delegated auth | Invoking user operating under a centrally governed client/IdP | Controlled enterprise rollouts requiring centralized governance | An administrator establishes trust/federation; users sign in or grant consent as required | Complex policy synchronization between platform and provider identity systems |
| Shared service account | Dedicated technical or service account | Unattended background workflows and intentionally shared datasets | An administrator configures and stores the shared credential once | Privilege escalation and loss of individual audit attribution |
| Builder/maker credential | Individual agent or application builder | Rapid prototyping or explicitly justified low-risk shared data scenarios | The builder authenticates once during design/development time | End users implicitly inherit the builder's elevated access privileges |
| Personal/API token | Individual token owner | CLI tools, CI/CD pipelines, Data Center deployments, and noninteractive fallbacks | A user or administrator manually creates and rotates the token | Bypasses central consent and domain controls; high manual rotation burden |
| Workload identity/client credentials | Application or service principal identity | Machine-to-machine automation and unattended daemon services | An administrator grants permissions directly to the application identity | Risk of broad, tenant-wide access exposure if permissions are over-scoped |

For every supported credential model, document:

- The runtime identity visible to the external provider.
- The source and scope of runtime permissions.
- Who provides initial consent and who holds revocation authority.
- Whether the credential scope is personal to the user or shared across the workspace.
- Compatibility with interactive user flows versus background automation.
- How actions are attributed in audit logs.
- Ownership, storage, and rotation procedures for tokens and client secrets.
- Explicitly recommended use cases and prohibited usage patterns.

Always prefer delegated per-user identity when accessing user-specific SaaS data or performing attributable write operations. Use shared or service credentials only when strictly required for unattended background processing or intentionally shared datasets, and include a prominent warning detailing the expanded blast radius.

## 4. Recommended documentation set

For complex connectors, produce the following documentation structure:

1. **Connector overview and decision guide**
   - Capabilities enabled and explicit out-of-scope boundaries.
   - Supported Prisme.ai surfaces and compatible provider editions/versions.
   - Role router outlining "who does what."
   - Credential selection matrix.
   - Trust boundary and data-flow diagram.
   - Summary of read, search, and write capabilities, including operational limitations.

2. **Governance administrator guide**
   - Enabling the capability across environments.
   - Configuring central OAuth clients when applicable.
   - Assigning access permissions to roles and user groups.
   - Restricting permitted tools/actions, client applications, and network boundaries.
   - Verifying service availability and checking audit log generation.

3. **Provider administrator guide**
   - Registering and approving the provider application.
   - Configuring redirect URIs, OAuth scopes, tenant/site distribution, network policies, and app permissions.
   - Provisioning a dedicated service account when using a shared-credential model.
   - Securely handing configuration values off to the Prisme.ai administrator without exposing secrets in plain text.

4. **Agent Factory builder guide**
   - Verifying administrative prerequisite readiness.
   - Adding the connector capability to an agent.
   - Selecting permitted tools and defining credential resolution behavior.
   - Writing tool-use guidelines, guardrails, and confirmation instructions.
   - Testing execution, evaluating responses, and publishing the agent.

5. **Workspace/App builder guide**
   - Installing and binding the App within the workspace.
   - Configuring environment-specific, secret-free resource references.
   - Invoking runtime instructions using exact capability names.
   - Mapping return outputs and handling error states.
   - Promoting configurations from test workspaces to production.

6. **End-user Chat guide**
   - Discovering enabled connectors within the chat interface.
   - Authenticating, selecting the target provider site, granting consent, returning to chat, and retrying failed actions.
   - Using safe example prompts to verify functionality.
   - Reviewing and approving confirmation prompts for sensitive operations.
   - Disconnecting/reconnecting accounts and escalating "disabled by admin" restrictions.

7. **Authentication and security reference**
   - Supported credential modes and identity trust boundaries.
   - Complete mapping matrix linking OAuth scopes to specific tools and actions.
   - Token storage architectures, refresh lifecycles, rotation routines, and data retention policies.
   - End-to-end data flow, audit log structures, and least-privilege enforcement.

8. **Tool/action reference**
   - Comprehensive reference entry for each action: operational purpose, risk level, required inputs, return outputs, required provider permissions/scopes, limitations, and usage examples.

9. **Verification, troubleshooting, and lifecycle**
   - Readiness verification procedures and negative access test cases.
   - Structured troubleshooting table covering symptoms, root causes, owners, fixes, and validation steps.
   - Procedures for re-consent, handling schema/scope drift, offboarding users, disabling connectors, and complete uninstallation.

Publish this documentation across separate URLs whenever the connector involves more than three distinct actors, supports more than two authentication modes, requires a provider-admin handoff, contains extensive tool catalogs, supports distinct cloud versus self-hosted variants, or includes complex operational lifecycle procedures.

## 5. Single-page fallback

When documentation must be consolidated onto a single connector page:

1. Open with an applicability summary and an operating-model decision guide.
2. Provide **Choose your path** navigation cards tailored to each supported actor role.
3. Document provider prerequisites before detailing Prisme.ai configuration steps.
4. Keep one-time platform administrator setup in a dedicated, directly linkable section. Never hide mandatory administrative prerequisites inside collapsed accordions.
5. Place Agent Factory and Builder paths in separate sections or tabs only if the site renderer indexes their headings and supports direct deep-linking.
6. Include a dedicated first-use walkthrough for end users whenever delegated authentication is supported.
7. Provide a concise summary of the tool catalog, linking to external references or collapsing detailed reference schemas.
8. Conclude with verification steps, troubleshooting procedures, revocation/removal guides, and authoritative links to provider documentation.

If an existing documentation template enforces tabs or accordions, maintain the repository layout while ensuring visible role headings, explicit prerequisite dependencies, clear completion checkpoints, and direct anchor links.

## 6. Required connector content

### Applicability

- Supported provider products, editions, deployment variants (cloud vs. self-hosted), hosting regions, API versions, and required license tiers.
- Supported Prisme.ai entry points and execution surfaces.
- Functional summary of read, search, write, and destructive capabilities.
- System limits: rate limits, payload sizes, attachment thresholds, custom field handling, and background execution timeouts.

### Roles and handoffs

- Comprehensive "who does what" responsibility matrix.
- Exact Prisme.ai and provider roles required for each procedure.
- Specific handoff values transferred between actors (e.g., Client ID, callback/redirect URI, provider site URL, capability name, API endpoint, or configuration app URL).
- Explicit success checkpoints and ready-to-send instructions for the next actor in the sequence.

Never instruct readers to paste secrets, private keys, or API tokens into chat prompts, agent instructions, system logs, version control repositories, or unmasked configuration fields. Always document secure, approved secret-management workflows.

### Scope and identity

- Scope of enablement: platform, organization, environment, workspace, agent, user, or provider site level.
- Runtime identity visible to the external provider during execution.
- Enforcement point for provider permissions and access policies.
- Attribution details recorded in platform and provider audit logs.
- Blast radius and security exposure when using shared credentials.
- Least-privilege baseline configurations and expected system behavior when write actions are denied.

### Builder paths

- Clearly separate Agent Factory procedures from Builder App workflows.
- Use exact, real-world capability identifiers, instruction names, and tool identifiers.
- Demonstrate safe, read-only verification tests before performing write operations.
- Explicitly state which configuration changes require saving, publishing, republishing, reinstalling, redeploying, or user re-consent.

### Lifecycle

- Connection health states and automated readiness checks.
- Token lifecycles, expiration intervals, and refresh mechanisms.
- Procedures for reviewing and adapting to upstream scope or tool schema changes.
- Rotation schedules and procedures for client secrets and access tokens.
- User offboarding protocols and service-account ownership transfers.
- Complete procedures to disable, revoke, uninstall, delete, and purge connector data.

## 7. Auth archetypes

Determine the integration archetype directly from its technical implementation rather than high-level descriptions.

### Static credential

Examples: API keys, Personal Access Tokens (PAT), HTTP Basic authentication, OAuth client credentials.

- Specify whether the credential identity is shared across all invoking users.
- Configure least-privilege role assignments directly at the provider.
- Store secrets exclusively within supported, encrypted secret-management surfaces.
- Validate the connection using a safe, read-only verification call.
- Document which background automation workflows are supported.
- Explicitly detail secret rotation procedures and the limitations of shared audit attribution.

### Central OAuth through Governance

- Platform and provider administrators register a single, centralized OAuth client.
- Governance administrators define the capability, redirect URIs, and authentication endpoints.
- Administrators grant capability access to specific user roles or groups.
- Each end user authenticates independently using their personal provider credentials.
- The provider enforces permissions based on the individual user's account access.
- Document connection status states, connect/disconnect flows, client-secret rotation routines, and user re-consent triggers.

### Tenant-context plus config app

- Configure connector instances and authentication modes through the dedicated configuration app.
- If a central catalog capability is used, clearly distinguish shared catalog definitions from tenant-specific instances.
- Document all context and scope fields required to resolve the tenant, agent, and user identity.
- Document per-agent capability allowlisting separately from general catalog availability.
- Never conflate declaring a capability's availability with granting execution authorization to a specific agent.

### Webhook bridge

- The provider administrator registers the incoming webhook or bot integration.
- The workspace builder configures the target agent or automated trigger workflow.
- Document payload signature verification, inbound caller identity resolution, replay prevention, idempotency handling, network firewall requirements, retry backoff policies, and decommissioning procedures.

### Legacy connector

If a deployed integration requires an older connection mechanism, document it strictly for the affected product versions and environments. Never present deprecated patterns, such as signed keys or credentials passed directly in request headers, as standard best practices. Always provide an explicit migration path to modern authentication standards when available.

## 8. Verification and troubleshooting

### Production-readiness checks

| Check | Expected result | Owner |
|---|---|---|
| Capability availability | The connector is visible exclusively to authorized builders and workspaces. | Governance admin |
| Provider trust | The OAuth redirect/consent flow completes successfully, or static credential validation succeeds. | Provider admin + Prisme.ai admin |
| Agent binding | Permitted tools execute successfully within the design-time preview environment. | Agent builder |
| Live binding | The published agent exposes only the intended and authorized toolset. | Builder / admin |
| First-use consent | A new user successfully connects their account on the first prompt, and the interrupted chat workflow resumes automatically. | End user |
| Identity | The external provider logs attribute actions to the correct individual user or service account. | Security / admin |
| Negative access | Requests attempting to access unauthorized provider resources are strictly blocked and return appropriate permission errors. | Security / provider admin |
| Write control | Confirmation prompts or policy enforcement checks display before any destructive or mutating operation executes. | Builder / security |
| Revocation | Revoking a credential immediately triggers a clean reconnect prompt or a safe execution failure. | Admin / user |
| Audit | The invoking actor, tool name, action parameters, execution result, and correlation/request ID are fully captured in audit logs. | Governance admin |

### Symptom table

When troubleshooting issues across documentation guides, identify the responsible owner and resolution path for each of the following failure scenarios:

- Connector or capability is missing from the builder interface.
- Connect action is disabled or blocked by administrative policy.
- OAuth authorization window fails to open.
- Redirect URI mismatch or blocked client redirect domain.
- User consent succeeds, but the connection status remains disconnected.
- User experiences repeated consent prompts or continuous reconnect loops.
- Connected session resolves to the wrong provider site or tenant.
- Successful queries return empty results when resources exist.
- Execution fails with HTTP `401 Unauthorized`, `403 Forbidden`, missing OAuth scopes, or insufficient provider permissions.
- Action executes successfully in builder preview but fails in the published live environment.
- Tool disappears from the interface following an upstream schema change.
- Request fails due to provider rate limits, payload size limits, or external provider outages.
- A revoked user account continues to show an active connection state.

When grouping multiple operational issues on a troubleshooting reference page, structure the content using the standard layout: `Symptom | Likely cause | Owner | Resolution | Verification`.
