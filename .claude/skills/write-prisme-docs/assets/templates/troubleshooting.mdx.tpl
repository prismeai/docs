---
title: 'Troubleshoot <<feature, component, or user journey name>>'
description: 'Resolve <<comma-separated list of common errors, symptoms, or unexpected behaviors>> in <<surface or environment>>.'
---

Use this page when <<feature or workflow>> fails to reach <<expected successful operational state>>. Locate the section matching your exact error string or observed behavior.

## Quick checks

1. <<High-probability, non-destructive check to verify baseline connectivity, service health, or license status.>>
2. <<Safe status or identity check to confirm active authentication tokens and role assignment.>>
3. <<Exact navigation path or CLI command to locate correlation IDs, execution logs, and request traces without exposing sensitive tokens.>>

## `<<Exact error message string or exception code>>`

**Symptom:** <<Precise visual behavior, UI alert, or HTTP response code observed by the user.>>

**Cause:** <<Underlying technical cause, expired credential, or invalid configuration.>>

**Owner:** <<Specific role responsible for remediation: End user, Builder, Prisme.ai admin, or Provider admin.>>

**Resolution:**

1. <<First step of the concrete remediation procedure.>>
2. <<Second step of the concrete remediation procedure, including saving or updating settings.>>

**Verification:** <<Specific test action to rerun and the exact output or UI indicator confirming resolution.>>

## <<Observable failure symptom without an explicit error message>>

| Possible cause | Owner | Resolution | Verification |
|---|---|---|---|
| <<Most likely technical cause>> | <<Responsible actor role>> | <<Step-by-step remediation action>> | <<Expected system state or output confirming the fix>> |
| <<Secondary or edge-case technical cause>> | <<Responsible actor role>> | <<Step-by-step remediation action>> | <<Expected system state or output confirming the fix>> |

## Collect information for support

Collect only:

- <<Software version, deployment tier, and affected workspace or tenant identifier>>
- <<UTC timestamp and sanitized request ID, execution ID, or correlation ID>>
- <<Complete error output with access tokens, secrets, and PII redacted>>

Never include access tokens, client secrets, API keys, personal data, or full sensitive payloads.
