# 09 — Supprimer les variables legacy et toutes les références au service `pages`

## Contexte

Le service `pages` n'existe plus (consolidé dans `console`). Plusieurs variables d'environnement documentées ne sont plus utilisées non plus.

Ce ticket est **indépendant** des autres et peut être livré en parallèle.

## Scope

### 1. Variables d'environnement à retirer

Supprimer toute mention (y compris exemples, tableaux, snippets) des variables suivantes dans `docs/self-hosting/`, principalement `kubernetes/environment-variables.mdx` :

- `SUGGESTIONS_ENDPOINT`
- `BILLING_HOME`
- `BILLING_USAGE`
- `TRACKING`
- `TRACKING_WEBHOOK`
- `PRODUCTS_ENDPOINT`
- `WORKSPACE_OPS_MANAGER`
- `ENABLED_AUTH_PROVIDERS`

Pour chacune :
- [ ] Grep dans tout le repo `docs/`.
- [ ] Supprimer les blocs et les lignes de tableau les mentionnant.
- [ ] Si une section entière dépend de la variable, la supprimer.

### 2. Service `pages` à retirer partout

Pages concernées (au moins) :
- `architecture.mdx` (ligne ~19 : "Pages Service: Renders end-user pages…")
- `requirements.mdx` (ligne ~56 : DNS `*.pages.yourdomain.com`)
- `kubernetes/resources.mdx` (ligne ~20 : ligne du tableau)
- `kubernetes/high-availability.mdx` (ligne ~36 : si la page n'a pas encore été supprimée par ticket 05)
- `operations/testing.mdx` (section "Pages")
- `kubernetes/environment-variables.mdx` (variables liées au service pages)
- Toute autre mention détectée par grep `prismeai-pages`, `service pages`, `pagesHost`, `*.pages.`

À faire :
- [ ] Retirer la mention du service `pages` partout (tableaux, listes de services).
- [ ] **Conserver** la notion de hostname `*.pages.example.com` car elle reste utilisée par `prismeai-console` pour servir les pages utilisateur — vérifier en lisant `prisme.ai-infra/helm-charts/prismeai-core/values.yaml` (clé `global.pagesHost`).
- [ ] Ne pas supprimer la clé `pagesHost` ni la sous-section DNS associée, mais préciser que c'est servi par `console` et non par un service séparé.

### 3. Vérifications

- [ ] `grep -ri "prismeai-pages" docs/` → vide ou uniquement dans des fichiers attendus (ex. v27 release notes si déjà publiées).
- [ ] `grep -ri "SUGGESTIONS_ENDPOINT\|BILLING_HOME\|BILLING_USAGE\|TRACKING_WEBHOOK\|PRODUCTS_ENDPOINT\|WORKSPACE_OPS_MANAGER\|ENABLED_AUTH_PROVIDERS" docs/` → vide.
- [ ] `grep -ri "TRACKING" docs/self-hosting/` → vérifier qu'il ne reste pas de variable d'env (autres usages OK).

## Non-goals

- Ne pas toucher aux docs hors `self-hosting/` (sauf si un grep révèle une référence).
- Ne pas supprimer les pages obsolètes (tickets 04, 05).

## Acceptance criteria

- [ ] Aucune des 8 variables n'apparaît plus dans `docs/self-hosting/`.
- [ ] Aucune mention de service `pages` en tant que microservice séparé.
- [ ] `pagesHost` reste documenté, attribué à `console`.

## Références

- `docs/self-hosting/kubernetes/environment-variables.mdx` (560 l., principal foyer)
- `prisme.ai-infra/helm-charts/prismeai-core/values.yaml` (vérifier ce qui reste exposé sur `console`)
