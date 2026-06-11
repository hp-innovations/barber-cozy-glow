#!/usr/bin/env bash
#
# deploy.sh — pull latest from GitHub, rebuild, and restart the app.
#
# This script lives in the repo so it stays in sync automatically.
# Run it on your server (manually or via cron) to update the live site
# after you make changes in Lovable.
#
# One-time setup on the server:
#   1. git clone <your-repo-url> /var/www/barbershop
#   2. cd /var/www/barbershop && chmod +x deploy.sh
#   3. (optional) add to cron — see bottom of this file.
#
# Adjust the variables below to match your server if needed.

set -euo pipefail

# ---- Configuration -----------------------------------------------------------
APP_DIR="${APP_DIR:-/var/www/barbershop}"   # where the repo is cloned
BRANCH="${BRANCH:-main}"                     # git branch Lovable pushes to
BASE_PATH="${VITE_BASE_PATH:-/barbershop}"   # subpath nginx serves from
PM2_NAME="${PM2_NAME:-barbershop}"           # pm2 process name
LOG="${DEPLOY_LOG:-$APP_DIR/deploy.log}"     # log file
# -----------------------------------------------------------------------------

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG"; }

cd "$APP_DIR"

# Fetch the latest commit info without changing anything yet.
git fetch origin "$BRANCH" --quiet
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")

# Nothing changed? Exit quietly so cron stays silent.
if [ "$LOCAL" = "$REMOTE" ]; then
  exit 0
fi

log "Change detected ($LOCAL -> $REMOTE). Deploying..."

# Pull the new code.
git reset --hard "origin/$BRANCH" >>"$LOG" 2>&1

# Install deps (fast no-op when nothing changed) and build.
log "Installing dependencies..."
npm install >>"$LOG" 2>&1

log "Building (VITE_BASE_PATH=$BASE_PATH)..."
VITE_BASE_PATH="$BASE_PATH" npm run build >>"$LOG" 2>&1

# Restart the Node server. The build output is .output/server/index.mjs.
# Using pm2; if the process doesn't exist yet, start it.
if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
  log "Restarting pm2 process '$PM2_NAME'..."
  pm2 restart "$PM2_NAME" >>"$LOG" 2>&1
else
  log "Starting pm2 process '$PM2_NAME'..."
  PORT="${PORT:-3000}" pm2 start .output/server/index.mjs --name "$PM2_NAME" >>"$LOG" 2>&1
fi

log "Deploy complete."

# ---- Cron setup (run once on the server) -------------------------------------
# Open crontab:   crontab -e
# Add this line to check GitHub every 2 minutes:
#
#   */2 * * * * /var/www/barbershop/deploy.sh >> /var/www/barbershop/deploy.log 2>&1
#
# View the log:   tail -f /var/www/barbershop/deploy.log
# -----------------------------------------------------------------------------
