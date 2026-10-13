# 06 — Réécrire `kubernetes/resources` (2 variantes + HPA + troubleshooting)

## Contexte

La page actuelle (`kubernetes/resources.mdx`, 199 l.) :
- Ne couvre pas les 3 services du namespace `apps` (functions, crawler, searchengine).
- Mentionne le service `pages` qui n'existe plus.
- Mélange ressources applicatives et ressources DB (les DB doivent être dans la section Databases).
- Mentionne l'autoscaling sur 2 lignes seulement — il faut une vraie section.
- Contient deux chapitres déplacés/inutiles : "Persistent Storage Recommendations" et "Monitoring Kubernetes Resources".
- Le chapitre "Troubleshooting" est pauvre.

## Scope

Réécrire la page complète avec la structure suivante :

### 1. Two reference variants

Présenter **deux variantes** de `requests/limits`, et expliquer le choix entre les deux.

#### Variant A — "Balanced" (économique, scaling modéré)

Cible : déploiements de quelques dizaines à centaines d'utilisateurs simultanés max. Pas conçu pour scaler à milliers d'users en parallèle. Compromis économique : on évite de réserver du CPU qu'on n'utilisera pas la plupart du temps.

Source : `prisme.ai-infra/aws/studio-prod/helm/prismeai-{core,apps}-values.yaml`.

Tableau (core) :

| Service       | CPU req | Memory req | Memory limit | HPA min / max |
|---------------|---------|------------|--------------|---------------|
| api-gateway   | 300m    | 200Mi      | 300Mi        | 2 / 4         |
| workspaces    | 300m    | 200Mi      | 400Mi        | 2 / 4         |
| runtime       | 2000m   | 2500Mi     | 2500Mi       | 2 / 4         |
| events        | 500m    | 300Mi      | 500Mi        | 2 / 4         |
| console       | 100m    | 300Mi      | 300Mi        | 2 / 4         |

Tableau (apps) :

| Service       | CPU req | Memory req | Memory limit | HPA min / max |
|---------------|---------|------------|--------------|---------------|
| functions     | 400m    | 1.5Gi      | 2Gi          | 1 / 6         |
| crawler       | 1500m   | 3Gi        | 3Gi          | 1 / 4         |
| searchengine  | 100m    | 200Mi      | 400Mi        | 1 / 4         |

#### Variant B — "Production-ready" (scaling max par pod)

Cible : volume utilisateur élevé, max throughput par pod. Correspond aux valeurs par défaut des charts Helm. Les requests correspondent **au maximum réellement utilisable** par nos services Node.js — au-delà, on gaspille.

Pourquoi ce plafond : nos services Node.js sont mono-thread (sauf `runtime` qui peut tourner sur plusieurs threads via `RUNNER_MAX_THREADS`) et ne peuvent pas dépasser significativement 1 CPU.

Source : `prisme.ai-infra/helm-charts/prismeai-{core,apps}/values.yaml`.

Tableaux équivalents (core et apps) à reproduire depuis ces fichiers.

#### Comment choisir ?

Encart explicatif :
- **Request élevée** = moins de pods placables par machine → plus de gaspillage CPU/RAM quand les pods sont inactifs.
- **Request basse** = plus de pods par machine → risque que la machine ne puisse pas fournir le CPU/RAM nécessaire en cas de pic.

Décider :
- Trafic relativement constant + budget serré → Variant A.
- Pics importants à absorber par pod → Variant B.

### 2. CPU limits — important note

Encart : **ne jamais mettre de CPU limit sur nos services**.

Justification : Linux/CFS throttle déjà les pods dès qu'ils dépassent leur request si un autre pod a besoin de CPU. Une limite ne ferait que gaspiller du CPU et ralentir les pods quand la machine a du CPU libre. Les CPU limits causent plus de problèmes qu'elles n'en résolvent.

(Les limites mémoire restent OK et recommandées.)

### 3. Horizontal Pod Autoscaling (HPA)

Section dédiée :

- Règle d'or : **toujours 2 replicas minimum en prod** (redondance), pour tous les services `core` et pour `functions` et `crawler` (apps).
- Cibles HPA recommandées : 70% CPU pour la plupart, 80% CPU/mémoire pour `crawler` et `nlu`.
- Snippet HPA Helm values type :

```yaml
prismeai-runtime:
  hpa:
    enabled: true
    minReplicas: 2
    maxReplicas: 5
    targetCPUUtilizationPercentage: 70
```

- Recommander la session stickiness via header pour `prismeai-events` (cohérent avec la DestinationRule Istio dans `aws/README.MD`).
- Mentionner que `prismeai-llm`, `prismeai-nlu` n'ont en général pas besoin de HPA.

### 4. Resource quotas et LimitRanges

Garder les exemples existants (`ResourceQuota`, `LimitRange`) — utiles.

### 5. Troubleshooting

Section enrichie à partir de `prisme.ai-infra/docs/fex/README.md`. Inclure :

- Pods qui ne schedulent pas (`kubectl describe pod` / nodes pleins / NodeAffinity).
- HPA qui sature `maxReplicas` (`kubectl get hpa` / éditer `maxReplicas`).
- Pods OOMKilled (vérifier `kubectl logs --previous` / augmenter request mémoire).
- Throttling CPU (vérifier `kubectl top pods` / monter request CPU).
- Nodes saturés (`kubectl top nodes`, `kubectl describe nodes`).

Commandes utiles, version simplifiée (`kubectl --context ... -n ...` etc.).

### 6. Sections à supprimer

- **Persistent Storage Recommendations** — ça relève des prérequis provider (déjà couvert dans `requirements.mdx` et `cloud/*`).
- **Monitoring Kubernetes Resources** — supprimé, sera couvert par un futur guide monitoring dédié.

### 7. Sections à NE PAS inclure

- Pas de ressources DB ici (elles vivent dans `databases/{mongodb,redis,...}` — ticket 07).
- Pas de service `pages` — supprimé (cf. ticket 09).

## Non-goals

- Ne pas couvrir la conf des services en détail (env vars) → page `kubernetes/helm`.
- Ne pas couvrir la conf des bases → `databases/*`.

## Acceptance criteria

- [ ] Les deux variantes (A et B) sont documentées avec leurs valeurs sourcées.
- [ ] Section HPA dédiée avec la règle "min 2 replicas en prod".
- [ ] Encart explicite "pas de CPU limit" avec justification.
- [ ] Section Troubleshooting enrichie depuis `fex/README.md`.
- [ ] Aucune mention du service `pages`.
- [ ] Aucune mention de ressources MongoDB / Redis / Elasticsearch dans cette page.

## Références

- `prisme.ai-infra/aws/studio-prod/helm/prismeai-core-values.yaml`
- `prisme.ai-infra/aws/studio-prod/helm/prismeai-apps-values.yaml`
- `prisme.ai-infra/helm-charts/prismeai-core/values.yaml`
- `prisme.ai-infra/helm-charts/prismeai-apps/values.yaml`
- `prisme.ai-infra/docs/fex/resources.md`
- `prisme.ai-infra/docs/fex/README.md`
