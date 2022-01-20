<template>
 <div class="manage_all">
  <div id="userManager">
   <div id="locTable">
      <div class="shadow-9" style="width: 550px;font-size:medium;padding-top:0px;">
        <q-toolbar style="color: var(--text-primary);box-shadow: 0 3px 5px -6px rgb(0 0 0);">
          <q-toolbar-title style="font-size:larger;font-weight:600;display: flex; justify-content: space-around;">Wards</q-toolbar-title>
          <q-btn clickable
              class="add_ses_table2 bg-accent text-white q-my-sm"
              @click="add_ward_pop=true" 
              round dense size="11px" 
            :disabled="disable" id="Users_addPatBtn" icon="add" style="display:flex;padding:0px;align-items: center;margin-right:8px;">
            <q-tooltip class="bg-secondary text-white" anchor="top middle" self="bottom middle">Add ward</q-tooltip>
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
              <q-btn label="clear" @click="clearFilter()" outline color="grey" class="q-ma-sm" size="10px" align="right" dense/>
              <q-list style="min-width: 150px;background: var(--bg);">
                <q-item clickable v-close-popup style="display: block;">
                  <q-item-section><q-radio v-model="filterAll" val="disabled" color="primary" size="sm" /></q-item-section>
                  <q-item-section>
                      <q-item-label> Disabled Only</q-item-label>
                  </q-item-section>
                </q-item>
                 <q-item clickable v-close-popup style="display: block;">
                  <q-item-section><q-radio v-model="filterAll" val="all" color="primary" size="sm" /></q-item-section>
                  <q-item-section>
                      <q-item-label> All</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
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
        <q-list bordered class="rounded-borders">
          <q-expansion-item
            v-for="ward in filteredWards" class="list__item" id="key" :key="ward?.name"
            expand-separator :label="ward?.name" default-closed
            @click="showWard(ward?.name)" group="wards" style="font-weight:700;">
            <template v-slot:header>
              <q-item-section>
                <q-icon name="room_preferences" color="secondary"/>
                {{ward.name}}
              </q-item-section>
              <q-item-section v-show="activeWard===ward.name" style="display: grid;align-items: center;">
                <q-btn v-show="activeWard===ward.name" clickable :icon="'add'"
                  class="bg-accent text-white q-my-sm" @click="add_room_pop=true,activeRoom=''" 
                  round dense size="11px" :disabled="disable" 
                  id="Location_addWardBtn" style="padding:0px;align-items: center; ">
                  <q-tooltip class="bg-secondary text-white" anchor="top middle" self="bottom middle">
                    Add room
                  </q-tooltip>
                </q-btn>
                <q-btn @click="edit_ward_pop = true" flat dense rounded icon="edit" size="sm" style="right: 20%; position: absolute;">
                  <q-tooltip class="bg-green-8 text-white" anchor="top middle" self="bottom middle">
                    Edit ward
                  </q-tooltip>
                </q-btn>
              </q-item-section>
            </template>
            <q-expansion-item
              v-for="(i,j) in rooms" :key="j" class="list__item"
              :header-inset-level="0.5" :content-inset-level="1" @click="roomClicked($event,i?.name,j)" expand-separator icon="meeting_room"
              :label="'Room  ' + i?.name" style="font-weight:200">
              <template v-slot:header>
                <q-item-section>
                  <q-icon name="meeting_room" color="secondary"/>
                  Room  {{i.name}}
                </q-item-section>
                <q-item-section>
                  <q-btn @click="edit_room_pop = true" flat dense rounded icon="edit" size="sm" style="right: 20%; position: absolute;">
                    <q-tooltip class="bg-green-8 text-white" anchor="top left" self="bottom middle">
                      Edit room
                    </q-tooltip>
                  </q-btn>
                </q-item-section>
              </template>
              <q-separator />
              <q-item clickable v-ripple v-for="(bed,j) in beds" :key="j" icon="bed">
                <q-item-section avatar>
                  <q-icon name="bed"  color="secondary"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{bed}}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-btn @click="edit_bed_pop = true" flat dense rounded icon="edit" size="sm" style="right: 0; position: absolute;">
                    <q-tooltip class="bg-green-8 text-white" anchor="top left" self="bottom middle">
                      Edit bed
                    </q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-expansion-item>
          </q-expansion-item>
          
        </q-list>
      </div>
