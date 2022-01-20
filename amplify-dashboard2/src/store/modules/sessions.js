import api, {serverEvents} from '../../services/api.js'

const state = () => ({
  all: [],
  fullSettings: [],
  settings: [],
  patients:[],
  activePolys: [],
  takenPatients: [],
  currentId: null,
  permissions: [],
  stream: null,
  newSessionId: '',
  calibrationUpdates: {}
})

// getters
const getters = {
  current: state => state.all.find(p => p.id === state.currentId)
}

// actions
const actions = {
  async loadAll ({ commit }) {
    const res = await api('session/all/1');
    commit('setAll', res.data);
  },

  async start({commit}){
    commit('setStream', await serverEvents('session/stream-all', {
      sessions: lst => lst.forEach(s => commit('updateOne', s)),
    }));
  },
  stop({commit}) { commit('setStream'); },

  async loadSettings ({ commit }) {
    const res = await api('session/settings/1');
    commit('setFullSettings', res.data);
  },

  async loadFinished ({ commit }) {
    const res = await api('session/all/0')
    commit('addFinished', res.data);
  },

  async loadCurrent ({ commit }, { id }) {
    // if (!id) return;
    commit('setCurrent', { id });
  },

  async loadCurrentSettings({commit},{ id }){
    if (!id) return;
    const res = await api('session/config/' + id);
    if (res.data) commit('setSettings', res.data);
  },

  async loadPermissions ({ commit }) {
    const res = await api('user/get_permissions');
    commit('setPermissions',res.data);
  },

  async loadStatus ({ commit }, {id, nextst}) {
    const res = await api('session/status/'+ id + '/' + nextst);
    commit('updateStatus',res.data.status);
  },

  async loadNewId ({ commit }, { id }) {
    commit('setNewId', { id });
  },

  async loadActivePolys ({ commit }, {id}) {
    const res = await api('session/activePolys/'+ id);
    commit('setActivePolys',res.data);
  },

  async loadPatients ({ commit }) { //enabled patients only
    const res = await api('patient/all');
    commit('setPatients', res.data);
  },

  async loadTakenPatients ({ commit }, {id}) { //active patients for specific session
    const res = await api('session/takenPatients/'+ id);
    commit('setTakenPatients',res.data);
  },

  async startMonitoring ({ commit }, {id}) {
    const res = await api('monitoring/start/' + id);
    commit('updateOne', res.data);
  },

  async stopMonitoring ({ commit }, {id}) {
    const res = await api('monitoring/end/' + id);
    commit('updateOne', res.data);
  },

  async resetPM (_, {id}) {
    await api('monitoring/reset/' + id);
  },

  async newSession ({ commit }) {
    commit('setSettings', null);
    const res = await api('session/create');
    commit('updateOne', res.data);
    commit('setNewId', res.data);
  },

  async updateValue ({ commit, state }, key_path_value) {
    const id = state.currentId;
    if (!id) {
      console.error('no session', state);
      return;
    }
    if(key_path_value.key === 'location') {
      commit('updateSession', key_path_value);
    }else{
      commit('updateSettings', key_path_value);
    }
    /*const res =*/ await api('session/update/' + id ,'put', key_path_value);
    /*if (res.data && id === state.currentId) {
      if(key_path_value.key === 'location') {
        commit('updateSession', key_path_value);
      }else{
        commit('updateSettings', key_path_value);
      }
    }*/
  },

  async archiveSession ({commit,dispatch}, {id}) {
    await api('session/archive/'+ id, 'put');
    commit('updateStatus',99);
    dispatch('loadAll');
  },

  async deleteSession ({commit, dispatch}, {id}) {
    await api('session/'+ id, 'delete');
    commit('deleteSession', id);
    dispatch('loadAll');
  },

  async setTimedMeasurement ({commit, state}, payload) {
    const id = state.currentId;
    if (!id) {
      console.error('no session', state);
      return;
    }
    commit('setTimedMeasurement', payload);
    await api('session/update/' + id ,'put', {key: 'calibrate', path: ['timed'], value: state.settings.calibrate.timed});
  },

  autoUpdateTimedMeasurement({commit, state}) {
    const c = state.calibrationUpdates;
    if (c.handler) clearInterval(c.handler);
    const id = state.currentId;
    if (!id) return;
    
    c.handler = setInterval(async () => {
      if (id != state.currentId) {
        clearInterval(c.handler);
        return;
      }
      var needUpdate = false;
      if (state.settings?.calibrate?.timed) {
        for(var r of state.settings?.calibrate?.timed){
          if(r.status == 0 || r.status == 1){
            needUpdate = true;
            break;
          }
        }
      } else {
        // commit('setTimedMeasurement', {});
      }

      if(needUpdate) {
        const res = await api('session/timed/' + id);
        if (res.data) commit('updateTimedMeasurement', res.data);
      }
    }, 2_400);
    commit('setTimedMeasurement', {});
  }
}
// mutations
const mutations = {
  setAll (state, payload) { 
    state.all = payload;
  },
  setFullSettings (state, payload) { state.fullSettings = payload; },
  setSettings (state, payload) { state.settings = payload; },
  setPatients (state, payload) { 
    state.patients = payload; 
    state.all.filter(function(ses) {
      var session = state.fullSettings.find(s => ses.id === s.id);
      if(!session) return null;
      return payload.find(pat=> pat.id == session.patient?.$oid);
    })
  },
  setActivePolys (state, payload) { state.activePolys = payload; },
  setTakenPatients (state, payload) { state.takenPatients = payload; },
  updateStatus(state,payload) { state.all.find(p => p.id === state.currentId).status = payload; },
  deleteSession(state) { delete state.all.find(p => p.id === state.currentId); },
  setPermissions(state,payload) { state.permissions = payload;},
  setCurrent (state, { id }) { state.currentId = id; },
  setNewId (state, {id}) { state.newSessionId = id; },
  updateOne (state, payload) {
    const i = state.all.findIndex(p => p.id === payload.id);
    if (i < 0) state.all.push(payload);
    else state.all.splice(i, 1, Object.assign({}, state.all[i], payload));
  },
  
  addFinished (state, payload) {
    for(var ses in payload){ 
      if (!state.all.find(s => s.id === payload[ses].id))
        state.all.push(payload[ses]);
    } 
  },

  setStream(state, stream) { state.stream?.close(); state.stream = stream; },

  deleteSession(state) {
    const i = state.all.findIndex(p => p.id === state.currentId);
    state.currentId = null;
    state.settings = null;
    state.all.splice(i, 1)
  },

  setNewSession (state, payload) {
    state.currentId = payload.id;
    state.all.push(payload); 
  },

  updateSession (state, {key, path, value}) {
    var obj = state.all.find(p => p.id === state.currentId);
    for (let nextKey of path) {
        if (!(key in obj)) obj[key] = isNaN(nextKey) ? {} : [];
        obj = obj[key];
        key = nextKey;
    }
    obj[key] = value;
  },
  updateSettings (state, {key, path, value}) {
    var obj = state.settings;
    for (let nextKey of path) {
        if (!(key in obj) || !obj[key]) obj[key] = isNaN(nextKey) ? {} : [];
        obj = obj[key];
        key = nextKey;
    }
    obj[key] = value;
  },
  setTimedMeasurement (state, action) {
    var cal = state.settings.calibrate;
    if (!cal) state.settings.calibrate = cal = {};
    if (!cal.timed) cal.timed = [];
    else if (action.append) cal.timed.push({status: -2});
    if ('remove' in action) cal.timed.splice(action.remove, 1);
    while (cal.timed.length < 3)
      cal.timed.push({status: -2});
  },
  updateTimedMeasurement(state, newTimes) {
    const oldTimes = state.settings?.calibrate?.timed;
    if (!oldTimes) return;
    for (let i in newTimes) {
      if (oldTimes[i]?.ts && oldTimes[i].ts === newTimes[i].ts) {
        oldTimes[i].status = newTimes[i].status;
        oldTimes[i].info = newTimes[i].info;
      } else {
        state.settings.calibrate.times = newTimes;
        return;
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
