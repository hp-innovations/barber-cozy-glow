## Problem

`http://corelinkdev.com/barbershop` renders as unstyled plain text. The HTML loads (200), but every CSS/JS file under `/barbershop/assets/...` fails with `net::ERR_ABORTED`.

Root cause: the app is built for the `/barbershop` subpath, so the HTML references assets at `/barbershop/assets/...`. The Node SSR server (Nitro) serves the SSR document at `/barbershop/`, but it serves the static asset files at the root path (`/assets/...`), not under the `/barbershop/` prefix. Asset requests therefore fall through to the SSR handler, return HTML instead of CSS/JS, and the browser aborts them — leaving the page unstyled.

## Fix

Have Nginx serve the hashed static files directly from the build output folder (`.output/public/assets`) for the `/barbershop/assets/` path, instead of proxying those to Node. This is the standard, reliable pattern for subpath hosting and also offloads static delivery from Node.

### 1. Update `deploy/install-site.sh` (Step 7 Nginx block)

In the `LOCATION_BLOCK` that the script writes, add a dedicated `assets` location **before** the existing proxy `location ${BASE_PATH}/` block so Nginx's longest-prefix match serves files directly:

```nginx
    # >>> ${APP_NAME} >>>
    location = ${BASE_PATH} { return 301 ${BASE_PATH}/; }

    # Serve hashed static assets directly from the build output (fast, correct MIME).
    location ${BASE_PATH}/assets/ {
        alias ${APP_DIR}/.output/public/assets/;
        access_log off;
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    location ${BASE_PATH}/ {
        proxy_pass http://localhost:${PORT}${BASE_PATH}/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    # <<< ${APP_NAME} <<<
```

(In the heredoc, `$uri`, `$host`, etc. must stay escaped as `\$uri` so the shell doesn't expand them — same convention the script already uses for the proxy variables.)

This change syncs to GitHub automatically.

### 2. Apply it on the server

Since DNS/HTTPS work is already done, the user re-pulls and re-runs the installer (idempotent — it regenerates the Nginx block and reloads):

```bash
cd /tmp/bcg && git pull
sudo APP_NAME=barbershop REPO_URL=https://github.com/hp-innovations/barber-cozy-glow.git DOMAIN=corelinkdev.com bash /tmp/bcg/deploy/install-site.sh
```

### 3. Immediate manual option (no full re-run)

If the user prefers a quick fix without re-running the whole script, edit the Nginx config directly:

```bash
sudo nano /etc/nginx/conf.d/lovable-sites.conf
```

Add this block just inside the `server { ... }`, above the existing `location /barbershop/` block:

```nginx
    location /barbershop/assets/ {
        alias /var/www/barbershop/.output/public/assets/;
        access_log off;
        expires 1y;
        try_files $uri =404;
    }
```

Then test and reload:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 4. Verify

Reload `http://corelinkdev.com/barbershop` (hard refresh). The site should now appear fully styled. Confirm in DevTools → Network that `styles-*.css` and `index-*.js` return `200` instead of `ERR_ABORTED`.

## Notes

- This also resolves the embedded Google Map and any future static images, since all bundled static files share the `/barbershop/assets/` path.
- HTTPS is unaffected; once certbot has run, the same config serves the assets over `https://corelinkdev.com/barbershop`.
- The earlier Node 22, `unzip`, and EPEL/certbot snags can optionally be folded into the script too (install Node 22 via NodeSource, add `unzip`, add `epel-release`) so a fresh server provisions cleanly in one pass — can be included on request.