<!-- ####################################################################################### -->
    
    <form class="form_details">
      <!-- Edit ward -->
      <q-dialog v-model="edit_ward_pop">
        <q-card style="background:var(--bg);grid-column: 1;font-size: large;color:black;">
          <h3 class="dialog_title shadow-3">Edit Ward</h3>
          <q-card-section class="text-h6 text-black" style="padding:20px;margin-bottom: 68px;">
            <label class="input_edit">
              <span>Ward </span>
              <q-input :placeholder="activeWard" name="ward" v-model.trim="newWard" id="Location_newWard" :class="{problem: problems.newWard}" bg-color="brown-1" filled dense/>
              <span class="required">{{problems.newWard}}</span>
            </label>
            <q-toggle class="q-mt-xl" v-model="wardEnabled" label="Active" @update:model-value="disLocDetails()" left-label color="yellow-8" id="Locations_enabled" size="30px" style="font-size: 20px;"/>
          </q-card-section>
          <div class="buttons">
            <q-btn label="Save" type="submit" @click="saveWard" id="Location_saveWard" text-color="white" color="accent" dense no-caps/>
            <q-btn label="Cancel" type="button" @click.prevent="clicked='',warning=false,edit_ward_pop=false" id="Location_saveWard_delete_no" color="white" text-color="accent" flat dense no-caps/>
          </div>
        </q-card>
      </q-dialog>

      <!-- Edit room -->
      <q-dialog v-model="edit_room_pop">
        <q-card style="background:var(--bg);grid-column: 1;font-size: large;">
          <h3 class="dialog_title shadow-3">Edit Room</h3>
          <q-card-section class="text-h6 text-black" style="padding:20px;margin-bottom: 68px;">
            <label class="input_edit">
              <span>Room </span>
              <q-input :placeholder="activeRoom" dir="auto" v-model.trim="newRoom" bg-color="brown-1" filled flat dense>
                <template v-slot:prepend>
                  <q-icon name="meeting_room" class="icon"/>
                </template>
              </q-input>
              <q-btn class="trash q-ma-md" @click.prevent="delete_popup=true" id="Location_deleteRoom" icon="delete" flat dense/>
            </label>
            <!-- <label class="input_edit"> -->
            <span class="input_edit_beds">Beds </span>
            <div style="display: inline-table;margin-left: 13px;">
              <li v-show="clicked!=='add_room'" v-for="(bed,j) in beds" :key="bed" class="bedSelect" :id="'locSelect_'+j"> 
                <label style="display: inline-flex;align-items: center;"> 
                  <q-input v-model.trim="beds[j]" :placeholder="bed" :data-guid="activeRoom" :id="'Location_bedName'+bed" bg-color="brown-1" filled flat dense>
                    <template v-slot:prepend>
                      <q-icon name="bed" class="icon"/>
                    </template>
                  </q-input>
                  <q-btn class="trash q-ma-md" @click.prevent="deleteBed(bed)" id="Location_deleteBed" dense flat icon="delete"></q-btn>
                  </label>
              </li>
            
              <label v-for="(b, i) in newBeds" :key="i" style="display: inline-flex;align-items: center;">
                <q-input dir="auto" v-model.trim="newBeds[i]" :id="'Location_newBed'+i" bg-color="brown-1" filled flat dense>
                    <template v-slot:prepend>
                      <q-icon name="bed" class="icon"/>
                    </template>
                  </q-input>
                <q-btn flat dense class="trash bg-none text-red q-ma-md" @click.prevent="newBeds.pop(i);" id="Location_cancelBed" icon="cancel"/>
              </label>
              <q-btn class="bedSign bg-accent" @click.prevent="newBeds.push('')" icon="add" dense round id="Location_newBed" no-caps></q-btn>
            <!-- </label> -->
            </div>
          </q-card-section>
          <div class="buttons">
            <q-btn label="Save" type="submit" @click="addNewRoom($event)" id="Location_saveWard" text-color="white" color="accent" dense no-caps/>
            <q-btn label="Cancel" type="button" @click.prevent="clicked='',edit_room_pop=false" id="Location_saveWard_delete_no" color="white" text-color="accent" flat dense no-caps/>
          </div>
        </q-card>
      </q-dialog>
       
      <!-- Delete room -->
      <q-dialog v-model="delete_popup">
        <q-card class="bg-primary text-white">
          <q-card-section class="text-h6 bg-red text-center" style="padding:20px;margin-bottom: 68px;">
            delete room {{activeRoom}} ?
            <q-icon name="delete_forever"/>
          </q-card-section>
          <q-card-actions align="left" class="bg-red">
            <q-btn type="submit" @click="deleteRoom" id="Location_popUp_delete_yes" flat dense no-caps >Yes</q-btn>
            <q-btn type="button" @click.prevent="clicked='',delete_popup=false" id="Location_saveWard_delete_no" flat dense no-caps>No</q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Edit/ Add beds -->
      <q-dialog v-model="edit_bed_pop">
        <q-card style="background:var(--bg);grid-column: 1;font-size: large;">
          <h3 class="dialog_title">Edit Beds</h3>      
          <q-card-section class="text-h6 text-black" style="padding:20px;margin-bottom: 68px;display: inline-table;padding: 20px;flex-direction: column;align-items: flex-start;">
            <span class="input_edit_beds">Beds </span>
            <div style="display: inline-table;margin-left: 13px;">
              <li v-show="clicked!='add_room'" v-for="(bed,j) in beds" :key="bed" class="bedSelect" :id="'locSelect_'+j"> 
                <label style="display: inline-flex;align-items: center;">
                  <q-input v-model.trim="beds[j]" :placeholder="bed" :id="'Location_bedName'+bed" bg-color="brown-1" filled flat dense>
                    <template v-slot:prepend>
                      <q-icon name="bed" class="icon"/>
                    </template>
                  </q-input>
                  <q-btn class="trash q-ma-md" @click.prevent="deleteBed(bed)" id="Location_deleteBed" flat dense no-caps icon="delete"></q-btn>
                  </label>
              </li>
              <label v-for="(b, i) in newBeds" :key="i" style="display: inline-flex;align-items: center;">
                <q-input dir="auto" v-model.trim="newBeds[i]" :id="'Location_newBed'+i" bg-color="brown-1" filled flat dense>
                  <template v-slot:prepend>
                    <q-icon name="bed" class="icon"/>
                  </template>
                </q-input>
                <q-btn flat dense class="trash bg-none text-red q-ma-md" @click.prevent="newBeds.pop(i);" id="Location_cancelBed" icon="cancel"/>
              </label>
              <q-btn class="bedSign bg-accent" @click.prevent="newBeds.push('')" icon="add" dense round id="Location_newBed" no-caps></q-btn>
            </div>
          </q-card-section>
          
          <div class="buttons">
            <q-btn label="Save" type="submit" @click="addNewRoom($event)" id="Location_saveWard" text-color="white" color="accent" dense no-caps/>
            <q-btn label="Cancel" type="button" @click.prevent="clicked='',edit_bed_pop=false" id="Location_saveWard_delete_no" color="white" text-color="accent" flat dense no-caps/>
          </div>
        </q-card>
      </q-dialog>

      <!-- Add ward -->
      <q-dialog v-model="add_ward_pop">
        <q-card style="background:var(--bg);grid-column: 1;font-size: large;">
          <h3 class="dialog_title shadow-3">Add Ward</h3>
          <q-card-section class="text-h6 text-black" style="padding:20px;margin-bottom: 68px;display: flex;padding: 20px;flex-direction: column;align-items: flex-start;">
            <label class="input_edit">
              <span>Ward </span><q-input dir="auto" name="ward" v-model.trim="newWard" flat dense bg-color="brown-1" :class="{problem: problems.newWard}" filled/>
              <span class="required">{{problems.newWard}}</span>
            </label>
          </q-card-section>
          <div class="buttons">
            <q-btn label="Add" type="submit" @click="addWard($event)" id="Location_saveWard" text-color="white" color="accent" dense no-caps/>
            <q-btn label="Cancel" type="button" @click.prevent="add_ward_pop = false" id="Location_saveWard_delete_no" color="white" text-color="accent" flat dense no-caps/>
          </div>
        </q-card>
      </q-dialog>

      <!-- Add room -->
      <q-dialog v-model="add_room_pop">
        <q-card style="background:var(--bg);grid-column: 1;font-size: large;">
          <h3 class="dialog_title shadow-3">Add Room</h3>
          <q-card-section class="text-h6 text-black" style="padding:20px;margin-bottom: 68px;">
            <label class="input_edit">
            <span>Room </span>
            <q-input :placeholder="activeRoom" dir="auto" v-model.trim="newRoom2" bg-color="brown-1" :class="{problem: problems.newRoom}" filled flat dense>
              <template v-slot:prepend>
                <q-icon name="meeting_room" class="icon"/>
              </template>
            </q-input>
            <span class="required">{{problems.newRoom}}</span>
            </label>
          
            <span class="input_edit_beds">Beds </span>
            <div style="display: inline-table;margin-left: 13px;">
              <li v-show="clicked!=='add_room'" v-for="(bed,j) in beds" :key="bed" class="bedSelect" :id="'locSelect_'+j"> 
                <label style="display: inline-flex;align-items: center;">
                  <q-icon name="bed" class="icon"/>
                  <q-input v-model.trim="beds[j]" :placeholder="bed" :data-guid="activeRoom" :id="'Location_bedName'+bed" bg-color="brown-1" filled flat dense/>
                  <q-btn class="trash q-ma-md" @click.prevent="deleteBed(bed)" id="Location_deleteBed" dense icon="delete"/>
                  </label>
              </li>
              <label v-for="(b, i) in newBeds" :key="i" style="display: inline-flex;align-items: center;">
                <q-input dir="auto" v-model.trim="newBeds[i]" :id="'Location_newBed'+i" bg-color="brown-1" filled flat dense>
                  <template v-slot:prepend>
                    <q-icon name="bed" class="icon"/>
                  </template>
                </q-input>
                <q-btn flat dense class="trash bg-none text-red q-ma-md" @click.prevent="newBeds.pop(i);" id="Location_cancelBed" icon="cancel"/>
              </label>
              <q-btn class="bedSign bg-accent" @click.prevent="newBeds.push('')" icon="add" dense round id="Location_newBed" no-caps></q-btn>
            </div>
          </q-card-section>
          <div class="buttons">
            <q-btn label="Save" type="submit" @click="addRoom($event)" id="Location_saveWard" text-color="white" color="accent" dense no-caps/>
            <q-btn label="Cancel" type="button" @click.prevent="clicked='',add_room_pop=false" id="Location_saveWard_delete_no" color="white" text-color="accent" flat dense no-caps/>
          </div>
        </q-card>
      </q-dialog>

      <!-- saved successfully :) -->
      <q-dialog v-model="saved_popup">
        <q-card class="bg-primary text-white text-right" style="height: 150px;">
          <q-card-section class="items-center q-pb-none bg-primary">
            <div class="text-h6"></div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="text-h6 bg-primary q-pa-md text-center">
            {{loc_name}} saved successfully <q-icon name="verified"></q-icon>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Warning - ward is taken -->
      <div v-show="warning" class="form-popup" id="myWarnForm">
        <form class="form-container">
          <h3 style="font-size:large;"> This {{loc_name}} is already in use ⚠️</h3>
        </form>
      </div>

    </form>
  </div>
