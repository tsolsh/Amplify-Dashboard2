import Poly from "../../services/ble.js"
import api from "../../services/api.js"
import { setTimeout } from "core-js";

export default {
  namespaced: true,
  state: {
    WSURL: null,
    links: [],
  },
  getters: {
    link: state => name => state.links.find(i => i.name === name),
  },
  actions: {
    async load ({commit}) {
      const res = await api('gw/ws');
      if (res?.data) commit('setWS', res.data);
    },
    async findPoly ({commit, getters}, name) {
      var poly = getters.link(name)?.poly;
      if (!poly) {
        poly = Poly();
        poly.stateChanged = s => commit('setPolyState', {name, s});
        commit('addLink', {name, poly});
        if (this.WSURL === null)
          this.load({commit});
      }
      if (!await poly.find())
        commit('removePoly', {name});
    },
    async connect ({commit, state, getters}, {name, session}) {
      var link = getters.link(name);
      const socket = new WebSocket(state.WSURL);
      socket.addEventListener('open', () => {
        socket.send(new Blob([`HELLO ${session} GWV=WEB-1.2 OK\n`]));
        commit('setSocket', {name, socket});
      });
      socket.addEventListener('message', e => link.poly.write(e.data));
      socket.addEventListener('close', () => {
        commit('setSocket', {name});
      });
    },
  },
  mutations: {
    setWS(state, {url, schema, host, port}) {
      state.WSURL = url || `${schema || 'wss'}://${host}:${port || 21098}`;
    },
    addLink(state, {name, poly, pm, ws}) {
      // state.links[name] = {poly};
      // Vue.set(state.links, name, {poly});
      // state.links = {...state.links, [name]: {poly}};
      state.links.push({name, poly, pm, ws});
    },
    setPolyState(state, {name, s}) { 
      const link = state.links.find(i => i.name === name);
      if (link){
        link.pm = s;
        if (s === 0) setTimeout(link.poly.find, 999);
      }
    },
    removePoly(state, {name}) {
      const link = state.links.find(i => i.name === name);
      if (link) {
        state.links = state.links.filter(i => i.name === name);
        link.poly.loose();
      }
    },
    setSocket(state, {name, socket}) {
      const link = state.links.find(i => i.name === name);
      if (!link) return;
      if (socket) {
        link.ws = socket;
        link.ticker = setInterval(() => {
          if (link.ws && link.poly?.canRead())
            link.ws.send(new Blob(link.poly.read()));
        }, 999)
      } else {
        link.ws = null;
        clearInterval(link.ticker);
        delete link.ticker;
      }
    }
  },
}
