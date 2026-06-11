---
name: centos-auto-deploy
description: Step-by-step workflow for deploying a Lovable project to a CentOS server with pm2 process management and cron-based auto-deployment from GitHub. Trigger when the user asks to deploy to CentOS, set up auto-deploy, configure pm2, or set up cron for automatic updates.
---

# CentOS Auto-Deploy Skill

Complete guide for setting up a Lovable project on a CentOS server with auto-deployment.

## Prerequisites
- CentOS server with root access
- Git installed
- Node.js and bun installed
- Project cloned from GitHub to `/var/www/<project-name>`

## Step 1: Install PM2 globally
```bash
npm install -g pm2
```

## Step 2: Create ecosystem config
File: `/var/www/<project-name>/deploy/ecosystem.config.js`
```javascript
module.exports = {
  apps: [{
    name: '<project-name>',
    script: './.output/server/index.mjs',
    cwd: '/var/www/<project-name>',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NITRO_PRESET: 'node-server'
    }
  }]
};
```

## Step 3: Create deploy script
File: `/var/www/<project-name>/deploy.sh`
```bash
#!/bin/bash
cd /var/www/<project-name>
git fetch origin
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
  echo "[$(date)] Changes detected. Pulling..."
  git pull origin main
  bun install
  bun run build
  pm2 reload deploy/ecosystem.config.js
  echo "[$(date)] Deployed successfully."
else
  echo "[$(date)] No changes."
fi
```
Make it executable:
```bash
chmod +x deploy.sh
```

## Step 4: Initial build and start
```bash
cd /var/www/<project-name>
bun install
bun run build
pm2 start deploy/ecosystem.config.js
pm2 save
pm2 startup systemd
```
Run the command `pm2 startup` outputs to enable startup on boot.

## Step 5: Set up cron job for auto-deploy
Add to crontab (runs every 2 minutes):
```bash
(crontab -l 2>/dev/null; echo '*/2 * * * * /var/www/<project-name>/deploy.sh >> /var/www/<project-name>/deploy.log 2>&1') | crontab -
```

Verify with `crontab -l`

## Step 6: Monitor logs
```bash
tail -f /var/www/<project-name>/deploy.log
```

## Common PM2 Commands
- `pm2 list` — see running processes
- `pm2 stop <name>` — stop app
- `pm2 delete <name>` — remove from pm2
- `pm2 logs <name>` — view app logs
- `pm2 reload <name>` — restart with zero downtime

## Important Notes
- Changes in Lovable automatically push to GitHub
- Cron job pulls from GitHub every 2 minutes
- Server rebuilds and restarts automatically if new commits exist
- No manual commands needed after initial setup
- To exit vi editor if opened by crontab: press Esc, type `:q!`, press Enter