</div>
 </div>
  
</template>


<script>
import { ref } from 'vue'
import { mapState } from 'vuex'

export default {
  name: 'Locations',
  components: {
    
  },
  setup () {
    const search_text = ref('')
    return {
      selected: ref('Wards'),
      search_text,
      filterAll: ref('all'),
    }
  },

  data(){
    return{
      clicked: '',
      filterDisable: false,
      // filterAll: false,
      // room: '',
      hideData: false,
      disable: false,
      activeWard: '',
      activeRoom: '',
      newWard: '',
      newRoom: '',
      newRoom2:null,
      // wardEnabled: true,
      rows: [1],
      newBeds: [],
      pop: false,
      warning: false,
      loc_name: 'ward', /*ward/room/bed */
      delete_popup: false,
      edit_ward_pop:false,
      edit_room_pop:false,
      edit_bed_pop:false,
      add_ward_pop: false,
      add_room_pop: false,
      saved_popup: false,
      wardEnabledData: null,
      search: false,
      problems: {
        newWard: null,
        newRoom: null,
        newBed: null,
      },
    }
  },

  computed:{
    ...mapState('locations', ['wards', 'ward']),
    // rooms() { return this.ward?.rooms ?? []; },
    filteredWards() { 
      if(this.search){ 
        return this.wards.filter(item => {
          var name = item.name?.toString() ?? '';
          return this.search_text
            .toLowerCase()
            .split(" ")
            .every(v => name.toLowerCase().includes(v));
        }); 
      }
      if(this.filterAll === 'all'){
        return this.fullWards;
      }

      if(this.filterAll === 'disabled'){
        return this.fullWards.filter(function(ward) {
          return ward.disabled == true;
        });
      }
      
      return this.wards;
    },
    room() { return this.rooms?.find(r => r.name == this.activeRoom) ?? {}; },
    // beds() { return this.room?.beds ?? []; },
    sessionList(){return this.$store.state.sessions.all; },
    fullWards(){return this.$store.state.locations.fullWards; },
    loc() { return this.currentSession?.location || {}; },
    currLoc(){ return this.$store.state.locations.currentLoc; },
    activeIndex(){ return this.$store.state.locations.index; },
    rooms() { return this.filteredWards.find(w => w.name === this.activeWard)?.rooms ?? []; },
    beds() { return this.rooms.find(r => r.name === this.activeRoom)?.beds ?? []; },
    wardEnabled: {
       get: function(){ return this.wardEnabledData==null? !this.fullWards.find(w=>w.name === this.activeWard)?.disabled??false : this.wardEnabledData;},
       set: function(value){ this.wardEnabledData = value;}
    },
    activate(){ return this.wardEnabled? 'activate':'inactivate'; },
  },

  mounted: function(){
    this.$store.dispatch('locations/loadAllWards');
    this.$store.dispatch('locations/loadFullWards');
  },

  watch:{
    $route: {
      immediate: true,
      handler() {
        var name = this.activeWard = this.$route.query.ward;
        // if (name)
        //   this.$store.dispatch('locations/loadWardVacancy', {name});
        this.mode = 'view';
        this.activeRoom = this.$route.query.room;
        this.noProblems();
      },
    },

    currLoc(){
      this.activeWard = this.activeWard;
      this.activeRoom = this.activeRoom;
    },

    search_text(){ 
      if(this.search_text == '') this.clearSearch();
    },

  },

  methods:{
    showWard(ward){
      this.hideData = this.warning = false;
      // this.activeWard = ward; this.activeRoom = this.clicked = '';
      var loc = [];
      loc[0] = this.activeWard = ward;
      this.$router.push({ name: 'mngLocations', query: { ward } });
    },
    
    addWard(e){
      if(!this.newWard) { this.problems.newWard = 'Required'; return;}
      for(var i in this.wards){
        if(this.newWard == this.wards[i].name){
          this.warning = true;
          e.preventDefault();
          this.loc_name = 'ward';
          return;
        }
      }
      
      this.clicked = '', this.hideData = true, this.activeWard = this.activeRoom= '';
      var ward = this.newWard;
      this.$store.dispatch('locations/addWard', ward);
      this.$router.push({ name: 'mngLocations', query: { ward } });
      this.add_ward_pop = false;
      this.saved_popup = true;
      this.cancelBtn(e);
    },

    addNewRoom(e){
      e.preventDefault();
      var room, index;
      index = this.activeIndex;
      for(var b in this.newBeds){
        if(this.beds.includes(this.newBeds[b])){
            this.warning = true;
            this.loc_name = 'bed';
            return;
        }
        this.beds.push(this.newBeds[b]);
      }
      /*pushing only new beds - works!*/
      if(this.newRoom == ''||this.edit_bed_pop){
        room = {ward: this.activeWard, room: this.activeRoom, beds: this.beds};
        this.loc_name = 'beds';
      }
      /*setting new name to room and adding beds if needed*/
      /*index = index of the original room name */
      else{
        for(var i in this.rooms){
        if(this.newRoom == this.rooms[i].name){
          this.warning = true;
          this.loc_name = 'room';
          return;
        }
        this.loc_name = 'room';
      }
        room = {ward: this.activeWard, room: this.newRoom, beds: this.beds}; 
      }

      this.$store.dispatch('locations/saveRoom', {room, index});
      this.disable = false;
      this.add_room_pop=this.edit_room_pop=this.edit_bed_pop=false;
      this.saved_popup = true;
      this.cancelBtn(e);
    },

    addRoom(e){
      if(!this.newRoom2) { this.problems.newRoom = 'Required'; return;}
      e.preventDefault();
      for(var i in this.rooms){
        if(this.newRoom2 == this.rooms[i].name){
          this.warning = true;
          this.loc_name = 'room';
          e.preventDefault();
          return;
        }
      }
      for(var b in this.newBeds){
        if(this.beds.includes(this.newBeds[b])){
            this.warning = true;
            this.loc_name = 'bed';
            return;
        }
      }

      this.$store.dispatch('locations/newRoom', {ward: this.activeWard, room: this.newRoom2, beds: this.newBeds});
      this.add_room_pop = false;
      this.cancelBtn(e);
    },

    saveWard(e){
      if(this.clicked == 'disable_btn'){
        var dis = !this.wardEnabled;
        var ward = this.activeWard;
        this.$store.dispatch('locations/disableWard', {ward, dis}); 
        this.fullWards.find(w => w.name === this.activeWard)['disabled'] = dis;
      }
      else{
        if(this.newWard){
          for(var i in this.wards){
            if(this.newWard == this.wards[i].name){
              this.warning = true;
              e.preventDefault();
              this.loc_name = 'ward';
              return;
            }
          }
          var wards={ old: this.activeWard, new: this.newWard };
          this.$store.dispatch('locations/saveWard', wards);
        }
      }
      this.edit_ward_pop=false;
      this.saved_popup = true;
      this.cancelBtn(e);
    },

    saveRoom(e){ 
      e.preventDefault();
      this.disable = false;
      this.cancelBtn(e);
    },

    roomClicked(e,name){
      e.preventDefault();
      this.roomClick = this.activeRoom= name;
      var counter = 0;
      for(var i in this.rooms){
        if(this.rooms[i].name == name){
        var index = counter;
          break;
        }
        else{
          counter = counter+1;
        }
      }
      // var index = this.activeIndex;
      this.$store.dispatch('locations/loadIndex', { index });
      var loc = [];
      loc[0] = this.activeWard;
      loc[1] = this.activeRoom;
      this.$store.commit('locations/setCurrentLoc', { loc });
      name = 'mngLocations';
      this.$router.push({ name, query: { ward: this.activeWard, room: this.activeRoom } });

    },

    deleteRoom(){
      var room = {ward: this.activeWard, room: this.activeRoom, beds: this.beds};
      this.$store.dispatch('locations/deleteRoom', room);
      this.delete_popup = false;
    },

    deleteBed(bed){
      for( var i = 0; i < this.beds.length; i++){    
        if ( this.beds[i] === bed) {  
          this.beds.splice(i, 1); 
        }
      }
    },

    disLocDetails(){
      this.popupDisable = true;
      this.clicked = 'disable_btn';
    },

    editRoomBtn(name){
      event.preventDefault();
      this.roomEdit = this.newRoom = name;
      this.clicked='edit_room';
    },

    cancelBtn(e){
      e.preventDefault();
      this.clicked = this.activeWard = this.activeRoom = this.wardEdit = this.roomEdit = '';
      this.disabled=false;
      this.hideData = true;
      this.newBeds = [];
    },

    addRow(){
      event.preventDefault();
      this.rows.push(this.rows.length + 1);
    },

    // checkSwitch(){
    //   this.switch = !this.wards.find(w => w.name === this.activeWard)['disabled'];
    // },

    clearSearch(){
      this.search_text = '';
      this.$store.dispatch('manage/loadGateways');
    },

    clearFilter(){
      this.filterAll = null;
    },

    noProblems() {
      for (let key in this.problems) this.problems[key] = null;
    },
      
  }

}
</script>

