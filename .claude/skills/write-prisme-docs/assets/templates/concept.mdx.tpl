---
title: '<<Noun phrase naming the concept>>'
description: 'Understand <<concept name>>, how it relates to <<adjacent concept>>, and when it matters.'
---

<<Define the concept in 1 to 2 sentences, name the intended reader role, and state the architecture or design decision this understanding unblocks.>>

## Mental model

<<Explain the minimal mental model needed to reason about this concept correctly. Define every technical term before using it.>>

```mermaid
flowchart LR
  A["<<Upstream component, actor, or state>>"] --> B["<<Downstream component, resource, or state>>"]

<<Provide a prose explanation that conveys the exact same system boundaries, data flow, and state transitions shown in the diagram above.>>

## How it works

<<Detail component interactions, trust boundaries, lifecycle phases, and how identity and data propagate through the system.>>

## When to use it

| Choose <<Option A name>> when | Choose <<Option B name>> when |
|---|---|
| <<Primary architectural requirement or constraint favoring Option A>> | <<Primary architectural requirement or constraint favoring Option B>> |

## Limitations and tradeoffs

- <<Hard functional limit, quota, or boundary condition and its concrete operational impact>>
- <<Architectural tradeoff, including when this approach is counter-indicated and what alternative to choose>>

## Next steps

- [<<Imperative label for a related procedure>>](<<verified-internal-route>>)
- [<<Imperative label for the configuration reference>>](<<verified-internal-route>>)
