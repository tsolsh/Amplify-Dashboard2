<template v-show="showTab">
  <div>
    <div class="q-pr-md q-gutter-y-md column items-start tab_actions" style="align-content: end;">
      <q-btn-group push class="shadow-10">
        <q-btn-dropdown dropdown-icon="info" dense class="delete" color="secondary" >
          <q-list style="background: var(--bg);color:var(--bg-4);font-weight: 600; min-width: 200px;">
            <q-item clickable v-close-popup>
              <q-item-section avatar>
                <q-avatar icon="badge" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Patient</q-item-label>
                <q-item-label caption>{{currentPatient}}</q-item-label>
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
        <q-btn :to="`/session/${$route.params.id}/configure`" class="delete" color="secondary" icon="first_page" dense>
          <q-tooltip v-if="deleteMsg" class="shadow-3 bg-secondary text-white" anchor="top middle" self="bottom middle" id="deleteTxt">
            Back to configure
          </q-tooltip>
        </q-btn>
        <q-btn :to="`/session/${$route.params.id}/calibrate`" class="delete" color="secondary" icon="chevron_left" dense>
          <q-tooltip v-if="deleteMsg" class="shadow-3 bg-secondary text-white" anchor="top middle" self="bottom middle" id="deleteTxt">
            Back to calibrate
          </q-tooltip>
        </q-btn>
        <q-btn v-if="currentSession?.status<99" @click="archiveSession($event)" color="secondary" icon="archive" class="icon delete" id="Nav_archive-button" :disable="!currentSession || isLive!=0" dense no-caps>
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

  <MonitorBox/>
  <form id="monitor">
    <div style=" margin: 4em 6px 2rem 9px;">
      <q-table
        title="Recorded Segments"
        dense class="recordTable shadow-8"
        table-header-class="table-title"
        :rows="segments"
        :columns="[
        {name: 'started', label: 'Started', align: 'center', field: row => row.name, format: val => `${val}`, sortable: true},
        {name: 'ended', label: 'Ended', align: 'center', field: row => row.name, format: val => `${val}`, sortable: true},
        {name: 'duration', label: 'Duration', align: 'center', field: row => row.name, format: val => `${val}`, sortable: true},
        {name: 'view', label: 'View', align: 'center', field: row => row.name, format: val => `${val}`, sortable: true},
        {name: 'raw', label: 'Raw', align: 'center', field: row => row.name, format: val => `${val}`, sortable: true},
        {name: 'results', label: 'Results', align: 'center', field: row => row.name, format: val => `${val}`, sortable: true},
        /*{name: 'actions', label: 'Actions', align: 'center', field: row => row.name, format: val => `${val}`, sortable: true},*/
        ]"
        row-key="name" id="Monitor_recordsTable" style="background:var(--bg);color:var(--text);"
      >
      <template v-slot:top>
        <div class="q-pa-xs">
          <h6 style="font-size: 1.2rem;font-weight: 600;margin:0;"> <q-icon name="history" size="sm"/> Recorded Segments</h6>
          <a v-bind="download({id: '', file: 'complete', startDate}, 'min.csv')"
           id="Monitor_RESBtn_Full" class="bg-accent shadow-3 text-white" style="position: absolute;top:23%; right: 3%;justify-content:center;border-radius:0.2rem;font-size: 0.8rem;">
             Download full CSV &nbsp;<i class="fas fa-file-download" style="font-size:18px;padding:2px 0;"></i>
          </a>        
        </div>
      </template>

      <template #header-cell="props">
        <q-th 
        :props="props"
        style="font-size:13px;font-weight:700;background:var(--bg);"
        >
          {{props.col.label}}
        </q-th>
      </template>

      <template #body-cell-started="props">
        <q-td key="started" :props="props">
          {{props.row.icon}}
          {{props.row.startDate.toLocaleString()}}
        </q-td>
      </template>

      <template #body-cell-ended="props">
        <q-td key="ended" :props="props">
          {{props.row.endDate?.toLocaleString() ?? '...'}}
        </q-td>
      </template>

      <template #body-cell-duration="props">
        <q-td key="duration" :props="props" >
          {{props.row.duration ?? '...'}}
        </q-td>
      </template>

      <!-- <template #body-cell-view="props">
        <q-td v-if="props.row.ended">
          <q-btn :to="{name: 'Historic', params: {id: currentId}, query: { start: props.row.first }}" @click="open_history()" target="_blank" :id="'Monitor_historyBtn'+props.row.first" no-caps flat dense color="purple">History</q-btn>
        </q-td>  
        <q-td v-else>
          <q-btn :to="{name: 'Live', params: {id: currentId}}" target="_blank" :id="'Monitor_LiveBtn_'+currentId" no-caps flat dense color="red">Live</q-btn>
        </q-td>
      </template> -->
      <template #body-cell-view="props">
        <q-td v-if="props.row.ended">
          <router-link :to="{path: '/historic/' + currentId, query: { start: props.row.first }}" target="_blank" :id="'Monitor_historyBtn'+props.row.first">History</router-link>
        </q-td>  
        <q-td v-else>
          <router-link :to="'/live/' + currentId" target="_blank" :id="'Monitor_LiveBtn_'+currentId">Live</router-link>
        </q-td>
      </template>

      <template #body-cell-raw="props">
        <q-td >
        <a v-if="permits!='Session'" v-bind="this.download(props.row, 'edf')">EDF</a>
        </q-td>
      </template>

      <template #body-cell-results="props">
        <q-td>
          <a v-bind="this.download(props.row, 'min.csv')">CSV</a>&nbsp;
          <a v-if="permits!='Session'" v-bind="this.download(props.row, 'json')">JSON</a>
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td>
          <q-btn class="delete-segment" @click.prevent="deleteSegment(props)" :id="'Monitor_deleteRecord_'+ props" :icon="props.row.actions" flat dense>
            <q-tooltip  anchor="center right" self="center left">Delete this recorded segment</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template #no-data>
        <q-chip>
          no recordings ...
        </q-chip>
      </template>
      </q-table>
    </div>
  </form>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import api, { getUrlWithToken } from '../../services/api.js';
