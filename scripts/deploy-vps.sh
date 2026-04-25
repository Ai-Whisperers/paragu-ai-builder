#!/usr/bin/env bash
# Deploy the paragu-ai Next.js app to the Hostinger VPS swarm.
#
# Used by .github/workflows/deploy.yml (SSHed in) and by humans on the VPS.
# Pulls the latest of a given branch, rebuilds the Docker image, and rolls
# the swarm service in place (zero-downtime via update_config.order=start-first
# declared on the service spec).
#
# Layout on the VPS:
#   /opt/stacks/paragu-ai-builder/   repo clone — ref is rewritten on each run
#   /etc/paragu-ai/env                secrets (chmod 600), sourced here
#   /opt/stacks/paragu-ai-builder/stack-prod.yml
#   /opt/stacks/paragu-ai-builder/stack-staging.yml
#
# Canonical copy of this script lives at the same path on the VPS — CI
# invokes the on-VPS copy; this file is the source of truth when it needs
# updating. Copy to the VPS with:
#   scp scripts/deploy-vps.sh root@72.61.44.159:/opt/stacks/paragu-ai-builder/deploy.sh
#
# Usage on the VPS:
#   ./deploy.sh prod                 # Main → paragu-ai_web
#   ./deploy.sh staging              # staging branch → paragu-ai-staging_web
#   ./deploy.sh staging <branch>     # deploy any branch to staging (hotfix previews)
set -euo pipefail

ENV=${1:-prod}
BRANCH=${2:-}
if [ -z "$BRANCH" ]; then
  if [ "$ENV" = "prod" ]; then BRANCH=Main; else BRANCH=staging; fi
fi
echo "[deploy] env=$ENV branch=$BRANCH"

REPO_DIR=${REPO_DIR:-/opt/stacks/paragu-ai-builder}
SECRETS=${SECRETS:-/etc/paragu-ai/env}

cd "$REPO_DIR"

# Fetch only the ref we want. --prune drops stale tracking refs (e.g.
# the feature branch that got deleted on merge). FETCH_HEAD is the
# canonical pointer to "what we just fetched" — using it avoids stale
# refs/remotes/origin/<branch> indirection.
git fetch --prune origin "$BRANCH"
git reset --hard FETCH_HEAD
echo "[deploy] HEAD: $(git log --oneline -1)"

TAG="paragu-ai:$ENV"
APP_URL="https://paragu-ai.com"
[ "$ENV" = "staging" ] && APP_URL="https://staging.paragu-ai.com"

# shellcheck disable=SC1090
set -a; source "$SECRETS"; set +a

# Note: full docker build output is logged. Previously we piped through
# `| tail -5` which hid every actual TS/build error behind Docker's stage
# summary. If your CI job's log becomes huge, add log rotation instead —
# don't drop signal.
docker build -f web/Dockerfile \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --build-arg SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" \
  --build-arg NEXT_PUBLIC_APP_URL="$APP_URL" \
  --build-arg GOOGLE_PLACES_API_KEY="$GOOGLE_PLACES_API_KEY" \
  -t "$TAG" .

SERVICE="paragu-ai-builder_web"
[ "$ENV" = "staging" ] && SERVICE="paragu-ai-staging_web"

# --force triggers a new task even when tag is reused (build digest differs)
docker service update --with-registry-auth --force --image "$TAG" "$SERVICE"

echo "[deploy] done. service=$SERVICE tag=$TAG"
