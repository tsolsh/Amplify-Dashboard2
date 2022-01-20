<template>
  <div class="live-monitor" :class="{forceDarkScheme, ['ANIM-'+animationMode]: true}" :style="forceDarkScheme? 'background: #000;': ''">
    <!-- <q-layout view="lHh lpr lFf" container style="height: 400px" class="shadow-2 rounded-borders"> -->
      <header elevated class="bg-primary q-header">
    <!-- <header @click="toggleFullScreen"> -->
      <svg class="as-logo"><use href="../../assets/img/i.svg#ATLASenseBioMed"/></svg>
      <q-toolbar style=" width: fit-content;">
        <q-btn @click="showSettings = !showSettings" class="shadow-8" rounded color="secondary" icon="settings_suggest" style="width:35px;margin-right:7px;display:flex;">
        </q-btn> 
        <q-dialog v-model="showSettings">
          <q-card style="width: 560px;" class="q-px-sm q-pb-md bg-primary shadow-10">
            <q-card-section style="display: flex; justify-content: space-between;font-weight:800;margin-bottom: 15px;">
              <div class="text-h5 text-white"><q-icon name="settings_suggest"/>&nbsp; Settings</div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
  
            <q-item>
              <q-item-label header class="text-h7 text-white">Display</q-item-label>
              <q-select v-model="animation" :options="['Smooth', 'Bulky', 'Minimal', 'Off']" @update:model-value="setAnimation(animation)" label="Animation" stack-label
                label-color="black" class="shadow-6 bg-grey-6" filled :dark="forceDarkScheme" style="display: flex;">
                <template v-slot:selected class="text-black">
                  <template v-if="animation">
                    <span style="color: black;">{{animation}}</span>
                  </template>
                  <template v-else>
                  <span style="color: black;">{{animationMode}}</span>
                  </template>
                </template>
                </q-select>
              <!-- <label><input type="checkbox" v-model="forceDarkScheme" /><q-icon name="nightlight_round" color="yellow-7" size="md"/></label> -->
              <label><q-btn v-model="forceDarkScheme" @click="forceDarkScheme = !forceDarkScheme" class="bg-grey-6 shadow-3" icon="emoji_objects" :text-color="forceDarkScheme? 'grey-10' :'yellow-7'" size="16px" flat dense/></label>
            </q-item>

            <q-item>
              <q-item-label header class="text-h7 text-white">Mesurements</q-item-label>
              <template v-for="ch in cfg.LiveSignals" :key="ch.channel">
                <label style="margin-bottom:5px;">
                  <q-select v-model="ch.seconds" :options="secs" @update:model-value="setMeasures(ch.channel,ch.seconds)" :label="ch.channel" stack-label label-color="black"
                  class="shadow-6 bg-grey-6" filled :dark="forceDarkScheme">
                      <template v-slot:selected>
                        <template v-if="measures && measures[ch.channel]">
                          <span style="color: black;">{{measures[ch.channel]}}</span>
                        </template>
                        <template v-else>
                          <span style="color: black;">{{ch.seconds}}</span>
                        </template>
                      </template>
                  </q-select>
                  <span style="font-size:small;margin-bottom:5px;color:black;">seconds </span>

                </label>
              </template>
              </q-item>

            <q-item>
              <q-item-label header class="text-h7 text-white">Advanced</q-item-label>
              <!-- <q-btn v-if="!pausedFor5Seconds" @click.prevent="resetPM" class="bg-purple-5 shadow-1 text-white" dense flat no-caps push size="16px">Reset PM</q-btn> -->
              <q-btn @click="resetPM" :loading="pausedFor5Seconds" class="shadow-7 text-white" dense flat no-caps push size="16px" :disable="pausedFor5Seconds" style="background: var(--fg-ok);font-weight: 400;">Reset PM
                 <template v-slot:loading>
                    <q-spinner-gears class="on-left"/>
                  </template>
              </q-btn>
              <q-btn :to="'/live-raw/' + currentId" id="Monitor_RawBtn" icon="fullscreen" class="text-white shadow-7" size="16px" no-caps dense style="width:fit-content;background: var(--fg-ok);"> Full</q-btn>
            </q-item>

            <q-item>
            <q-item-label header class="text-h7 text-white">Sound</q-item-label>
              <q-btn @click.prevent="mute()" class="bg-grey-6 shadow-3" :icon="muted? 'volume_off':'volume_up'" size="16px" dense flat no-caps push/>
            </q-item>

          </q-card>
        </q-dialog>
      </q-toolbar>

      <div class="session-details">
        <Gyro :placement="baseline?.polymonitorBodyLocation" />
        <span v-for="v, k in patientLabel" :key="k">
          <span class="dim">{{k}} </span>
          <b>{{v}} </b>
        </span>
      </div>

      <!-- user section -->
      <!-- <template> -->
      <!-- <div style="flex:1;"/> -->
        <div id="userBox2">
          <q-fab
            v-model="userBtn"
            :label="userName" vertical-actions-align="left"
            icon="account_circle" direction="down" flat dense>
            <q-fab-action @click="logout" label="Logout" id="head_logout" icon="logout" size="10px" dense no-caps />
          </q-fab>
          <!-- <div>
            <q-icon name="account_circle" />
            {{userName}}
          </div>
          <q-btn @click="logout" label="Logout" id="head_logout" icon="logout" size="12px" flat dense no-caps></q-btn> -->
        </div>
        <!-- </template> -->

      <div><span :class="['ts', 'ts'+lagAlert]">
        {{lastTime}}
        <i>
          <svg v-if="meta.first" viewBox="-25 -25 50 50" preserveAspectRatio="none">
            <circle r="23" />
            <path d="M0,0V-22L19-11V11L0,22L-19,11Z" :transform="`rotate(${6*(meta.first%60)})`" />
            <line y1="-20" class="now" :transform="`rotate(${6*clock.getSeconds()})`"/>
            <line y1="-24" :transform="`rotate(${6*(last%60)})`"/>
          </svg>
        </i>
        </span>
        <span class="dim">{{now}}</span>
      </div>
      </header>
    
    <LiveWave v-for="ch in cfg.LiveSignals" :key="ch.channel" :class="ch.channel" v-bind="ch" width="100%" height="calc(100% - 1em)" />
    <div class="spikes" :class="alertClass(lr?.Spikes)"><span v-show="lr" class="status">{{lr?.Spikes?.Status ?? 'Signal OK'}}</span></div>
    <div class="PM_ED" :class="alertClass(lr?.PM_ED)"><span v-show="lr" class="status">
      <svg width="45" height="25">
        <use style="color: #9999" :href="pmIcon"/>
        <use v-for="e in pmED" :key="e" :href="e"/>
      </svg>
      {{lr?.PM_ED?.Status}}
    </span></div>
    <div class="AFib" :class="alertClass(lr?.AFib)"><span v-show="lr" class="status">{{lr?.AFib?.Status ?? '❤'}}</span></div>
    <div class="box heart" :class="alertClass(lr?.HR)">
      <span class="title">HR</span>
      <span class="baseline">{{baseline.hr}}</span>
       <span class="big-current"><span class="value" :data-old="old.HR">{{lr?.HR?.Value}}</span></span>
      <span class="unit">BPM</span>
      <span class="status">{{lr?.HR?.Status ?? 'OK'}}</span>
    </div>
    <div class="box resp" :class="alertClass(lr?.RR)">
      <span class="title">RR</span>
      <span class="baseline">{{baseline.rr}}</span>
      <span class="big-current"><span class="value" :data-old="old.RR">{{lr?.RR?.Value}}</span></span>
      <span class="unit">RPM</span>
      <span class="status">{{lr?.RR?.Status ?? 'OK'}}</span>
    </div>
    <div class="box bp" :class="alertClass(lr?.BP)">
      <span class="title">BP</span>
      <span class="baseline">{{baseline.bp}}</span>
      <span class="big-current" v-if="lr?.BP"><sup
        class="value" :data-old="old.Sys">{{lr.BP?.Sys}}</sup>/<sub
        class="value" :data-old="old.Dia">{{lr.BP?.Dia}}</sub></span>
      <span class="map">{{map(lr?.BP)}}</span>
      <span class="status">{{lr?.BP?.Status ?? 'OK'}}</span>
    </div>
    <!-- <div class="box rii" :class="alertClass(lr?.RR?.RII)">
      <span class="title">RII</span>
      <span class="baseline">{{baseline.RII}}</span>
      <span class="unit">score</span>
      <span class="big-current"><span class="value">{{lr?.RR?.RII?.Value}}</span></span>
      <span class="status">{{lr?.RR?.RII?.Status ?? 'OK'}}</span>
    </div> -->
    <div class="box rii" :class="alertClass(lr?.RR?.RII)">
      <span class="title">MVT</span>
      <span class="big-current"><span class="value" :data-old="old.MVT">{{lr?.RR?.MVT?.toFixed(0)}}</span></span>
      <span class="unit">mL</span>
      <span class="status">RII: {{lr?.RR?.RII?.Status ?? 'OK'}}</span>
    </div>
    <div class="box temp" :class="alertClass(lr?.Temp)">
      <span class="title">C.Temp.&nbsp;</span>
      <span class="baseline">&nbsp;{{temp.toUI(baseline.temperature)}}°{{temp.unit}}</span>
      <span class="big-current"><span class="value" :data-old="old.Temp">{{temp.toUI(lr?.Temp?.Value)}}</span></span>
      <span class="unit">°{{temp.unit}}</span>
      <span class="status">{{lr?.Temp?.Status ?? 'OK'}}</span>
    </div>
    <div class="history">
      <table>
        <thead :class="{dimmed: hist15.length === 0}">
          <tr>
            <th class="time">Time</th>
            <th class="heart">HR</th>
            <th class="resp">RR</th>
            <th class="temp">Temp</th>
            <th class="bp">BP</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v of hist15" :key="v.ts">
            <td class="time">{{hhmm(v.ts)}}</td>
            <td class="heart">{{v.HR?.Value}}</td>
            <td class="resp">{{v.RR?.Value}}</td>
            <td class="temp">{{temp.toUI(v.Temp?.Value)}}</td>
            <td class="bp">{{v.BP?.Sys}}/{{v.BP?.Dia}} {{map(v.BP)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="trends">
      <div class="heart"><Trend id="HR" :values="hrTrends" :min="(baseline.hr ?? 60) - 10" :max="(baseline.hr ?? 60) + 10" /></div>
      <div class="resp"><Trend id="RR" :values="rrTrends" :min="(baseline.rr ?? 12) - 4" :max="(baseline.rr ?? 12) + 4"/></div>
      <div class="bp"><Trend id="BP" :values="bpTrends" :min="70" :max="120"/></div>
    </div>

<!-- </q-layout> -->
  </div>
</template>


<script>
import { mapState, mapGetters } from 'vuex'
import FullScreen from '../../services/fullScreen.js'
import LiveWave from './LiveWave.vue'
import Trend from './Trend.vue'
import Gyro from './Gyro.vue'
import config from '../../../public/MonitorConfig.json';
import svgimg from '../../assets/img/i.svg'

export default {
  name: 'Live',
  components: { LiveWave, Trend, Gyro },

  data() {
    return {
      forceDarkScheme: true,
      secs: [5, 6, 10, 12, 15, 20, 30, 60],
      lagAlert: -1,
      now: '',
      lastLast: 0,
      showSettings: false,
      success: false,
      userBtn: false,
      // measures: null,
      warn_sound: new Audio(require('../../assets/audio/warn.mp3')),
      alert_sound: new Audio(require('../../assets/audio/alert.wav')),
      muted: false,
      pausedFor5Seconds: false,
      animation: null,
      old: { HR: '—', RR: '—', MVT: '—', Temp: '—', Sys: '—', Dia: '—' },
    };
  },

  computed: {
    ...mapState('live', { lr: 'lastResults'}),
    ...mapState('live', ['meta', 'last', 'history', 'trends','stream','measures']),    
    ...mapState('sessions', ['currentId', 'patients', 'settings']),
    ...mapState('manage', ['polys']),
    ...mapState('env', ['temp', 'clock']),
    ...mapState('auth', ['user']),
    ...mapGetters({
      currentSession: 'sessions/current',
      userName: 'auth/userName',
    }),
    ...mapGetters('sessions', ['current']),
    // sessionList() { return this.$store.state.sessions.all; },
    animationMode(){ return this.$store.state.live.animationMode; },
    isLive() {return this.lastLast + 9999 > this.clock.valueOf(); },
    hist15() { return this.history.slice(0, 15); },
    patient() { return this.patients?.find(p => p.id === this.settings?.patient?.$oid); },
    polyMonitor() { return this.polys.find(p => p.id === this.settings?.polyMonitor?.$oid); },
    location() { return this.current?.location ?? this.current ?? {}; },
    patientLabel() { return {patient: this.patient?.serial, ...this.location, PolyMonitor: this.polyMonitor?.name}; },
    lastTime() { return this.last ? new Date(this.last * 1000).toLocaleTimeString() : 'NO DATA'; },
    baseline() { return this.settings?.calibrate ?? {}; },
    cfg() { return config; },
    pmIcon() { return svgimg + '#A4PolyMonitor'; },
    pmED() { return this.lr?.PM_ED?.List?.map(w => svgimg + '#A4' + w) },
    hrTrends() { return [this.trends.map(t => t.HR?.Value)]; },
    rrTrends() { return [this.trends.map(t => t.RR?.Value)]; },
    bpTrends() { return [this.trends.map(t => t.BP?.Dia), this.trends.map(t => t.BP?.Sys)]; },
  },

  watch:{
    $route: {
      immediate: true,
      handler() {
        const id = this.$route.params.id;
        this.$store.dispatch('live/start', { id, whatToDoWhenIGetAnActionClose(action) { if(action==='close') window.close(); } });
        this.$store.dispatch('live/getHistory', { id });
        this.$store.dispatch('sessions/loadCurrent', { id });
        this.$store.dispatch('sessions/loadCurrentSettings', { id });
      },
    },
    clock() {
      const d = this.clock, lag = d / 1000 - this.last;
      this.lagAlert = this.last ? lag < 4 ? 0 : lag < 8 ? 1 : 2 : -1;
      this.now = this.lagAlert > 0 && d.getSeconds() % 6 > 3 ?
        lag < 60 ? 'Data ' + ~~lag + ' sec. behind' : 'Data is NOT LIVE' :
        'Now: ' + d.toLocaleTimeString(); 
    },
    "lr.HR": function() {
      if(!this.muted){
        if(this.lr.HR.Alert == -1 || this.lr.RR.Alert == -1){
          this.warn_sound.play();
        }
        else if(this.lr.HR.Alert == -2 || this.lr.RR.Alert == -2){
          this.alert_sound.play();
        }
      }
    },

    last() {
      this.lastLast = this.clock.valueOf();
      const save = {
        HR: this.lr?.HR?.Value,
        RR: this.lr?.RR?.Value,
        MVT: this.lr?.RR?.MVT?.toFixed(0),
        Temp: this.lr?.Temp?.Value,
        Sys: this.lr?.BP?.Sys,
        Dia: this.lr?.BP?.Dia,
      };
      for (let k in save) {
        if (save[k]) this.old[k] = `(${save[k]})`;
      }
    },

  },

  mounted: function() {
    this.$store.commit('layout/setVisible', false);
    this.$store.dispatch('sessions/loadAll');
    this.$store.dispatch('manage/loadPatients');
    this.$store.dispatch('manage/loadPolys');
    // this.tick();
  },

  unmounted: function() {
    this.$store.dispatch('live/stop');
    this.$store.commit('layout/setVisible', true);
  },

  methods: {
    hhmm(ts) { return isNaN(ts) ? ts : new Date(ts * 1000).toLocaleTimeString('en-US', {hour:'numeric', minute:'numeric'}); },
    alertClass(ob) { return ('alert' + (ob?.Alert ?? 0)).replace('.', ''); },
    map(bp) { return (bp?.Sys && bp?.Dia) ? '(' + ~~((bp.Sys + 2 * bp.Dia) / 3) + ')' : ''; },
    toggleFullScreen() { FullScreen.toggle(); },
    resetPM() { 
      this.$store.dispatch('sessions/resetPM', {id: this.$route.params.id}); 
      this.pausedFor5Seconds = true;
      setInterval(() => this.pausedFor5Seconds = false, 5000);
    },

    mute(){
      this.muted = !this.muted;
      if(this.muted) {this.warn_sound.pause(); this.alert_sound.pause();}
      // else {this.warn_sound.play(); this.alert_sound.play(); }
    },

    setAnimation(anim) { this.$store.commit('live/setAnimation', anim); },

    setMeasures(channel,secs) { 
      if(channel == 'ECG')
        this.$store.commit('live/setECGMeasures', {channel,secs});
      else 
        this.$store.commit('live/setRespMeasures', {channel,secs});
    },
    logout() { 
      this.$store.dispatch('auth/logout');
      this.$store.commit('layout/setLogin', false);
    },
    // tick() {
    //   const d = new Date(), lag = d / 1000 - this.last;
    //   this.lagAlert = this.last ? lag < 4 ? 0 : lag < 8 ? 1 : 2 : -1;
    //   this.now = this.lagAlert > 0 && d.getSeconds() % 6 > 3 ?
    //     lag < 60 ? 'Data ' + ~~lag + ' sec. behind' : 'Data is NOT LIVE' :
    //     'Now: ' + d.toLocaleTimeString(); 
    //   setTimeout(this.tick, 1001 - d.getMilliseconds());
    // },
    // toggleTempScale() { this.tempScale = this.tempScale === 'F' ? 'C' : 'F'; },
    // tempInScale(t) { return isNaN(t) ? '-' : (this.tempScale === 'F' ? (t * 9 / 5 + 32) : t).toFixed(1); },
  },
}
</script>


<style scoped>

.live-monitor {
  background: var(--bg);
  color: var(--fg);
  display: grid;
  grid-template-rows: 3em 1.5em repeat(4, minmax(9em, 11em)) auto;
   grid-template-columns: 10fr 10fr 10fr 7fr 3fr;
  grid-template-areas:
      "head   head   head   head   head  "
      "PM_ED  spikes spikes AFib   AFib  "
      "ecg    ecg    ecg    ecg    .     "
      "resp   resp   resp   resp   .     "
      "hr     rr     rii    ct     ct    "
      "hist   hist   bp     bp     bp    "
      "trends trends trends trends trends";
  position: fixed;
  inset: 0;
  padding: 1px;
  overflow: auto;
}
svg.as-logo {
  height: 2em;
  width: 6em;
}

@media (min-width: 60em) {
  .live-monitor {
  grid-template-rows: 3em 1.5em repeat(3, minmax(8em, 11em)) auto;
    grid-template-columns: auto 2fr 1fr 1fr;
    grid-template-areas:
        "head   head   head   head  "
        "PM_ED  spikes spikes AFib  "
        "ecg    ecg    ecg    hr    "
        "resp   resp   resp   rr    "
        "hist   bp     ct     rii   "
        "trends trends trends trends";
  }
}

@media (min-width: 67em) {
  .live-monitor {
    font-size: 1.5vw;
  }
}

header {
  grid-area: head;
  background-color: var(--bg-3);
  color: var(--fg);
  display: flex;
  font-weight: bold;
  justify-content: space-between;
  padding: .3em 1em;
}
  header > * {
    align-self: center;
  }

.session-details {
    display: flex;
    gap: .5em;
    margin-left: 84px;
}
.dim {
    color: var(--fg-dim);
    display: block;
    font: 100 80%/.7 'PT Sans', sans-serif;
}

.session-details > span > b {
    display: block;
    text-align: right;
}
.live-monitor > div {
  border: thin solid;
  border-image: radial-gradient(rgb(102 102 102 / 5%) 80%, currentColor 150%) 1;
  margin: -.5px;
}
.live-monitor > div, .trends > div {
    padding: .1em .4em;
    text-align: center;
}

.box {
    align-items: center;
    box-shadow: 0 0 2em 1em inset var(--bg);
    justify-content: center;
    display: grid;
    grid-template-columns: auto min-content minmax(1fr, 6em) min-content auto;
    grid-template-rows: 3ex 5ex 5ex 1fr;
    grid-template-areas:
        ". title  base   base   ."
        ". big    big    arrow  ."
        ". big    big    unit   ."
        "status status status status status";
    min-width: 11em;
    line-height: .9;
}
.trends {
    display: grid;
    grid-area: trends;
    grid-template-columns: repeat(3, 1fr);
}

.temp, table .time {
    color: var(--temp);
}

.heart {
    color: var(--hr);
}
.box.heart {
    grid-area: hr;
}

.resp {
    color: var(--resp);
}
.box.resp {
    grid-area: rr;
}

.bp {
    color: var(--bp);
}

.box.bp {
    grid-area: bp;
    gap: 0;
    min-width: 20em;
}

.rii {
    color: var(--rii);
}
.box.rii {
    grid-area: rii;
}
.box.temp {
    grid-area: ct;
}

.box::after {
    grid-area: arrow;
}

.unit, .map {
    grid-area: unit;
}

.spikes { grid-area: spikes; }
.PM_ED  { grid-area: PM_ED; }
.AFib   { grid-area: AFib; } 
.spikes, .PM_ED, .AFib {
  color: var(--fg-dim);
  line-height: .6;
}

.ts i {
  background: var(--bg-1);
  border-radius: 50%;
  color: silver;
  display: inline-block;
  /* border: 1px solid; */
  margin-left: .5em;
  position: relative;
  bottom: -.1em;
  height: 1em;
  width: 1em;
}
.ts svg { display: block; width: 100%; }
.ts svg * { vector-effect: non-scaling-stroke; }
.ts circle { fill: currentColor; }
.ts path { fill: #00f2; }
.ts line { stroke: var(--bg); stroke-width: 1; }
.ts line.now { stroke: lime; }

.ts.ts0 i { color: lime; }

.ts.ts1 i { color: var(--fg-warn); }

.ts.ts2 i {
    color: var(--fg-alert);
    box-shadow: 0 0 .2em .2em var(--bg-alert);
    animation: flashlight 1s var(--anim-linear) 0s infinite;
    animation-timing-function: ease-out;
}

@keyframes flashlight {
    from { box-shadow: 0 0 .2em .2em var(--bg-alert); }
    to { box-shadow: 0 0 .2em 0 var(--bg-alert); }
}

/* RII White Alert */
.alert5 :is(.value, .status) {
  color: #fff;
  text-shadow: 1px 1px #060, -1px -1px #fc0;
  animation: warnBlink 4s var(--anim-ease-in) infinite;
}

/* RII Orange Alert */
.alert15 :is(.value, .status) {
  color: #f70;
  text-shadow: 1px 1px #ff0, -1px -1px #f00;
  animation: warnBlink 1.5s var(--anim-ease-in) infinite;
}


.status {
  color: var(--fg-ok);
  font-weight: bold;
  grid-area: status;
  align-self: baseline;
  text-align: center;
}


:is(.alert1, .alert-1) :is(.value, .status) {
  text-shadow: -1px -1px var(--bg-warn);
  animation: warnBlink 2s var(--anim-ease-in) infinite;
  /* color: var(--fg-warn); */
}

@keyframes warnBlink {
  25% { color: inherit; }
  50% { color: var(--fg-warn); }
}

:is(.alert2, .alert-2) {
  background: radial-gradient(transparent, var(--bg-alert) 300%);
  background-size: 300% 300%;
  animation: alertBackground 2s var(--anim-ease) infinite alternate;
  text-shadow: -2px -1px var(--bg);
}
:is(.alert2, .alert-2) :is(.value, .status) {
  animation: alertBlink 2s var(--anim-linear) infinite;
  color: var(--fg-alert);
  font-weight: 900;
}

@keyframes alertBackground {
   0% { background-position: left top; }
 100% { background-position: right top; }
}

@keyframes alertBlink {
  25% { color: inherit; }
  50% { color: var(--fg-alert); }
}

.status svg{
    vertical-align: middle;
    margin: 0 2px;
    stroke: var(--bg);
    stroke-width: .5;
}
.value:empty::before {
    content: '—';
    color: var(--fg-ok);
    font-size: 80%;
}
.value[data-old]:empty::before {
    content: attr(data-old);
}
.history td:empty::before {
    content: '—';
    color: var(--fg-ok);
}
sup.value {
    vertical-align: 10%;
    font-size: 90%;
}

sub.value {
    vertical-align: -10%;
    font-size: 90%;
}

.history {
    grid-area: hist;
    max-height: 100%;
    overflow-y: auto;
}

.history .dimmed {
    opacity: .5;
}

.history :is(td, th) {
    padding: 0 .2em .1em;
}
.history table {
    margin: auto;
}
.history th {
    box-shadow: 0 .5ex 1ex -1ex;
    font-weight: 100;
    text-align: center;
}

.history .time {
    width: 6em;
}

.history .bp {
    width: 7em;
}

.history .temp {
    width: 3em;
}

.history :is(.heart,.resp) {
    width: 2em;
}

.ECG {
    grid-area: ecg;
}
.Respiration {
    grid-area: resp;
}
.RESP_Filtered {
    grid-area: respF;
}

.title { grid-area: title; text-align: left; }
.baseline { grid-area: base; text-align: right; }
.big-current { font-size: 4em; grid-area: big; min-width: 1.5em; }
.map { font-size: 1.5em; }

.box::after {
    display: inline-block;
    margin-right: auto;
}

.box:is(.alert1, .alert2)::after {
    animation: up-down 1s var(--anim-linear) infinite;
    color: var(--fg-alert);
    content: '▲';
    text-shadow: 2px 2px var(--bg-alert);
}
.box:is(.alert-1, .alert-2)::after {
    animation: up-down 1s var(--anim-linear) reverse infinite;
    color: var(--bg-alert);
    content: '▼';
    text-shadow: -2px -2px var(--fg-alert);
}

@keyframes up-down{
    0% {opacity:0; transform: translateY(.8em) scaleY(.1);}
    25% {opacity:1; transform: translateY(.3em) scaleY(.9);}
    50% {transform: none}
    75% {opacity:1; transform: translateY(-.3em) scaleY(.9);}
    100% {opacity:0; transform: translateY(-.8em) scaleY(.1);}
}

.advanced {
  color: var(--fg);
  grid-area: trends;
  text-align: left;
  width: fit-content;
  height: fit-content;
  margin: auto 0 auto 0;
  padding: 3px;
  display: flex;
  align-items: center;
}

.advanced[open] {
  background: var(--bg);
  border: thin solid var(--bg4)
}

.advanced select{
  border: none;
  margin-bottom: 2px;
  outline: none;
  height: 26px;
  border-radius: 4px 4px;
}

label, #Monitor_RawBtn{
  font-weight: 400;
  font-size: medium;
  width: -webkit-fill-available;
}
#Monitor_RawBtn{
  margin-left: 15px;
}

aside{
  background: var(--bg-3);
  display: flex;
  align-items: center;
  min-width: max-content;
  height: 42px;
}
aside > * {
  align-items: baseline;
  display: flex;
}

.q-item__label--header {
  /* font-family: system-ui; */
  font-weight: 500;
  font-size: 1.3rem;
  color:#c8dfdf;
  /* margin-right: 5px; */
}

.q-item {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 3rem;
}

.text-h5{
  font-size:1.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  color: #c8dfdf;
  text-shadow: 0 0 5px #5a6464;;
  /* text-shadow: 0 0 12px #5a6464; */
}

#userBox{
  /* font-family: Trebuchet MS; */
  display: flex;
  flex-direction: column;
  align-items: center;
}

#head_logout{
  background-color:var(--q-accent);
  font-size: small;
  /* background: var(--q-secondary); */
}
</style>