import MonitorBox from './MonitorBox.vue';

export default {
  name: 'Monitor',
  components: {
    MonitorBox
  },

  data() {
    return {
      segments: [],
      permits: '',
      startDate: new Date(),
      fullCSV: {},
      permitted: true,
      deleteMsg:true,
      createdTime: '',
      createdDate: '',
    }
  },

  computed: {
    ...mapGetters({'currentSession': 'sessions/current'}),
    ...mapState('sessions', ['currentId','settings']),
    ...mapState('env', ['temp','timeZone']),  
    ...mapState('layout', ['colourScheme']),
    ...mapState('manage', ['patients']),
    ...mapState('live', ['last']),
    currentPatient() { return this.patients.find(p => p.id === this.settings?.patient?.$oid)?.serial; },
    perms(){ return this.user ? this.$store.state.sessions.permissions : null; },
    isLive() { return this.last && this.last + 30 > new Date().valueOf() / 1000; },
    // tz (){ return {label: 'Local time', value: this.startDate.getTimezoneOffset()}},
  },

  watch: {
    currentSession: { immediate: true, handler: 'loadRecordings'},
   perms(){
      if(this.perms){
        this.checkPermissions();
      }
    },
  },

  methods: {
    async loadRecordings() {
      const res = await api('session/recordings/' + this.currentId) || [];
      this.startDate = new Date();
      for (const seg of res.data) {
        seg.startDate = new Date(seg.first * 1000);
        if (this.startDate > seg.startDate) this.startDate = seg.startDate;
        seg.file = seg.startDate.toISOString().split(".")[0].split(":").join("-");
        if (seg.ended) {
          let duration = seg.last - seg.first + 1, s = duration % 60, m = ~~(duration / 60) % 60, h = ~~(duration / 3600);
          seg.endDate = new Date(seg.last * 1000).toLocaleString();
          seg.duration = `${h}:${this.pad(m)}:${this.pad(s)}`;
        }
      }
      this.fullCSV = {id: '', file: this.startDate.toISOString().substr(0, 10) + '.' + this.currentPatient, startDate: this.startDate};
      this.segments = res.data;
      // this.tz['value'] = this.startDate.getTimezoneOffset();
      /*calculate created time & date */
      var created_time = new Date(this.currentSession.created * 1000);
        var now = new Date();
        this.createdTime = now - created_time < 72000000 ? created_time.toLocaleTimeString() : created_time.toLocaleDateString();
        this.createdDate = created_time.toLocaleString();
    },

    pad (n) { 
      return n < 10 ? '0' + n : n;
    },

    download({id, file, startDate}, type) {
      return {
        href: getUrlWithToken(`recording/download/${this.currentId}/${file}.${type}?rec=${id}&temp=${this.temp.unit}&tz=${this.timeZone? this.timeZone: startDate.getTimezoneOffset()}&patient=${this.startDate.toISOString().substr(0, 10) + '.' + this.currentPatient}`),
        download: `${file}.${type}`
      };
    },

    async deleteSegment({id}) {
      await api('/recording/' + this.currentId + '/' + id, 'delete');
      await this.loadRecordings();
    },

    checkPermissions() {
      if(this.roles.includes('user-group') || this.roles.includes('web-admin')|| this.roles.includes('research-group')) {
        this.permits - 'admin';
        // this.permits.push('Patients','Sessions','Gateways','PolyMonitors','Locations', 'Users'); 
      } 
      else if(this.roles.includes('patient-group')) {
        // this.permits.push('Patients','Sessions');
        this.permits - 'Patients';
      }
      else if(this.roles.includes('nurse-group')) {
        // this.permits.push('Sessions');
        var name = this.permits = 'Sessions'
        this.$router.push({name});
      }
      else if(this.roles.includes('gateway')) {
        this.permits.push('Gateways');
        var name = this.permits = 'mngGateways';
        this.$router.push({name});
      }// }else if(this.perms.includes('MANAGE_USERS')) {
      //   this.permits.push('Users','Sessions');
      // }else if(this.perms.includes('MANAGE_PM')) {
      //   this.permits.push('PolyMonitors','Sessions');// 
      
    }
  }
}
</script>

