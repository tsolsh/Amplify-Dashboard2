<template>

  <q-header v-show="visible" elevated class="q-header bg-primary">
    <div @mouseover="hover=true" @mouseout="hover=false" class="page-title">
      <router-link to="/session" id="Head_Img">
      <img src="../../assets/img/raphael.png" alt="" width="84" height="38"/>
      </router-link>
      <div><b translate="no" class="notranslate">RAPHAEL </b>  Session Manager</div>
      <q-badge align="bottom" v-show="true" class="version" style="height: fit-content;">version: {{version}}</q-badge>
    </div>

    <!-- <div v-show="showDate && user" class="user_info session-details">
      <span v-for="v, k in patientLabel" :key="k">
        <span>{{k}} </span>
        <b>{{v}} </b>
      </span>
      <span>started at 
        <b><q-icon name="pending_actions"/> {{createdTime}}</b>
      </span>
      
      <q-tooltip class="bg-amber-9 text-body2" :offset="[10, 10]">
        🕑{{createdDate}}
      </q-tooltip>
    </div> -->

    <h6 v-show="header_name!='' && user" class="manager_header" id="headerName"><q-icon :name="header_icon"/>&nbsp;{{header_name}}</h6>

    <div style="flex:1;"/>
    <template v-if="user">
      <div id="userBox">
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
    </template>
    <div v-else style="display: flex; flex-direction: column;">
      <div><q-icon name="account_circle"/> Hello, Guest</div>
      <q-btn @click="open_login" label="Login" id="head_logout1" icon="login" size="12px" flat dense no-caps></q-btn>
    </div>
   
    <router-link to="/session" id="head_img2">
      <svg class="as-logo" width="100" height="33"><use href="../../assets/img/i.svg#ATLASenseBioMed"></use></svg>     
    </router-link>
  </q-header>
</template>


<script>
import { mapState, mapGetters } from 'vuex'
import config from '../../../public/config.json';

export default {
  name: 'Header',
  data() {
    return {
      createdTime: '',
      createdDate: '',
      showDate: false,
      permitted: false,
      version: "0.0.0",
      hover: false,
      header_name: '',
      header_icon: '',
      userBtn: false,
    }
  },

  computed: {
    ...mapState('auth', ['user']),
    ...mapState('layout', ['visible']),
    ...mapState('sessions', ['settings']),
    ...mapGetters({
      currentSession: 'sessions/current',
      userName: 'auth/userName',
    }),
    location() { return this.currentSession?.location ?? {}; },
    patients(){
      return this.$store.state.manage.patients;
    },
    patient() {
      return this.patients?.find(p => p.id === this.settings?.patient?.$oid);
    },
    patientLabel() { return {patient: this.patient?.serial, ...this.location}; },
  },

  mounted:function(){  
    this.version = config.version;
    return;
  },

  watch:{
     $route: {
      immediate: true,
      handler() {
        if(this.$route.path == '/') { this.header_name ='';}
        else{
          this.header_name = this.$route.path.split('/')[1];
          this.header_name = this.header_name.charAt(0).toUpperCase() + this.header_name.slice(1);
          switch(this.header_name){
            case 'Patients': this.header_icon = 'badge'; break;
            case 'Gateways': this.header_icon = 'call_split';break;
            case 'Users': this.header_icon = 'account_circle';break;
            case 'Locations': this.header_icon = 'room_preferences';break;
            case 'Polymonitors': this.header_icon = 'hub';break;
            case 'Session':  this.header_name = ''; this.header_icon = '';break;
          }
        }
      },
    },
    currentSession() {
      if (this.currentSession) {
        var created_time = new Date(this.currentSession.created * 1000);
        var now = new Date();
        this.createdTime = now - created_time < 72000000 ? created_time.toLocaleTimeString() : created_time.toLocaleDateString();
        this.createdDate = created_time.toLocaleString();
        this.showDate = true;
      } else {
        this.showDate = false;
      }
    },
  },

  methods: {
    logout() { 
      this.$store.dispatch('auth/logout');
      this.$store.commit('layout/setLogin', false);
    },
    open_login(){
      this.$store.commit('layout/setLogin', true);
    }
  },
}
</script>

<style scoped>
header {
  color: var(--fg-alt);
  display: flex;
  /* grid-area: head; */
  /* height:65px; */
  background-color: getPaletteColor('primary') !important;
}

header > * {
  align-self: center;
  margin: .2em .5em;
}

.page-title {
  display: flex;
  font-size: 1em;
  align-items: flex-end;
}
  .page-title div {
    flex-flow: column;
  }
  .page-title b {
    display: block;
    letter-spacing: .1em;
  }

.icons {
  display: initial;
  flex-direction: row;
  font-size: 1.7em;
  padding-right: 1em;
}

.session-details {
  display: flex;
  gap: 1em;
  text-align-last: center;
}

.session-details > span > b {
  display: block;
  text-align: right;
  color: #c4efef;
}

.show_date {
  text-decoration: dotted rgb(255 255 255 / .5);
}

.version{
  place-self: flex-end;
  margin-bottom: 2px;
}

.show_date:hover .toolTip {
  display: block;
}

#head_logout{
  color:white;
  font-size: small;
  background: var(--q-accent);
}

.manager_header{
  font-weight: bolder;
  font-size: 2.4em;
  text-shadow: 1px 1px 20px rgb(19 63 63);
  color: white;
  left: 50%;
  right: 50%;
  position: fixed;
  display: flex;
  align-items: flex-end;
}
</style>
