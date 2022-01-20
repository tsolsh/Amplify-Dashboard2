import { initAuth } from "../../services/auth.js"
import api, { withoutToken } from "../../services/api.js"

function unitConverter(unit, fallback) {
  var c = 1, d = 0, toPlaces = 1;
  switch(unit) {
    case 'C': return { unit, fromUI: v => +v, toUI: v => isNaN(v) ? v : (+v).toFixed(1), delta: v => v};
    case 'cm':
    case 'kg': return { unit, fromUI: v => ~~v, toUI: v => ~~v, delta: v => v};
    case 'F': c = 1.8; d = 32; break;
    case 'm': c = .01; toPlaces = 2; break;
    case 'lbs': c = 2.20462262; break;
    case 'inch':
      return {
        unit: null,
        fromUI(v) {  /* View => DB (feet" inch' to cm) */
          const m = /([\d.]+)[^\d.]+([\d.]+)/.exec(v + ' 0');
          return m ? ~~((12 * m[1] + +m[2]) * 2.54) : null;
        },
        toUI(v) { /* DB => View (cm to feet" inch') */
          if (isNaN(v)) return null;
          const i = v / 2.54, r = i % 12, f = (i - r) / 12;
          return `${~~f}' ${r.toFixed(1)}"`;
        },
        delta(D) { return (D / 2.54).toFixed(1); }
      };
    default:
      console.error('unknown unit ' + unit);   
      if (fallback)
        return unitConverter(fallback, null)
  }
  return {
    unit,
    fromUI(v) { return isNaN(v) ? v : (v - d) / c; }, /* View => DB (from local unit to metric) */
    toUI(v) { return isNaN(v) ? v : (v * c + d).toFixed(toPlaces); }, /* DB => View (from metric to unit) */
    delta(D) { return (D * c).toFixed(toPlaces); }
  };
}

export default {
  namespaced: true,
  state: {
    server: '',
    name: '',
    height: unitConverter('cm'),
    weight: unitConverter('kg'),
    temp: unitConverter('C', null),
    clock: new Date(),
    port: null,
    timeZone: null,
  },
  
  actions: {
    async load ({commit, dispatch}) {
      try {
        const res = await withoutToken.get('environment');
        commit('setEnv', res.data);
      }
      catch(e) {
        setTimeout(15_000, dispatch, 'load');
      }
    },
    
    async initUserUnits({commit}) { 
      const units = await api('/user/get_units');
      if(units){
        commit('initUnits', units.data)
      }
      else if (res.data.units){
        commit('setUnits', res.data.units)
      }
    },

    async setUserUnits(state, unit) { 
      const res = await api('/user/set_units/','put', unit);
      console.log(state.height,unit);
    },

    startTheClock({commit, dispatch}) {
      const d = new Date();
      commit('updateClock', d);
      setTimeout(() => dispatch('startTheClock', d), 1001 - d.getMilliseconds());
    },

    async setPort({commit}) { 
      const res = await api('/port');
      commit('setPort', res.data);
    },
  },

  mutations: {
    setEnv(state, data) {
      state.server = data.name;
      state.name = data.title;
      initAuth(data);
    },
    
    setUnits(state, {height, weight, temp}) { 
      if (height) state.height = unitConverter(height, 'cm');
      if (weight) state.weight = unitConverter(weight, 'kg');
      if (temp) state.temp = unitConverter(temp, 'C');
    },

    initUnits(state, units) { 
      for(var u in units){
        if (u === 'height') state.height = unitConverter(units[u], 'cm');
        if (u === 'weight') state.weight = unitConverter(units[u], 'kg');
        if (u === 'temp') state.temp = unitConverter(units[u], 'C');
      }
    },

    updateClock(state, now) { state.clock = now; },

    setPort(state, port){ state.port = port; },

    setTimeZone(state, timeZone){ state.timeZone = timeZone; }
  
  },
}
