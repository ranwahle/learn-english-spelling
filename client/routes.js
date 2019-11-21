import {Router} from '/node_modules/@vanillarouter/router-module/dist/index.js';

const routes = [
    {path: '/', element: 'spell-training'},
    {path: '/spell-backoffice', element: 'spell-backoffice'}
]

Router.appRouter(routes);
