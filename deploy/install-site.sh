#!/usr/bin/env bash
#
# One-shot installer for hosting this SSR site on a CentOS VPS under a subpath
# (e.g. http://YOUR_IP/barbershop). Run it as a sudo-capable user.
#
# USAGE EXAMPLES
# --------------
# 1) Code already uploaded to /var/www/barbershop, host at /barbershop on port 3001:
#      sudo APP_NAME=barbershop ./install-site.sh
#
# 2) Clone from a git repo first:
#      sudo APP_NAME=barbershop REPO_URL=https://github.com/you/barbershop.git ./install-site.sh
#
# 3) Add a second site (restaurant) on a different port/path:
#      sudo APP_NAME=restaurant PORT=3002 BASE_PATH=/restaurant \
#           REPO_URL=https://github.com/you/restaurant.git ./install-site.sh
#
# 4) Use a domain + free HTTPS (must point DNS at this server first):
#      sudo APP_NAME=barbershop DOMAIN=barbershop.example.com ./install-site.sh
#
# CONFIG (override any of these with env vars)
# -------------------------------------------
APP_NAME="${APP_NAME:-barbershop}"      # PM2 process name + folder name
BASE_PATH="${BASE_PATH:-/${APP_NAME}}"  # URL subpath, e.g. /barbershop
PORT="${PORT:-3001}"                    # internal port this app listens on
APP_DIR="${APP_DIR:-/var/www/${APP_NAME}}"
REPO_URL="${REPO_URL:-}"                # optional: git URL to clone
DOMAIN="${DOMAIN:-}"                    # optional: domain for server_name + HTTPS
NGINX_CONF="/etc/nginx/conf.d/lovable-sites.conf"

