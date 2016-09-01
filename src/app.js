// global app
// global m

//import 'd3/hierarchy'
import './scss/Header.css';
import './scss/scaffold.css';
import Dashboard from 'components/Dashboard'

window.app = {}
window.m = m

app.dashboard = m.mount(document.body, Dashboard.component({}))
