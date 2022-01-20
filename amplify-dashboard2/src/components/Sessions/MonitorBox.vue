<template>
  <!-- <DevOptions/> -->
  <fieldset class="shadow-10">
    <div>
      <!-- monitor box text -->
      <p class="monitor_text">
        <template v-if="!isLive && current?.status<99">Place </template>
        <bdi dir="ltr" translate="no" class="notranslate"><em translate="no" class="PM"><b>P</b>oly<b>M</b>onitor </em>
        <b>{{currentPM}}</b></bdi> on patient <b dir="ltr" translate="no" class="notranslate">{{currentPatient}}</b><br/>
        <template v-if="!isLive && !isDue && current?.status<99">and then press "Start Monitoring".</template>
        <b v-else style="color:var(--q-primary);">{{statusText}}</b>
      </p>

      <time v-if="isLive" id="Monitor_recordingTimer" translate="no" class="timer notranslate shadow-3">{{recordingTimer}}</time>
      <!-- Start\Stop -->
      <q-btn v-else-if="current?.status<99 && !isLive" dense id="Monitor_startMonitoring" class="start-it shadow-7" 
      @click.prevent="startMonitoring({id: currentId})" :loading="progress" color="secondary" @click="progress = true" :disable="isDue" no-caps> 
        <span> <q-icon name="radio_button_checked" size="18px"/> Start Monitoring </span>
        <!-- spinner -->
        <template v-slot:loading style="font-size:.5rem;">
          <q-spinner-radio class="on-left" />
          Monitoring
        </template>
      </q-btn>
      <q-btn v-if="current?.status<99" id="Monitor_stopMonitoring" class="stop-it" @click.prevent="stopMonitoring({id: currentId})" :disabled="!isDue && !progress" color="negative" @click="progress = false" label="Stop" dense no-caps/>
    </div>

    <!-- Live button -->
    <q-btn v-if="isLive" :to="'/live/' + currentId" target="_blank" class="shadow-3" size="11px" id="Monitor_LiveBtn" dense flat>Live &nbsp;<q-icon size="20px" name="live_tv"/><i class="lang-hint">Monitor</i>
      <q-tooltip class="bg-red-6" transition-show="scale" transition-hide="scale"> opens in a new tab</q-tooltip>
    </q-btn>
    
    <div v-if="isLive && isDue && current?.status<99" class="live_results">
      <table v-if="lastResults && current?.maxAlert > 0" id="Monitor_LiveResults">
        <template v-for="(s, k) in lastResults" :key="k">  
          <tr v-show="s.Alert ?? 0 !== 0" :class="'alert'+s.Alert">
            <th><q-icon name="warning" color="red" size="12px;"/>&nbsp;{{k}}</th><td>{{s.Status}}</td>
          </tr>
        </template>
      </table>
    
      <div class="live-preview">
        <LiveWave v-for="ch in config.LiveSignalsPreview" :key="ch.channel" :class="ch.channel" v-bind="ch" style="margin-left:20px;max-width:30%;"/>
      </div>

    </div>
  </fieldset>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
// import DevOptions from '../../components/Sessions/DevOptions.vue';
import config from '../../../public/MonitorConfig.json';
import LiveWave from '../../components/Charts/LiveWave.vue';
import { ref } from 'vue'

export default {
  name: 'MonitorBox',
  components: { LiveWave },
  
  data() {
    return {
      config: config,
      lastLast: 0,
      skip: [Symbol()],
      // progress: false,
    };
  },

  computed: {
    ...mapState('sessions', ['currentId', 'settings']),
    ...mapState('manage', ['polys', 'patients']),
    ...mapGetters('sessions', ['current']),
    ...mapState('live', ['meta', 'last', 'lastResults']),
    ...mapState('env', ['clock']),
    currentPM() { return this.polys.find(pm => pm.id === this.settings?.polyMonitor?.$oid)?.name; },
    currentPatient() { return this.patients.find(p => p.id === this.settings?.patient?.$oid)?.serial; },
    recordingTimer() {
      if (this.last <= this.meta?.first) return '-:--:--';
      const t = this.last - this.meta.first;
      return ~~(t / 3600) + ':' + ~~(t % 3600 / 600) + ~~(t % 600 / 60) + ':' + ~~(t % 60 / 10) + ~~(t % 10);
    },
    // isLive() { return this.last && this.last + 5 > new Date().valueOf() / 1000; },
    isLive() {return this.lastLast + 9999 > this.clock.valueOf(); },
    isDue() { return this.current?.activeSubSession != null; },
    statusText() {
      return this.isDue
        ? this.isLive
          ? ['Monitoring...', 'Monitor: Warning!', 'Monitor: ALERT!'][this.current.maxAlert]
          : '🔍 Waiting for data...'
        : this.isLive ? 'Stopping...' : '';
    },
    statusClass() {
      return this.isDue ? this.isLive ? ['recording', 'warning', 'alert'][this.current.maxAlert] : 'waitingForPoly' : '';
    },
    progress() { return this.isDue ?? false;}
  },

  mounted() { this.$store.dispatch('live/start', {id: this.currentId}); },

  unmounted() { this.$store.dispatch('live/stop'); },

  watch: {
    last() { this.lastLast = this.clock.valueOf(); },
    isLive() { if(this.isLive) this.progress = false;}
  },

  methods: mapActions('sessions', ['startMonitoring', 'stopMonitoring'])
  
  
}
</script>

