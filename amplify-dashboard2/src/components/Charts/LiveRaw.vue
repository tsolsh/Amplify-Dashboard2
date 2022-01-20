<template>
  <div class="live-monitor" :class="{forceDarkScheme}">
    <div class="waves">
      <LiveWave v-for="w in waves" :key="w.channel" v-bind="w" :seconds="window" width="100%" />
    </div>
    <aside>
      <details>
        <summary><i>📈</i> Session</summary>
        <table>
          <tr v-for="v, k in patientLabel" :key="k"><th>{{k}}:</th><td>{{v}}</td></tr>
        </table>
      </details>
        
      <details>
        <summary><i>⌚</i> Time</summary>
        <table>
          <tr>
            <th>Now:</th><td>{{now}}</td><td rowspan="3">
              <svg width="50" viewBox="-48 -51 96 99" preserveAspectRatio="none">
                <circle r="47" fill="#999" />
                <path v-if="meta.first" fill="#0093" stroke-width="2" stroke="#ccfc" :transform="`rotate(${6*((last - meta.first)%60)})`"
                   d="M0-44V0L1-22H38L19-11L38,22L19,11L0,44V22H-38L-19,11L-38-22L-19-11Z" />
                <line y1="-51" stroke-width="5" stroke="#ff0" />
              </svg>
            </td>
          </tr>
          <tr><th>Showing:</th><td>{{lastTime}}</td></tr>
          <tr><th>Gap:</th><td>{{gap}} sec.</td></tr>
        </table>
      </details>
        
      <details>
        <summary><i>🧭</i> Orentation</summary>
        <p style="font-size: 3em; text-align:center; margin: .1em"><Gyro :placement="baseline?.polymonitorBodyLocation" /></p>
      </details>
        
      <details>
        <summary><i>📶</i> Signal Validation</summary>
        <table>
          <tr>
            <th>Electrodes:</th>
            <td :class="alertClass(lr?.PM_ED)">
              {{lr?.PM_ED?.Status}}<br/>
              <svg width="45" height="25">
                <use style="color: #9999" :href="pmIcon"/>
                <use v-for="e in pmED" :key="e" :href="e"/>
              </svg>
            </td>
          </tr>
          <tr>
            <th>Spikes:</th>
            <td :class="alertClass(lr?.Spikes)">{{lr?.Spikes?.Status}}<br/>{{lr?.Spikes?.Reason}}</td>
          </tr>
        </table>
      </details>
        
      <details>
        <summary><i>❤</i> Heart</summary>
        <table>
          <tr>
            <th>HR:</th>
            <td :class="alertClass(lr?.HR)">{{lr?.HR?.Status}}</td>
            <td class="value" rowspan="4">{{lr?.HR?.Value}}</td>
          </tr>
          <tr>
            <th>b.:</th>
            <td>{{baseline.hr}}</td>
          </tr>
          <tr>
            <th>R2R:</th>
            <td>{{lr?.HR?.R2R}}</td>
          </tr>
          <tr>
            <th>AFib:</th>
            <td :class="alertClass(lr?.AFib)">{{lr?.AFib?.Status}}</td>
          </tr>
        </table>
      </details>
         
      <details>
        <summary><i>😤</i> Respiration</summary>
        <table>
          <tr>
            <th>RR:</th>
            <td :class="alertClass(lr?.RR)">{{lr?.RR?.Status}}</td>
            <td class="value" rowspan="3">{{lr?.RR?.Value}}</td>
          </tr>
          <tr>
            <th>b.:</th>
            <td>{{baseline.rr}}</td>
          </tr>
          <tr>
            <th>MVT:</th>
            <td>{{lr?.RR?.MVT?.toFixed(0)}}</td>
          </tr>
          <tr>
            <th>RII:</th>
            <td colspan="2" :class="alertClass(lr?.RR?.RII)">{{lr?.RR?.RII?.Status}}</td>
          </tr>
        </table>        
      </details>
         
      <details>
        <summary><i>🩸</i> Blood Pressure</summary>
        <table>
          <tr>
            <th>Dia.</th><th>Sys.</th><th>MAP</th>
          </tr>
          <tr>
            <td class="value">{{lr?.BP?.Sys}}</td>
            <td class="value">{{lr?.BP?.Dia}}</td>
            <td>{{mapBP}}</td>
          </tr>
          <tr>
            <td colspan="3" :class="alertClass(lr?.BP)">{{lr?.BP?.Status}}</td>
          </tr>
        </table>        
      </details>
         
      <details>
        <summary><i>🌡</i> Temperature</summary>
        <table>
          <tr>
            <th>Core:</th>
            <td :class="alertClass(lr?.Temp)">{{lr?.Temp?.Status}}</td>
            <td class="value" rowspan="3">{{lr?.Temp?.Value}}</td>
          </tr>
          <tr>
            <th>Skin:</th>
            <td>{{lr?.Temp?.Skin?.toFixed(2) ?? '—'}} ({{polyMonitor?.cf_skin ?? ' — '}})</td>
          </tr>
          <tr>
            <th>Ambient:</th>
            <td>{{lr?.Temp?.Ambient?.toFixed(2) ?? '—'}} ({{polyMonitor?.cf_ambient ?? ' — '}})</td>
          </tr>
          <tr>
            <th>b.:</th>
            <td colspan="2">{{baseline.temperature ?? '—'}} ({{baseline.temperatureType ?? ' — '}})</td>
          </tr>
        </table>
      </details>

      <details>
        <summary><i>🛠</i> Prefrences</summary>
        <table>
          <tr>
            <th>Window:</th>
            <td>
              <select v-model.number="window">
                <option>5</option>
                <option>6</option>
                <option>10</option>
                <option>12</option>
                <option>15</option>
                <option>20</option>
                <option>30</option>
                <option>60</option>
              </select>
              seconds
            </td>
          </tr>
          <tr>
            <th>Scheme:</th>
            <td><label><input type="checkbox" v-model="forceDarkScheme" /> Dark 🌛</label></td>
          </tr>
        </table>
      </details>
    </aside>
  </div>
