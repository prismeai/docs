---
title: '<<Imperative phrase describing the connector setup or maintenance outcome>> for the <<Third-party service name>> connector'
description: '<<Exact actor role>>: <<imperative summary of the single connector task>> in <<Prisme.ai surface or provider console>>.'
---

Use this procedure if you are the **<<exact actor role name>>**. It starts after <<prerequisite state achieved by previous actor>> and finishes when <<observable verification state confirming completion>>.

## Before you begin

- **Prisme.ai role:** <<Exact Prisme.ai role or permission required>>
- **Provider role:** <<Exact third-party platform role required, or "Not required">>
- **Environment/site:** <<Target environment, workspace tier, or deployment scope>>
- **Receive from <<preceding actor role>>:** <<Non-secret identifiers, configuration values, and readiness confirmation needed>>
- **Creates access for:** <<Target user group, agent name, workspace, or entire organization>>
- **Runtime identity:** <<Execution identity: invoking user, dedicated service account, or workload principal>>

## <<Imperative heading for the setup or configuration procedure>>

<Steps>
  <Step title="<<Imperative title for initial navigation and parameter configuration>>">
    <<Exact UI navigation path or CLI command, configuration values to enter, and immediate checkpoint to verify before continuing.>>
  </Step>
  <Step title="<<Imperative title for applying least-privilege scoping or tool restrictions>>">
    <<Specific toggles, scope selections, or tool whitelists to apply, including the security consequence of each setting.>>
  </Step>
  <Step title="<<Imperative title for saving, publishing, or authorizing the configuration>>">
    <<Action to persist or deploy the configuration, followed by the exact system response or confirmation dialogue that appears.>>
  </Step>
</Steps>

## Verify

1. <<Instruction to perform a live identity resolution or endpoint reachability check.>>
2. <<Instruction to execute a non-destructive read query and verify the returned payload.>>
3. <<Instruction to test an unauthorized action and verify that access is properly denied.>>
4. <<Instruction to execute a controlled write or test transaction and verify the corresponding audit log entry, if applicable.>>

## Hand off to <<succeeding actor role>>

The connector is ready when <<exact observable system state>>. Send <<list of non-secret identifiers, URLs, or status confirmations>> to the **<<succeeding actor role name>>**, then ask them to [<<imperative phrase for the next actor's task>>](<<verified-route>>).

## Troubleshooting

| Symptom | Likely cause | Owner | Resolution | Verification |
|---|---|---|---|---|
| `<<Exact error message string or UI symptom>>` | <<Root cause of the failure>> | <<Actor role responsible for fixing it>> | <<Concrete step-by-step remediation action>> | <<Expected observable state confirming the fix>> |

## Revoke or undo

1. <<Step-by-step instructions to disable the integration, revoke OAuth tokens, or delete connector credentials.>>
2. Confirm that <<connector requests fail with an authorization error and all audit log entries reflect disconnection>>.
