<template show-if="showTab">
  <div>
    <div class="q-pr-md q-gutter-y-md column items-start tab_actions" style="    align-content: end;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;">
       <div class="endCalibrate1">
      <q-banner v-show="countGoodTM==3 && currentSession.status==20" rounded class="q-pa-sm q-mb-sm bg-accent text-white" dense> You can move to monitor
        <div class="arrow-container">  <div class="arrow-down"></div> </div>
      </q-banner>
      <!-- <div> -->
        <q-btn v-if="!disable" @click.prevent="moveToMonitor()" id="Clibrate_Set" class="nextMon bg-accent shadow-1" no-caps dense :icon="countGoodTM<3? 'lock' : 'lock_open'" :disable="countGoodTM<3">Finish</q-btn>
        <q-tooltip v-if="countGoodTM!=3" class="bg-accent text-white" anchor="top middle" self="bottom middle">enter 3 blood measurements</q-tooltip>       
      <!-- </div> -->
    </div>
      <q-btn-group push class="shadow-10">
        <q-btn-dropdown dropdown-icon="info" dense class="delete" color="secondary">
          <q-list style="background: var(--bg);color:var(--bg-4);font-weight: 600; min-width: 200px;">
            <q-item clickable v-close-popup>
              <q-item-section avatar>
                <q-avatar icon="badge" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Patient</q-item-label>
                <q-item-label caption>{{patient?.serial}}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup >
              <q-item-section avatar>
                <q-avatar icon="room_preferences" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Ward</q-item-label>
                <q-item-label caption>{{currentSession?.location?.ward}}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section avatar>
                <q-avatar icon="meeting_room" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Room</q-item-label>
                <q-item-label caption>{{currentSession?.location?.room}}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section avatar>
                <q-avatar icon="bed" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Bed</q-item-label>
                <q-item-label caption>{{currentSession?.location?.bed}}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section avatar>
                <q-avatar icon="pending_actions" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Started at</q-item-label>
                <q-item-label caption>{{createdTime}}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="info" color="amber">
                  <q-tooltip v-if="deleteMsg" class="bg-amber shadow-3 text-black" anchor="top middle" self="bottom middle">
                    {{createdDate}}
                  </q-tooltip>
                </q-icon>
              </q-item-section>
            </q-item>
          </q-list>
          <template v-slot:label>
            <q-tooltip class="shadow-3 bg-secondary text-white" anchor="top middle" self="bottom middle" style="color:var(--action);">
              details
            </q-tooltip>
          </template>
        </q-btn-dropdown> 
          
        <q-btn :to="`/session/${$route.params.id}/configure`" class="delete" icon="first_page" dense color="secondary">
          <q-tooltip v-if="deleteMsg" class="shadow-3 bg-secondary text-white" anchor="top middle" self="bottom middle" id="deleteTxt">
            Back to configure
          </q-tooltip>
        </q-btn>

        <q-btn v-if="currentSession?.status>20" :to="`/session/${$route.params.id}/monitor`" class="delete" icon="last_page" color="secondary" dense>
          <q-tooltip v-if="deleteMsg" class="shadow-3 bg-secondary text-white" anchor="top middle" self="bottom middle" id="deleteTxt">
            Next to monitor
          </q-tooltip>
        </q-btn>

        <q-btn v-if="currentSession?.status<99" @click="archiveSession($event)" icon="archive" class="icon delete" id="Nav_archive-button" :disable="!currentSession || isLive!=0" color="secondary" dense no-caps>
          <!-- <svg><use href="../../assets/img/i.svg#stageFinished" :disable="!currentSession || isLive"/></svg> -->
          <q-tooltip v-if="deleteMsg" class="shadow-3 bg-secondary text-white" anchor="top middle" self="bottom middle" id="deleteTxt">
            Archive
          </q-tooltip>
        </q-btn>
        <q-tooltip v-if="isLive" class="bg-red text-black" anchor="top middle" self="bottom middle">
          need to stop recording
        </q-tooltip>
      </q-btn-group>
    </div>

  <form @change="autoUpdateValue" >
    <!-- <div class="text-purple q-gutter-md"><i class="fas fa-pen-square" style="font-size:20px;"></i></div> -->
    <table style="padding-left: 10px;">
      <tr><th>Date of Birth:</th><td colspan="2">{{birthday}}</td></tr>
      <tr><th>Gender:</th><td colspan="3">{{patient?.gender}}</td></tr>
      <tr><th>Height:</th><td colspan="2">{{height.toUI(patient?.height)}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{height.unit}}</td></tr>
      <tr>
        <th><label for="Calibrate_weight">Weight:</label></th>
        <td v-if="disable" class="disableInput">{{weight.toUI(cal.weight)}}</td>
        <td v-else style="width: 15%;">
          <input id="Calibrate_weight" name="weight" type="number" data-convert="weight"
            :value="weight.toUI(cal.weight)" :disabled="step1complete"
            :min="weight.toUI(config.min_weight)" :step="weight.delta(.1)"
            :max="weight.toUI(config.max_weight)" :class="hasProblem('weight')"/>
        </td>
        <td>{{weight.unit}}</td>
         <td>
          <q-btn v-if="suggestedWeight" class="suggestion" @click="setSuggestedWeight" flat dense no-caps>Did you mean &nbsp;{{suggestedWeight.text}}?</q-btn>
        </td>
      </tr>
      <tr>
        <th><label for="Calibrate_temperature">Temperature:</label></th>
        <td v-if="disable" class="disableInput">{{temp.toUI(cal.temperature)}}</td>
        <td v-else style="width: 15%;">
          <input id="Calibrate_temperature" name="temperature" type="number" data-convert="temp"
            :value="temp.toUI(cal.temperature)" :disabled="step1complete"
            :min="temp.toUI(config.min_temperature)" :step="temp.delta(.1)"
            :max="temp.toUI(config.max_temperature)" :class="hasProblem('temperature')"/>
        </td>
        <td>°{{temp.unit}}</td>
        <td>
          <label>
            <input id="Calibrate_temperature_type_skin" name="temperatureType" type="radio" value="skin" :checked="cal.temperatureType === 'core'" :disabled="disable" />
            skin
          </label>
          &nbsp;
          <label>
            <input id="Calibrate_temperature_type_skin" name="temperatureType" type="radio" value="core" :checked="cal.temperatureType !== 'core'" :disabled="disable" />
            core
          </label>
          <q-btn v-if="suggestedTemp" class="results" @click="setSuggestedTemp" outline color="info" dense no-caps>Did you mean &nbsp;<strong>{{suggestedTemp.text}}</strong> ?</q-btn>
        </td>
      </tr>
      <tr>
        <th><label for="Calibrate_heartRate">Heart rate:</label></th>
        <td v-if="disable" class="disableInput">{{cal.hr}}</td>
        <td v-else style="width: 15%;">
          <input id="Calibrate_heartRate" name="hr" type="number" :value="cal.hr" :disabled="step1complete"
            :min="config.min_hr" :max="config.max_hr" :class="hasProblem('hr')"/>
        </td>
        <td>BPM</td>
        <td v-if="!cal.hr && lastRes.HR?.Value"> <q-btn @click="resultToDB(lastRes.HR?.Value,'hr')" class="results" flat dense no-caps size="12px">Use last result- &nbsp;<strong>{{lastRes.HR.Value}}</strong> ?</q-btn></td>
      </tr>
      <tr>
        <th><label for="Calibrate_respRate">Respiration Rate:</label></th>
        <td v-if="disable" class="disableInput">{{cal.rr}}</td>
        <td v-else style="width: 15%;">
          <input id="Calibrate_respRate" name="rr" type="number" :value="cal.rr" :disabled="step1complete"
            :min="config.min_rr" :max="config.max_rr" :class="hasProblem('rr')"/>
        </td>
        <td>RPM</td>
        <td v-if="!cal.rr && lastRes.RR?.Value"> <q-btn @click="resultToDB(lastRes.RR?.Value,'rr')" class="results" flat dense no-caps size="12px">Use last result- &nbsp; <strong>{{lastRes.RR.Value}}</strong> ?</q-btn></td>      
      </tr>
      <tr>
        <th><label for="Calibrate_spo2">SpO<sub>2</sub>:</label></th>
        <td v-if="disable" class="disableInput">{{cal.spo2}}</td>
        <td v-else style="width: 15%;">
          <input id="Calibrate_spo2" name="spo2" type="number" :value="cal.spo2" :disabled="step1complete"
            :min="config.min_spo2" :max="config.max_spo2" :class="hasProblem('spo2')"/>
        </td>
        <td colspan="2">%</td>
      </tr>
    </table>
  </form>
  <MonitorBox v-if="canRecord"/>
  <form v-if="canRecord" @input="autoUpdateValue" :disable="disable">
    <!-- <fieldset style="border-left: thin solid var(--q-primary);border-top: none;border-bottom: none;margin-bottom: 20px;"> -->
      <fieldset style="border: none;margin-bottom: 20px;">
      <legend translate="yes" class="translate" style="font-size:1rem;">BP reading method</legend>
      <label>
        <input id="Calibrate_bp_method_invasive" name="bpMethod" type="radio" value="invasive" :checked="cal.bpMethod === 'invasive'" :disabled="disable" />
        invasive <q-tooltip anchor="top middle" self="bottom middle">Arterial line blood pressure</q-tooltip>
      </label>
      &nbsp;&nbsp;
      <label>
        <input id="Calibrate_bp_method_nibp" name="bpMethod" type="radio" value="cuff" :checked="cal.bpMethod === 'cuff'" :disabled="disable"/>
        NIBP <q-tooltip anchor="top middle" self="bottom middle">Non invasive blood pressure</q-tooltip>
      </label>
    </fieldset>
      
    <!-- <div class="text-purple q-gutter-md"> <q-icon name="alarm" size="24px"/></div> -->
    <fieldset style="border: none;">
      <legend translate="yes" class="translate">Timed Measurements&nbsp;<q-icon name="alarm"/></legend>
      <table dir="ltr" translate="no" class="ts-measure notranslate">     
        <thead>
          <tr>
            <td :colspan="disable ? null : 2">&nbsp;</td>
            <th translate="yes" class="translate"></th>
            <th>Systolic <q-tooltip anchor="center middle" self="top middle" :delay="800">Systolic Blood Pressure</q-tooltip></th>
            <th>Diastolic <q-tooltip anchor="center middle" self="top middle" :delay="800"> Diastolic Blood Pressure </q-tooltip></th>
            <th translate="yes" class="translate">Status</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(row, i) in rows" :key="i">
            <tr v-if="!disable || row.status==2 || row.status==-1">
              <td v-if="!disable">
                <q-btn :id="'Calibrate_TimeMs_delete'+i" class="removeRow"
                @click.prevent="row.status == 2 ? confirmCard(row): setTimedMeasurement({remove:i})" icon="cancel" dense flat>
                  <q-tooltip anchor="center left" self="center right"> Remove this row</q-tooltip>
                </q-btn>
                <q-dialog v-model="pop">
                  <q-card class="bg-secondary text-white">
                    <q-card-section class="text-h3 bg-red">
                      <div class="text-h6"> Delete this row? 
                      <q-icon name="delete_forever"/></div>
                    </q-card-section>
                    <q-card-actions align="right" class="bg-red">
                      <q-btn flat type="submit" class="pop_btn1 " @click.prevent="setTimedMeasurement({remove:i}), pop = false" id="Location_popUp_delete_yes">Yes</q-btn>
                      <q-btn flat type="button" class="pop_btn1 cancel" @click.prevent="pop=false,confirmRemoveRow = 0" id="Location_saveWard_delete_no">No</q-btn>
                    </q-card-actions>
                  </q-card>
                </q-dialog>

              </td>
              <td>{{i+1}}.</td>
              <td>
                <template v-if="row.ts">{{getTime(row.ts)}}</template>
                <div v-else class="container-fluid">
                
                  <q-btn v-if="minutePassed(i)" class="setNow bg-blue-grey-2" :id="'Calibrate_TimeBtn'+i" @click.prevent="measurementTimestamp(i)"
                  :disable="disableTimeBtn(i)" dense flat icon-right="keyboard_double_arrow_right" no-caps><q-icon name="alarm"/> Time</q-btn>              
                  
                  <q-btn v-else 
                    @click="startComputing(0)"
                    :loading = progress[0].loading
                    :percentage="progress[0].percentage" dark-percentage class="setNow bg-blue-grey-2" 
                    dense flat icon-right="keyboard_double_arrow_right" no-caps><q-icon name="alarm"/> Time
                    <template v-slot:loading>
                      <q-spinner-hourglass class="on-left" /> Time
                    </template>

                    <q-tooltip class="bg-blue-8 text-white" anchor="top middle" self="bottom middle">Wait 1 minute</q-tooltip>
                  </q-btn>
                </div> 
                <!-- <q-btn v-else class="setNow" :id="'Calibrate_TimeBtn'+i" @click.prevent="measurementTimestamp(i)"
                  :disabled="disableTimeBtn(i)" flat dense>⏱ Time &gt;&gt;</q-btn> -->
              </td>
              <td><input type="number" :id="'Calibrate_TimeMs_sys'+i" :name="'timed.'+i+'.sys'" :min="config.min_sys" :max="config.max_sys" :value="row.sys" :disabled="!row.ts || (row.status ?? -2) > -2" /></td>
              <td><input type="number" :id="'Calibrate_TimeMs_dia'+i" :name="'timed.'+i+'.dia'" :min="config.min_dis" :max="config.max_dis" :value="row.dia" :disabled="!row.ts || (row.status ?? -2) > -2" /></td>
              <td v-if="row.ts && row.status === -2">
                <button :id="'Calibrate_TimeMs_activate'+i" class="activateRow" :disabled="outOfRangeBP(row)"
                  @click.prevent="activateTimedMeasurement(i)" flat dense no-caps>Done</button>
              </td>
              <td v-else-if="row.status === 1" class="timedStatus1">
                Working...
                <q-btn :id="'Calibrate_TimeMs_activate'+i"
                  @click.prevent="activateTimedMeasurement(i)" icon="keyboard_return" flat dense></q-btn>
              </td>
              <td v-else :class="['timedStatus', 'timedStatus'+ row.status]">
                {{['Failed','','Working...','Ok!'][1 + (row.status ?? 0)]}}
                <q-tooltip v-if="row.status == -1" class="bg-pink-4 text-black" anchor="top middle" self="bottom middle">{{row.info?? row.BP?.info?? ''}}</q-tooltip>
              </td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr v-if="!disable">
            <td colspan="2">&nbsp;</td>
            <td colspan="4">
              <q-btn translate="yes" label="Add row" id="Calibrate_TimeMs_addRow" class="translate addRow ellipsis bg-orange-7 text-white"
              @click.prevent="setTimedMeasurement({append:1})" :disabled="disable" icon="more_time" no-caps dense>
              </q-btn>
            </td>
          </tr>
        </tfoot>
      </table>
    </fieldset>
    <!-- <p v-show="currentSession?.status === 30">
      ✔ Calibration complete.&nbsp;
      <router-link :to="{ name: 'tabMonitoring', params: { id: currentId } }">Continue to monitoring.</router-link>
    </p> -->
    <!-- <div class="endCalibrate">
      <q-banner v-show="countGoodTM==3 && currentSession.status==20" rounded class="q-pa-sm q-mb-sm bg-accent text-white" dense> You can move to monitor
        <div class="arrow-container">  <div class="arrow-down"></div> </div>
      </q-banner>
        <q-btn v-if="!disable" @click.prevent="moveToMonitor()" id="Clibrate_Set" class="nextMon bg-accent shadow-4" no-caps dense :icon="countGoodTM<3? 'lock' : 'lock_open'" :disable="countGoodTM<3">Finish Calibration</q-btn>
        <q-tooltip v-if="countGoodTM!=3" class="bg-accent text-white" anchor="top middle" self="bottom middle">enter 3 blood measurements to continue</q-tooltip>       
    </div> -->
  </form>
  </div>
