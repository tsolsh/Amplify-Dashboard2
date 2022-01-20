<template>
  <div class="nav-wizard">
    <ul>
      <li class="nav-step">
        <q-btn flat no-caps tag="button" :to="`/session/${$route.params.id}/configure`" :disable="!currentSession" id="Nav_configureTab" class="icon" :class="{'activeTab': checkActive('configure')}">
          <svg><use :href="confSvg"/></svg>
          <span>Configure</span>
        </q-btn>
      </li>
        <!-- <li :class="activeBar!=''? 'bar bar-left active':'bar bar-left'"></li> -->
      <li class="nav-step" >
        <q-btn flat no-caps tag="button" :to="`/session/${$route.params.id}/calibrate`" :disable="currentSession?.status<20 || !currentSession" id="Nav_calibrateTab" class="icon" :class="{'activeTab': checkActive('calibrate')}">
          <svg><use :href="calSvg"/></svg><span>Calibrate</span>
        </q-btn>
      </li>
        <!-- <li :class="activeBar=='both'? 'bar bar-right active':'bar bar-right'"></li> -->
      <li class="nav-step">
        <q-btn flat no-caps tag="button" :to="`/session/${$route.params.id}/monitor`" :disable="currentSession?.status!=30" id="Nav_monitorTab" class="icon" :class="{'activeTab': checkActive('monitor')}">
          <svg><use :href="monSvg"/></svg>
          <span>Monitor</span>
        </q-btn>
      </li>
    </ul>
  </div>
</template>


<script>
import svgimg from '../../assets/img/i.svg'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'NavWiz',
  components: {   
  },

  data(){
    return{
      confSvg: svgimg+'#stageConfiguration',
      calSvg: svgimg+'#stageCalibrating',
      monSvg: svgimg+'#stageMonitoring',
      disCalTab:true,
      disMonTab: true,
      active: '',
      activeBar:'',
      pop: false,
      lastLast: 0,
      pathId: null,
      ignoreTab: false,
    }
  },
  
  computed:{
    ...mapGetters({'currentSession': 'sessions/current'}),
    ...mapState('sessions', ['currentId']),
    ...mapState('manage', ['patients', 'polys', 'wards']),
    ...mapState('live', ['meta', 'last', 'lastResults']),
    ...mapState('env', ['clock']),
    ind(){return this.$store.state.sessions.current?.ind || {}; },
    sessionList() { return this.$store.state.sessions.all; },
    settings(){ return this.$store.state.sessions.settings; },
    isLive() {return this.lastLast + 9999 > this.clock.valueOf(); },
  },

  watch:{
    $route: {
      immediate: true,
      handler() {
        if(this.pathId && this.pathId == this.$route.params.id){
          this.ignoreTab = true;
        }
        else{
          this.ignoreTab = false;
          this.pathId = this.$route.params.id
        }
      },
    },

    currentSession(){
      // this.pathId = this.$route.params.id;
      if(!this.ignoreTab) {
        this.disCalTab=this.currentSession?.status<20;
        this.disMonTab= this.currentSession?.status<30;
        switch(this.currentSession?.status){
          case 10: this.active = 'configure'; this.activeBar=''; break;
          case 20: this.active = 'calibrate'; this.activeBar='left'; break;
          default:
            this.active = 'monitor'; this.activeBar='both'; break;  
        }
      }
    },
    last() { this.lastLast = this.clock.valueOf(); },
  },

  methods:{
    tabClicked(name){
      this.active = name;
      console.log('clicked');
    },

    checkActive(tab){
      var path = this.$route.path;
      path = path.split('/');
      return tab === path[path.length-1];
    },

    async archiveSession(e) {
      e.preventDefault();
      if(!this.currentSession || !this.currentId) return;
      var id = this.currentId;
      await this.$store.dispatch('sessions/archiveSession',{id});
      this.restoreConfigData(id);
    },
 
    async deleteSession() {
      if(!this.currentSession || !this.currentId) return;
      var id = this.currentId;
      await this.$store.dispatch('sessions/deleteSession',{id});
      this.pop = false;
      this.restoreConfigData(id);
    },

    restoreConfigData(id){
      var name = 'Sessions';
      this.$router.push({ name, params: {} });
      this.$store.dispatch('sessions/loadTakenPatients',{id});
      this.$store.dispatch('manage/loadPatients');
      this.$store.dispatch('sessions/loadActivePolys',{id});
      this.$store.dispatch('manage/loadPolys');
    }
  }

}
</script>

<style>
.nav-wizard {
  width: 100%;
  display:flex;
  justify-content: space-between;
  align-items:center;
}

