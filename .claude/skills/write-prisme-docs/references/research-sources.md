# Research sources and competitive patterns

This registry documents the authoritative industry standards and competitor documentation patterns that inform our writing methodology. Verify these official sources whenever documenting time-sensitive features or external API behaviors.

## Contents

1. Documentation methodology
2. Closest platform documentation models
3. Additional relevant platforms
4. Research synthesis

## 1. Documentation methodology

| Source | Supports |
|---|---|
| [Diátaxis](https://diataxis.fr/) | Structuring documentation into distinct modes based on user intent: tutorials, how-to guides, reference material, and conceptual explanation. |
| [Google developer documentation style guide](https://developers.google.com/style) | Establishing clear, concise, and consistent standards for technical developer documentation. |
| [Google: Procedures](https://developers.google.com/style/procedures) | Formatting structured task steps, including numbered sequences, conditional paths, optional actions, and expected outcomes. |
| [Google: Accessible documentation](https://developers.google.com/style/accessibility) | Creating accessible content structures across headings, link text, images, tables, and alternative text equivalents. |
| [Google: Timeless documentation](https://developers.google.com/style/timeless-documentation) | Writing evergreen technical prose that remains accurate without relying on relative time references. |
| [Google technical writing: Audience](https://developers.google.com/tech-writing/one/audience) | Conducting audience analysis focused on target roles, prerequisite knowledge, and specific user tasks. |
| [Microsoft: Step-by-step instructions](https://learn.microsoft.com/en-us/style-guide/procedures-instructions/writing-step-by-step-instructions) | Applying imperative verbs, clear UI element anchors, and scannable formatting to procedural instructions. |
| [Microsoft: Global writing tips](https://learn.microsoft.com/en-us/style-guide/global-communications/writing-tips) | Designing clear, unambiguous sentence structures and consistent terminology optimized for localization and global audiences. |
| [GitLab documentation style guide](https://docs.gitlab.com/development/documentation/styleguide/) | Maintaining documentation as the single source of truth, establishing appropriate tone, and managing ongoing maintenance workflows. |
| [GitLab topic types](https://docs.gitlab.com/development/documentation/topic_types/) | Defining explicit content models for concepts, tasks, references, troubleshooting entries, and tutorials. |
| [GitLab troubleshooting](https://docs.gitlab.com/development/documentation/topic_types/troubleshooting/) | Structuring troubleshooting documentation around exact error messages and symptoms, underlying causes, and validated resolutions. |
| [GitLab documentation testing](https://docs.gitlab.com/development/documentation/testing/) | Implementing automated linting and quality gates within a docs-as-code deployment pipeline. |
| [GitHub content design principles](https://docs.github.com/en/contributing/writing-for-github-docs/content-design-principles) | Creating focused, user-centered documentation that minimizes unnecessary prose and delivers immediate practical value. |
| [GitHub templates](https://docs.github.com/en/contributing/writing-for-github-docs/templates) | Standardizing content architecture through reusable page templates across content types. |
| [GitHub screenshots](https://docs.github.com/en/contributing/writing-for-github-docs/creating-screenshots) | Establishing criteria for when visual assets add value and defining workflows for ongoing screenshot maintenance. |
| [GitHub search findability](https://docs.github.com/en/contributing/writing-for-github-docs/making-content-findable-in-search) | Optimizing discoverability through role-targeted keywords, structured metadata, strategic internal linking, and content precision. |
| [Write the Docs principles](https://www.writethedocs.org/guide/writing/docs-principles/) | Ensuring documentation is discoverable, uniquely addressable, logically sequenced, and easily navigated. |
| [Nielsen Norman Group: Progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/) | Prioritizing primary user workflows upfront while structuring secondary or advanced technical details into accessible secondary layers. |
| [W3C images tutorial](https://www.w3.org/WAI/tutorials/images/) | Writing meaningful, context-appropriate alternative text for diagrams and user interface screenshots. |
| [W3C tables tutorial](https://www.w3.org/WAI/tutorials/tables/) | Constructing accessible data tables with explicit header associations and structural relationships. |

## 2. Closest platform documentation models

### Microsoft Copilot Studio and Power Platform

- [Configure and manage connections](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-connections)
- [Configure user authentication for tools](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-enduser-authentication)
- [Control maker-provided credentials](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-no-maker-authentication)
- [Connector catalog](https://learn.microsoft.com/en-us/connectors/)

Patterns to adopt: authentication decision tables, governance policy enforcement, clear separation between maker and end-user execution identities, and runtime in-chat connection prompts.

### IBM watsonx Orchestrate

- [Role-based getting started](https://www.ibm.com/docs/en/watsonx/watson-orchestrate/base?topic=getting-started)
- [Credential overview](https://www.ibm.com/docs/en/watsonx/watson-orchestrate/base?topic=credentials-overview)
- [Bind and deploy connections](https://www.ibm.com/docs/en/watsonx/watson-orchestrate/base?topic=credentials-binding-deploying-connections)

Patterns to adopt: explicit role-based user routing (administrator, builder, end user), distinction between team-level and member-level credentials, and pre-deployment validation for draft versus published states.

### Dust

- [Tools management](https://docs.dust.tt/docs/tools-management)
- [Personal versus workspace credentials](https://docs.dust.tt/docs/personal-vs-workspace-credentials-for-tools-mcp-servers)
- [Jira](https://docs.dust.tt/docs/jira)

Patterns to adopt: streamlined admin-to-builder-to-user narrative arcs, credential configuration decisions presented prior to setup procedures, first-use in-chat authentication behaviors, and action-level risk ratings and confirmation prompts.

### Glean

- [Agents documentation](https://docs.glean.com/agents)
- [Introduction to actions](https://docs.glean.com/agents/actions/introduction-to-actions)
- [Manage action access](https://docs.glean.com/administration/actions/managing-actions/managing-role-based-access-actions)

Patterns to adopt: distinct user, creator, and administrator journeys, separation of action availability from execution authority, and explicit action-level prerequisites and access controls.

### Atlassian Rovo MCP and Jira

- [Getting started with Atlassian Rovo MCP](https://support.atlassian.com/atlassian-rovo-mcp-server/docs/getting-started-with-the-atlassian-remote-mcp-server/)
- [Configure OAuth 2.1](https://support.atlassian.com/atlassian-rovo-mcp-server/docs/configuring-oauth-2-1/)
- [Supported tools and scopes](https://support.atlassian.com/atlassian-rovo-mcp-server/docs/supported-tools/)
- [Control Rovo MCP settings](https://support.atlassian.com/security-and-access-policies/docs/control-atlassian-rovo-mcp-server-settings/)
- [Configure Rovo MCP permissions](https://support.atlassian.com/security-and-access-policies/docs/Configure-Atlassian-Rovo-MCP-server-permission/)
- [Add an external MCP server](https://support.atlassian.com/organization-administration/docs/add-an-external-mcp-server-from-atlassian-administration/)
- [Manage Atlassian API tokens](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/)
- [Jira Cloud REST API introduction](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/)
- [Jira Cloud OAuth 2.0 (3LO)](https://developer.atlassian.com/cloud/jira/software/oauth-2-3lo-apps/)
- [Jira Cloud OAuth scopes](https://developer.atlassian.com/cloud/jira/platform/scopes-for-oauth-2-3LO-and-forge-apps/)
- [Jira Data Center personal access tokens](https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html)
- [Jira Cloud rate limiting](https://developer.atlassian.com/cloud/jira/platform/rate-limiting/)

Patterns to adopt: decision criteria between interactive OAuth and static API tokens, scoped-token handling with site/`cloudId` routing, architectural differences between Jira Cloud and Jira Data Center, network and domain policies, governance over read/write/search operations, mapping specific tools to required OAuth scopes, credential lifecycles, rate limits, and audit log implications. Always consult these primary sources directly before publishing current token expiration rules, endpoint URLs, API versions, or rate limits.

## 3. Additional relevant platforms

| Platform | Official sources | Pattern to reuse |
|---|---|---|
| UiPath | [Integration Service connectors](https://docs.uipath.com/integration-service/automation-cloud/latest/user-guide/connectors) | Documenting connector lifecycles, connection management, individual activities, event triggers, authentication methods, and tier support levels. |
| Salesforce Agentforce | [Permissions](https://help.salesforce.com/s/articleView?id=ai.agent_actions_common_perms.htm&language=en_US&type=5), [Agentforce MCP tools](https://developer.salesforce.com/docs/platform/hosted-mcp-servers/guide/agentforce.html) | Differentiating logged-in user context from autonomous agent identity, structuring permission matrices, and defining security trust boundaries. |
| Microsoft Foundry | [MCP authentication](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/mcp-authentication), [MCP governance](https://learn.microsoft.com/en-us/azure/ai-foundry/agents/how-to/tools/governance?view=foundry) | Structuring authentication-mode decision matrices, configuring centralized OAuth applications, managing action approvals, and enforcing gateway security policies and audit trails. |
| Google Vertex AI Agent Builder | [Documentation hub](https://docs.cloud.google.com/agent-builder) | Structuring end-to-end lifecycle navigation, managing IAM and service identities, and designing developer-oriented setup workflows. |
| AWS Bedrock AgentCore | [Overview](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html), [Identity](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html) | Managing workload identity federation, credential vaults, IAM policy attachment, comprehensive audit logging, and VPC network boundary controls. |
| Dify | [Choose a plugin type](https://docs.dify.ai/en/develop-plugin/getting-started/choose-plugin-type), [Tool OAuth](https://docs.dify.ai/en/develop-plugin/dev-guides-and-walkthroughs/tool-oauth) | Applying decision trees for plugin architecture and implementing two-stage administrative and end-user OAuth handshakes. |
| ServiceNow | [Credentials, connections, aliases](https://www.servicenow.com/docs/en-US/bundle/zurich-platform-security/page/product/credentials/concept/credentials-connections-alias.html) | Decoupling reusable endpoint and authentication connection aliases from underlying production credentials. |
| Slack | [Manage app requests](https://slack.com/help/articles/360024269514-Manage-app-requests-for-your-workspace), [OAuth](https://api.slack.com/authentication/oauth-v2) | Handling scope-sensitive administrative approval workflows and distinguishing bot identity permissions from user-delegated tokens. |

## 4. Research synthesis

The target documentation architecture for Prisme.ai synthesizes the strongest elements across these platform models:

- IBM watsonx Orchestrate for explicit role-based user routing and pre-deployment draft-to-live verification.
- Dust for a cohesive, linear administrator-to-builder-to-user narrative structure in connector documentation.
- Microsoft Copilot Studio for structured credential decision tables and explicit governance policy enforcement.
- Glean for granular action-level visibility, execution authority, and end-user confirmation controls.
- Atlassian Rovo MCP for comprehensive integration details covering identity management, OAuth scope mapping, client configuration, network security, and audit implications.

Avoid replicating the organizational fragmentation found in external platform docs. Provide Prisme.ai users with a single, clear role-and-operating-model router, unified setup procedures, explicit operational handoffs between personas, and modular, independently addressable reference and lifecycle documentation.
