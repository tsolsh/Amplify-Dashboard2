<template>
<div class="manage_all">
  <div class="user_content">

    <div v-if="currPoly.name && saveBtn != 'Add'">
      <div class="table_details_header">
        <h3 style="color:var(--bg-4);">PolyMonitor {{currPoly?.name.includes('-') ? currPoly?.name.split('-')[1]: currPoly?.name}}<q-icon name="hub" color="secondary"/></h3>
        <div>
          <q-btn clickable :disable="!currPoly"
            class="q-my-sm" id="edit_select" 
            @click.prevent="editPoly(currPoly)"
            dense size="15px" flat
            :icon="'edit'" style="color:var(--action);">
          </q-btn>
          <q-btn 
            class="q-my-sm" id="edit_select" 
            @click.prevent="" 
            :disabled="true"
            dense size="15px" flat
            icon="delete" style="color:var(--action);margin-left:10px;">
          </q-btn>
        </div>
      </div>

      <table v-if="currPoly" class="q-mt-md">
        <tr><th>Name:</th><td>{{currPoly?.name.includes('-') ? currPoly.name.split('-')[1]: currPoly?.name}}</td></tr>
        <tr><th>Model:</th><td>{{currPoly?.name.split('-')[1]? currPoly?.name.split('-')[0]: 'A4'}}</td></tr>
        <tr><th>Version:</th><td>{{currPoly?.type}}</td></tr>
        <tr><th>MAC Address:&nbsp;</th><td>{{currPoly?.mac}}</td></tr>
        <tr>
          <th>Session:</th>
          <td v-if="currPoly?.sessionId?.$oid">
            <router-link :to="{ name: 'tabConfiguration', params: { id: currPoly?.sessionId.$oid } }">In session</router-link>.
          </td>
          <td v-else>
            Not in session.
          </td>
        </tr>
        <tr v-if="currPoly.signal">
          <th>Signal:</th>
          <td>
            <table border="1">
              <thead>
                <th>Gateway</th>
                <th>RSSI</th>
                <th>Time</th>
              </thead>
              <tr v-for="(v, k) in currPoly.signal" :key="k">
                <td><router-link :to="{ name: 'mngGateways', query: {id: k} }">{{gw(k)}}</router-link></td>
                <td>{{v.rssi}} dB</td>
                <td>{{showTime(v.ts)}}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><th>Added:</th><td>{{showTime(currPoly.ts)}}</td></tr>
        <tr><th>Temperature &nbsp;Calibration parameters:&nbsp;</th><td>Skin {{currPoly.cf_skin}}, Ambient {{currPoly.cf_ambient}}</td></tr>
        <tr>
          <th>&nbsp;</th>
        </tr>
      </table>   
    </div>

    <!-- Edit/ ADD PolyMonitor -->
    <q-dialog v-model="popUp_edit">
      <q-card class="add_input" id="edit_pat_form" @input="saveChanges($event)" style="background:var(--bg);grid-column: 1;font-size: large;">
        <q-card-section class="dialog_title row items-center q-pb-none shadow-9">
          <h3 class="dialog_title q-ma-sm">{{saveBtn}} PolyMonitor {{saveBtn=='Edit'? currPoly?.name: ''}}</h3>
          <!-- <q-btn icon="close" color="black" flat round dense v-close-popup @click.prevent="cancleBtn()" /> -->
        </q-card-section>
        <q-card-section class="editor q-pa-md q-pb-xl">
          <table class="editTable" style="margin-bottom: 35px;">
            <tr><th>Name:</th>
            <td>
              <q-input v-model="fields.name" name="name" :placeholder="saveBtn=='Edit' ? currPoly?.name? currPoly.name: '':''" :class="{problem: problems.name}" bg-color="brown-1" filled dense />
              <span class="required">{{problems.name}}</span>
            </td></tr>
            <tr><th>MAC Address:&nbsp;</th>
            <td> 
              <q-input v-model="fields.mac" name="mac" :placeholder="currPoly?.mac? currPoly.mac: ''" :class="{problem: problems.mac}" bg-color="brown-1" filled dense />
              <span class="required">{{problems.mac}}</span>
            </td></tr>
            <tr><th>Version:&nbsp;</th><td> 
              <q-select standout="bg-secondary text-white" :dark="colourScheme=='darkScheme'" v-model="fields.type" :options="['V1','V1.4']" :class="{problem: problems.type}" stack-label filled dense style="color: var(--text);background: var(--bg-1);">
                  <template v-slot:selected>
                    <template v-if="fields?.type" class="text-red">
                      {{ fields.type }}
                    </template>
                    <template v-else>
                      (Select 👇)
                    </template>
                    </template>
                </q-select>
                <span class="required">{{problems.type}}</span>
                </td>
            </tr>
            <tr><th colspan="2" style="padding-top: 20px;">Temperature Calibration parameters:</th></tr>
            <tr>
              <th><label for="Polys_CFSkin">Skin:</label></th>
              <td>
                <q-input id="Polys_CFSkin" type="number" min="-2" max="2" step=".01" v-model.number="fields.cf_skin" :class="{problem: problems.cf_skin}" bg-color="brown-1" filled dense style="width: fit-content"/>°C
                <!-- <span class="required">{{problems.cf_skin}}</span>   -->
              </td>
            </tr>
            <tr>
              <th><label for="Polys_CFAmbient">Ambient:</label></th>
              <td>
                <q-input id="Polys_CFAmbient" type="number" min="-2" max="2" step=".01" v-model.number="fields.cf_ambient" :class="{problem: problems.cf_ambient}" bg-color="brown-1" filled dense style="width: fit-content"/>°C
                <!-- <span class="required">{{problems.cf_ambient}}</span>   -->
              </td>
            </tr>
          </table>

          <form id="edit_form" style="margin-top:30px;">
            <div class="update_loc">
              <q-btn label="Save" type="submit" id="Polys_saveNewPat" @click.prevent="addNewPoly()" text-color="white" color="accent" dense no-caps/>
              <q-btn label="Cancel" type="submit" id="Polys_Cancel" class="cancelBtn1" @click.prevent="cancleBtn()" color="white" text-color="accent" dense flat no-caps/>
            </div>
          </form>  
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Warning - PolyMonitor is taken -->
    <q-dialog v-model="warning">
      <q-card class="bg-deep-orange-9 text-white" style="height: 150px;">
        <q-card-section class="row items-center q-pb-none bg-deep-orange-9">
          <div class="text-h6"></div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click.prevent="cancleBtn()"/>
        </q-card-section>

        <q-card-section class="text-h5 bg-deep-orange-9">
            This Polymonitor is already in use <q-icon name="new_releases"></q-icon>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Saved successfully :) -->
    <q-dialog v-model="popUp">
      <q-card class="bg-primary text-white" style="height: 150px;">
        <q-card-section class="row items-center q-pb-none bg-primary">
          <div class="text-h6"></div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="text-h6 bg-primary">
          PolyMonitor {{fields['name']}} {{saveBtn == 'Edit'? 'Saved': 'Added'}} successfully <q-icon name="verified"></q-icon>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>