<style scoped>
.manage_all{
  grid-template-columns: auto;
}

div.user_content {
  display: grid;
  padding-top: 12px 0px 0px 0px;
  justify-content: space-between;
  grid-column:2;
  grid-row: 1;
  padding: 14px 16px;
  align-items: flex-start;
  overflow: auto auto;
  margin-top: 20px;
  grid-template-columns: auto auto auto auto auto;
  grid-template-rows: 60px 60px 50px;
}

.user_content >p{
  color: #009d9d;
  font-weight: 600;
  grid-column-start: 1;
  grid-column-end: 4;
}

#userManager{
  grid-column: 1;
  grid-row: 1;
}

.form_details{
  grid-column:2/4; 
  font-size:1.2em;
  width: inherit;
  margin-left: 30px;
}

.form_details>p{
  font-weight: bolder;
  color: var(--bg-4);
}

.form_details>label{
  margin-bottom: 15px;
}

.edit_sign{
  margin-left: 30px;
  background: none;
  border: none;
  font-size: large;
  color:red;
}

.editName{
  text-align: center;
  font-size: medium;
  box-shadow: 0px 0px 7px 0px #aba9a9;
  border: none;
  margin-left: 10px;
}

.bedSign{
  font-size: 0.7rem;
  /* margin-top: 10px; */
  color: white;
  display: flex;
}

