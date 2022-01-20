import api from '../../services/api.js';

export default {
  namespaced: true,
  state: {
    meta: {first: 0, last: 0, ended: true, channels: []},
    raw: [],
    results: [],
  },
  actions: {
    async load({commit}, {id, start}) {
      const res = await api('recording/view/' + id + '?start=' + start);
      commit('setData', res.data);
    },
  },
  mutations: {
    setData(state, {raw, res, meta}) {
      state.meta = meta;
      state.raw = raw;
      state.results = res;
    },
  },
}
