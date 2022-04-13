export default [
  {
    path: '/user',
    component: '../layouts/LoginLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './Login' },
    ],
  },
  {
    path: '/',
    component: '../layouts/AuthLayout',
    routes: [
      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: './Dashboard' },
      {
        path: '/moduleName',
        name: 'moduleName',
        routes: [{ path: '/moduleName/demo', component: './Demo' }],
      },
      {
        path: '/authData',
        name: '培训演示数据',
        routes: [
          {
            path: '/authData/index',
            component: './AuthData',
            title: '培训演示数据',
          },
        ],
      },
      {
        path: '/flowForm',
        name: '培训演示数据',
        routes: [
          {
            path: '/flowForm/index',
            component: './FlowForm',
            title: '培训演示数据',
          },
          {
            path: '/flowForm/approveDetail',
            component: './FlowForm/approve/ApproveDetail',
            title: '流程详情',
          },
          {
            path: '/flowForm/approveEdit',
            component: './FlowForm/approve/ApproveEdit',
            title: '流程修改',
          },
        ],
      },
    ],
  },

];
