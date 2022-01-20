import api from '../../services/api.js'

const state = () => ({
  // patients:{},
  patients:[],
  fullPatients:[],
  currentId: null,
  currentUser: null,
  currentPoly: null,
  polys:[],
  currPolys: [],
  users:[],
  gateways: [],
  currentGw: null,
  currGwPolys: [],
})

// getters
const getters = {
  // current: state => state.currentId && state.patients[state.currentId]
  current: state => state.patients.find(p => p.id === state.currentId)
}

// actions
const actions = {
  async loadPatients ({ commit }) {
    const res = await api('patient/all');
    commit('setPatients', res.data);
  },

  async loadFullPatients ({ commit }) {
    const res = await api('patient/full');
    commit('setFullPatients', res.data);
  },

  async loadCurrent ({ state, commit }, { id }) {
    if (!id) return;
    if (id != state.currentId)
      commit('setCurrent', { id });
  },

  async loadCurrentUser ({ commit }, { user }) {
    if (!user) return;
    // if (na!= state.currentId)
      commit('setCurrentUser', { user });
  },

  async addPatient ({commit }, {fields}) {
    const res = await api('patient/add','put', fields);
    commit('setPatients', res.data)
  },
  async patSessions ({commit}, {pid}) {
    const res = await api('patient/get_sessions/'+pid);
    commit('setPatSessions',res.data);
  },

  async disablePatient ({ commit }, {ses_id, p_id, switchOff}) {
    const res = await api('/patient/disable/'+ ses_id +'/'+ p_id +'/'+ switchOff);
    // console.log(state.currentId);
    commit('setPolyDetails', res.data);
  },

  async setUnits ({ state }, {units}) {
    await api('patients/units', 'put', units);
    console.info(state.patients);
    // commit('setPolys', res.data);
  },

  async loadPolys ({ commit }) {
    const res = await api('polymonitor/all');
    commit('setPolys', res.data);
  },

  // async loadCurrentPoly ({ state, commit }, { poly }) {
  //   if (!poly) return;
  //   if (poly != state.currentPoly)
  //     commit('setCurrentPoly', { poly });
  // },

  async loadCurrPolys ({ commit }) {
    const res = await api('polymonitor/details');
    commit('setCurrPolys', res.data);
  },

  // async loadPolyDetails ({ commit }) {
  //   const res = await api('polymonitor/details');
  //   commit('setPolyDetails', res.data);
  // },

  async editPoly ({commit }, {fields}) {
    const res = await api('polymonitor/update','put', fields);
    commit('setPolys', res.data)
  },

  async addPoly ({commit }, {fields}) {
    const res = await api('polymonitor/add','put', fields);
    commit('setPolys', res.data)
  },

  async disablePoly ({ state }, {p_name, switchOff}) {
    await api('/polymonitor/disable/'+ p_name+'/'+switchOff);
    console.log(state.currentId);
    //commit('setPolyDetails', res.data);
  },

  // async loadWards ({ commit }) {
  //   const res = await api('wards/details'), data = {};
  //   for(var w of res.data) {
  //     let rooms = {}
  //     for(var r of w.rooms) rooms[r.name] = r;
  //     data[w.name] = {name: w.name, rooms};
  //   }
  //   commit('setWards', data);
  // },

  async loadUsers ({ commit }) {
    const res = await api('user/all')
    commit('setUsers', res.data);
  },

  async loadGateways ({ commit }) {
    const res = await api('gw/all');
    commit('setGateways', res.data);
  },

  async loadCurrentGw ({ state, commit }, { serial }) {
    if (!serial) return;
    const res = await api('gw/status/'+ serial);
    // if (gw != state.currentGw)
    commit('setCurrentGw', res.data);
  },

  // async addGw ({commit }, {fields}) {
  //   const res = await api('gw/add','put', fields);
  //   commit('setGateways', res.data)
  // },
  async updateGW ({commit }, gw) {
    const res = await api('gw/update','put', gw);
    commit('setGateways', res.data)
  },
  async loadGwPolys ({commit }) {
    const res = await api('gw/activePolys');
    commit('setGwPolys', res.data)
  },

}

// mutations
const mutations = {
  addFinished (state, payload) { Object.assign(state.all,payload); },
  setPatients (state, payload) { state.patients = payload; },
  setFullPatients (state, payload) { state.fullPatients = payload; },
  setCurrent (state, { id }) { state.currentId = id; },
  setCurrentUser (state, { user }) { state.currentUser = user; },
  setPatSessions (state, payload) { state.patSessions = payload; },
  setPolys (state, payload) { state.polys = payload; },
  setCurrPolys (state, payload) { state.currPolys = payload; },
  setCurrentPoly (state, { poly }) { state.currentPoly = poly; },
  setPolyDetails (state, payload) { state.polyDetails = payload; },
  // setWards (state, payload) { state.wards = payload; },
  // setFullWards (state, payload) { state.fullWards = payload; },
  setUsers (state, payload) { state.users = payload; },
  setGateways (state, payload) { state.gateways = payload; },
  setCurrentGw (state, payload) { state.currentGw = payload; },
  setGwPolys (state, payload) { state.currGwPolys = payload; },

  restoreSesDetails(state, {pat,poly}){
    state.patients.find(p => p.id === pat["$oid"]).taken = 0;
    state.polys.find(p => p.id === poly["$oid"]).taken = false
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
