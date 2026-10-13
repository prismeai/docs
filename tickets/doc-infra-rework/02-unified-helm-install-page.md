# 02 — Réécrire `kubernetes/helm` comme page d'install unifiée

## Contexte

Aujourd'hui :
- `kubernetes/helm.mdx` (234 l.) ne couvre que le namespace `core`, ne mentionne pas les valeurs critiques à configurer, et ne dit rien des annotations ingress.
- Chaque page `cloud/*` répète à l'identique les mêmes commandes `helm install`, ce qui crée de la redondance et des risques de dérive.

Objectif : faire de `kubernetes/helm.mdx` **la** source de vérité pour l'installation Helm — couvrant les deux namespaces `core` et `apps`, toutes les valeurs critiques, les annotations ingress, et les env vars importantes. Les pages `cloud/*` (ticket 03) viendront pointer vers cette page.

Source de référence : `prisme.ai-infra/aws/README.MD`.

## Scope

Réécrire `docs/self-hosting/kubernetes/helm.mdx` avec les sections suivantes :

### 1. Prerequisites
- Kubernetes 1.26+
- Helm 3+
- Bases de données provisionnées (lien vers la section Databases)
- Object storage configuré (S3-like / Azure Blob / GCS / Filesystem)
- Secret store optionnel (External Secrets / Vault / AWS Secrets Manager)

### 2. Add the Helm repository
```bash
helm repo add prismeai https://helm.prisme.ai/charts
helm repo update
```

### 3. Configure the `core` namespace

Bloc YAML commenté avec les valeurs critiques :

```yaml
global:
  apiUrl: "https://api.studio.example.com/v2"
  internalApiUrl: "http://prismeai-core-prismeai-api-gateway.prismeai-core/v2"
  consoleUrl: "https://studio.example.com"
  pagesHost: ".pages.example.com"

  broker:
    driver: redis
    existingSecret: "core-broker"
    maxLen: "700"

  storage:
    permissions:
      driver: mongoose          # or postgresql
      existingSecret: "core-permissions"
    workspaces:
      driver: S3_LIKE           # or FILESYSTEM | AZURE_BLOB | GCS
      s3_like_bucketName: "prismeai-models"
    uploads:
      driver: S3_LIKE
      s3_like_bucketName: "prismeai-uploads"
      s3_like_public_bucketName: "prismeai-public"
    events:
      driver: elasticsearch     # or opensearch
      existingSecret: "core-prismeai-events-store"
```

Documenter chaque service `core` :
- `prismeai-api-gateway` (users storage, sessions store, Mailgun secret, `UPLOADS_MAX_SIZE=100000000`)
- `prismeai-workspaces` (workspaces storage, `UPLOADS_MAX_SIZE=100000000`, `UPLOADS_ALLOWED_MIMETYPES=image/*,text/*,video/*,audio/*,application/*,font/*,message/rfc822`)
- `prismeai-runtime` (collections storage, contexts cache, `BROKER_EMIT_MAXLEN=1000000`)
- `prismeai-events` (rétention via `events.cleanupjob`, `events.retention`, `prismeai-events.events.workspaceMaxEvents`, `workspaceInactivityDays`, `automationExecutedExpiration`)
- `prismeai-console` (multi-domain via `consoleUrl`)

Indiquer pour chacun : où placer le secret, et quels env vars/clés Helm sont critiques.

### 4. Install `core`

```bash
helm install prismeai-core prismeai/prismeai-core \
  --namespace prismeai-core \
  --create-namespace \
  -f prismeai-core-values.yaml
```

### 5. Configure et installer le namespace `apps`

Bloc YAML commenté pour `prismeai-apps-values.yaml` :

```yaml
global:
  repository:
    host: registry.gitlab.com
    username: ""        # fourni par prisme.ai
    token: ""           # fourni par prisme.ai
    create: true
    imagePullSecretName: "registry-secret"
```

Documenter chaque service `apps` :
- `prismeai-functions` (`REQUEST_MAX_SIZE=20mb`, `NODE_OPTIONS=--max-old-space-size=...`, `KERNEL_POOL_SIZE`)
- `prismeai-crawler` (`MAX_CONTENT_LEN=2000000`, indices ES via `ELASTIC_INDICES_PREFIX`, secrets `apps-crawler-documents` et `apps-crawler-searchengines`)
- `prismeai-searchengine`
- `prismeai-nlu` (désactivé par défaut)
- `prismeai-llm` (optionnel, désactivé par défaut, tolérations dédiées)

Note sur le PVC partagé `apps-prismeai-sfsturbo` (EFS / Azure Files / Filestore).

```bash
helm install prismeai-apps prismeai/prismeai-apps \
  --namespace prismeai-apps \
  --create-namespace \
  -f prismeai-apps-values.yaml
```

### 6. Ingress et load balancer

Donner un exemple d'ingress complet avec annotations AWS ALB **et** les valeurs critiques de timeout :

```yaml
metadata:
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTPS": 443},{"HTTP": 80}]'
    alb.ingress.kubernetes.io/certificate-arn: "arn:aws:acm:..."
    alb.ingress.kubernetes.io/ssl-policy: "ELBSecurityPolicy-TLS13-1-2-2021-06"
    alb.ingress.kubernetes.io/load-balancer-attributes: idle_timeout.timeout_seconds=300,client_keep_alive.seconds=60
```

Expliquer pourquoi `idle_timeout=300` et `client_keep_alive=60` sont nécessaires (synchro gateway/ALB sur les streams SSE et websockets).

Inclure les 3 rules type (`api.*`, `studio.*`, `*.pages.*`) et la section `tls`.

Renvoyer aux pages `cloud/*` pour les équivalents Azure App Gateway / GCP Load Balancer.

### 7. PostgreSQL

Garder la section existante (3 clés à changer : `global.storage.permissions`, `prismeai-api-gateway.storage.users`, `prismeai-runtime.storage.collections`).

### 8. Security context

Garder la section existante.

### 9. Upgrade / rollback / uninstall

Commandes `helm upgrade`, `helm history`, `helm rollback`, `helm uninstall`.

### 10. Next Steps

Cards vers : Resources & HPA, Databases, Configuration, Operations.

## Non-goals

- Ne pas documenter Docker (ticket 04 supprime cette page).
- Ne pas dupliquer les recos provider — ça reste dans `cloud/*` (ticket 03).
- Ne pas inclure les ressources requests/limits → page `kubernetes/resources` (ticket 06).
- Ne pas documenter la conf des bases → section Databases (ticket 07).

## Acceptance criteria

- [ ] La page couvre `core` ET `apps`.
- [ ] Toutes les env vars listées dans le prompt sont mentionnées avec leur valeur recommandée.
- [ ] Les annotations ingress timeouts ALB sont documentées.
- [ ] Les clés `global.internalApiUrl` et `prismeai-events.events.*` sont documentées.
- [ ] La page ne mentionne plus le service `pages` comme service séparé (cf. ticket 09).

## Références

- `prisme.ai-infra/aws/README.MD`
- `prisme.ai-infra/helm-charts/prismeai-core/values.yaml`
- `prisme.ai-infra/helm-charts/prismeai-apps/values.yaml`
- `prisme.ai-infra/aws/studio-prod/helm/prismeai-core-values.yaml`
- `prisme.ai-infra/aws/studio-prod/helm/prismeai-apps-values.yaml`
