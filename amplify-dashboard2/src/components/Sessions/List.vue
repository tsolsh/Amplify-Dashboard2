<template>
  <q-table
    title="Sessions" dense :rows-per-page-options = "[15]"
    :rows="rows"
    :columns="[ 
      { name: 'stage',label: 'Stage',field: 'stage',required: true,align: 'center',sortable: true,sort: (a, b) => sortStage(a,b),sortOrder: 'ad'},
      { name: 'status', label: 'Monitor', field: 'status',align: 'center', sortable: true, sort: (a, b) => sortStatus(a,b),sortOrder: 'ad'},
      { name: 'date', label: 'Date', field: 'date',align: 'center', sortable: true, sort: (a, b) => a.getTime() - b.getTime() ,sortOrder: 'da' },
      { name: 'LocationW', label: 'Ward', field: 'LocationW',align: 'left', sortable: true, sort: (a, b) => a.toString().localeCompare(b.toString()), sortOrder: 'ad' },
      { name: 'LocationR', label: 'Room', field: 'LocationR',align: 'left',sortable: true, sort:(a, b) => a.toString().localeCompare(b.toString()), sortOrder: 'ad'},
      { name: 'LocationB', label: 'Bed', field: 'LocationB',align: 'left',sortable: true, sort: (a, b) => a.toString().localeCompare(b.toString()), sortOrder: 'ad'},
    ]"
    row-key="name" :loading="loading" 
    style="background:var(--bg);color:var(--text);font-size:0.9rem;box-shadow: none;line-height:1.8em;">

    <template #header-cell-stage="props">
      <q-th 
      :props="props"
      style="color:var(--text-primary);font-size:13px;padding:5px 0;"
      :title="props.col.label">
      </q-th>
    </template>
    <template #header-cell-status="props">
      <q-th 
      :props="props"
      style="color:var(--text-primary);font-size:13px;padding:3px;"
      :title="props.col.label">
      </q-th>
    </template>
    <template #header-cell-date="props">
      <q-th 
      :props="props"
      style="color:var(--text-primary);font-size:13px;"
      >
        {{props.col.label}}
      </q-th>
    </template>
    <template #header-cell-LocationW="props">
      <q-th 
      :props="props"
      style="color:var(--text-primary);font-size:13px;"
      >
        {{props.col.label}}
      </q-th>
    </template>
    <template #header-cell-LocationR="props">
      <q-th 
      :props="props"
      style="color:var(--text-primary);font-size:13px;"
      >
        {{props.col.label}}
      </q-th>
    </template>
    <template #header-cell-LocationB="props">
      <q-th 
      :props="props"
      style="color:var(--text-primary);font-size:13px;"
      >
        {{props.col.label}}
      </q-th>
    </template>
        
    <template v-slot:top-left>
      <div style="margin:-40px 0;">
        <h6 style="color: var(--text);font-weight: 500;"> Sessions </h6>
      </div>
    </template>

    <template v-slot:top-right>
      <div class="q-gutter-md">
        <q-btn size="12px" dense :disable="loading" icon="add" rounded @click="newSession()" color="accent" text-color="white" class="shadow-4">
          <q-tooltip class="bg-secondary text-white" anchor="top middle" self="bottom middle">
            Add new session
          </q-tooltip>
        </q-btn>
        <q-btn size="12px" flat dense icon="filter_alt" style="color:var(--action);">
          <q-tooltip class="text-white" anchor="top middle" self="bottom middle" style="color:var(--action);">
            filter
          </q-tooltip>

          <q-menu fit>
          <q-list bordered style="background: var(--bg);">
            <q-expansion-item 
              expand-separator
              default-closed
              label="Filter by stages"
              group="stage"
              style="font-weight:600; font-size:15px;color:var(--text);"
              expand-icon="filter_alt"
            >
              <q-item tag="label" v-ripple dense style="color:var(--text); font-size: 15px;align-items: baseline;">
                <q-item-section avatar>
                  <q-checkbox v-model="filterStage" val="Configuration" color="green" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label><svg><use :href="icon + 'stageConfiguration'" /></svg> Configure</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple dense style="color:var(--text); font-size: 15px;align-items: baseline;">
                <q-item-section avatar>
                  <q-checkbox v-model="filterStage" val="Calibrating" color="green" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label><svg><use :href="icon + 'stageCalibrating'" /></svg> Calibrate</q-item-label>
                </q-item-section>
              </q-item>
              
              <q-item tag="label" v-ripple dense style="color:var(--text); font-size: 15px;align-items: baseline;">
                <q-item-section avatar top>
                  <q-checkbox v-model="filterStage" val="Monitoring" color="green" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label><svg><use :href="icon + 'stageMonitoring'" /></svg> Monitor</q-item-label>
                </q-item-section>
              </q-item>
              <q-item tag="label" v-ripple dense style="color:var(--text); font-size: 15px;align-items: baseline;">
                <q-item-section avatar top>
                  <q-checkbox v-model="filterStage" val="Finished" color="green" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label><svg><use :href="icon + 'stageFinished'" /></svg> Finished</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item tag="label" v-ripple dense style="color:red; font-size: 15px;align-items: baseline;">
                <q-item-section avatar top>
                  <q-checkbox v-model="filterStatus" val="2" color="orange" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label><svg><use :href="icon + 'alertLevel2'" /></svg> Urgent</q-item-label>

                </q-item-section>
              </q-item>
              <q-item tag="label" v-ripple dense style="color:var(--text); font-size: 15px;align-items: baseline;">
                <q-item-section avatar top>
                  <q-checkbox v-model="filterStatus" val="1" color="orange" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label><svg><use :href="icon + 'alertLevel1'" /></svg> Warning</q-item-label>
                </q-item-section>
              </q-item>
              <q-item tag="label" v-ripple dense style="color:var(--text); font-size: 15px;align-items: baseline;">
                <q-item-section avatar top>
                  <q-checkbox v-model="filterStatus" val="0" color="orange" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label><svg><use :href="icon + 'alertLevel0'" /></svg> Normal</q-item-label>
                </q-item-section>
              </q-item>
              <q-item tag="label" v-ripple dense style="color:var(--text); font-size: 15px;align-items: baseline;">
                <q-item-section avatar top>
                  <q-checkbox v-model="filterStatus" val="" color="orange" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label><svg><use :href="icon + 'alertNotRecording'" /></svg> Waiting</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item tag="label" v-ripple dense style="color:var(--text); font-size: 15px;align-items: baseline;">
                <q-item-section avatar top>
                  <q-checkbox v-model="filterMonitor" val="online" color="black" size="sm"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Online</q-item-label>
                </q-item-section>
              </q-item>
              <q-item tag="label" v-ripple dense style="color:var(--text); font-size: 15px;align-items: baseline;">
                <q-item-section avatar top>
                  <q-checkbox v-model="filterMonitor" val="offline" color="black" size="sm"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Offline</q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>

            <q-expansion-item 
              expand-separator
              default-closed
              label="Filter by wards"
              group="wards"
              style="font-weight:600; font-size:15px;color:var(--text);"
              expand-icon="filter_alt">
              
              <q-item v-for="w in wards" class="list__item" id="key" :key="w" tag="label" v-ripple dense style="color:var(--text); font-size: 15px;align-items: baseline;">
                <q-item-section avatar top>
                  <q-checkbox v-model="filterWards" :val="w?.name" color="black" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{w?.name}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>
          </q-list>
            </q-menu>
        </q-btn>
        <q-btn size="12px" flat dense rounded icon="info" @click="showInfo = true" style="color:var(--action);">
          <q-tooltip class="text-white" anchor="top middle" self="bottom middle" style="color:var(--action);">
            more info
          </q-tooltip>
        </q-btn>
        </div>
    </template>

    <template #body-cell-stage="props">
      <q-td key="stage" :props="props" @click="loadSessionData(props)" :class="{'newSes': checkActive(props.row.name) == 'new', 'active':currentId===props.row.name}" style="padding:3px">
        <svg><use :href="icon + props.row.stage[1]" /></svg>
      </q-td>
    </template>

    <template #body-cell-status="props">
      <q-td key="status" :props="props" @click="loadSessionData(props)" :class="{'newSes': checkActive(props.row.name) == 'new', 'active':currentId===props.row.name}" style="padding:3px">
        <svg><use :href="icon + props.row.status" /></svg>
      </q-td>
    </template>

    <template #body-cell-date="props">
      <q-td key="date" :props="props" clickable @click="loadSessionData(props)" :class="{'newSes': checkActive(props.row.name) == 'new', 'active':currentId===props.row.name}" style="padding:3px">{{getDate(props.row.date)}}
      </q-td>
    </template>

    <template #body-cell-LocationW="props">
      <q-td key="LocationW" :props="props" clickable @click="loadSessionData(props)" :class="{'newSes': checkActive(props.row.name) == 'new', 'active':currentId===props.row.name}" style="padding:3px">{{props.row.LocationW}}
      </q-td>
    </template>

    <template #body-cell-LocationR="props">
      <q-td key="LocationR" :props="props" @click="loadSessionData(props)" :class="{'newSes': checkActive(props.row.name) == 'new', 'active':currentId===props.row.name}" style="padding:3px">{{props.row.LocationR}}
      </q-td>
    </template>

    <template #body-cell-LocationB="props">
      <q-td key="LocationB" :props="props" @click="loadSessionData(props)" :class="{'newSes': checkActive(props.row.name) == 'new', 'active':currentId===props.row.name}" style="padding:3px">{{props.row.LocationB}}
      </q-td>
    </template>

    <template #no-data>
      <q-chip>
        press on + to create a session.
      </q-chip>
    </template>

  </q-table>
  <!-- <q-btn style="background-color:var(--accent);color:white;" dense :disable="loading" icon="add" rounded @click="newSession()" class="add_filter shadow-5">
    <q-tooltip class="bg-orange-7 text-black" anchor="top middle" self="bottom middle">
      Add new session
    </q-tooltip>
  </q-btn> -->
  <q-dialog v-model="showInfo" full-width class="session-list">
    <q-table
      title="Sessions Info" dense :rows-per-page-options = "[15]"
      :rows="rows"
      :columns="[ 
        { name: 'stage',label: 'Stage',field: 'stage',required: true,align: 'center',sortable: true,sort: (a, b) => sortStage(a,b),sortOrder: 'ad'},
        { name: 'status', label: 'Monitor', field: 'status',align: 'center', sortable: true, sort: (a, b) => sortStatus(a,b),sortOrder: 'ad'},
        { name: 'patientId', label: 'Id', field: 'patientId',align: 'center', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),sortOrder: 'ad'},
        { name: 'serial', label: ' Serial №', field: 'serial',align: 'center', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),sortOrder: 'ad'},
        { name: 'date', label: 'Date', field: 'date',align: 'center', sortable: true, sort: (a, b) => a.getTime() - b.getTime() ,sortOrder: 'da' },
        { name: 'startTime', label: 'Start monitoring', field: 'startTime',align: 'center', sortable: true, sort: (a, b) => a.getTime() - b.getTime() ,sortOrder: 'da' },
        { name: 'LocationW', label: 'Ward', field: 'LocationW',align: 'center', sortable: true, sort: (a, b) => a.toString().localeCompare(b.toString()), sortOrder: 'ad' },
        { name: 'LocationR', label: 'Room', field: 'LocationR',align: 'center',sortable: true, sort:(a, b) => a.toString().localeCompare(b.toString()), sortOrder: 'ad'},
        { name: 'LocationB', label: 'Bed', field: 'LocationB',align: 'center',sortable: true, sort: (a, b) => a.toString().localeCompare(b.toString()), sortOrder: 'ad'},
      ]"
      row-key="name" :loading="loading"
      style="background:var(--bg);color:var(--text);font-weight:600;font-size:0.9rem;">

        <template #header-cell-stage="props">
          <q-th 
          :props="props"
          style="color:var(--text-primary);font-size:13px;padding:3px"
          :title="props.col.label"
          >
          </q-th>
        </template>
        <template #header-cell-status="props">
          <q-th 
          :props="props"
          style="color:var(--text-primary);font-size:13px;padding:3px"
          :title="props.col.label"
          >   
          </q-th>
        </template>
        <template #header-cell-patientId="props">
          <q-th 
          :props="props"
          style="color:var(--text-primary);font-size:13px;"
          >
            {{props.col.label}}
          </q-th>
        </template>
        <template #header-cell-serial="props">
          <q-th 
          :props="props"
          style="color:var(--text-primary);font-size:13px;"
          >
            {{props.col.label}}
          </q-th>
        </template>
        <template #header-cell-date="props">
          <q-th 
          :props="props"
          style="color:var(--text-primary);font-size:13px;"
          >
            {{props.col.label}}
          </q-th>
        </template>
         <template #header-cell-startTime="props">
          <q-th 
          :props="props"
          style="color:var(--text-primary);font-size:13px;"
          >
            {{props.col.label}}
          </q-th>
        </template>
        <template #header-cell-LocationW="props">
          <q-th 
          :props="props"
          style="color:var(--text-primary);font-size:13px;"
          >
            {{props.col.label}}
          </q-th>
        </template>
        <template #header-cell-LocationR="props">
          <q-th 
          :props="props"
          style="color:var(--text-primary);font-size:13px;"
          >
            {{props.col.label}}
          </q-th>
        </template>
        <template #header-cell-LocationB="props">
        <q-th 
        :props="props"
        style="color:var(--text-primary);font-size:13px;"
        >
          {{props.col.label}}
        </q-th>
      </template>

      <template #body-cell-stage="props">
        <q-td key="stage" :props="props" @click="loadSessionData(props)" :class="checkActive(props.row.name) == 'new' ? 'newSes': ''" style="padding:3px" :style="currentId===props.row.name? 'background:#009688;color:white;':''">
          <svg ><use :href="icon + props.row.stage[1]" /></svg>
        </q-td>
      </template>

      <template #body-cell-status="props">
        <q-td key="status" :props="props" @click="loadSessionData(props)" :class="checkActive(props.row.name) == 'new' ? 'newSes': ''" style="padding:3px" :style="currentId===props.row.name? 'background:#009688;color:white;':''">
          <svg><use :href="icon + props.row.status" /></svg>
        </q-td>
      </template>

      <template #body-cell-patientId="props">
        <q-td key="patientId" :props="props" clickable @click="loadSessionData(props)" :class="checkActive(props.row.name) == 'new' ? 'newSes': ''" :style="currentId===props.row.name? 'background:#009688;color:white;':''">{{props.row.name}}
        </q-td>
      </template>

      <template #body-cell-serial="props">
        <q-td key="serial" :props="props" clickable @click="loadSessionData(props)" :class="checkActive(props.row.name) == 'new' ? 'newSes': ''" :style="currentId===props.row.name? 'background:#009688;color:white;':''">{{props.row.serial}}
        </q-td>
      </template>

      <template #body-cell-date="props">
        <q-td key="date" :props="props" clickable @click="loadSessionData(props)" :class="checkActive(props.row.name) == 'new' ? 'newSes': ''" :style="currentId===props.row.name? 'background:#009688;color:white;':''">{{getDate(props.row.date)}}
        </q-td>
      </template>

      <template #body-cell-startTime="props">
        <q-td key="startTime" :props="props" clickable @click="loadSessionData(props)" :class="checkActive(props.row.name) == 'new' ? 'newSes': ''" :style="currentId===props.row.name? 'background:#009688;color:white;':''">{{props.row.startTime}}
        </q-td>
      </template>

      <template #body-cell-LocationW="props">
        <q-td key="LocationW" :props="props" clickable @click="loadSessionData(props)" :class="checkActive(props.row.name) == 'new' ? 'newSes': ''" :style="currentId===props.row.name? 'background:#009688;color:white;':''">{{props.row.LocationW}}
        </q-td>
      </template>

      <template #body-cell-LocationR="props">
        <q-td key="LocationR" :props="props" @click="loadSessionData(props)" :class="checkActive(props.row.name) == 'new' ? 'newSes': ''" :style="currentId===props.row.name? 'background:#009688;color:white;':''">{{props.row.LocationR}}
        </q-td>
      </template>

      <template #body-cell-LocationB="props">
        <q-td key="LocationB" :props="props" @click="loadSessionData(props)" :class="checkActive(props.row.name) == 'new' ? 'newSes': ''" :style="currentId===props.row.name? 'background:#009688;color:white;':''">{{props.row.LocationB}}
        </q-td>
      </template>
    
      <template v-slot:top-left>
        <div style="margin:-40px 0;">
          <h6 style="color: var(--text);font-weight: 500;"> Sessions info <q-icon name="info"/></h6>
        </div>
      </template>

      <template #no-data>
        <q-chip>
          Session list is empty..
        </q-chip>
      </template>
    </q-table>
  </q-dialog>

