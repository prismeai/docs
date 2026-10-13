# 05 — Supprimer `kubernetes/high-availability` et relocaliser les sections utiles

## Contexte

La page `kubernetes/high-availability.mdx` (168 l.) est essentiellement du remplissage :

- **Example: Minimal HA Setup** — exemple de Deployment YAML qui n'a rien à faire ici, c'est géré par notre chart.
- **Stateless vs Stateful Services** — couvert par les pages resources et databases.
- **Microservice Redundancy** — couvert par la page resources (HPA + min replicas = 2).
- **Resilient Databases** — couvert par la section Databases (ticket 07).
- **Monitoring and Self-Healing** — pas de contenu utile.

Deux sections valent la peine d'être préservées **en les déplaçant** :

1. **Load Balancing & Ingress** → vers `self-hosting/requirements.mdx` (sous-section "Networking & Ingress").
2. **Kubernetes Cluster Architecture** (multi-AZ, control plane, node pools) → vers `self-hosting/requirements.mdx` (sous-section "Kubernetes Cluster").

## Scope

### 1. Extraire et déplacer

Avant suppression, copier dans `docs/self-hosting/requirements.mdx` :
- Le bloc "Load Balancing & Ingress" : ajouter comme sous-section sous "Networking and DNS".
- Le bloc "Kubernetes Cluster Architecture" : ajouter comme sous-section sous "Infrastructure Recommendations".

Au passage, condenser et retirer ce qui fait doublon avec le reste de `requirements.mdx`.

### 2. Supprimer la page

- [ ] `git rm docs/self-hosting/kubernetes/high-availability.mdx`
- [ ] Retirer l'entrée de `docs/docs.json`.
- [ ] Grep et corriger les liens entrants (cards "Next Steps", liens en ligne).
- [ ] Pour les liens "HA setup" → rediriger vers `kubernetes/resources` (qui couvre HPA + min replicas via ticket 06).

## Non-goals

- Ne pas réécrire la page resources ici (ticket 06).
- Ne pas créer de nouvelles pages — tout va dans `requirements.mdx`.

## Acceptance criteria

- [ ] `requirements.mdx` contient les deux sous-sections relocalisées, sans répétition avec son contenu existant.
- [ ] Le fichier `high-availability.mdx` est supprimé.
- [ ] `docs.json` ne référence plus la page.
- [ ] Aucun lien cassé dans le reste de la doc.

## Références

- `docs/self-hosting/kubernetes/high-availability.mdx`
- `docs/self-hosting/requirements.mdx`