<style scoped>
fieldset {
  background: var(--bg-1);
  display: flex;
  flex-flow: row wrap;
  gap: 1em;
  margin: 3em 6px 2rem 9px;
  top: 0;
  border: none;
  padding: 0.35em em 0.625em; 
}

p { font-weight: 600; margin: 1em 0; }

.live-preview {
  display: flex;
  gap: .5em;
  flex: 1;
  justify-content: flex-end;
  align-content: center;
}

a#Monitor_LiveBtn:is(:link,:visited) {
  background: rgb(255 255 255 / .25);
  border: 1.2px solid;
  color: red;
  display: block;
  font-weight: 600;
  width: 8em;
  letter-spacing: .1em;
  text-align: center;
  margin: 10px 20px;
  height: fit-content;
  text-shadow: 0 0 1px #6b000057;
  /* box-shadow: 0px 0px 1px 0px red; */
}

.timer {
  background: black;
  border: thin inset green;
  color: lime;
  display: inline-block;
  font: 700 1.1em monospace;
  min-width: 7em;
  margin-right: 10px;
  height: 28px;
}
.timer::before {
  content: '⏱ '
}

/* Animated Status Indicators: */

.statusIndicator {
  margin: auto;
  position: relative;
  width: 10ex;
  height: 10ex;
}

/* Animated Status Indicators: Waiting for Recording to start */

.waitingForPoly::before,
.waitingForPoly::after {
  animation: waitingRipple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  border: 4px solid cadetblue;
  border-radius: 50%;
  content: ' ';
  position: absolute;
}

.waitingForPoly::after {
  animation-delay: -0.5s;
}

@keyframes waitingRipple {
  0% { inset: 50%; opacity: 1; }
  100% { inset: 0; opacity: 0; }
}

/* Animated Status Indicators: Something is Wrong */

.alert::before,
.alert::after,
.warning::before,
.warning::after {
  border-radius: 50%;
  border: 4px solid;
  content: '!';
  position: absolute;
  inset: .2ex;
  text-align: center;
  font: 900 8ex serif;
  line-height: 1;
}

.alert::before {
  animation: pulseWarning 1s linear infinite;
  background: rgb(255 255 0 / .75);
  color: rgb(255 187 134);
}

.alert::after {
  animation: scaleWarning 0.5s infinite alternate;
  color: red;
}

.warning::before {
  animation: pulseWarning 2s linear infinite;
  background: rgb(255 255 255 / .75);
  color: rgb(255 187 134);
}

.warning::after {
  animation: scaleWarning 0.75s infinite alternate;
  color:  rgb(248 187 134);
}

@keyframes scaleWarning {
  0% { transform: scale(1); }
  30% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

@keyframes pulseWarning {
  0% { transform: scale(1); opacity: 0.75; }
  30% { transform: scale(1); opacity: 0.75; }
  100% { transform: scale(2); opacity: 0; }
}

/* Animated Status Indicators: Recording, and All is OK */

.recording::before {
	animation: pulseRecording 1.5s linear infinite;
  background-color: lime;
	border-radius: 50%;
  content: ' ';
  position: absolute;
  inset: 33%;
}

@keyframes pulseRecording {
	0% { box-shadow: 0 0 .5ex 0 rgba(0 173 0 / .3); }
	65% { box-shadow: 0 0 1ex 2ex rgba(0 173 0 / .3); }
	90% { box-shadow: 0 0 3ex 2ex rgba(0 173 0 / 0); }
}

.start-it, .stop-it{
  padding:5px;
  transition:.2s all;
  margin-right: 5px;
  font-weight: 400;
  font-size: 0.9rem;
}

.start-it:hover{
  transform:scale(1);
  filter:blur(0px);
  opacity:1;
  box-shadow:0 8px 20px 0px rgba(0,0,0,0.125);
}.stop-it:hover{
  transform:scale(1);
  filter:blur(0px);
  opacity:1;
  box-shadow:0 8px 20px 0px rgba(0,0,0,0.125);
}

#Monitor_LiveResults { 
  margin: 1em; 
  position: sticky;
  left: 45%;
  display: block;
}

#Monitor_LiveResults th {
  color: var(--fg-dim);
  font-size: 100%;
  padding: .3em 0;
  display: flex;
  margin-right: 5px;
}

#Monitor_LiveResults :is(.alert-1, .alert1) td {
  background: var(--bg-warn);
  color: var(--fg-warn);
}

#Monitor_LiveResults :is(.alert-2, .alert2) td {
  background: var(--bg-alert);
  color: var(--fg-alert);
  font-weight: 900;
}

.preview{
  display: flex;
  justify-content: flex-end;
}

.monitor_text{
  font-size: 1rem;
  line-height: 1.8rem;
}

.live_results{
  max-width: 11em; 
  overflow: visible;
  margin-left: 10px;
  display: contents;
}
</style>