</template>


<script>
import MonitorBox from './MonitorBox.vue'
import { mapGetters, mapState, mapActions } from 'vuex'
import config from '../../../public/PatientConfig.json';

export default {
  name: 'Calibrate',
  components: { MonitorBox },

  data:function(){
    return{
      problemAlert: [],
      problem: true,
      showTab: false,
      step1areYouSure: false,
      config: config,
      suggestedWeight: null,
      suggestedTemp: null,
      clicked_hr: false,
      clicked_rr : false,
      clicked_spo2: false,
      confirmRemoveRow: -1,
      deleteMsg: true,
      pop:false,
      canMonitor: false,
      createdTime: '',
      createdDate: '',
      progress: [
        { loading: false, percentage: 0 },
        { loading: false, percentage: 0 },
        { loading: false, percentage: 0 }
      ],

      intervals: [ null, null, null ]
    }
  },

  computed:{
    ...mapGetters({'currentSession': 'sessions/current'}),
    ...mapState('sessions', ['currentId', 'settings']),
    ...mapState('manage', ['patients', 'wards']),
    ...mapState('live', ['meta', 'last', 'lastResults']),
    ...mapState('env', ['height', 'weight', 'temp']),
    patient() { return this.patients.find(p => p.id === this.settings?.patient?.$oid);},
    sessionList() { return this.$store.state.sessions.all; },
    lastRes() { return this.lastResults ?? {}; },
    disable() { return this.currentSession?.status !== 20; },
    cal() { return this.currentSession ? this.settings?.calibrate ?? {} : {}; },
    rows() { return this.cal.timed ?? []; },
    step1complete() { return this.disable; },
    canRecord() { return (this.cal.temperature ?? 0) >= config.min_temperature; },
    isLive() { return this.last && this.last + 30 > new Date().valueOf() / 1000; },
    has60sec() { return this.last && this.last - this.meta?.first >= 60; },
    minuteCountdown() {
      const percent = 5 * (this.last - this.meta?.first) / 3;
      return percent;
      // return {background: `linear-gradient(90deg,rgb(0 255 0 / .5) ${percent}%,transparent ${percent}%)`};
    },
    birthday() {
      const bd = this.patient?.birthdate;
      if (!bd) return '';
      const b = new Date(bd), d = new Date(Date.now() - b);
      const a = d < 2_631_600_000 ? ~~(d / 86_400_000) + ' days' : d < 63_158_400_000 ? ~~(d / 2_631_600_000) + ' months' : ((d.getUTCFullYear() - 1970) + 'yo');
      return b.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }) + ' (' + a + ')';
    },

    countGoodTM() {
      return this.rows.filter(r => r.status === 2).length;
    },
  },

  beforeUnmount(){ 
    this.intervals.forEach(val => {
      clearInterval(val)
    })
  },

  watch: {
    currentSession: {
      immediate: true,
      handler(){
        this.showTab = true;
        this.problemAlert.splice(0);
        this.suggestedWeight = null;
        this.suggestedTemp = null;
        this.autoUpdateTimedMeasurement();
        if(this.currentSession){
          var created_time = new Date(this.currentSession.created * 1000);
          var now = new Date();
          this.createdTime = now - created_time < 72000000 ? created_time.toLocaleTimeString() : created_time.toLocaleDateString();
          this.createdDate = created_time.toLocaleString();
        }
      }
      
    },
    patient: 'setDefaults',
    settings: 'setDefaults',
    lastRes: function(){console.table(this.lastRes)},
    last(){
      this.progress[0].percentage = 5 * (this.last - this.meta?.first) / 3;
      if (this.progress[0].percentage >= 600) {//100
          this.progress[0].loading = false
      }
    },
    rows(){ if(this.rows.filter(r => r.status === 2).length >= 3) this.canMonitor = true;}
  },

  
  methods:{
    startComputing (id) {
      this.progress[id].loading = true
      this.progress[id].percentage = this.progress[id].percentage +(5 * (this.last - this.meta?.first) / 3);
    },

    ...mapActions('sessions', ['updateValue', 'setTimedMeasurement', 'autoUpdateTimedMeasurement']),
 
    getTime(ts) { return ts ? new Date(1000 * ts).toLocaleTimeString('en-US'): '-'; },

    hasProblem(name) { return this.problemAlert.includes(name) ? 'problem' : ''; },

    setDefaults() {
      if (!this.cal.weight && this.patient?.weight) {
        this.updateValue({key: 'calibrate', path: ['weight'], value: this.patient?.weight});
      }
    },

    autoUpdateValue(e) {
      if (!this.currentSession) return;
      const el = e.target, path = el.name.split('.'), cnv = el.dataset?.convert;
      var value = el.type === 'checkbox' ? el.checked : isNaN(el.value) ? el.value.trim() : +el.value;
      if (cnv) {
        value = this[cnv].fromUI(value);
        // if (cnv === 'weigth') this.suggestWeight(value);
        if (cnv === 'temp') this.suggestTemp(value);
      }
      this.updateValue({key: 'calibrate', path, value});
      this.problemAlert.splice(0);
    
    },

    suggestTemp(t) {
      if (this.temp.unit === 'C' && 90 < t && t < 115) {
        let value = ((t - 32) / 1.8).toFixed(1);
        this.suggestedTemp = { value, text: `${t}°F (${value}°C)` };
      } else if (this.temp.unit === 'F' && 0 < t && t < 8) {
        let value = this.temp.toUI(t);
        this.suggestedTemp = { value, text: `${value}°C (${this.temp.toUI(value)}°F)` };
      } else
        this.suggestedTemp = null;
    },

    setSuggestedWeight()  {this.updateValue({key: 'calibrate', path: ['weight'], value: this.suggestedWeight.value }); this.suggestedWeight = null; },
    
    setSuggestedTemp() { this.updateValue({key: 'calibrate', path: ['temperature'], value: this.suggestedTemp.value }); this.suggestedTemp = null; },

    confirmCard(row){
      this.confirmRemoveRow = row.ts;
      this.pop = true;
    },
    
    minutePassed(i){
      if(i==0) {return this.has60sec;}
      else if(i>0 && this.rows[i - 1]?.ts) { return this.has60sec;}
      else if( i> 0 && !this.rows[i - 1]?.ts) { return true;}
    },
    
    disableTimeBtn(i){
      if (i == 0) return false;
      return !this.rows[i - 1]?.ts;
    },

    step1valid() {
      const cal = this.cal, t = cal.temperature;
      this.problemAlert.splice(0);
      if (!t || t < config.min_temperature || t > config.max_temperature) this.problemAlert.push('temperature');
      // if (!cal.spo2) this.problemAlert.push('spo2');
      // if (!cal.rr) this.problemAlert.push('rr');
      // if (!cal.hr) this.problemAlert.push('hr');
      // if (!cal.weight) this.problemAlert.push('weight');
      return this.problemAlert.length === 0;
    },

    moveToMonitor(){
      this.updateValue({key: 'calibrate', path: ['stage'], value: 'ready'});
      const id = this.currentId, nextst = 30, name = 'tabMonitoring';
      this.$store.dispatch('sessions/loadStatus', { id, nextst }); 
      this.$router.push({ name, params: { id: id } });
    },

    // step1completed() {
    //   if (this.step1valid()) {
    //     this.updateValue({key: 'calibrate', path: ['canRecord'], value: true});
    //   } else {
    //     this.step1areYouSure = false;
    //   }
    // },

    resultToDB(res,location){
      this.updateValue({key: 'calibrate', path: [location], value: res});
    },

    measurementTimestamp(i) {
      // this.showClock = true;
      // this.clockDisabled = true;
      // setTimeout(this.checkTimer, 60000);
      // document.getElementById('Calibrate_TimeMs_sys'+i).display = 'none';
      // this.startTimer(i);   
      var value = ~~(new Date() / 1000);
      this.updateValue({key: 'calibrate', path: ['timed', i, 'ts'], value});
      document.getElementById('Calibrate_TimeMs_sys'+i).focus();
    },

    activateTimedMeasurement(i) {
      this.updateValue({key: 'calibrate', path: ['timed', i, 'status'], value: 0});
    },

    outOfRangeBP({dia, sys}) {
      return (dia ?? 0) < 30 || (sys ?? 0) < 60 || sys < dia || 250 < sys;
    }
  }
}
</script>