set -euo pipefail
log() { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }
die() { printf '\n\033[1;31mERROR: %s\033[0m\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "Please run with sudo (root)."

# ---------------------------------------------------------------------------
log "Step 1/7 — Installing system packages (Nginx, Node, git)"
dnf install -y nginx nodejs git curl >/dev/null
systemctl enable --now nginx >/dev/null

# ---------------------------------------------------------------------------
log "Step 2/7 — Installing Bun + PM2"
if ! command -v bun >/dev/null 2>&1; then
  export BUN_INSTALL=/usr/local
  curl -fsSL https://bun.sh/install | bash >/dev/null
fi
BUN_BIN="$(command -v bun || echo /usr/local/bin/bun)"
command -v pm2 >/dev/null 2>&1 || npm install -g pm2 >/dev/null

# ---------------------------------------------------------------------------
log "Step 3/7 — Opening firewall + SELinux for web traffic"
if command -v firewall-cmd >/dev/null 2>&1; then
  firewall-cmd --permanent --add-service=http  >/dev/null 2>&1 || true
  firewall-cmd --permanent --add-service=https >/dev/null 2>&1 || true
  firewall-cmd --reload >/dev/null 2>&1 || true
fi
if command -v setsebool >/dev/null 2>&1; then
  setsebool -P httpd_can_network_connect 1 >/dev/null 2>&1 || true
fi

# ---------------------------------------------------------------------------
log "Step 4/7 — Getting the code into ${APP_DIR}"
mkdir -p "$(dirname "$APP_DIR")"
if [ -n "$REPO_URL" ]; then
  if [ -d "$APP_DIR/.git" ]; then
    git -C "$APP_DIR" pull --ff-only
  else
    rm -rf "$APP_DIR"
    git clone "$REPO_URL" "$APP_DIR"
  fi
fi
[ -f "$APP_DIR/package.json" ] || die "No package.json in ${APP_DIR}. Upload the code there or pass REPO_URL=..."

# ---------------------------------------------------------------------------
log "Step 5/7 — Installing deps + building with base path ${BASE_PATH}"
cd "$APP_DIR"
"$BUN_BIN" install
VITE_BASE_PATH="$BASE_PATH" "$BUN_BIN" run build
SERVER_ENTRY="$APP_DIR/.output/server/index.mjs"
[ -f "$SERVER_ENTRY" ] || die "Build did not produce ${SERVER_ENTRY}. Check 'ls -la .output/server'."

# ---------------------------------------------------------------------------
log "Step 6/7 — Starting the app on port ${PORT} with PM2"
pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
PORT="$PORT" pm2 start "$SERVER_ENTRY" --name "$APP_NAME" --interpreter node
pm2 save
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true

# ---------------------------------------------------------------------------
log "Step 7/7 — Configuring Nginx for ${BASE_PATH}"
# Build the server_name + the list of -d flags for certbot.
# For an apex domain (exactly one dot, e.g. corelinkdev.com) we also include www.
CERT_DOMAINS=""
if [ -n "$DOMAIN" ]; then
  if [ "$(echo "$DOMAIN" | tr -cd '.' | wc -c)" -eq 1 ]; then
    SERVER_NAME="${DOMAIN} www.${DOMAIN}"
    CERT_DOMAINS="-d ${DOMAIN} -d www.${DOMAIN}"
  else
    SERVER_NAME="${DOMAIN}"
    CERT_DOMAINS="-d ${DOMAIN}"
  fi
else
  SERVER_NAME="_"
fi
touch "$NGINX_CONF"

# Remove any previous block for this app (between matching markers), then append fresh.
sed -i "/# >>> ${APP_NAME} >>>/,/# <<< ${APP_NAME} <<</d" "$NGINX_CONF"

# Ensure a server{} wrapper exists; if file has no server block, create one.
if ! grep -q "listen 80;" "$NGINX_CONF" 2>/dev/null; then
  cat > "$NGINX_CONF" <<EOF
server {
    listen 80;
    server_name ${SERVER_NAME};
}
EOF
fi

# Insert the location block just before the final closing brace of the server block.
LOCATION_BLOCK=$(cat <<EOF
    # >>> ${APP_NAME} >>>
    location = ${BASE_PATH} { return 301 ${BASE_PATH}/; }

    # Serve hashed static assets directly from the build output (fast, correct MIME).
    # NOTE: no try_files here — with alias, \$uri keeps the full request path and breaks matching.
    location ${BASE_PATH}/assets/ {
        alias ${APP_DIR}/.output/public/assets/;
        access_log off;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ${BASE_PATH}/ {
        proxy_pass http://localhost:${PORT}${BASE_PATH}/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    # <<< ${APP_NAME} <<<
EOF
)
# Append block before the last "}" in the file.
awk -v block="$LOCATION_BLOCK" '
  { lines[NR] = $0 }
  END {
    last_brace = 0
    for (i = NR; i >= 1; i--) { if (lines[i] ~ /^}/) { last_brace = i; break } }
    for (i = 1; i <= NR; i++) {
      if (i == last_brace) print block
      print lines[i]
    }
  }
' "$NGINX_CONF" > "${NGINX_CONF}.tmp" && mv "${NGINX_CONF}.tmp" "$NGINX_CONF"

nginx -t
systemctl reload nginx

# ---------------------------------------------------------------------------
if [ -n "$DOMAIN" ]; then
  log "Setting up free HTTPS for ${SERVER_NAME}"
  dnf install -y certbot python3-certbot-nginx >/dev/null
  certbot --nginx $CERT_DOMAINS --non-interactive --agree-tos --redirect -m "admin@${DOMAIN}" || \
    echo "certbot failed (is DNS pointing here yet?). You can re-run: certbot --nginx ${CERT_DOMAINS}"
fi

IP="$(curl -fsS https://api.ipify.org 2>/dev/null || echo YOUR_IP)"
log "DONE!"
echo "Local check : curl http://localhost:${PORT}${BASE_PATH}"
if [ -n "$DOMAIN" ]; then
  echo "Visit       : https://${DOMAIN}${BASE_PATH}"
else
  echo "Visit       : http://${IP}${BASE_PATH}"
fi
echo "Logs        : pm2 logs ${APP_NAME}"
