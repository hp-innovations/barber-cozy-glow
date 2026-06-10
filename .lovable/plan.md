# Hosting Your Sites on the CentOS VPS

## The one thing to understand first

This barbershop site is **not** a folder of plain HTML files. It's a **TanStack Start app with server-side rendering (SSR)**. That means:

- You can't just drop files into `/var/www/barbershop` and be done.
- Each site runs as a **small Node program** listening on its own port (e.g. `3001`, `3002`).
- **Nginx** sits in front and forwards visitors to the right program.

```text
                 ┌────────────── CentOS VPS ──────────────┐
Visitor  ─────▶  │  Nginx (port 80/443)                    │
                 │     ├─▶ barbershop  → Node on :3001      │
                 │     └─▶ restaurant  → Node on :3002      │
                 └─────────────────────────────────────────┘
```

## Subpath vs Subdomain — read this before choosing

You asked for `http://ip/barbershop`. That's a **subpath**. It's possible, but with SSR apps it needs extra config (the app must be told its "base path" is `/barbershop`, otherwise its CSS/JS load from the wrong place and the page looks broken).

You already set up **wildcard DNS** (`*` → VPS IP). That means **subdomains work today with zero extra app config**:

- `barbershop.corelinkdev.com`
- `restaurant.corelinkdev.com`

**Recommendation:** use subdomains. Same goal (separate sites, easy to add more), much less fragile. The plan below covers the **subdomain path as the main route**, and includes the **subpath method** at the end if you insist on `/barbershop`.

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
- **Connect this Lovable project to GitHub** (Lovable → GitHub button), then `git clone` it.
- Or download/upload the project folder manually.

```bash
sudo mkdir -p /var/www
cd /var/www
git clone <your-repo-url> barbershop
cd barbershop
bun install
```

---

## Part 3 — Build & run the barbershop as a service

This project builds with **Nitro**. By default it targets Cloudflare Workers (for Lovable's own hosting). To run it as a normal Node service on your VPS, set the Nitro preset to **node-server** at build time. This is just an environment variable — it does **not** change any code, and it does not affect how Lovable publishes the site.

```bash
cd /var/www/barbershop

# Build a Node server bundle (note the env var)
NITRO_PRESET=node-server bun run build

# The build produces .output/server/index.mjs — run that with PM2 on port 3001
PORT=3001 pm2 start ".output/server/index.mjs" --name barbershop --interpreter node

pm2 save               # remember it across reboots
pm2 startup            # then run the command it prints, once
```

Check it's alive: `curl http://localhost:3001` should return HTML.

> If the build output folder differs (e.g. `.output` isn't created), run `ls -la` after the build and look for the generated `server/index.mjs` — point PM2 at that path. The `NITRO_PRESET=node-server` variable is the key part that makes it runnable outside Cloudflare.

---

## Part 4 — Point Nginx at it (subdomain method, recommended)

Create `/etc/nginx/conf.d/barbershop.conf`:

```nginx
server {
    listen 80;
    server_name barbershop.corelinkdev.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then:

```bash
sudo nginx -t            # test config
sudo systemctl reload nginx
```

Visit `http://barbershop.corelinkdev.com` — done.

---

## Part 5 — Add HTTPS (free SSL)

```bash
sudo dnf install -y certbot python3-certbot-nginx
sudo certbot --nginx -d barbershop.corelinkdev.com
```

Certbot edits the Nginx file and auto-renews. Repeat for each subdomain.

---

## Part 6 — Adding more sites later (e.g. restaurant)

Each new site is the same 3 steps:

1. **Code + build:**
   ```bash
   cd /var/www && git clone <restaurant-repo> restaurant
   cd restaurant && bun install
   NITRO_PRESET=node-server bun run build
   PORT=3002 pm2 start ".output/server/index.mjs" --name restaurant --interpreter node && pm2 save
   ```
2. **Nginx file** `/etc/nginx/conf.d/restaurant.conf` — same as Part 4 but `server_name restaurant.corelinkdev.com;` and `proxy_pass http://localhost:3002;`
3. **Reload + SSL:** `sudo nginx -t && sudo systemctl reload nginx`, then `sudo certbot --nginx -d restaurant.corelinkdev.com`

Use a new port for each app (3001, 3002, 3003…). Because your DNS already has the `*` wildcard, **no DNS changes are needed for new subdomains** — they just work.

---

## (Optional) Subpath method — `http://ip/barbershop`

If you truly want `/barbershop` instead of a subdomain:

1. The **app code must be configured with a base path** of `/barbershop` so its assets resolve correctly. This is a code change I'd make in this project (Vite/router base config) before building — it won't work without it.
2. Build & run on its port (same as Part 3).
3. Nginx uses a `location` block instead of a `server_name`:

```nginx
server {
    listen 80;
    server_name corelinkdev.com;   # or _ for IP-only

    location /barbershop/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /restaurant/ {
        proxy_pass http://localhost:3002/;
        # ... same headers ...
    }
}
```

Each app still needs its own base path baked in at build time. This is why subdomains are the lower-effort choice.

---

## What I need from you to proceed

This plan is a hosting guide — no app code changes are required for the **subdomain** route. I'd only touch the codebase if you choose the **subpath** route (to set the base path) or if the Node build target needs switching for VPS hosting.

Tell me:
1. **Subdomain** (`barbershop.corelinkdev.com`) or **subpath** (`/barbershop`)?
2. Do you want me to **switch the build output to a Node server** so it runs cleanly on your VPS with PM2?