import api, { serverEvents } from '../../services/api.js';

export default {
  namespaced: true,
  state: {
    meta: {first: 0, last: 0, ended: true, channels: []},
    last: 0,
    raw: [],
    lastResults: {
      HR: {},
      RR: {},
      BP: {},
      Temp: {},
      Battery: {},
      AFib: {},
      PM_ED: {},
      Spikes: {},
    },
    history: [],
    trends: [],
    stream: null,
    animationMode: '',
    measures: {},
  },
  getters: {
    lastRaw: state => state.last ? state.raw[state.last % 64] : null
  },
  actions: {
    async start({commit}, {id, full, whatToDoWhenIGetAnActionClose}){
      commit('setRecording');
      if (id) {
        commit('setStream', await serverEvents(`live/${full ? 'pm' : 'live'}-stream/${id}`, {
          meta: m => commit('setRecording', m),
          raw: r => commit('addRaw', r),
          res: r => commit('setLastResults', r),
          action: whatToDoWhenIGetAnActionClose,
        }));
      } else commit('setStream');
    },
    stop({commit}) {
      commit('setStream');
    },
    async getHistory({commit}, {id}) {
      const res = await api('live/live-init/' + id);
      commit('setHistory', res.data);
    },
  },
  mutations: {
    setRecording(state, recording) {
      state.last = 0;
      state.raw = [];
      Object.assign(state.lastResults, {
        HR: {},
        RR: {},
        BP: {},
        Temp: {},
        Battery: {},
        AFib: {},
        PM_ED: {},
        Spikes: {},
      });
      state.meta = recording ?? {first: 0, last: 0, ended: true, channels: []};
    },
    setStream(state, stream) { state.stream?.close(); state.stream = stream; },
    addRaw(state, array) {
      let now = state.last;
      for (let r of array) {
        let time = r._id;
        if (time < now - 64) continue;
        if (now < time) now = time;
        state.raw[time % 64] = r;
      }
      state.last = now;
    },
    setLastResults(state, currentValues) {
      Object.assign(state.lastResults, currentValues);
      const nextHistory = 900 + (state.history[0]?.ts ?? (state.last - state.last % 900));
      if (state.last >= nextHistory){
        state.history.unshift({ts: state.last, ...currentValues});
      }
      const ts = ~~(state.last / 60);
      if (state.trends[0]?.ts !== ts) {
        state.trends.unshift({ts});
        if (state.trends.length > 15) state.trends.pop();
      }
      Object.assign(state.trends[0], currentValues)
    },
    setHistory(state, values) {
      values = values.map(({_id, ...etc}) => ({ts: _id * 60, ...etc}));
      values.reverse();
      state.history = values.filter(v => v.ts % 900 === 0);
      state.trends = values.slice(-15);
    },

    setAnimation(state, anim) {
      anim = anim ?? localStorage.getItem("animation") ?? 'Smooth';
      localStorage.setItem("animation", anim);
      state.animationMode = anim;
    },

    setECGMeasures(state, measures) {
      measures = measures ?? localStorage.getItem("ECG") ?? {}; var s = '';
      if(measures === "[object Object]") measures = '15';
      if(measures.secs) s = measures.secs;
      else s = measures;
      localStorage.setItem("ECG",s);
      var channel,secs;
      if(!measures.channel && !measures.secs) {
        channel = 'ECG'; secs = s;
      }
      else{
        channel = measures.channel; secs = measures.secs;
      }
      state.measures[channel] = secs;
      
    },

    setRespMeasures(state, measures) {
      measures = measures ?? localStorage.getItem("Respiration") ?? {}; var s = '';
      if(measures === "[object Object]") measures = '15';
      if(measures.secs) s = measures.secs;
      else s = measures;
      localStorage.setItem("Respiration",s);
      var channel,secs;
      if(!measures.channel && !measures.secs) {
        channel = 'Respiration'; secs = s;
      }
      else{
        channel = measures.channel; secs = measures.secs;
      }
      state.measures[channel] = secs;
      
    },
  },
}