<!-- <div id="userManager"> -->
  <div id="polyTable" >
    <!--  class="q-ml-md q-mr-xl shadow-9" -->
    <div style="max-width: 350px" class="shadow-9">
      <q-toolbar style="color: var(--text-primary);box-shadow: 0 3px 5px -6px rgb(0 0 0);">
        <q-toolbar-title style="font-size:large;font-weight:600;display: flex;justify-content: space-around;">PolyMonitors</q-toolbar-title>
        <q-btn clickable
          class="add_ses_table2 bg-accent text-white q-my-sm"
          @click="addPolyBtn()" 
          round dense size="11px" 
          id="Users_addPatBtn" :icon="'add'" style="display:flex;justify-content: center;align-items: center;margin-right: 8px;">
          <q-tooltip class="bg-secondary text-white" anchor="top middle" self="bottom middle">
            Add PolyMonitor
          </q-tooltip>
        </q-btn>
        <q-btn icon="search" flat dense @click="search = !search" v-show="!search" style="color:var(--action);">
          <q-tooltip class="bg-secondary text-black" anchor="top middle" self="bottom middle">
            search
          </q-tooltip>
        </q-btn>
      </q-toolbar>
      
      <q-toolbar v-show="search" class="bg-white text-black rounded-borders">
        <q-input filled dense standout v-model="search_text" input-class="text-right" class="q-ml-md shadow-4" style="width: 100%;display: flex;">
          <template v-slot:append>
            <q-icon v-if="search_text === ''" name="search" color="secondary" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="clearSearch()" color="secondary" />
          </template>
        </q-input>
      </q-toolbar>

      <q-list bordered>
        <q-item v-for="pm in filteredPolys" :key="pm.id" class="q-my-sm" clickable @click="showContent(pm)" v-ripple :active="currentId==pm?.id" active-class="active" style="font-size:medium">
          <q-item-section avatar center
            :id="'Polys_polyName_'+pm.name">
            <q-icon name="hub" size="20px" color="secondary"/>
            {{ pm.name.includes('-') ? pm.name.split('-')[1]: pm.name }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>

<!-- </div> -->
</div>
</template>

<script>
import { mapState } from 'vuex'
import { ref } from 'vue'

export default {
  name: 'Polymonitors',
  components: {},

  setup () {
    const loading = ref(false)
    const search_text = ref('')

    return {
      loading,
      search_text,
    }
  },

  data(){
    return{
      clicked: String,
      content: [],
      disable: false,
      fields: {},
      warning: false,
      saveBtn: 'Edit',
      poly_name: null,
      poly_mac: null,
      pop: false,
      popUp: false,
      popUp_edit:false,
      search: false,
      currentId: null,
      currPoly: {
        name: null,
        type: null,
        mac: null,
        ts: null,
        cf_skin: null,
        cf_ambient: false,
        sessionId: null,
        signal: null,
      },
      problems: {
        name: null,
        type: null,
        mac: null,
        ts: null,
        cf_skin: null,
        cf_ambient: false,
      },
    }
  },

  computed:{
    ...mapState('manage', ['gateways', 'currPolys']),
    ...mapState('layout', ['colourScheme']),
    // current() { return this.currPolys?.find(pm => pm.id === this.currentId); },
    filteredPolys() { 
      if(this.search){ 
        return this.currPolys.filter(item => {
          var name = item.name?.toString() ?? '';
          return this.search_text
            .toLowerCase()
            .split(" ")
            .every(v => name.toLowerCase().includes(v));
        }); 
      }
      return this.currPolys;
    },
    activePoly(){ return this.$store.state.manage.currentPoly?.name; },
    activate(){ return this.switched? 'activate':'inactivate'; }
  },

  watch:{
    $route: {
      immediate: true,
      async handler() {
        this.currentId = this.$route.params.pm_id;
        this.copyPolys();
        this.noProblems();
      },
    },
    
    currPolys: 'copyPolys',
    'currPoly.name'() { this.problems.name = null; },
    'currPoly.type'() { this.problems.type = null; },
    'currPoly.mac'() { this.problems.mac = null; },
    'currPoly.ts'() { this.problems.ts = null; },
    'currPoly.cf_skin'() { this.problems.cf_skin = null; },
    'currPoly.cf_ambient'() { this.problems.cf_ambient = null; },

    search_text(){ 
      if(this.search_text == '') this.clearSearch();
    }
  },

  mounted: function(){
    this.$store.dispatch('manage/loadCurrPolys');
    // this.$store.dispatch('manage/loadBackupPolys');
  },

  methods:{
    gw(id) { return this.gateways?.find(gw => gw._id === id)?.name ?? id; },

    showTime(t) { if (t) return new Date(1000 * t).toLocaleString(); return '-'; },

    showContent(poly){
      this.clicked = '';
      this.content = [];
      // this.$store.dispatch('manage/loadCurrentPoly', { poly });
      var name = 'mngPolyMonitors';
      var p = poly.name;
      this.$router.push({ name, params: { pm_id: poly.id } });
    },

    copyPolys() {
      const pat = this.filteredPolys.find(p => p.id === this.currentId);
      var key;
      if (!pat) {
        for (key in this.currPoly) this.currPoly[key] = null;
        return;
      }
      for (key in this.currPoly) this.currPoly[key] = pat[key];
      // if (!pat.createdBy && pat['created by']) pat.createdBy = pat['created by']; // TODO: temporary fix
    },

    noProblems() {
      for (let key in this.problems) this.problems[key] = null;
    },

    clearSearch(){
      this.search_text = '';
      this.$store.dispatch('manage/loadCurrPolys');
    },

    saveChanges(e){
      const el = e.target;
      if(el.value!="") {
          this.fields[el.name] = el.value
      }
      this.disable = true;
    },

    async addNewPoly(){
      for(var i in this.polys){
        if(this.polys[i] == null) { continue; }
        if(this.fields['name'] == this.polys[i].name || this.fields['mac'] == this.polys[i].mac){
          this.warning = true;
          return;
        }
        else{
          this.warning = false;
        }
      }

      if (this.saveBtn == 'Edit'){
        for(var p in this.current){
          if(!(p in this.fields)) { this.fields[p] = this.current[p]; }
        }
      }
      if (!this.fields['name']) this.problems.name = 'Required'; else this.problems.name = null;
      if (!this.fields['type']) this.problems.type = 'Required'; else this.problems.type = null;
      if (!this.fields['mac']) this.problems.mac = 'Required'; else this.problems.mac = null;
      if (!this.fields['ts']) this.problems.ts = 'Required'; else this.problems.ts = null;
      // if (!this.fields['cf_skin']) this.problems.cf_skin = 'Required'; else this.problems.cf_skin = null;
      // if (!this.fields['cf_ambient']) this.problems.cf_ambient = 'Required'; else this.problems.cf_ambient = null;
      
      if (Object.values(this.problems).filter(v => v).length === 0) {
        if (this.saveBtn == 'Edit'){
          this.fields['id'] = this.current.id;
          for(var f in this.fields){ 
            this.current[f] = this.fields[f];
          }
        }
        else this.fields['id'] = '';

        var fields = this.fields;
        if (this.saveBtn == 'Edit') await this.$store.dispatch('manage/editPoly', {fields});
        else await this.$store.dispatch('manage/addPoly', {fields});
        this.disable = false;
        this.popUp = true;
        this.cancleBtn();
      }
    },

    addPolyBtn(){
      this.clicked = 'edit_pat'; this.saveBtn = 'Add';
      this.fields = {};
      if(this.current){
        Object.assign(this.currPoly, {name: null, type: null, mac: null, ts: null, cf_skin: null, cf_ambient: null})
      }
      this.popUp_edit = true; 
    },

    editPoly({id, name, mac,type, cf_skin, cf_ambient}){
      this.clicked = 'edit_pat'; this.saveBtn = 'Edit';
      this.fields = {id, name, mac,type, cf_skin, cf_ambient};
      this.popUp_edit = true;
    },

    cancleBtn(){
      this.clicked='';
      this.disabled= this.warning = false;
      // this.currid = this.current = this.currPat = '' ;
      this.popUp_edit = false;
    },

    disPolyDetails(){
      var switchOff = !this.switched;
      for(var i in this.polys) {
          if(this.polys[i].name == this.activePoly) {
              this.polys[i]['disabled'] = switchOff;
          }
      }
      var p_name = this.activePoly;
      this.$store.dispatch('manage/disablePoly',{p_name,switchOff});
    },

    checkSwitch(){
      for(var i in this.polys) {
        if(this.polys[i].name == this.activePoly) {
          return !this.polys[i]['disabled'];
        }
      }
    },
  }

}
</script>

<style scoped>

div.user_content {
  justify-content: space-between;
  grid-column: 2;
  grid-row: 1;
  align-items: flex-start;
  overflow: auto auto;
  font-size: medium;
}

@media (max-width: 50em){
  div.user_content{
    grid-column: 1;
    grid-row: 2; 
    margin-left: 20px;
  }
}

.user_list{
   text-align: left;
}

.user_content >p{
  color: black;
  font-weight: 600;
  grid-column-start: 1;
  grid-column-end: 4;
}

#edit_select{
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.3em;
  font-family: fantasy;
  grid-column: 4/6;
  grid-row: 1;
}

.update_loc button{
  /* background-color: var(--q-accent);
  color: white; */
  font-size: 0.9rem;
  margin-bottom: 10px;
  margin-right: 10px;
}

.update_loc{
  display: flex;
  position: absolute;
  right: 0px;
  bottom: 0;
}

.editor{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

div#edit_pat_form {
  min-width: 20%;
  min-height: 28%;
}

.active{
  /* color: white;
  background: #5da3a7; */
  border-right: 4px solid #5da3a7;
}

table tr{
  margin-top: 25px;
  line-height: 2.5rem;
}

table td{
  /* display: inline-flex;
  align-items: flex-end; */
  margin-left: 30px;
  display: flex;
  align-items: center
}

.q-icon{
  margin-left: 10px;
  margin-right: 13px;
}

.q-item__section{
  display: flex;
  flex-direction: row;
}
</style>
