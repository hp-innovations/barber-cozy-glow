# Auto-update: edit in Lovable → refresh your live site

Goal: after you make a change in Lovable, your server automatically picks it up, rebuilds, and serves it — so you just refresh `corelinkdev.com/barbershop` to see the change.

## How it works (Option B — server pulls from GitHub)

```text
You edit in Lovable
      │  (auto-commits in real time)
      ▼
   GitHub repository
      │  (your server pulls every 2 min via cron)
      ▼
  Server: git pull → bun run build → restart Node process
      │
      ▼
Refresh corelinkdev.com/barbershop → change is live
```

No SSH keys to hand out, no cloud robot. Your server only reaches *out* to GitHub, which is the most secure and simplest setup for your case.

## Important detail about your project

This is a TanStack Start app, not static HTML. The build produces a Node server (`.output/server/index.mjs`), which you run (likely with PM2) behind nginx. The sub-path is controlled by the `VITE_BASE_PATH=/barbershop` environment variable at build time. The deploy script must always set that variable before building, or the `/barbershop/assets/...` URLs will break.

## Steps

### 1. Connect Lovable to GitHub (in Lovable, one-time)
- Plus (`+`) menu → GitHub → Connect project → create the repository.
- From now on every edit you make here auto-commits to that repo.

### 2. Clone the repo onto your server (one-time)
On the server, clone the GitHub repo into a working folder, e.g. `/var/www/barbershop`. This replaces the manual upload process you were doing before — the repo becomes the live source.

### 3. Create a deploy script on the server (one-time)
A small `deploy.sh` that:
- `git pull` the latest from GitHub
- only continues if something actually changed (avoids needless rebuilds)
- `bun install` (in case dependencies changed)
- `VITE_BASE_PATH=/barbershop bun run build`
- restart the Node app (`pm2 restart barbershop` or your process manager)

### 4. Schedule it with cron (one-time)
Add a cron entry that runs `deploy.sh` every 1–2 minutes. Result: within ~2 min of editing in Lovable, your server rebuilds and the live site updates on refresh.

### 5. Verify
- Make a small visible change in Lovable (e.g. a heading).
- Wait ~2 min, refresh `corelinkdev.com/barbershop`, confirm it appears.
- Check the cron log to confirm clean pulls/builds.

## What I'll provide when you implement
Since this lives on your server (outside Lovable), I can't run these commands for you, but I'll give you the exact copy-paste commands and file contents:
- the `git clone` command
- the full `deploy.sh` (with the `VITE_BASE_PATH` build, change-detection, and PM2 restart)
- the exact `crontab` line and how to view its log
- the nginx note to confirm it proxies to the Node app correctly

## Optional upgrade later
If you ever want zero-delay (instant) updates instead of the ~2-min cron window, we can switch to a GitHub webhook that triggers the same `deploy.sh` the moment you make a change. The cron approach is the recommended starting point.

## One thing to confirm
What folder do you want the repo to live in on the server (e.g. `/var/www/barbershop`), and are you currently running the app with **PM2** or something else (systemd, plain `node`)? That determines the exact restart command in the deploy script.