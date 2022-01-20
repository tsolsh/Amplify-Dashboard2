<template>
  <q-layout view="lHh Lpr lFf" container id="layout2" class="q-pa-xl shadow-2 rounded-borders" style="height: 900px;position:relative;">
    <q-header bordered elevated style="background:var(--nav) !important;height: 88px;">
      <q-toolbar>
      <q-btn
        flat dense round icon="menu_open"
        aria-label="Menu" size="15px"
        @click="drawer = !drawer, rotate = !rotate"
        :class="rotate? 'rotate-180': ''"
        style="color:var(--text);margin-right:8px;"
      />
      <NavWiz/>
      </q-toolbar>
    </q-header>  
    <q-drawer class="session-list"
      v-model="drawer"
      bordered show-if-above
      :width="460" :mini-width="90" persistent 
      style="background:var(--bg);"
    >
      <q-scroll-area class="fit">
        <List/>
      </q-scroll-area>
    </q-drawer>

    <q-page-container style="padding-bottom: 2%;">
      <q-page padding class="q-px-xs q-pt-none">
      <div class="settings">
         
        <div class="Tabs" v-if="currentId">
          <router-view :key="$route.path"/>
        </div>
      </div>
      </q-page>
    </q-page-container>    
  </q-layout>
  
</template>

<script>
import NavWiz from './NavWiz.vue'
import List from './List.vue'
import { mapState } from 'vuex'
import { ref } from 'vue'

export default {
  name: 'Sessions',
  props: {
    msg: String
  },
  
  components: {
    NavWiz,
    List
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const loading = ref(false)
    return {
      leftDrawerOpen,
      drawer: ref(false),
    }
  },
  data(){ 
    return{ 
      rotate: false, 
    }
  },

  computed: {
    ...mapState('sessions', ['currentId', 'newSessionId']),
    get_wards: function () {
      return Object.keys(this.hideWards);
    },
    perms(){return this.$store.state.sessions.permissions }
  },

  watch:{
    $route: {
      immediate: true,
      handler() {
        const id = this.$route.params.id;
        this.$store.dispatch('sessions/loadCurrent', { id });
        this.$store.dispatch('sessions/loadCurrentSettings', { id });
      },
    },
    newSessionId() {
      if (this.newSessionId && this.newSessionId != this.currentId) {
        this.$router.push({ name: 'tabConfiguration', params: { id: this.newSessionId } });
      }
    },
  },

   mounted: function(){
    this.$store.dispatch('sessions/loadAll');
    this.$store.dispatch('sessions/loadSettings');
    this.$store.dispatch('sessions/loadPatients');
    // this.$store.dispatch('manage/loadPatients');
    this.$store.dispatch('manage/loadPolys');
    this.$store.dispatch('locations/loadActiveWards');
    this.$store.dispatch('sessions/start');
  },

  unmounted: function() { this.$store.dispatch('sessions/stop'); },
}
</script>

<style scoped>
.row {
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
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
}

.settings {
  /* overflow: hidden scroll; */
  height: fit-content;
  position: relative;
}

  .settings > div {
    border-top: none;
    /* overflow: scroll; */
    /* bottom: 236px; */
    /* top: 20px; */
    position: relative;
    /* margin-top: 170px; */
    padding-bottom: 210px;
  }

.del-button{
  left:0;
  position: absolute;
  top: 14%;
}

.side_panel_dots {
  position: fixed;
  top: 10rem;
  left: 75px;
  overflow: auto;
  background: #84e08b;
  border: thin solid #909090;
  box-shadow: 0 0 20px rgb(0 0 0 / 50%);
  padding:.5em;
  z-index:3;
}

.side_panel_dots2 {
  position: fixed;
  top: 10rem;
  left: 160px;
  background: #84e08b;
  border: thin solid #909090;
  box-shadow: 0 0 20px rgb(0 0 0 / 50%);
  padding:.7em;
  z-index:3;
}

#st-dot, #loc-dot{
  font-size: large;
  cursor: pointer;
}

.q-field--dense .q-field__label {
  font-size: 14px;
  font-weight: 800;
  top: 10px;
}

.Tabs{
  margin-top: 30px;
  position: relative;
}
</style>
