# Doc infra rework — backlog

Refonte de la doc `self-hosting/` pour résoudre :

- Doc d'install éclatée et redondante (cloud/* répètent helm + sizing).
- Pages obsolètes (`kubernetes/docker`, `kubernetes/high-availability`, `kubernetes/prometheus-grafana-operator`).
- Pages incomplètes (`kubernetes/helm`, `kubernetes/resources`).
- Pas de section dédiée aux bases de données (info éclatée dans `operations/*`).
- Menu de gauche surchargé, les pages clés ne ressortent pas.
- Variables d'env et service "pages" legacy à supprimer.

## Tickets

| # | Titre | Dépend de | Taille |
|---|-------|-----------|--------|
| [01](./01-navigation-restructure.md) | Restructurer le menu Self-Hosting et créer la section Databases | — | S |
| [02](./02-unified-helm-install-page.md) | Réécrire `kubernetes/helm` comme page d'install unifiée (core + apps) | 01 | L |
| [03](./03-slim-cloud-pages.md) | Réduire les pages `cloud/*` au contenu provider-spécifique | 02 | M |
| [04](./04-delete-obsolete-k8s-pages.md) | Supprimer `kubernetes/docker` et `kubernetes/prometheus-grafana-operator` | 01 | XS |
| [05](./05-delete-high-availability-page.md) | Supprimer `kubernetes/high-availability`, relocaliser les sections utiles | 01 | S |
| [06](./06-rewrite-resources-page.md) | Réécrire `kubernetes/resources` (2 variantes, HPA, troubleshooting) | 01 | L |
| [07](./07-databases-section.md) | Créer la section Databases avec une page par DB | 01 | L |
| [08](./08-cleanup-operations-pages.md) | Nettoyer `operations/updates`, `operations/scaling`, `operations/backup` | 07 | M |
| [09](./09-remove-legacy-variables-and-pages-service.md) | Supprimer vars d'env legacy et toutes les références au service `pages` | — | S |

## Ordre de livraison recommandé

```
01 (menu)
 ├── 02 (helm) ── 03 (cloud)
 ├── 04 (delete docker + prom)
 ├── 05 (delete HA)
 ├── 06 (resources)
 └── 07 (DBs) ── 08 (ops cleanup)
09 (legacy vars) — indépendant
```

01 doit atterrir en premier pour éviter les conflits sur `docs.json`. 09 peut partir en parallèle de tout le reste.

## Sources de référence utilisées

- `prisme.ai-infra/aws/README.MD` — install AWS de référence
- `prisme.ai-infra/aws/studio-prod/helm/prismeai-{core,apps}-values.yaml` — variante "medium"
- `prisme.ai-infra/helm-charts/prismeai-{core,apps}/values.yaml` — variante "prod ready"
- `prisme.ai-infra/terraform/modules/aws/{elasticache,opensearch,prismeai,s3}` — modules Terraform
- `prisme.ai-infra/docs/fex/{README,resources}.md` — troubleshooting et resource matrix
