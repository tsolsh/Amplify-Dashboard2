<template>

 <div class="manage_all">
    <div class="user_content">
      <div class="table_details_header">
        <h3 v-if="currPat.serial" style="color:var(--bg-4);">Patient {{currPat?.serial}} <q-icon name="badge" color="secondary"/></h3>
        <div v-if="currPat.serial">
        <q-btn 
          class="q-my-sm" id="edit_select" 
          @click.prevent="editPatBtn()" 
          :disabled="inSession"
          dense size="15px" flat
          :icon="'edit'" style="color:var(--action);">
        </q-btn>
        <q-btn 
          class="q-my-sm" id="edit_select" 
          @click.prevent="" 
          :disabled="inSession"
          dense size="15px"  flat
          :icon="'delete'" style="color:var(--action);margin-left:10px;">
        </q-btn>
        
        <!-- <span class="text-black" anchor="top middle" self="bottom middle"> -->
          <span v-if="inSession"> Can't edit patient <router-link :to="{ name: 'tabConfiguration', params: { id: inSession.id } }" class="text-secondary">in session</router-link>
          <!-- </span> -->
        </span>
        </div>
      </div>

      <table v-if="action === 'view'" class="q-mt-md">
        <tr><th>Serial №:</th><td>{{currPat.serial}} <q-icon name=""/> </td></tr>
        <tr><th>Date of Birth:&nbsp;</th><td>{{birthday}} <q-icon name="event"/> </td></tr>
        <tr><th>Age:</th><td>{{age}} <q-icon name="event"/> </td></tr>
        <tr><th>Gender:</th><td>{{currPat.gender}} <q-icon :name="currPat.gender==='Male'? 'man':'woman'"/> </td></tr>
        <tr><th>Weight:</th><td>{{weight.toUI(currPat.weight)}} {{weight.unit}}&nbsp; <i class="las la-weight"></i> </td></tr>
        <tr><th>Height:</th><td>{{height.toUI(currPat.height)}} {{height.unit}}&nbsp; <i class="las la-ruler-vertical"></i></td></tr>
        <tr><th>Status:</th><td :style="{color: patientEnabled ? 'green' : 'red'}">{{patientEnabled ? 'Active' : 'Inactive'}} patient</td></tr>
        <tr>
        <th>&nbsp;</th>  
        </tr>
        <tr class="additional"><th>Id:</th><td>{{currid}}</td></tr>
        <tr class="additional"><th>Created by:</th><td>{{currPat.createdBy}}</td></tr>
      </table>

       <!-- Edit/ ADD patient -->
      <q-dialog v-model="popUp_edit">
        <q-card class="add_input" id="edit_pat_form" @input="saveChanges($event)" style="min-width: 26%;background:var(--bg);grid-column: 1;font-size: large;">
          <h3 class="dialog_title shadow-3">{{saveBtn}} patient {{saveBtn == 'Edit' ? currPat.serial: ''}}</h3>
          <table class="editTable q-pa-md">
            <tr><th>Serial №:</th> 
              <td>
                <q-input v-model="currPat.serial" name="serial" :placeholder="currPat?.serial? currPat.serial: ''" :class="{problem: problems.serial}" bg-color="brown-1" filled dense/>
                <span class="required">{{problems.serial}}</span>
              </td>
            </tr>
            <tr><th>Date Of Birth: </th> 
              <td>
                <q-input v-model="currPat.birthdate" name="birthdate" type="date" :placeholder="currPat?.birthdate? currPat?.birthdate: ''" :class="{problem: problems.birthdate}" bg-color="brown-1" filled dense/>
                <span class="required">{{problems.birthdate}}</span>
              </td>
            </tr>
            <tr><th>Age:</th><td colspan="2">{{age}}</td></tr>
            <tr><th>Gender: </th> 
              <td>
                <q-select @update:model-value="updateGender" standout="bg-secondary text-white" v-model="new_gender" :options="['Male','Female']" :class="{problem: problems.gender}" :dark="colourScheme=='darkScheme'" stack-label filled dense style="color: var(--text);background: var(--bg-1);">
                  <template v-slot:selected>
                    <template v-if="new_gender">
                      {{ new_gender }}
                    </template>
                    <template v-else>
                      {{currPat?.gender?? ''}}
                    </template>
                  </template>
                </q-select>
              </td>
            </tr>
            <tr><th>Weight: </th> 
              <td style="display: flex;align-items: center;">
                <q-input v-model.number="currPat.weight" type="number" name="weight" @blur="currPat.weight = weight.fromUI($event.target.value)" :min="weight.toUI(config.min_weight)" :step="weight.delta(.1)"
                  :max="weight.toUI(config.max_weight)" :class="{problem: problems.weight}" :placeholder="currPat?.weight? weight.toUI(currPat.weight): ''" id="Patients_newWeight" bg-color="brown-1" filled dense>
                </q-input>
                <span>{{weight.unit}}</span>
                <span class="required">{{problems.weight}}</span>
              </td>
            </tr>
            <tr><th>Height: </th> 
              <td style="display: flex;align-items: center;">
                <div v-if="height.unit" style="display: contents;">
                  <q-input v-model.number="new_height" type="number" name="height" @blur="currPat.height = height.fromUI($event.target.value)" :min="height.toUI(config.min_height)" :step="height.delta(.1)"
                    :max="height.toUI(config.max_height)" :class="{problem: problems.height}" :placeholder="currPat?.height? height.toUI(currPat.height): ''" id="Patients_newHeight" bg-color="brown-1" filled dense></q-input>
                  <span>{{height.unit}}</span>
                </div>
                <div v-else>
                  <q-input v-model.number="new_height" id="Patients_height" name="height" :placeholder="currPat?.height? height.toUI(currPat.height):'foot inch'" 
                  @blur="currPat.height = height.fromUI($event.target.value)" size="6" bg-color="brown-1" filled dense/>
                </div>
                  <span class="required">{{problems.height}}</span>
              </td>
            </tr>
            <tr>
              <div v-if="currid" style="display: flex;align-items: baseline;font-weight:700;">
                <!-- <label for="Patients_enabled">Active:</label> -->
                <!-- <input id="Patients_enabled" type="checkbox" v-model="patientEnabled"/> -->
                <q-toggle v-model="patientEnabled" @update:model-value="disPatDetails()" label="Active" left-label color="yellow-8" id="Patients_enabled"/>
              </div>
            </tr>
          </table>

          <form class="edit_input" id="edit_form">
            <div class="update_loc">
            <q-btn label="Save" type="submit" id="Patients_saveNewPat" @click.prevent="addNewPat()" text-color="white" color="accent" dense no-caps/>
            <q-btn label="Cancel" type="submit" id="Patients_Cancel" class="cancelBtn" @click.prevent="cancleBtn()" color="white" text-color="accent" flat dense no-caps/>
            </div>
          </form> 
        </q-card>
      </q-dialog>
        
      <!-- Warning - patient is taken -->
      <q-dialog v-model="warning">
        <q-card class="bg-deep-orange-9 text-white" style="height: 150px;">
          <q-card-section class="row items-center q-pb-none bg-deep-orange-9">
            <div class="text-h6"></div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="text-h5 bg-deep-orange-9">
              There is a patient with serial {{this.fields['serial']}} already. <q-icon name="new_releases"></q-icon>
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

          <q-card-section class="text-h5 bg-primary">
            Patient {{fields['serial']}} {{saveBtn == 'Edit'? 'Saved': 'Added'}} successfully <q-icon name="verified"></q-icon>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>

  <!-- <div id="userManager"> -->
  <div id="patientTable">
    <!--  class="q-ml-md q-mr-xl shadow-9" -->
    <div style="max-width: 350px;" class="shadow-9">
      <q-toolbar style="color: var(--text-primary);box-shadow: 0 3px 5px -6px rgb(0 0 0);">
        <q-toolbar-title style="font-size:large;font-weight:600;display: flex; justify-content: space-around;" color="white">Patients</q-toolbar-title>
        <q-btn class="add_ses_table2 bg-accent text-white q-my-sm"
          @click="addPatBtn()" clickable round dense size="11px" :icon="'add'"
          id="Patients_addPatBtn" style="display:flex;justify-content: center;align-items: center;margin-right: 8px;">
          <q-tooltip class="bg-secondary text-white" anchor="top middle" self="bottom middle">
            Add paient
          </q-tooltip>
        </q-btn>
        <q-btn icon="search" flat dense @click="search = !search" v-show="!search" style="color:var(--action);">
          <q-tooltip class="bg-secondary text-black" anchor="top middle" self="bottom middle">
            search
          </q-tooltip>
        </q-btn>
        <q-btn dense icon="filter_alt" class="add_filter" flat style="color:var(--action);">
          <q-tooltip class="bg-secondary text-black" anchor="top middle" self="bottom middle">
            filter
          </q-tooltip>

        <q-menu class="shadow-7" style="background: var(--bg);">
          <q-btn label="clear" @click="clearFilter()" outline color="grey" class="q-ma-sm" size="10px" align="right" dense />
          <q-list style="min-width: 150px;background: var(--bg);">
            <q-item clickable v-close-popup style="display: flex;align-items: center;padding-left:0px;">
              <q-item-section><q-radio v-model="filterAll" val="disabled" color="primary" size="sm" /></q-item-section>
              <q-item-section class="q-ma-none">
                  <q-item-label> Deleted Only</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup style="display: flex;align-items: center;padding-left:0px;">
              <q-item-section><q-radio v-model="filterAll" val="all" color="primary" size="sm" /></q-item-section>
              <q-item-section class="q-ma-none">
                  <q-item-label> All</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup style="display: flex;align-items: center;padding-left:0px;">
              <q-item-section><q-radio v-model="filterAll" val="session" color="primary" size="sm" /></q-item-section>
              <q-item-section class="q-ma-none">
                  <q-item-label> In Session</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      </q-toolbar>
      
       <q-toolbar v-show="search" class="bg-white text-black rounded-borders">
        <q-input filled dense standout v-model="search_text" input-class="text-right" class="q-ml-md shadow-4" style="width: 100%;display: flex;">
          <template v-slot:append>
            <q-icon v-if="search_text === ''" name="search" color="secondary"/>
            <q-icon v-else name="clear" class="cursor-pointer" @click="clearSearch()" color="secondary"/>
          </template>
        </q-input>
      </q-toolbar>
      
      <q-list bordered>
        <q-item v-for="pat in filteredPatients" :key="pat" class="q-my-sm" clickable @click.prevent="showContent(pat.id)" v-ripple :active="currid==pat?.id" active-class="active" style="font-size:medium;padding: 8px 16px;">
          <q-item-section avatar center :id="'Patients_patSerial_'+pat?.serial">
            <q-icon name="badge" size="20px" color="secondary"/>
            {{ pat?.serial? pat.serial: pat.id }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
  <!-- </div> -->

 </div>
</template>

<script>
// import font from '../../assets/fonts'
import config from '../../../public/PatientConfig.json';
import { mapGetters, mapState } from 'vuex'
import { ref } from 'vue'

export default {
  name: 'Patients',
  components: { },

  setup () {
    const loading = ref(false)
    const search_text = ref('')

    return {
      loading,
      search_text,
      filterAll: ref('all')
      // filterEnable: ref(['Active', 'Inactive', 'In Session']),
    }
  },

  data(){
    return{
      search: false,
      // filterAll: false,
      filterDisable: false,
      filterInSession: false,
      clicked: String,
      content: [],
      fields: {},
      disable: false,
      saveBtn: 'Edit',
      pop: false,
      popUp_edit:false,
      warning: false,
      config: config,
      popUp: false,
      new_gender: null,
      new_height: '',
      currid: null,
      action: null,
      problems: {
        serial: null,
        birthdate: null,
        gender: null,
        weight: null,
        height: null,
      },
      currPat: {
        serial: null,
        birthdate: null,
        gender: null,
        weight: null,
        height: null,
        disabled: false,
        createdBy: null,
      },
    }
  },

  computed:{
    ...mapGetters({'current': 'manage/current'}),
    ...mapState('env', ['height','weight']),
    ...mapState('manage', ['patients','patSessions', 'fullPatients']),
    ...mapState('layout', ['colourScheme']),
    sessions() { return this.$store.state.manage.patSessions; },
    sessionList() { return this.$store.state.sessions.all; },
    fullSettings() { return this.$store.state.sessions.fullSettings; },
    inSession() { return this.patSessions?.find(s => 10 < s.status && s.status < 99); },
    birthday() {
      const bd = this.currPat.birthdate;
      return bd ? new Date(bd).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }) : '';
    },
    age() {
      const bd = this.currPat.birthdate;
      if (!bd) return '';
      const d = new Date(Date.now() - new Date(bd));
      return (d < 2_631_600_000 ? ~~(d / 86_400_000) + ' days' : d < 63_158_400_000 ? ~~(d / 2_631_600_000) + ' months' : ((d.getUTCFullYear() - 1970) + ' years')) + ' old';
    },
    patients() { return this.$store.state.manage.patients; },
    filteredPatients(){
      if (this.search) {
        return this.patients.filter(item => {
          var serial = item.serial?.toString() ?? '';
          return this.search_text
            .toLowerCase()
            .split(" ")
            .every(v => serial.toLowerCase().includes(v));
        });
      }
      if(this.filterAll === 'all'){
        return this.fullPatients;
      }

      if(this.filterAll === 'disabled'){
        return this.fullPatients.filter(function(pat) {
          return pat.disabled === true;
        });
      }

      if(this.filterAll==='session'){
        var fullSettings = this.fullSettings; var sessionList = this.sessionList;
        return this.patients.filter(function(pat) {
          var ses = fullSettings.find(s => s.patient?.$oid === pat.id) ?? {id: null , status: 0};
          if(ses.id) ses = sessionList.find(s => ses.id === s.id)
          // console.info(ses);
          return 10 < ses.status && ses.status < 99;
        });
      }

      return this.patients;
    },

    patientEnabled: {
      get() { return !this.currPat.disabled; },
      set(v) { this.currPat.disabled = !v; },
    },
  },

  mounted: function(){
    this.$store.dispatch('manage/loadPatients');
    this.$store.dispatch('manage/loadFullPatients');
    // console.log('in mounted!')
  },

  watch:{
    $route: {
      immediate: true,
      async handler() {
        this.action = this.$route.params.action;
        const pid = this.currid = this.$route.params.p_id;
        if (pid) {
          await this.$store.dispatch('manage/patSessions',{pid});
        }
        this.copyPatient();
        this.noProblems();
      },
    },
    patients: 'copyPatient',
    'currPat.serial'() { this.problems.serial = null; },
    'currPat.birthdate'() { this.problems.birthdate = null; },
    'currPat.gender'() { this.problems.gender = null; },
    'currPat.height'() { this.problems.height = null; },
    'currPat.weight'() { this.problems.weight = null; },

    search_text(){ 
      if(this.search_text == '') this.clearSearch();
    },

    // filterEnable() { this.filter = !this.filter;}
  },

  methods:{
    clearSearch(){
      this.search_text = '';
      this.$store.dispatch('manage/loadPatients');
    },

    clearFilter(){
      this.filterAll = null;
    },

    noProblems() {
      for (let key in this.problems) this.problems[key] = null;
    },
      
    copyPatient() {
      const pat = this.filteredPatients.find(p => p.id === this.currid);
      var key;
      if (!pat) {
        for (key in this.currPat) this.currPat[key] = null;
        return;
      }
      for (key in this.currPat) this.currPat[key] = pat[key];
      if (!pat.createdBy && pat['created by']) pat.createdBy = pat['created by']; // TODO: temporary fix
    },

    // goTo(action, id) { this.$router.push({ name: 'mngPatients', params: {action: action, p_id: id ?? this.currid } }); },
    
    // goToSession() { this.$router.push({ name: 'tabConfiguration', params: { id: this.inSession?.id } }); },

    async showContent(pid){
      this.warning = false;
      this.clicked = '';
      this.content = [];
      // this.currid =  pid;
      var name = 'mngPatients';
      this.$router.push({ name, params: {action:'view', p_id: pid } });
    },
    
    saveChanges(e){
      const el = e.target; var inputVal = el.value;
      if(el.value!="") {
        if(el.type == 'number') { inputVal = parseFloat(inputVal); }
        this.fields[el.name] = inputVal
      }
      this.disable = true;
      //var value = el.type === 'checkbox' ? el.checked : isNaN(el.value) ? el.value.trim() : +el.value;
    },

    updateGender(g){
      this.fields['gender'] = g
    },

    addNewPat(){ //async?
      if(this.clicked == 'disable_btn'){
        var switchOff = !this.patientEnabled;
        var p_id = this.currid;
        for(var i in this.sessions){
          var ses_id = this.sessions[i].id;
          this.$store.dispatch('manage/disablePatient',{ses_id,p_id, switchOff});
        }
        this.currPat.disabled = switchOff;
      }

      if(this.fields['serial']) {
        for(var i in this.patients){
          if(this.patients[i] == null) { continue; }
          else if(this.fields['serial'] == this.patients[i].serial && this.saveBtn!='Edit'){
            this.warning = true;
            return;
          }
          else{
            this.warning = false;
          }
        }
      }

      if (this.saveBtn == 'Edit'){
        for(var p in this.currPat){
          if(!(p in this.fields)) { this.fields[p] = this.currPat[p]; }
        }
      }
      if (!this.fields['serial']) this.problems.serial = 'Required';
      if (!this.fields['birthdate']) this.problems.birthdate = 'Required';
      if (!this.fields['gender']) this.problems.gender = 'Required'; else this.problems.gender = null;
      if (!this.fields['height']) this.problems.height = 'Required';
      else if (+ this.fields['height'] < +config.min_height || +this.fields['height'] > +config.max_height) {
        this.problems.height = 'Must be between ' +
          this.height.toUI(config.min_height) + ' and ' +
          this.height.toUI(config.max_height) + ' ' + (this.height.unit ?? '') +
          ' (' + this.fields['height'] + ' cm)';
      }
      if (!this.fields['weight']) this.problems.weight = 'Required';

      if (Object.values(this.problems).filter(v => v).length === 0) {
        if (this.saveBtn == 'Edit'){
          this.fields['id'] = this.currid;
          for(var f in this.fields){
            this.currPat[f] = this.fields[f];
          }
        } else
          this.fields['id'] = '';
      
        var fields = this.fields;
        this.$store.dispatch('manage/addPatient', {fields});
        
        this.new_gender = null;
        this.popUp = true;
        this.noProblems();
        this.cancleBtn();
      } 
    },

    addPatBtn(){
      this.clicked = 'edit_pat'; this.saveBtn = 'Add';
      this.popUp_edit = true;
      this.fields = {};
      if(this.currPat)
        Object.assign(this.currPat, {serial: null, birthdate: null, gender: null, weight: null, height: null, disabled: null, createdBy: null})
      // var name = 'mngPatients';
      // this.$router.push({ name, params: {action:'add', p_id: this.currid } });
    },

    editPatBtn(){
      this.clicked ='edit_pat', this.saveBtn = 'Edit';
      this.popUp_edit = true;
      this.fields={};
      // this.current = this.currid;
      // this.goTo('edit');
      // var name = 'mngPatients';
      // this.$router.push({ name, params: {action:'edit', p_id: this.currid } });
    },

    cancleBtn(){
      this.clicked='';
      this.disabled= this.warning =this.popUp_edit= false;

      // this.currid = this.current = this.currPat = '' ;
    },

    disPatDetails(){
      this.clicked = 'disable_btn';
    },

    // checkSwitch(){
    //   for (var i in this.sessions){
    //     if(this.sessions[i].status && this.sessions[i].status == 99){
    //       return false;
    //     }else{
    //       return true;
    //     }
    //   }
    // }
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

.user_content >p{
  color: black;
  font-weight: 600;
  grid-column-start: 1;
  grid-column-end: 4;
}

@media (max-width: 50em){
  div.user_content{
    grid-column: 1;
    grid-row: 2; 
    margin-left: 20px;
  }
}

#edit_form{
  display: block;
  grid-column:1;
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

.form-container {
  display: table-row;
  max-width: 200px;
  padding: 5px;
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

.power{
  font-family: 'power_symbols';
  font-style: normal;
}

.power.active{
  color: #fac42c;
}

[type="hidden"].problem ~ button { box-shadow: 0 0 .1em .1em red; }

.active{
  /* color: white; */
  /* background: #5da3a7; */
  border-right: 4px solid #5da3a7;
   color: var(--bg-4);
}

.scroll {
  overflow: auto;
  background: var(--input) !important;
}

.problem input:not(:focus) { box-shadow: 0 0 .1em .1em red; }

.additional {
  font-size: 100%;
  line-height: 2;
  color: var(--fg-dim);
}

.list__link:not(.enabled) { font-weight: 100; color: var(--fg-dim); }


table td{ 
  margin-left: 30px;
  display: flex;
  align-items: center
}

label.q-field.row.no-wrap.items-start.q-field--filled.q-input.q-field--dense {
  width: fit-content;
}

.q-icon{
  margin-left: 10px;
  margin-right: 13px;
}

.q-item__section{
  display: flex;
  flex-direction: row;
}

.q-item__section--main + .q-item__section--main {
  margin-left: 0px;
}
</style>
