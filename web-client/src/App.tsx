import {createBrowserHistory} from 'history';
import {Module as DashboardModule} from './Components/Dashboard/Module';
import FuryHeader from './Components/Header/WebComponent';
import FuryNav from './Components/Nav/FuryNav';
import './index.scss';
import {DashboardConfig} from "./Services/ConfigurationLoader/DashboardConfig";

async function init() {
  
  await DashboardConfig.createDashboardConfigSingletonAsync();
  
  try {
    const dashboardModuleComponent = await (new DashboardModule()).loadElementConstructorAsync();
    window.customElements.define('fury-dashboard', dashboardModuleComponent);
    window.customElements.define('fury-header', FuryHeader);
    window.customElements.define('fury-nav', FuryNav);
  } catch {
  }
  
  
  const history = createBrowserHistory();
  
  const header = document.querySelector('#header');
  const nav = document.querySelector('#nav');
  const appContent = document.querySelector('#content');
  const footer = document.querySelector('#footer');
  
  header.innerHTML = `<fury-header />`;
  nav.innerHTML = `<fury-nav />`;
  
  const routes = {
    '/': 'div',
    '/support': 'fury-dashboard',
  };
  
  const findComponentName = (pathName: string) => {
    console.log('pathname', pathName);
    return routes[pathName] || 'not found';
  };
  
  const updatePageComponent = (location) => {
    console.log('location', location);
    appContent.innerHTML = `<${findComponentName(location.pathname)} />`;
  };
  
  history.listen(updatePageComponent);
  updatePageComponent(window.location);
  
  document.addEventListener('click', e => {
    if ((e.target as HTMLAnchorElement).nodeName === 'A') {
      const href = (e.target as HTMLAnchorElement).getAttribute('href');
      history.push(href);
      console.log('cambio route');
      e.preventDefault();
    }
  });
}

init();