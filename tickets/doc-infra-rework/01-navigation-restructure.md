# 01 — Restructurer le menu Self-Hosting

## Contexte

Le menu de gauche de l'onglet Self-Hosting est surchargé. Les pages les plus importantes — **installer**, **configurer**, **scaler**, **maintenir** — ne ressortent pas. Il manque aussi une section dédiée aux bases de données : aujourd'hui leurs infos sont éclatées dans `operations/updates`, `operations/scaling` et `operations/backup`.

Ce ticket pose les fondations de la refonte : il déplace/renomme/ajoute des entrées dans `docs.json` et crée les stubs des nouvelles pages, pour que les tickets suivants puissent éditer leur contenu sans conflit.

## Scope

### 1. Refondre la navigation `self-hosting` dans `docs/docs.json`

Cible (groupes du tab `Self-Hosting`) :

```
Overview
  - self-hosting/overview
  - self-hosting/requirements
  - self-hosting/architecture
  - self-hosting/sizing

Installation
  - self-hosting/kubernetes/helm           ← page d'install unifiée (cf. ticket 02)
  - Cloud Providers (sous-groupe)
      - self-hosting/cloud/aws
      - self-hosting/cloud/azure
      - self-hosting/cloud/gcp
      - self-hosting/cloud/openshift
  - self-hosting/kubernetes/environment-variables
  - self-hosting/kubernetes/resources      ← incl. HPA, cf. ticket 06

Databases                                  ← NOUVEAU groupe (cf. ticket 07)
  - self-hosting/databases/overview
  - self-hosting/databases/mongodb
  - self-hosting/databases/redis
  - self-hosting/databases/elasticsearch
  - self-hosting/databases/postgresql

Entreprise Services            (inchangé)
Product Configuration          (inchangé)

Operations
  - self-hosting/operations/install-v27
  - self-hosting/operations/migration-v27
  - self-hosting/operations/updates
  - self-hosting/operations/backup
  - self-hosting/operations/scaling
  - self-hosting/operations/testing
```

Retirées par les tickets suivants :
- `self-hosting/kubernetes/docker` (ticket 04)
- `self-hosting/kubernetes/prometheus-grafana-operator` (ticket 04)
- `self-hosting/kubernetes/high-availability` (ticket 05)

### 2. Créer les stubs des nouvelles pages DB

Cinq fichiers `.mdx` minimaux (titre + description + 1 phrase). Le contenu réel arrive dans le ticket 07.

- `self-hosting/databases/overview.mdx`
- `self-hosting/databases/mongodb.mdx`
- `self-hosting/databases/redis.mdx`
- `self-hosting/databases/elasticsearch.mdx`
- `self-hosting/databases/postgresql.mdx`

### 3. Mettre à jour les "Next Steps" / cards de la page `self-hosting/overview.mdx`

Pour refléter la nouvelle hiérarchie : Install → Databases → Configuration → Operations.

## Non-goals

- Ne pas toucher au contenu des pages existantes (sauf `overview.mdx` pour les cards).
- Ne pas supprimer les pages obsolètes ici (tickets 04 et 05).

## Acceptance criteria

- [ ] `docs.json` reflète l'arbo cible.
- [ ] Les 5 stubs DB existent et s'affichent (404 résolus).
- [ ] `npm run dev` (ou équivalent Mintlify) démarre sans erreur de page introuvable.
- [ ] La page `self-hosting/overview` pointe vers les nouvelles entrées.

## Références

- `docs/docs.json` lignes ~310–380
- `docs/self-hosting/overview.mdx`
