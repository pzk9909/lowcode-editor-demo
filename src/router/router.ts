import Home from '../pages/Home/Home';
import Preview from '../pages/Preview/Preview'


let routes = [{
  path: "/",
  component: Home,
  exact: true
}, {
  path: "/preview",
  component: Preview,
  exact: true
},


];

export default routes;