<style scoped> 

.ts-measure{
  border: none;
  margin-top: 10px;
}

.ts-measure :is(td, th) {
  padding: .1em .3em;
  font-weight: 500;
}

.ts-measure button{
  box-shadow: 0 0px 3px 0px rgb(162 152 152 / 37%);
  transition: .1s all;
  margin-right: 10px;
  border: none;
  background: #cccccc;
  margin-left: 5px;
  font-size: 0.8em;
  vertical-align: middle;
}

.ts-measure button.setNow:not(:disabled):hover{
  background: #bbd;
}


.ts-measure button.addRow:hover{
  background: #bdb;
}

.ts-measure caption {
  background: var(--bg-2);
  font-weight:700; font-size:1rem;
}

legend{
  font-size: 18px;
  font-weight: 600;
}

.setNow {
  color: #0d685f;
  font-weight: 700;
  background: grey;
}
  .setNow:disabled {
    color: #668;
  }

.addRow {
  color: #060;
  font-weight:700;
  font-size: 0.7rem !important;
  margin-top: 5px;
}

.removeRow {
  color: #900;
  /* background: rgb(243, 240, 240) !important; */
  background: transparent !important;
}


.container-fluid{
  display: flex; 
  align-items: center;
}

.nextMon{
  background-color: var(--fg-ok);
  color: rgba(255,255,255,1);
  display: block;
  font-size: large;
  /* font-family: Trebuchet MS; */
  margin: 0 0 0 auto;
  margin-right: 20px;
  font-weight: 300;
}

