import './scss/Header.css';
import './scss/scaffold.css';
import Dashboard from 'components/Dashboard'
import m from 'mithril'

window.app = {}
window.m = m

app.dashboard = m.mount(document.body, Dashboard.component({}))
