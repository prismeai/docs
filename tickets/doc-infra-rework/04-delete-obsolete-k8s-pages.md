# 04 — Supprimer `kubernetes/docker` et `kubernetes/prometheus-grafana-operator`

## Contexte

Deux pages à supprimer :

1. **`kubernetes/docker.mdx`** — pas à jour, personne ne l'utilise en prod. Pas pertinente pour un guide self-hosting destiné à de la production.

2. **`kubernetes/prometheus-grafana-operator.mdx`** — ne dit rien d'utile (install générique de l'operator sans contenu spécifique à Prisme.ai). À supprimer en attendant qu'on écrive un vrai guide monitoring (hors scope de cette refonte).

## Scope

- [ ] `git rm docs/self-hosting/kubernetes/docker.mdx`
- [ ] `git rm docs/self-hosting/kubernetes/prometheus-grafana-operator.mdx`
- [ ] Retirer les deux entrées de `docs/docs.json`.
- [ ] Grep et corriger les liens entrants depuis les autres pages de la doc :
  - Liens vers `/self-hosting/kubernetes/docker`
  - Liens vers `/self-hosting/kubernetes/prometheus-grafana-operator`
- [ ] Si des cards "Next Steps" pointent vers ces pages → remplacer la cible (ex. helm, resources, operations).

## Non-goals

- Pas de redirection Mintlify nécessaire (URLs internes uniquement, pas d'index public à fort trafic).
- Ne pas écrire de page monitoring de remplacement ici — c'est un futur chantier.

## Acceptance criteria

- [ ] Aucun fichier `.mdx` ne référence plus ces deux URLs.
- [ ] `npm run dev` (Mintlify) démarre sans warning de lien cassé.
- [ ] `docs.json` ne contient plus les deux entrées.

## Références

- `docs/self-hosting/kubernetes/docker.mdx`
- `docs/self-hosting/kubernetes/prometheus-grafana-operator.mdx`
- `docs/docs.json` lignes ~330–339
