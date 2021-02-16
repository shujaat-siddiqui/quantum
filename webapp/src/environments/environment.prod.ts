export const environment = {
  production: true,
  BASE_URL: "http://localhost:8091/",
  content: [
    {
      menu: 'Home',
      action: ['Home'],
      route: '/dashboard',
      icon: 'fas fa-file-video'
    },
    {
      menu: 'Create Project',
      action: ['CreateProject'],
      route: '/dashboard/createproject',
      icon: 'fas fa-volleyball-ball'
    },
    {
      menu: 'Create Team',
      action: ['CreateTeam'],
      route: '/dashboard',
      icon: 'fas fa-blog'
    },
    {
      menu: 'My Projects',
      action: ['MyProjects'],
      route: '/dashboard',
      icon: 'fas fa-leaf'
    }
  ]
};