</template>


<script>
import { mapState, mapGetters } from 'vuex'
import LiveWave from './LiveWave.vue'
import Gyro from './Gyro.vue'
import svgimg from '../../assets/img/i.svg'

export default {
  name: 'Live',
  components: { LiveWave, Gyro },
  data() {
    return {
      waves: {},
      window: 20,
      forceDarkScheme: true,
    };
  },
  computed: {
    ...mapState('live', { lr: 'lastResults'}),
    ...mapState('live', ['meta', 'last']),
    ...mapState('sessions', ['currentId', 'patients', 'settings']),
    ...mapGetters('sessions', ['current']),
    ...mapState('manage', ['polys']),
    ...mapState('env', ['clock']),
    patient() { return this.patients.find(p => p.id === this.settings?.patient?.$oid); },
    polyMonitor() { return this.polys.find(p => p.id === this.settings?.polyMonitor?.$oid); },
    location() { return this.current?.location ?? this.current ?? {}; },
    patientLabel() { return {patient: this.patient?.serial, ...this.location, PolyMonitor: this.polyMonitor?.name}; },
    lastTime() { return this.last ? new Date(this.last * 1000).toLocaleTimeString() : 'NO DATA'; },
    baseline() { return this.settings?.calibrate ?? {}; },
    gap() { return ~~(this.clock / 1000 - this.last); },
    now() { return this.clock.toLocaleTimeString(); },
    mapBP() { const p = this.lr?.BP ?? {}; return (p.Sys && p.Dia) ? '(' + ~~((p.Sys + 2 * p.Dia) / 3) + ')' : ''; },
    pmIcon() { return svgimg + '#A4PolyMonitor'; },
    pmED() { return this.lr?.PM_ED?.List?.map(w => svgimg + '#A4' + w) },
  },
  watch:{
    $route: {
      immediate: true,
      handler() {
        const id = this.$route.params.id;
        this.$store.dispatch('live/start', {id, full: true});
        this.$store.dispatch('sessions/loadCurrent', { id });
        this.$store.dispatch('sessions/loadCurrentSettings', { id });
      },
    },
    meta: function(data) {
      this.waves = Object.values(data).filter(ch => ch.rate).map(ch => ({
        title: ch.label.replace(/_/g, ' '),
        'class': ch.label.replace(/[)(]/g, ''),
        channel: ch.label,
        'min-scale': ch.range[0] / 2,
        'max-scale': ch.range[1] / 2,
        step: (ch.range[1] - ch.range[0]) / 10,
      }));
    }
  },
  mounted: function() {
    this.$store.dispatch('sessions/loadAll');
    this.$store.dispatch('sessions/loadPatients');
    this.$store.dispatch('manage/loadPolys');
  },
  unmounted: function() {
    this.$store.dispatch('live/stop');
  },
  methods: {
    alertClass(ob) { return ('alert' + (ob?.Alert ?? 0)).replace('.', ''); },
  },
}
</script>


