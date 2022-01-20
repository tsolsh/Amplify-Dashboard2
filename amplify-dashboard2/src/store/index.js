import { createStore } from 'vuex'
import auth from './modules/auth'
import env from './modules/env'
import gateway from './modules/gateway'
import history from './modules/history'
import layout from './modules/layout'
import live from './modules/live'
import sessions from './modules/sessions'
import manage from './modules/manage'
import locations from './modules/locations'
export default createStore({
  modules: {
    auth,
    env,
    gateway,
    history,
    layout,
    live,
    sessions,
    manage,
    locations
  },
})