.trash{
  /* font-family:auto; */
  color:red;
  margin-left: 10px;
}

#locTable{
  display: inline-grid;
  width: auto;
}

#Location_editWard{
  margin-left: -5px;
  margin-right: 20px;
}

.bedSelect{
  color:var(--fg);
  display: block;
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

.form-container .cancel {
  background-color: red;
}

.form-container .btn:hover, .open-button:hover {
  opacity: 1;
}


.buttons{
  position: absolute;
  right: 0px;
  bottom: 0; 
}

.buttons button{
  /* background-color: var(--q-accent); */
  font-size: 0.9rem;
  /* color: white; */
  margin: 1px 10px 14px 0px;
}

.q-item__section label{
  margin-bottom: 15px;
}

.q-card{
  min-width: 300px;
  /* min-height: 450px; */
}

.q-icon{
  margin-left: 5px;
  margin-right: 13px;
}

.q-item__section.column.q-item__section--main.justify-center{
  font-weight: 400;
}

.row2{
  font-weight: bolder;
  color:#009d9d;
  width:fit-content;
  margin-top: 15px;
}

.input_edit{
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.input_edit_beds{
  display: contents;
}

.input_edit span, .input_edit_beds{
  font-weight: 400;
  color: var(--text);
  margin-right: 10px;
}

.form_details span{
  /* padding: 0px; */
  color: black;
}

.q-field__prepend.q-field__marginal.row.no-wrap.items-center{
    display: flex;
}

.icon{
  top: 17%;
  display: block;
}

[type="hidden"].problem ~ button { box-shadow: 0 0 .1em .1em red; }

.problem { box-shadow: 0 0 .1em .1em red; }

</style>