<style scoped>

.live-monitor {
  background: var(--bg);
  color: var(--fg);
  display: grid;
  grid-template-columns: minmax(16em, 1fr) 16em;
  grid-column: 1/-1;
  position: fixed;
  inset: 3em 0 2em;
}
@media all and (display-mode: fullscreen) { .live-monitor {inset: 0;} }
.live-monitor > * { overflow: auto; }
.waves { padding: .5em; padding-right: 2em; }

details{margin: 0 .1em;}

:not([open]) > summary {
    color: var(--fg);
    font-weight: 100;
}
i {
  font-style: normal;
  color: #f09;
  display: inline-block;
  width: 1.5em;
  text-align: center;
}

table { width: 100%; }

th {
    margin: 0 .1em;
    font-size: 85%;
    font-weight: 100;
    opacity: .8;
}
td:empty::before {content: '—'; color: var(--fg-dim);}
td.alert0:empty::before {content: 'ok'; color: var(--fg-ok);}
td.value {
  border: thin solid;
  color: var(--fg-highlight);
  font-size: 2em;
  min-width: 2em;
  text-align: center;
}

td:is(.alert-1, .alert1) {
  background: var(--bg-warn);
  color: var(--fg-warn);
}
td:is(.alert-2, .alert2) {
  background: var(--bg-alert);
  color: var(--fg-alert);
}
td.alert5 { color: #fff; background: rgb(0 0 0 / .6); }
td.alert15 { color: #f90; background: rgb(0 0 0 / .8); }

td:is(.alert1, .alert2)::before {
    content: '▲';
}
td:is(.alert-1, .alert-2)::before {
    content: '▼';
}

.live-monitor {
  --Skin-Temp-Colour: #f60;
  --Ambient-Temp-Colour: #c90;
  --EMG-Colour: #0c9;
}

.darkScheme .live-monitor, .forceDarkScheme.live-monitor
{
  --Skin-Temp-Colour: #fa1;
  --Ambient-Temp-Colour: #df0;
  --EMG-Colour: #0f9;
}

.Pulse_wave { --wave-line-color: #3af; }
.EMG { --wave-line-color: var(--EMG-Colour); }
.GSR { --wave-line-color: #f3f; }
.Acceleration_X { --wave-line-color: #f34; }
.Acceleration_Y { --wave-line-color: #0c0; }
.Acceleration_Z { --wave-line-color: #46f; }
.Skin_Temp { --wave-line-color: var(--Skin-Temp-Colour); }
.Ambient_Temp { --wave-line-color: var(--Ambient-Temp-Colour); }
</style>