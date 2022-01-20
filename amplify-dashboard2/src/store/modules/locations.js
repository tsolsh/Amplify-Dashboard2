import api, { withToken } from '../../services/api.js'

const state = () => ({
  wards: [],
  ward: { name: null, rooms: [] },
  // wards:{},
  currentLoc: [],
  index: 0,
  fullWards:[],
})

// getters
const getters = {
}

// actions
const actions = {
  async loadAllWards ({ commit }) {
    const res = await api('wards/all');
    commit('setWards', res.data);
  },

  async loadFullWards ({ commit }) {
    const res = await api('wards/full_details');
    commit('setFullWards', res.data);
  },

  async loadActiveWards ({ commit }) {
    const res = await api('wards/active');
    commit('setWards', res.data);
  },
  async loadWardVacancy ({ commit }, { name }) {
    commit('setWard', { name: null, rooms: [] });
    if (name) {
      const res = await withToken.request({url: 'wards/vacancy', params: {ward: name}});
      commit('setWard', { name, rooms: res.data });
    }
  },

  // async loadFullWards ({ commit }) {
  //   const res = await api('wards/full_details'), data = res.data;
  //   // for(var w of res.data) {
  //   //   let rooms = {}
  //   //   for(var r of w.rooms) rooms[r.name] = r;
  //   //   data[w.name] = {name: w.name, rooms,disabled: w.disabled};
  //   // }
  //   commit('setFullWards', data);
  // },
  
  async loadCurrLoc ({ commit },{loc}) {
    if (!loc) return;
    if (loc != state.currentLoc)
      commit('setCurrentLoc', { loc });
  },

  async addWard ({ commit }, ward) {
    const res = await api('/wards/add/'+ ward);
    // for(var w of res.data) {
    //   let rooms = {}
    //   for(var r of w.rooms) rooms[r.name] = r;
    //   data[w.name] = {name: w.name, rooms};
    // }
    commit('setWards', res.data);
  },

  async saveWard ({commit }, wards) {
    const res = await api('/wards/rename/', 'put',wards);
    // const res = await api('/wards/save_ward/'+ wards);
    commit('setWards', res.data);
  },

  async saveRoom ({commit }, {room,index}) {
    const res = await api('/wards/save_room/'+index, 'put',room);
    commit('setWards', res.data);
  },

  async newRoom ({commit }, room) {
    const res = await api('/wards/room/', 'put', room);
    commit('setWards', res.data);
    },

  async saveBed ({commit }, {room,index}) {
    const res =await api('/wards/save_bed/'+index, 'put',room);
    commit('setWards', res.data);
  },

  async loadIndex ({ commit },{index}) {
    if (!index) return;
    if (index != state.index)
      commit('setIndex', { index });
  },

  async deleteRoom ({commit}, room) {
    const res = await api('/wards/room/','delete', room);
    commit('setWards', res.data);
  },

  async disableWard ({commit}, {ward,dis}) {
    const res = await withToken.request({url: '/wards/disable_ward/'+ dis, params: {ward}, method: 'put'});
    // const res = await api('/wards/disable_ward/'+ dis,'put', {ward});
    commit('setWards', res.data);
  },
}

// mutations
const mutations = {
  setWards (state, payload) { state.wards = payload; },
  // setWard (state, payload) { Object.apply(state.ward, payload); },
  setWard (state, payload) { state.ward = payload; },
  setCurrentLoc (state, { loc }) { state.currentLoc = loc; },
  setIndex (state, { index }) { state.index = index; },
  setFullWards (state, payload) { state.fullWards = payload; },
  restoreSesLoc(state, loc){
    state.wards.push(loc);
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