</template>

<script>
import { ref } from 'vue'
import { mapGetters, mapState } from 'vuex'
import api, { getUrlWithToken } from '../../services/api.js';

export default {
  name: 'SessionList',
  props: {
    msg: String
  },

  components:{},

  setup () {
    const loading = ref(false)
    
    return {
      model: ref(null),
      loading,
      miniState: ref(true),
      filterSelected: ref(null),
      value: ref(true),
      filterStage: ref(['Configuration', 'Calibrating', 'Monitoring']),
      filterStatus: ref(['0', '3' , '2', '1', '']),
      filterMonitor: ref(['offline','online']),
      // filterWards: ref([]),
    }
  },  

  data(){ 
    return{
      segments: [],
      startDate: new Date(),
      hideWards: {},
      newSes : false,
      wardList: [],
      showPanel: true,
      activeSes: String,
      rotate: false,
      showInfo : false,
      icon: require('../../assets/img/i.svg') + '#',
      filWardsData: [''],
    }
  },

  mounted: function(){
    this.$store.dispatch('sessions/loadPatients');
  },

  computed: {
    ...mapGetters({'currentSession': 'sessions/current'}),
    ...mapState('sessions', ['currentId', 'newSessionId','fullSettings']),
    ...mapState('manage', ['patients', 'polys']),
    ...mapState('locations', ['wards']),
    ...mapState('env', ['clock']),
    ind(){return this.$store.state.sessions.current?.ind || {}; },
    sessionList() { return this.$store.state.sessions.all; },
    rows() { return this.clock === 0 ? [] : this.sessionList?.map(this.filterCondition).filter(s => s) ?? []; },
    goodAsDead() { return this.clock.valueOf() / 1000 - 15; },
    classObject(id) { return {active: this.currentId == id} },
    currentId() { return this.$store.state.sessions.currentId; },
    newSessionId() { return this.$store.state.sessions.newSessionId; },
    wardsNames(){
      var lst = [''];
      if(this.wards) {
        for (var w in this.wards){
          lst.push(this.wards[w].name);
        }
      }
      return lst;
    },
    filterWards:{
      get: function(){
        return this.$data.filWardsData.length > 1 ? this.$data.filWardsData : this.wardsNames;
      },
      set: function(value){
        this.$data.filWardsData = value;
      },
      
    },
  },  
  watch:{
    sessionList(){
      var i,ward;
      for (i in this.sessionList){
        if (!this.sessionList[i].location) continue;
        ward = this.sessionList[i].location.ward;
        if (!this.wardList.includes(ward)){
          this.wardList.push(ward);
        }
      }
      
    },

    filterStage(){ 
      if(this.filterStage?.includes('Finished')) {
        this.$store.dispatch('sessions/loadFinished');
      }
      else{ 
        this.$store.dispatch('sessions/loadAll');
      }
    },

    filterStatus(){
      this.$store.dispatch('sessions/loadAll');
    },

    filterMonitor(){
      this.$store.dispatch('sessions/loadAll');
    },

    filterWards(){
      this.$store.dispatch('sessions/loadAll');
    },

    currentSession: { immediate: true, handler: 'loadRecordings' },

  },

  methods:{
    filterCondition(ses) {
      const stage = this.stageString(ses);
      const status = this.shouldBeRecording(ses) ?
          this.isRecording(ses) ? ses.maxAlert : '1':  '';
      const sr = this.shouldBeRecording(ses), monitor = sr && this.isRecording(ses);
      const online = monitor ? 'online' : 'offline';
      const ward = ses.location?.ward ? ses.location.ward : '';
      if (this.filterStage.includes(stage) && this.filterStatus.includes(status.toString()) && this.filterMonitor.includes(online) && this.filterWards.includes(ward)) { 
        return {
          name: ses.id,
          stage: this.statusToString(ses.status),
          status: this.levelIcon(ses),
          patientId: ses.id,
          serial: this.getPatSettings(ses),
          date: new Date(ses.created * 1000),
          startTime: ses.activeSubSession? this.startDate.toLocaleString() : null,
          LocationW: ses.location?.ward ?? '' ,
          LocationR: ses.location?.room ?? '',
          LocationB: ses.location?.bed ?? '',
        }
      }
      return null;
    },

    getDate(date){
      if(!date){ return '';}
      var now = new Date();
      return now - date < 72_000_000 ? date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) :
              now - date < 28_927_206_000 ? 
                date.toLocaleString(undefined, {month: "numeric", day: "numeric"}) : date.getFullYear();
    },

    sortDate(a,b){
      return new Date(b.date) - new Date(a.date);
    },

    sortStage(a,b){
      return this.stageToNum(a[0])-this.stageToNum(b[0]);
    },

    sortStatus(a,b){
      return this.statusToNum(this.levelIcon(a)) - this.statusToNum(this.levelIcon(b));
    },

    getPatSettings(ses){
      if(this.fullSettings.length == 0 ) return;
      var patSes = this.fullSettings.find(s => s.id === ses.id);
      if(patSes && patSes.patient) var pat =  this.patients.find(p => p.id === patSes.patient.$oid);
      if (pat) return pat.serial;
    },

    async loadRecordings() {
      if(! this.sessionList[this.currentId]?.activeSubSession) return;
      const res = await api('session/recordings/' + this.currentId) || [];
      this.startDate = new Date();
      for (const seg of res.data) {
        if(seg.ended) continue;
        seg.startDate = new Date(seg.first * 1000);
        if (this.startDate > seg.startDate) this.startDate = seg.startDate;
      }
    },

    checkActive(id){
      if(this.newSessionId === id){
        return 'new';
      }
      if(this.currentId == id){
        return 'active';
      }
      return '';
    },

    getWards(){
      var i,ward;
      for (i in this.sessionList){
        ward = this.sessionList[i].location?.ward;
        if (!this.wardList.includes(ward)){
          this.wardList.push(ward);
        }
      }
    },

    statusToNum(status){
      switch(status){
        case 'Alert': return 4;
        case 'Warning': return 3;
        case 'Monitoring': return 2;
        case 'Wait': return 1;
        default: return 0;
      }
    },

    statusToString(num){
      var stageStatus = "Unknown";
      switch (num) {
        case 10: stageStatus = "Configuration"; break;
        case 20: stageStatus = "Calibrating"; break;
        case 30: stageStatus = "Monitoring"; break;
        case 99: stageStatus = "Finished"; break;
      }
      return [stageStatus, 'stage' + stageStatus]
    },

    stageToNum(stage){
      switch(stage){
        case 'Configuration': return 10;
        case 'Calibrating': return 20;
        case 'Monitoring': return 30;
        case 'Finished': return 40;
        default: return 1;
      }
    },

    stageString({status}) {
      switch (status) {
        case 10: return "Configuration";
        case 20: return "Calibrating";
        case 30: return "Monitoring";
        case 99: return "Finished";
      }
      return null;
    },

    shouldBeRecording(ses) {
      if(!ses?.activeSubSession) { return false;}
      return ses?.activeSubSession && (ses.status == 20 || ses.status == 30);
    },

    isRecording(ses) { return this.goodAsDead < (ses.last ?? 0); },

    levelIcon(ses) {
      // ses = this.sessionList.find(s=>s.id === ses.row.name);
      return this.shouldBeRecording(ses) ?
          this.isRecording(ses) ? 'alertLevel' + ses.maxAlert : 'alertNotRecording':
          '';
    },

    updateWardPanel(){
      var wards = Object.keys(this.hideWards);
      var collator = new Intl.Collator();
      wards.sort(collator.compare);
    },

    updateSession(ses) {
      var id = ses._id ? ses._id.$oid : ses.id;
      var ob = this.sessionData[id];
      if (ob) Object.assign(ob, ses);
      else this.sessionList.unshift(this.sessionData[id] = ob = ses);
      if (!ses.activeSubSession) delete ob.activeSubSession;
      return ob;
    },

    loadSessionData(s){
      var id = this.activeSes = s.row.name;
      s.row.style = '#fff';
      this.$store.dispatch('sessions/loadCurrent', { id });
      this.$store.dispatch('sessions/loadCurrentSettings', { id });
      var st = this.statusToString(this.currentSession.status);

      var name = 'Sessions';
      if (st[0])
        name = 'tab' + st[0];
      this.$router.push({ name, params: { id: id } });
      
      this.$store.dispatch('sessions/loadActivePolys', {id});
      this.$store.dispatch('sessions/loadTakenPatients', {id});

    },

    async newSession() {
      await this.$store.dispatch('sessions/newSession');
      this.newSes = true;
      // this.rows.push({
      //     name: this.newSessionId,
      //     stage: this.statusToString(10),
      //     status: '',
      //     date: new Date(),
      //     LocationW: '' ,
      //     LocationR: '',
      //     LocationB: '',
      //     });
      
      var name = 'tabConfiguration';
      var id = this.activeSes = this.newSessionId; 
      this.$router.push({ name, params: {id: id} });
      this.$store.dispatch('sessions/loadTakenPatients', {id});
      this.$store.dispatch('sessions/loadActivePolys', {id});
      this.$store.dispatch('manage/loadPolys'); 
    },

    showClose() {
      this.$store.dispatch('sessions/loadFinished');
    },

  }
}
</script>