<style scoped>
.table-title{
  margin: -30px 0;
}

.recordTable{
  width: 750px; 
  color:black;
  font-size:0.9rem;
  /* box-shadow: 0 1px 5px rgb(0 0 0 / 69%), 0 2px 14px 3px rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%); */
}

#monitor table {
  border-collapse: collapse;
  box-shadow: 0px 0px 1px 0px #000000;
  color: var(--fg-1);
}

#monitor td {
  background: var(--bg);
  padding: .2em .4em;
  text-align: center;
}

#monitor th {
  background: var(--bg-2);
  font: 100 italic "Trebuchet MS", sans-serif;
  padding: 0 .4em;
}

#monitor tr:hover td {
  background: var(--bg-highlight);
  color: var(--fg-highlight);
}

#monitor a[download] {
  background: rgb(207 216 220);
  color: var(--q-primary);
  font-weight: 600;
  font-size: 88%;
  padding: 0.1em 0.3em;
  margin: auto;
  text-decoration: none;
  min-width: 2.6em;
  transition: all 1s ease;
}

#monitor a[download]:hover {
  color: #fff;
  transition: all .2s ease;
}

#monitor a[download$="edf"]:hover {
  background: #f93;
}

#monitor a[download$="csv"]:hover {
  background: #3c3;
}

#monitor a[download$="json"]:hover {
  background: #03f;
}

.timezone_select{
  flex:0 0 15em;
  width: 20px;
  background: var(--bg-2);
}

.csv_btn{
  left:38%; 
  position: relative;
  font-size:1.3rem;
}

.load_recordings{
  height: 6px; 
  width: 6px;
  font-size:1rem;
}

/*
#rec-list tbody:empty {
    border: thin solid gray
}
#rec-list tbody:empty::before {
    content: '\a0';
}
#rec-list tbody:empty::after {
    content: '(no recordings yet)';
}

@media (max-width : 50em){
   #rec-list tbody{
    padding: 0px 0 0 0 !important;
    width:20%;
    display:block;
    font-size: small;
  }
  #rec-list th{
    display:contents;
  }
}
*/
.delete{
  font-size: 0.9rem !important;
  /* width: 50px !important;
  height: 45px !important; */
  /* right: 12px;
  top:0px;
  position: absolute; */
}

.q-item__label--caption {
  color: var(--text);
}

.tab_actions button{
  padding: 0.3rem 0.5rem;
}
</style>
