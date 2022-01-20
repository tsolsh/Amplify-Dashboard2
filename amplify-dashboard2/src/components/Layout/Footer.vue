<template>
  <q-footer reveal elevated v-show="visible" class="q-footer bg-white">
    <q-toolbar>
      <q-fab @click="showSettings = true" direction="up" title="Settings" id="footer_settings" icon="settings_suggest"
      class="bg-primary shadow-3"
      padding="3px 3px 3px 3px"
      label="Settings" label-position="top"
      external-label round
      >
        <aside v-show="showSettings" class="shadow-9"> 
          <h5 style="margin: 9px 4px; font-weight: 700;color: var(--text-primary);text-shadow: rgb(107 111 111 / 67%) 0px 0px 2px;"><q-icon name="settings_suggest" style="display: contents;"/> Settings</h5>
          <table>
            <th class="title">Units</th>
            <tr><th class="head"><q-icon name="square_foot" size="1.4rem"/><span>Height </span></th>
              <td><q-radio @update:model-value="setUnits($event, 'height')" v-model="height.unit" val="cm" label="Centimeters" dense color="secondary" class="aside_select"/></td>
              <td><q-radio @update:model-value="setUnits($event, 'height')" v-model="height.unit" val="m" label="Meters" dense color="secondary" class="aside_select"/></td>
              <td><q-radio @update:model-value="setUnits($event, 'height')" v-model="height.unit" val="inch" label="Foot, inch" dense color="secondary" class="aside_select"/></td>
            </tr>
            
            <tr><th class="head"><i class="las la-weight" style="font-size: 1.4rem;"></i><span>Weight </span></th>    
              <td><q-radio @update:model-value="setUnits($event, 'weight')" v-model="weight.unit" val="kg" label="Kilograms" dense color="secondary" class="aside_select"/></td>
              <td><q-radio @update:model-value="setUnits($event, 'weight')" v-model="weight.unit" val="lbs" label="Pounds" dense color="secondary" class="aside_select"/></td>
            </tr>

            <tr><th class="head"><q-icon name="thermostat" size="1.4rem"/><span>Temp. </span></th>          
              <td><q-radio @update:model-value="setUnits($event, 'temp')" v-model="temp.unit" val="C" label="Celsius" dense color="secondary" class="aside_select"/></td>
              <td><q-radio @update:model-value="setUnits($event, 'temp')" v-model="temp.unit" val="F" label="Farenheit" dense color="secondary" class="aside_select"/></td>
            </tr>
            <th class="title">Theme</th>
            <tr><th class="head"><i class="fas fa-adjust"></i><span>Theme </span></th>
              <td><q-radio @update:model-value="setColourScheme" v-model="colourScheme" val="lightScheme" label="Light" dense color="secondary" class="aside_select"/></td>
              <td><q-radio @update:model-value="setColourScheme" v-model="colourScheme" val="darkScheme" label="Dark" dense color="secondary" class="aside_select"/></td>
            </tr>

            <th class="title">Files</th>
            <tr><th class="head"> <q-icon name="watch_later"/><span>Clock for files </span></th>
              <td><q-select id="Monitor_Clock" class="timezone_select" standout="bg-secondary" outlined v-model="tz" @update:model-value="updateTz" 
              :dark="colourScheme=='darkScheme'" :options="timezones" style=" font-size: 0.8rem;" dense rounded>
              </q-select>
              </td>
              <td> (in {{startDate?.toLocaleDateString('en-US', {timeZoneName: 'long'}).split(', ')[1]}})</td>
            </tr>
            </table>
        </aside>
      </q-fab> 

    <span id="foot_serverName" class="text-black text-bold">Server: &#32; <b class="notranslate text-primary" translate="no">{{server}}</b>
      <q-tooltip v-if="server" class="bg-secondary text-black" anchor="top middle" self="bottom middle">{{name}}</q-tooltip>
    </span>
    <span v-if="statusText" id="foot_status" class="text-black text-bold">Status: &#32; 
      <svg><use :href="statusIcon"></use></svg> <b class="notranslate text-primary">{{statusText}}</b>
    </span>
    <span id="foot_message" class="text-black" :class="messageStyle">{{messageText}}</span>
    <time id="foot_time" class="notranslate text-black" translate="no">{{time}}</time>
    </q-toolbar>
  </q-footer>
</template>


<script>
import { mapState } from 'vuex'
import svgimg from '../../assets/img/i.svg'