@media (max-width: 50em){
  .nav-wizard .nav-step {
    padding: 0px 0 0 0 !important;
  }
}

.nav-wizard ul {
  padding: 0;
  display: flex;
  flex: 3;
  margin: 9px 5em 0.4rem;
  align-items: center;
}

.nav-wizard li {
  list-style: none;
  flex-grow: 4;
  text-align-last: center
}

.nav-wizard :is(.nav-delete, .nav-end) {
  text-align: center;
  flex:0;
}

.q-dialog__inner > .q-card > .q-card__actions .q-btn--rectangle {
  min-width: 0;
}

.bar {
  height: 0.30rem;
  background-color: #ccc;
  flex: 1;
  z-index: 1;
}

.bar.active {
  background-color: var(--fg-dim);
  z-index: 1;
}

.nav-wizard .icon {
  /* background: var(--q-primary); */
  /* border: 1px solid var(--q-primary); */
  width: 5.5rem;
  color: var(--text);
  height: 68px;
  text-align: center;
  z-index: 999;
  font-size: 0.8rem;
  border-radius: 0;

}

.activeTab {
  color: black !important;
  /* background-color: var(--q-primary) !important; */
  /* border-color: transparent !important; */
  border-bottom: 4px solid teal;
  transform: scale(1.3);
  font-size: 1.3rem;
  z-index:999;
    transition: height 5s;
  transition-property: size;
  transition-duration: 2s;
  transition-timing-function: linear;
  transition-delay: 1s;
}

.disable{
  border-color: grey;
  color: grey;
  cursor:not-allowed;
}

/* .disable{
  pointer-events: none;
}

.disable{
    color: grey;
    border-color: grey;
} */


/* .nav-wizard .nav-step:is(.fade, .hide) {
  color: grey;
  cursor: not-allowed;
  display: none;
} */

.icon.active > svg ,.router-link-active.icon > svg{
  filter: drop-shadow(0 0 1ex var(--bg));
}

.nav-wizard svg{
  height: 23px;
}

#Nav_archive_button{
  font-size: 0.7rem !important;
  width: 50px !important;
  height: 45px !important;
}

.end .icon{
  font-size: small !important;
  width: 50px !important;
}

.form-popup{
  width: 120px;
}

.form-container {
  max-width: 250px;
  padding: 2px;
  background-color: #ddffff;
  box-shadow: 0px 0px 7px 0px #069191bd;
}

.form-container input[type=text], .form-container input[type=password] {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  border: none;
  background: #f1f1f1;
}

.form-container input[type=text]:focus, .form-container input[type=password]:focus {
  background-color: #ddd;
  outline: none;
}

.form-container .pop_btn {
  color: white;
  border: none;
  cursor: pointer;
  margin-bottom: 10px;
  opacity: 0.8;
  margin-top: 10px;
  align-items: center !important;
}

.form-container .cancel {
  background-color: red;
}

.form-container .btn:hover, .open-button:hover {
  opacity: 1;
}

.st0{fill:none;stroke:#000000;stroke-width:15;stroke-linejoin:round;stroke-miterlimit:10;}
	.st1{fill:#FFFFFF;stroke:#000000;stroke-width:15;stroke-linejoin:round;stroke-miterlimit:10;}
	.st2{fill:#FFFFFF;stroke:#000000;stroke-width:10;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
	.st3{fill:#FFFFFF;stroke:#000000;stroke-width:15;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
	.st4{fill:none;stroke:#000000;stroke-width:15;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
	.st5{fill:none;stroke:#000000;stroke-width:10;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
	.st6{fill:#FFFFFF;stroke:#000000;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
	.st7{fill:#FFFFFF;stroke:#000000;stroke-width:10;stroke-linejoin:round;stroke-miterlimit:10;}
	.st8{fill:#FFFFFF;stroke:#000000;stroke-width:12;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
	.st9{fill:none;stroke:#000000;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
	.st10{fill:none;stroke:#000000;stroke-width:7;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
	.st11{fill:none;stroke:#000000;stroke-width:12;stroke-linejoin:round;stroke-miterlimit:10;}
	.st12{fill:#FFFFFF;stroke:#000000;stroke-width:10;stroke-miterlimit:10;}
	.st13{fill:none;stroke:#000000;stroke-width:12;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
	.st14{fill:none;stroke:#000000;stroke-width:10;stroke-linejoin:round;stroke-miterlimit:10;}
	.st15{fill:#FFFFFF;stroke:#000000;stroke-width:15;stroke-miterlimit:10;}
	.st16{fill:#FFFFFF;stroke:#000000;stroke-width:15;stroke-linecap:round;stroke-miterlimit:10;}
</style>