tbody tr:hover { background: #feb3;}
tr:focus-within { background: #feb9; }
tbody tr:focus-within:hover { background: #febc;}
table th{ font-weight: 600 !important;}
.problem:not(:focus) { box-shadow: 0 0 .1em .1em red; }
table tr { height:20px; }

.con_id{
  font-weight: bold;
}

div.curFocus {
  background: #fdecb2;
}

.timedStatus {
  color: var(--fg-dim);
  width: 3em;
  overflow: visible;
}

.timedStatus::before {
  margin-right: .3em;
}

.timedStatus-1:hover {
  color: var(--fg-alert);
  cursor: help;
}

.timedStatus-1::before {
  color: var(--fg-alert);
  content: '⚠';
}
.timedStatus0:hover,
.timedStatus1:hover {
  color: var(--fg);
}

.timedStatus0::before {
  content: '...';
}

.timedStatus1::before {
  content: ' ';
  border-color: #9990 #9996 #999c #999f;
  border-style: dotted;
  border-radius: 100%;
  display: inline-block;
  width: .7em;
  height: .7em;
  animation: rotating 1s linear infinite;
}

@keyframes rotating {
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
}

.timedStatus2:hover {
  color: var(--fg-ok);
  font-weight: 700;
}

.timedStatus2::before {
  color: var(--fg-ok);
  content: '✔';
}

.suggestion {
  color: var(--fg-clicky);
  font: italic 100 85% serif;
}

.suggestion:hover {
  background: var(--bg-highlight);
  text-decoration: underline;
}

.areYouSure {
  color: var(--fg-highlight);
  line-height: 1.5em;
  margin-left: auto;
  text-align: center;
  width: fit-content;
}

.areYouSure button {
  background-color: green;
  border: none;
  border-radius: 4%;
  color: rgba(255,255,255,1);
  font-size: initial;
  /* font-family: Trebuchet MS; */
  padding: .2em .6em;
  margin: 0 1ex;
}

#Clibrate_BeforeRecording_Cancel {
  background-color: red;
}

.row :is(input, select) {
  border-style: none none solid;
  border-width: 2px thin;
  border: none;
  box-shadow: 0px 0px 4px #495858;
}

input{
  border: none;
  margin-bottom: 2px;
  outline: none;
  background: #f2f2f2;
  height: 31px;
  border-radius: 4px 4px 0 0;
  color: black;
}

.disableInput{
  margin-bottom: 2px;
  margin-left: 5px;
  height: 31px;
  color: black;
  width: 15%;
}

input:hover{
  background: #e6d6c7;
}

input:focus{
  background:#c5cfd3;
}

/* timer clock */

.head {
  margin-bottom: 20px;
  font-size: 50px;
}
#display {
  margin: 9px 4px;
}
#box {
  border: none;
  border-radius: 10%;
  margin: 0;
  /* width: 304px; */
  /* height: 262px; */
  padding: 0;
}