export default {
  name: 'Footer',
  data() {
    return {
      showSettings: false,
      unitSelected : null,
      heightSelected: null,
      weightSelected: null,
      tempSelected: null,
      themeSelected: null,
      tz: {label: 'Local time', value: null},
      timezones: [
        {label: 'Local time', value: null},
        {label: 'Eastern Daylight', value: 300},
        {label: 'Eastern Standart', value: 240},
        {label: 'Israel Daylight', value: -180},
        {label: 'Israel Standart', value: -120},
      ],
      startDate: new Date(),
    }
  },

  computed: {
    currentSession() { return this.$store.getters['sessions/current']; }, // TODO: remove!
    ...mapState('layout', ['colourScheme', 'visible', 'statusText', 'statusIcon', 'messageText', 'messageStyle']),
    ...mapState('env', ['server', 'name', 'clock', 'weight', 'height', 'temp']),
    nextSchemeIcon() { return this.colourScheme === 'darkScheme' ? '🌞' : '🌛'; },
    nextSchemeName() { return this.colourScheme === 'darkScheme' ? 'light' : 'dark'; },
    time() { return this.clock.toLocaleString(); },
  },

  watch: {
    currentSession(){
      // TODO: move this away!
      if (this.currentSession) {
        var st = this.statusToString(this.currentSession);
        this.$store.commit('layout/setStatus', {text: st, icon: svgimg + '#stage' + st});
      } else {
        this.$store.commit('layout/setStatus', {});
      }
    },

  },

  methods:{
    updateUnit(unit){
      switch(unit){
        case 'Centimeters': this.setUnits('cm','height'); break;
        case 'Meters': this.setUnits('m','height'); break;
        case 'Foot, inch': this.setUnits('inch','height'); break;
        case 'Kilograms':this.setUnits('kg','weight'); break;
        case 'Pounds':this.setUnits('lbs','weight'); break;
        case 'Celsius':this.setUnits('C','temp'); break;
        case 'Farenheit':this.setUnits('F','temp'); break;
      }
    },

    updateTz(timeZone){
      // switch(timeZone){
      //   case 'Local time': timeZone = null; break;
      //   case 'Eastern Daylight': timeZone = 300; break;
      //   case 'Eastern Standart': timeZone = 240; break;
      //   case 'Israel Daylight': timeZone = -180; break;
      //   case 'Israel Standart': timeZone = -120; break;
      // }
      timeZone = timeZone.value;
      this.$store.commit('env/setTimeZone', timeZone);
    },

    statusToString:function ({status}){ // TODO: remove!
      switch (status) {
          case 10: return "Configuration";
          case 20: return "Calibrating";
          case 30: return "Monitoring";
          case 99: return "Finished";
      }
      return null
    },

    setUnits(value, name) { 
      this.$store.commit('env/setUnits', {[name]: value});
      this.$store.dispatch('env/setUserUnits', {[name]: value});
    },
    
    setColourScheme(theme) { this.$store.commit('layout/setColourScheme', theme); },

  }
}
</script>


<style scoped>

b {
  color: var(--fg);
}

time {
  flex: 1;
  text-align: right;
}

#footer_settings{
  margin-right: 15px;
}

aside {
  background:var(--bg);
  color: black;
  position: absolute;
  left: 4em;
  bottom: 1em;
  /* box-shadow: 0px -8px 11px -5px rgb(10 102 93 / 10%), 0 2px 14px 2px #0096881a, 0 6px 12px 5px rgb(10 102 93 / 10%); */
  display: table;
  font-size: 1rem;
  width: max-content;
  padding: 5px 15px 5px 5px;
  border-radius: 0.2rem;
  
}

aside label {
  display: flex;
  justify-content: flex-start;
  font-size: 1rem;
  align-items: center;
  margin-bottom: 2px; 
}

.aside_select{
  display: flex;
  margin-left: 3px;
  border-radius: 0.2rem;
}

.head{
  margin-left: 10px;
  display: flex;
  font-size: medium;
  align-items: center;
  font-weight: 500;
    
}

.head span{
  margin-left: 10px;
  color: var(--text);
}

i{
  color:var(--text-primary);
}

table tr{
  line-height: 2rem;
}

table td{
  font-size: small;
  color: var(--text);
}

label.row:hover{
  background-color: transparent;
}

.title{
  font-size: 1.1rem;
  padding-left: 2px;
  padding-top: 10px;
}
</style>
