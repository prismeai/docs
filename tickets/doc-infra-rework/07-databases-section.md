# 07 — Créer la section Databases avec une page par DB

## Contexte

Aujourd'hui les infos sur les bases de données (rôle, versions compatibles, scaling, backup, updates) sont éclatées dans :
- `operations/updates.mdx`
- `operations/scaling.mdx`
- `operations/backup.mdx`
- `requirements.mdx` (versions)
- `sizing.mdx` (sizing)
- `kubernetes/environment-variables.mdx` (URLs / drivers)

Objectif : une section Databases dédiée avec **une page par DB** centralisant tout ce qui est spécifique à cette DB, et des cross-refs depuis les anciennes pages.

Les stubs sont créés par le ticket 01. Ce ticket les remplit.

## Scope

### 1. Pages à écrire

- `self-hosting/databases/overview.mdx` — table récapitulative, choix par stack.
- `self-hosting/databases/mongodb.mdx`
- `self-hosting/databases/redis.mdx`
- `self-hosting/databases/elasticsearch.mdx` (couvre aussi OpenSearch)
- `self-hosting/databases/postgresql.mdx`

### 2. Structure type pour chaque page DB

```
## Role in the platform
À quoi sert cette DB dans Prisme.ai (users / permissions / collections / cache / broker / events / contexts / sessions / search / workspaces models …).

## Version compatibility
Versions min/max, modules requis (RedisJSON + RediSearch, OpenSearch X.Y…).

## Recommended deployment
Service managé recommandé par provider (renvoi vers `cloud/*`), HA topology, multi-AZ.

## Sizing
Sizing de référence (CPU/RAM/stockage), avec lien vers `kubernetes/resources` pour les ressources applicatives.

## Configuration (Helm)
Quelles clés Helm pointent vers cette DB (`global.storage.permissions.url`, `broker.url`, etc.), secrets, drivers acceptés.

## Backup & restore
Procédure backup/restore (dump, snapshots provider). Renvoi vers `operations/backup` pour la stratégie globale.

## Updates
Notes de compatibilité version par version. Renvoi vers `operations/updates`.

## Scaling
Sharding/cluster mode, options de scale vertical/horizontal. Renvoi vers `operations/scaling`.

## Least privileges
Roles/permissions minimum requis (très important pour MongoDB et Elasticsearch).

## Troubleshooting
2–3 problèmes courants.
```

### 3. Contenu spécifique par DB

#### MongoDB
- Rôle : users, permissions, collections, workspaces metadata.
- **Version min : 5.0+** (mettre à jour `requirements.mdx`, `sizing.mdx`, `operations/updates.mdx` qui mentionnent encore 4.4+ / 6.x).
- Managed : Atlas (recommandé multi-cloud), DocumentDB (limitations à mentionner — features MongoDB non couvertes), Cosmos DB API MongoDB (Azure).
- Custom roles : reprendre la section actuelle de `operations/scaling.mdx`.
- Backup : `mongodump` / Atlas snapshots.

#### Redis
- Rôle : broker (streams), contexts cache (runtime), sessions store (api-gateway), search index (RedisJSON + RediSearch) pour AI Knowledge.
- **Version min : 6.1+** (mettre à jour `requirements.mdx`, `sizing.mdx` qui mentionnent encore 5.x).
- Modules requis pour AI Knowledge : RedisJSON + RediSearch (donc Redis Stack ou ElastiCache + Redis Enterprise / Azure Cache for Redis Enterprise / Memorystore Redis Cluster avec modules).
- Cluster mode : OK depuis v3.2 (mentionner).
- Numérotation des `db` Redis : convention par service (broker / cache / searchengine), reprendre la convention de `aws/README.MD`.
- Backup : RDB snapshots, AOF.

#### Elasticsearch / OpenSearch
- Rôle : events store, crawler index, searchengine index.
- Version : 8.x (Elasticsearch) ou OpenSearch 2.x.
- Index prefix multi-tenant : `EVENTS_STORAGE_NAMESPACE`, `ELASTIC_INDICES_PREFIX`.
- Cluster permissions : reprendre la section actuelle de `operations/scaling.mdx`.
- Warning : formatage de volume — reprendre l'avertissement existant de `operations/scaling.mdx`.
- Backup : snapshot repository S3 / Azure Blob / GCS.

#### PostgreSQL
- Rôle : alternative à MongoDB pour `permissions`, `users`, `collections`.
- **Version min : 12+** (mettre à jour `environment-variables.mdx` qui mentionne encore 10+).
- `sslmode=require` requis.
- 3 clés Helm concernées : `global.storage.permissions`, `prismeai-api-gateway.storage.users`, `prismeai-runtime.storage.collections`.
- Managed : RDS Postgres, Azure DB for PostgreSQL (avec Entra ID passwordless), Cloud SQL.

#### Overview page
Tableau récap :

| DB | Usage | Version min | Recommandée |
|----|-------|-------------|-------------|
| MongoDB | users, permissions, collections | 5.0+ | Atlas / DocumentDB |
| Redis  | broker, cache, sessions, search | 6.1+ | ElastiCache / Azure Cache Enterprise / Memorystore Cluster |
| Elasticsearch | events, crawler, search | 8.x | OpenSearch Service / Elastic Cloud |
| PostgreSQL | alternative à MongoDB | 12+ | RDS / Azure DB / Cloud SQL |

### 4. Mise à jour des pages existantes

Mettre à jour les versions :
- `requirements.mdx` : Redis 5.x → 6.1+, MongoDB 6.x → 5.0+ (relâcher la borne basse), Elasticsearch préciser 8.x.
- `sizing.mdx` : idem (3 occurrences Redis 5.x).
- `operations/updates.mdx` : MongoDB 4.4+ → 5.0+.
- `kubernetes/environment-variables.mdx` : PostgreSQL 10+ → 12+, Redis 5+ → 6.1+.

### 5. Cross-refs depuis les anciennes pages

Les sections DB-spécifiques de `operations/{updates,scaling,backup}` seront **vidées** et remplacées par des renvois ("See [MongoDB](/self-hosting/databases/mongodb#backup-restore) for details") — ce nettoyage est traité dans le **ticket 08**, qui dépend de celui-ci.

## Non-goals

- Pas de doc sur les charts Bitnami / install Redis dans le cluster — on assume des DB managées.
- Pas de doc Kubernetes Operators (Mongo Operator, ECK…) → laissé en référence externe.

## Acceptance criteria

- [ ] Les 5 pages existent et suivent la structure type.
- [ ] Tableau récap dans `overview.mdx`.
- [ ] Versions min mises à jour partout (Redis 6.1+, MongoDB 5.0+).
- [ ] Aucune contradiction de version entre les pages.
- [ ] Section "Least privileges" présente pour MongoDB et Elasticsearch.

## Références

- `prisme.ai-infra/helm-charts/prismeai-core/values.yaml` (drivers, secrets)
- `prisme.ai-infra/aws/README.MD` (conventions secrets, db numbers Redis)
- Sections actuelles à extraire :
  - `operations/scaling.mdx` (cluster permissions ES, custom roles Mongo)
  - `operations/backup.mdx` (procédures par DB)
  - `operations/updates.mdx` (compatibilité versions)
