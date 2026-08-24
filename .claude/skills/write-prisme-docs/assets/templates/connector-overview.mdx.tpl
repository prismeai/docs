---
title: '<<Third-party service name>> connector'
description: 'Connect <<Third-party service name>> to Prisme.ai agents and Builder workflows with <<comma-separated authentication methods>>.'
---

The <<Third-party service name>> connector lets <<authorized roles or actors>> <<read, search, and write capabilities summary>> through <<Agent Factory tools, MCP servers, and Builder App actions>>. It supports <<supported provider tiers, editions, and deployment models>>.

<Warning>
  <<State any critical operational constraint, identity boundary, shared-credential exposure, or tenant-isolation risk. Remove this component if no material warning applies.>>
</Warning>

## Choose your path

<CardGroup cols={2}>
  <Card title="Use <<Third-party service name>> in Chat" icon="comments" href="<<verified-end-user-route>>">
    Connect your account and use a published agent.
  </Card>
  <Card title="Add <<Third-party service name>> to an agent" icon="robot" href="<<verified-agent-builder-route>>">
    Add and test the connector in Agent Factory.
  </Card>
  <Card title="Use <<Third-party service name>> in Builder" icon="screwdriver-wrench" href="<<verified-workspace-builder-route>>">
    Install the App and call connector instructions from a workspace.
  </Card>
  <Card title="Enable <<Third-party service name>> for your organization" icon="shield-halved" href="<<verified-admin-route>>">
    Configure trust, access, credentials, and policy.
  </Card>
</CardGroup>

## Supported operating models

| Model | Runtime identity | Interactive | Background | Audit attribution | Recommended for |
|---|---|---:|---:|---|---|
| <<Delegated user authorization model>> | <<Invoking end-user identity>> | Yes | <<No or qualified condition>> | <<Individual user identity>> | <<Primary interactive use case>> |
| <<Service account or shared credential model>> | <<Dedicated service account identity>> | Yes | Yes | <<Service principal or shared identity>> | <<Automated background use case and security warning>> |

## Who does what

| Actor | Responsibility | Completion state |
|---|---|---|
| Prisme.ai platform or organization admin | <<Configure central connector settings, tenant credentials, and access scopes>> | <<Connector enabled and ready for builder assignment>> |
| <<Third-party service name>> admin | <<Approve OAuth application, grant tenant-level API scopes, and set security policies>> | <<Third-party tenant trust established and scopes approved>> |
| Agent builder | <<Attach connector to agent, apply tool-level restrictions, test prompts, and publish>> | <<Agent published with scoped connector tools>> |
| Workspace builder | <<Install App in workspace, map input parameters, and invoke connector instructions>> | <<Workflow executed and verified in workspace>> |
| End user | <<Authenticate via OAuth consent screen and confirm delegated tool permissions>> | <<User connection active and authorized for queries>> |

## How identity and data flow

```mermaid
sequenceDiagram
  participant U as End user
  participant P as Prisme.ai
  participant C as Connector
  participant S as <<Third-party service name>>
  U->>P: <<User prompt or trigger event>>
  P->>C: <<Tool execution request with authenticated user context>>
  C->>S: <<API request signed with delegated user token or service credential>>
  S-->>C: <<Filtered API response scoped to identity permissions>>
  C-->>P: <<Normalized structured payload>>

<<Explain the trust boundaries, token exchange mechanics, permission filtering, and payload sanitization shown in the sequence diagram.>>

## Capabilities and risk

| Category | Examples | Access | Confirmation/policy |
|---|---|---|---|
| Read/search | <<Specific read-only tools and query capabilities>> | <<Required OAuth scopes or API permissions>> | <<Default execution policy or policy override>> |
| Write | <<Specific record creation or modification tools>> | <<Required OAuth scopes or write permissions>> | <<Approval rule or role-based restriction>> |
| Destructive | <<Specific deletion, purge, or bulk-overwrite tools>> | <<Elevated administrative scopes or permissions>> | <<Mandatory explicit user or admin confirmation prompt>> |

## Limitations

- <<Unsupported provider editions, hosting models, regional endpoints, rate limits, payload size thresholds, or tool constraints>>

## Verify readiness

| Check | Expected result | Owner |
|---|---|---|
| <<Prerequisite connectivity or configuration check>> | <<Exact observable status, log entry, or UI state>> | <<Responsible actor role>> |
| <<End-to-end operation, identity resolution, or negative-permission test>> | <<Exact returned payload, error code, or audit log entry>> | <<Responsible actor role>> |

## Reference and operations

- [<<Authentication setup and credential management>>](<<verified-route>>)
- [<<Tool definitions, input schemas, and required scopes>>](<<verified-route>>)
- [<<Troubleshooting and common error resolution>>](<<verified-route>>)
- [<<Credential rotation, permission revocation, and connector offboarding>>](<<verified-route>>)