#timer {
  border: solid 1px #000000;
  background-color: #ebc7b6;
  width: 35px;
  height: 35px;
  display: block;
  border-radius: 50%;
}
button:hover{
  color:#4e4b56;
}
#plus {
  float: left;  
}
#minus {
  float: right;
}
.pm-btn { 
    outline: none;
    border: none;
    color: black;
    height: 30px;
		width: 30px;
    margin: 20px;
		font-size: 20px;
		text-align: center;
		align-content: center;
		background-color: transparent;
}

 .buttonT {
   outline: none;
   border: none;
   outline: none;
   color: white;
   height: 40px;
   width: 80px;
   font-size: 10px;
   text-align: center;
   align-content: center;
   background-color: transparent;
}

.results{
  /* border: none; */
  /* color: var(--bg-4); */
  background: var(--bg-2);
  /* box-shadow: 0px 0px 1px 1px #91d4cd; */
  /* border-radius: 0.2rem; */
  font-size: small;
  
}

.absolute-full, .fullscreen, .fixed-full {
  background: #0000000d !important;
}

.endCalibrate{
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 20px;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  position: absolute;
  right: 2px;
}

.translate{
  /* font-family: Trebuchet MS; */
  /* text-shadow: 0px 4px 8px #1918188f; */
}

/*arrow animation */
.arrow-container {
  width: 25px;
  animation: bounce-5a328104 1600ms infinite cubic-bezier(0.445, 0.05, 0.55, 0.95);
  cursor: pointer;
  margin: 0 0 0 15px;
  padding: 0;
  display: inline-grid;
}

.arrow-down {
  height: 4px;
  background: white;
  transform: rotate(45deg);
  transform-origin: 0% 0%;
  border-radius: 5px;
  width: 15px;
}
.arrow-down:after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0;
  left: 100%;
  border-radius: 5px;
  background: white;
  transform: rotate(-90deg);
  transform-origin: 0% 100%;
}

@keyframes bounce {
50% {
    transform: translateY(-10px);
  }
}

.delete{
  font-size: 0.9rem !important;
  /* width: 50px !important;
  height: 45px !important; */
  /* right: 12px; */
  /* top:0px;
  position: absolute; */
}

.q-item__section--side > .q-avatar {
  font-size: 36px;
}

.q-item__label--caption {
  color: var(--text);
}

.tab_actions button{
  padding: 0.3rem 0.5rem;
}
</style>