<style scoped>
h3 {
  font-size:1rem;
}

.q-item__label {
  font-weight: 400;
  font-size: small;
}

.q-item svg{
  width: 1.2em;
  height: 1.2em;
  vertical-align: text-top;
  margin-right: 5px;
}

input{
  border: 1px solid gray;
  border-radius: .5ex;
  box-shadow: 0 0 0 1px #fff;
  height: auto !important;
  padding: 1ex;
  transition: box-shadow 0.3s;
  width: auto !important;
  font-size: 100%;
  margin-right: 7px;
}

.session-list {
  background: #e4f8f8;
  padding:0.5em 5px;
  background: var(--bg-1);
  overflow: auto;
  /* grid-column: 1; */
  resize: horizontal;
  top: 50px !important;
}

.session-list .button,.del-button{
  display:inline-block;
  font-size: 1.2rem;
  cursor: pointer;
  border: 1px solid rgb(255 255 255);
}

.session-list svg {
  width: 1.2em;
  height: 1.2em;
}

.session-list td:is(.recStatus, .stage) {
  width: 2.8em;
  text-align: center;
}

.q-table tbody td {
  cursor: pointer;
}

.q-table th {
  font-weight: bold;
  font-size: 0.9rem;
  padding-left: 16px;
}

.q-table thead, .q-table tr, .q-table th, .q-table td {
  border-color: rgba(0, 0, 0, 0.12);
  /* font-weight: revert; */
}

.q-table__title {
  font-weight: 700;
  color: var(--bg-4);
}

.add_filter{
  /* margin-bottom:20px; */
  font-size: 1rem;
  position: absolute;
  right: 7%;
  top: 60%;
}

@keyframes anime {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

aside{
  left: auto !important;
}

.active{
  background:var(--q-secondary);
  color:white;
  font-weight: 600;
}

.newSes {
  background: yellow;
  animation: myfirst 13s 1;
}

@keyframes myfirst
{
    0%      {background:#8b91e0;}
    35%     {background:#fcc01e;}
    50%     {background:#f2baa0;}
    75%     {background:rgb(15, 155, 97);}
    100%    {background:#009688;}
}

</style>
