module.exports = {
  apps: [{
    name: 'websiteofferteaanvragen',
    script: 'serve',
    env: {
      PM2_SERVE_PATH: './dist',
      PM2_SERVE_PORT: 3030,
      PM2_SERVE_SPA: 'true',
      NODE_ENV: 'production'
    },
    instances: 1,
    exec_mode: "cluster",
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    exp_backoff_restart_delay: 100
  }]
} 