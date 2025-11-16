module.exports = {
  apps: [
    {
      name: 'portfolio-backend',
      script: 'server/server.js',
      cwd: '/home/lisvindanu/www/AnaphygonPortofolios',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'portfolio-frontend',
      script: 'npx',
      args: 'serve -s build -p 3000',
      cwd: '/home/lisvindanu/www/AnaphygonPortofolios',
      env: {
        NODE_ENV: 'production'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'cloudflare-tunnel',
      script: 'sudo',
      args: 'cloudflared tunnel run vinmedia-tunnel',
      env: {
        NODE_ENV: 'production'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
};