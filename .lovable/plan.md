# Hosting Your Sites on the CentOS VPS (subpath: `http://your-ip/barbershop`)

## The one thing to understand first

This barbershop site is **not** a folder of plain HTML files. It's a server-side rendered (SSR) app. That means:

- You can't just drop files into `/var/www/barbershop` and be done.
- Each site runs as a **small Node program** listening on its own port (e.g. `3001`, `3002`).
- **Nginx** sits in front and forwards visitors to the right program based on the URL path.

```text
                 ┌────────────── CentOS VPS ──────────────┐
Visitor  ─────▶  │  Nginx (port 80/443)                    │
   /barbershop   │     ├─▶ /barbershop → Node on :3001      │
   /restaurant   │     └─▶ /restaurant → Node on :3002      │
                 └─────────────────────────────────────────┘
```

## How the subpath works

You want `http://your-ip/barbershop`. For an SSR app this needs the app to know its
**base path** is `/barbershop`, otherwise its CSS/JS load from the wrong place and
the page looks broken.

That part is **already done in the code**. The app reads a build-time variable
`VITE_BASE_PATH`. When you build with `VITE_BASE_PATH=/barbershop`, every asset
and route is served under `/barbershop`. You set this per-site at build time, so
the same codebase can be hosted at any path.

---

## Part 1 — Prepare the VPS (one time only)

SSH into the server, then install the basics.

```bash
# Update system
sudo dnf update -y

# Install Nginx
sudo dnf install -y nginx
sudo systemctl enable --now nginx

# Install Node.js 20 + git
sudo dnf install -y nodejs git

# Install Bun (this project uses Bun) and PM2 (keeps apps running)
curl -fsSL https://bun.sh/install | bash
sudo npm install -g pm2

# Open the firewall for web traffic
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

> If SELinux blocks Nginx from connecting to your Node apps, run:
> `sudo setsebool -P httpd_can_network_connect 1`

---

## Part 2 — Get the barbershop code onto the server

You need this project's source on the VPS. Two options:
- Push the project to a **Git repository**, then `git clone` it.
- Or upload the project folder manually (e.g. with `scp` or SFTP).

```bash
sudo mkdir -p /var/www
cd /var/www
git clone <your-repo-url> barbershop
cd barbershop
bun install
```

---

## Part 3 — Build & run the barbershop under `/barbershop`

The key is building with `VITE_BASE_PATH=/barbershop`. This bakes the subpath into
the app so all assets resolve correctly.

```bash
cd /var/www/barbershop

# Build with the subpath baked in
VITE_BASE_PATH=/barbershop bun run build

# Run it with PM2 on port 3001
PORT=3001 pm2 start ".output/server/index.mjs" --name barbershop --interpreter node

pm2 save               # remember it across reboots
pm2 startup            # then run the command it prints, once
```

Check it's alive: `curl http://localhost:3001/barbershop` should return HTML.

> If the build output folder differs, run `ls -la .output/server` after the build
> and look for `index.mjs` — point PM2 at that path.

---

## Part 4 — Point Nginx at it (subpath method)

Create `/etc/nginx/conf.d/sites.conf`:

```nginx
server {
    listen 80;
    server_name _;   # responds on the server's IP (or set your domain)

    location /barbershop/ {
        proxy_pass http://localhost:3001/barbershop/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Make /barbershop (no trailing slash) redirect to /barbershop/
    location = /barbershop {
        return 301 /barbershop/;
    }
}
```

Then:

```bash
sudo nginx -t            # test config
sudo systemctl reload nginx
```

Visit `http://your-ip/barbershop` — done.

---

## Part 5 — Add HTTPS (free SSL, requires a domain)

SSL certificates can't be issued for a bare IP — you need a domain name pointing
at the VPS. Once you have one:

```bash
sudo dnf install -y certbot python3-certbot-nginx
# set server_name to your domain in the Nginx file first, then:
sudo certbot --nginx -d your-domain.com
```

Certbot edits the Nginx file and auto-renews.

---

## Part 6 — Adding more sites later (e.g. restaurant at `/restaurant`)

Each new site is the same steps with a different base path and port:

1. **Code + build with its own base path:**
   ```bash
   cd /var/www && git clone <restaurant-repo> restaurant
   cd restaurant && bun install
   VITE_BASE_PATH=/restaurant bun run build
   PORT=3002 pm2 start ".output/server/index.mjs" --name restaurant --interpreter node && pm2 save
   ```
2. **Add an Nginx `location` block** to `/etc/nginx/conf.d/sites.conf`:
   ```nginx
   location /restaurant/ {
       proxy_pass http://localhost:3002/restaurant/;
       proxy_http_version 1.1;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
   location = /restaurant {
       return 301 /restaurant/;
   }
   ```
3. **Reload:** `sudo nginx -t && sudo systemctl reload nginx`

Use a new port for each app (3001, 3002, 3003…) and a matching `VITE_BASE_PATH`
at build time. That's the whole trick.

---

## Quick recap

| Step | Command |
| --- | --- |
| Build for subpath | `VITE_BASE_PATH=/barbershop bun run build` |
| Run on a port | `PORT=3001 pm2 start ".output/server/index.mjs" --name barbershop --interpreter node` |
| Nginx | `location /barbershop/ { proxy_pass http://localhost:3001/barbershop/; ... }` |
| Reload Nginx | `sudo nginx -t && sudo systemctl reload nginx` |

The base path is wired into the code via `VITE_BASE_PATH`. Set it at build time
per site, give each app its own port, and add a matching Nginx `location` block.
