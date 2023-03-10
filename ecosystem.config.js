module.exports = {
  apps: [
    {
      name: 'Doreamon Finance',
      script: '/usr/local/bin/yarn',
      args: 'start',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      max_memory_restart: '500M',
    },
  ],
}
