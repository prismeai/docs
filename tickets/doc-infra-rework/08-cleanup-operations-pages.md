# 08 — Nettoyer `operations/updates`, `operations/scaling`, `operations/backup`

## Contexte

Une fois la section Databases en place (ticket 07), les pages `operations/*` doivent :
1. Perdre les sections DB-spécifiques (déplacées vers `databases/*`).
2. Garder uniquement la **stratégie transverse** (timing, ordre des étapes, checklist).
3. Renvoyer vers les pages DB pour les détails par moteur.

## Scope

### 1. `operations/updates.mdx`

À garder :
- Update strategy (rolling, blue/green).
- Pre-update checklist.
- Update process (Helm chart updates, Terraform updates).
- Post-update tasks.
- Rollback procedure.

À supprimer / déplacer vers `databases/*` :
- "Database Compatibility Considerations" → renvoyer vers `databases/mongodb#updates`, `databases/redis#updates`, `databases/elasticsearch#updates`.
- Toutes les notes versions par DB.

### 2. `operations/scaling.mdx`

À garder :
- Scaling approaches (vertical, horizontal, infra).
- When to scale.
- Scaling Core Components (renvoyer vers `kubernetes/resources` pour les valeurs).
- Infrastructure Scaling with Terraform.
- Monitoring for Scaling Decisions.
- Scaling Best Practices.

À supprimer / déplacer vers `databases/*` :
- MongoDB scaling (sharding, replica sets) → `databases/mongodb#scaling`.
- Elasticsearch/OpenSearch scaling + cluster permissions → `databases/elasticsearch#scaling` + `#least-privileges`.
- Redis scaling (cluster mode) → `databases/redis#scaling`.
- Storage Scaling (PVC resize) → garder dans `operations/scaling` (c'est K8s, pas DB).
- "Database Least Privileges" → déplacer vers chaque page DB (`#least-privileges`).
- "Service Crawler Optimization" (env vars) → garder, c'est applicatif (lien vers `databases/elasticsearch` pour la partie indices).

### 3. `operations/backup.mdx`

À garder :
- Backup strategy (RPO/RTO, fréquence).
- Configuration backup (Helm values, K8s manifests).
- Disaster Recovery Planning.
- Testing and Validation.

À supprimer / déplacer vers `databases/*` :
- MongoDB Backup procedures → `databases/mongodb#backup-restore`.
- Elasticsearch/OpenSearch backup → `databases/elasticsearch#backup-restore`.
- Redis backup → `databases/redis#backup-restore`.
- S3 backup → garder ici (object storage, pas une DB au sens Prisme).

### 4. Cross-refs

À chaque endroit où une section DB a été retirée :
- Laisser un encart court "See `databases/<db>` for details".
- Ne pas dupliquer — pure redirection.

## Non-goals

- Ne pas modifier le contenu des pages `databases/*` ici (ticket 07).
- Ne pas toucher à `operations/testing.mdx`, `install-v27.mdx`, `migration-v27.mdx`.

## Acceptance criteria

- [ ] Aucun bloc de procédure spécifique à MongoDB / Redis / Elasticsearch ne subsiste dans `operations/{updates,scaling,backup}`.
- [ ] Chaque section retirée a un renvoi clair vers la page DB correspondante.
- [ ] Les checklists et stratégies transverses restent intactes.
- [ ] Aucun lien cassé.

## Dépendances

Ce ticket dépend du ticket 07 (les pages DB doivent exister pour qu'on puisse y renvoyer).

## Références

- `docs/self-hosting/operations/updates.mdx` (428 l.)
- `docs/self-hosting/operations/scaling.mdx` (643 l.)
- `docs/self-hosting/operations/backup.mdx` (818 l.)
