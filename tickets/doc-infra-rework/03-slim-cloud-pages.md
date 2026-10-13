# 03 — Réduire les pages `cloud/*` au contenu provider-spécifique

## Contexte

Les 4 pages `cloud/aws`, `cloud/azure`, `cloud/gcp`, `cloud/openshift` répètent à l'identique :
- les étapes d'install Helm (couvertes par le ticket 02),
- le sizing DB et cluster (qui ne dépend pas du provider),
- les "security best practices" génériques.

La seule chose qui doit rester par provider, ce sont :
1. **Les services managés recommandés** propres au provider (DB, search, cache, object storage, file storage).
2. **La solution PVC ReadWriteMany** propre au provider (cf. liste ci-dessous).
3. **Un pointeur** vers la doc / l'IaC du provider plutôt que des commandes CLI que nous maintenons mal.

Les clients standards utilisent leur propre IaC (Terraform majoritairement), donc dupliquer des commandes `eksctl` / `az` / `gcloud` apporte peu et vieillit vite.

## Scope

Pour chacune des 4 pages, garder cette structure (≤ 100 lignes par page) :

### Sections cibles

1. **Recommended managed services** — tableau récapitulatif :

   | Composant | Service recommandé | Notes |
   |-----------|--------------------|-------|
   | Kubernetes | EKS / AKS / GKE / OpenShift | Version min. |
   | MongoDB    | MongoDB Atlas (multi-cloud) | Renvoyer vers `databases/mongodb` |
   | Search     | OpenSearch Service / Elastic Cloud sur AKS / Elastic Cloud / OpenShift Elasticsearch Operator | |
   | Redis      | ElastiCache / Azure Cache for Redis (Enterprise pour RedisJSON+Search) / Memorystore Redis Cluster / Redis sur OpenShift | Mentionner besoin RedisJSON + RediSearch pour AI Knowledge |
   | Object storage | S3 / Azure Blob / GCS / OpenShift Data Foundation (Noobaa) | |
   | File storage (PVC RWX) | **EFS** ou **FSx for NetApp ONTAP** / **Azure Files (zone-redundant)** / **Filestore (regional)** / **OpenShift Data Foundation** | Doit être Multi-AZ |
   | TLS / Cert | ACM / Key Vault / Cert Manager + Cloud DNS / Cert Manager | |
   | Ingress | AWS Load Balancer Controller (ALB) / Application Gateway Ingress Controller / GKE Ingress / OpenShift Routes | |

2. **Persistent storage (PVC ReadWriteMany)** — paragraphe court :
   - AWS : EFS (StorageClass `efs-sc`) ou FSx for NetApp ONTAP, en Multi-AZ.
   - Azure : Azure Files avec zone-redundant storage (ZRS).
   - GCP : Filestore avec redondance régionale.
   - OpenShift : ODF (OpenShift Data Foundation).

3. **Infrastructure as Code** — un encart qui renvoie :
   - AWS : modules Terraform `prisme.ai-infra/terraform/modules/aws/{elasticache,opensearch,prismeai,s3}` + lien `prisme.ai-infra/aws/README.MD`.
   - Azure : pointer vers la doc Azure (templates Bicep / Terraform AzureRM provider).
   - GCP : pointer vers la doc Google (Deployment Manager / Terraform Google provider).
   - OpenShift : Operator-based deployment.

4. **Provider-specific notes** :
   - AWS : IRSA pour S3 / SES, IAM via OIDC, ALB annotations clé (renvoyer vers `kubernetes/helm` ticket 02 pour le détail).
   - Azure : Managed Identity / Workload Identity, PostgreSQL passwordless avec Entra ID, Azure DNS pour wildcard.
   - GCP : Workload Identity, GCS HMAC vs Service Account.
   - OpenShift : SecurityContextConstraints, Route TLS termination.

5. **Next Steps** — cards vers : `kubernetes/helm`, `databases/overview`, `operations/install-v27`.

### Sections à supprimer

- "Step-by-Step Deployment Guide" (toutes les commandes `helm install` redondantes).
- Snippets `eksctl`, `az`, `gcloud` qui dupliquent la doc provider (les remplacer par un lien vers la doc provider).
- "Security Best Practices" génériques (IAM rotation, network isolation… ça n'apporte rien de spécifique au provider et c'est répété 4 fois).
- Tableaux de sizing DB (cf. section Databases, ticket 07).

### Spécifique AWS (priorité)

Compléter à partir de `prisme.ai-infra/aws/README.MD` :
- Mention du certificat ACM wildcard à pré-créer.
- DNS CNAME des 3 hostnames vers l'ALB partagé.
- Secrets dans AWS Secrets Manager + External Secrets Operator (renvoi).
- CloudFront pour les assets publics.

Et lister les modules Terraform disponibles :
- `terraform/modules/aws/prismeai` — EKS, IAM, EFS, SecretsManager.
- `terraform/modules/aws/elasticache` — ElastiCache (broker, cache, crawler).
- `terraform/modules/aws/opensearch` — OpenSearch domain.
- `terraform/modules/aws/s3` — buckets models / uploads / public + CloudFront.

## Non-goals

- Ne pas réintroduire les étapes Helm dans les pages cloud — elles vivent dans `kubernetes/helm` (ticket 02).
- Ne pas écrire de tutoriel "0 to prod" CLI provider — renvoyer vers la doc provider.

## Acceptance criteria

- [ ] Aucune des 4 pages ne contient `helm install prismeai-core …`.
- [ ] Aucune des 4 pages ne re-documente le sizing DB.
- [ ] La page AWS référence les 4 modules Terraform.
- [ ] Chaque page mentionne explicitement la solution PVC RWX retenue pour le provider.
- [ ] Chaque page contient un lien clair vers `kubernetes/helm` pour l'install effective.

## Références

- `docs/self-hosting/cloud/{aws,azure,gcp,openshift}.mdx`
- `prisme.ai-infra/aws/README.MD`
- `prisme.ai-infra/terraform/modules/aws/`
