<template>
  <div class="manage_all">
    <form v-if="currid && current" class="user_content">
      <div class="table_details_header">
        <h3 style="color:var(--bg-4);">Gateway {{current?.name ?? current?._id}} <q-icon name="call_split"/></h3>
        <q-btn id="Gateways_edit"
          class="q-my-sm"
          @click.prevent="editStart()" 
          dense size="15px" flat
          :icon="'edit'" style="color:var(--action);margin-left:10px;">
        </q-btn>
      </div>
      <table class="q-mt-md">
        <tr>
          <th>Friendly Name:</th>
          <td class="big1">{{current?.name}}</td>
        </tr>
        <tr><th>Version:</th><td class="big1">{{current?.version}}</td></tr>
        <tr><th>Serial:</th><td>{{current?._id}}</td></tr>
        <tr><th>Added:</th><td>{{showTime(current?.added)}}</td></tr>
        <tr><th>Last Connected:</th><td>{{showTime(current?.lastConnect)}} <q-icon name="schedule"/></td></tr>
        <tr><th>Last Sync:</th><td>{{showTime(current?.lastSync)}} <q-icon name="schedule"/></td></tr>
        <tr>
        <th style="font-size:large;"><em class="PM"><b>P</b>oly<b>M</b>onitors</em>:&nbsp;</th>
        <td class="poly-list"><div v-for="pm in attachedPMs" :key="pm.id">{{ pm.name.includes('-') ? pm.name.split('-')[1]: pm.name}}</div><i v-if="attachedPMs.length === 0">(all)</i></td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          
        </tr>
      </table>

      <div class="q-pa-xs">
        <q-table
          dense class="recordTable"
          table-header-class="table-title"
          :rows="details"
          :columns="[
          {name: 'device', label: 'Device', align: 'center', field: row => row.name, format: val => `${val}`, sortable: true,sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),sortOrder: 'ad'},
          {name: 'last', label: 'Last', align: 'center', field: row => row.name, format: val => `${val}`, sortable: true, sort: (a, b) => a.getTime() - b.getTime() ,sortOrder: 'da'},
          {name: 'battery', label: 'Battery', align: 'center', field: row => row.name, format: val => `${val}`, sortable: true,sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),sortOrder: 'ad'},
          {name: 'signal', label: 'Signal', align: 'center', field: row => row.name, format: val => `${val}`, sortable: true, sort:(a, b) => a.toString().localeCompare(b.toString()), sortOrder: 'ad'},
          {name: 'linkDevice', label: 'Link to Device', align: 'center', field: row => row.name, format: val => `${val}`, sortable: true},
          {name: 'linkServer', label: 'Link to Server', align: 'center', field: row => row.name, format: val => `${val}`, sortable: true},
          ]"
          row-key="name" width="250px" id="gateway_deviceTable" style="background:var(--bg-1);"
        >
          <template #header-cell="props">
            <q-th 
            :props="props"
            style="color: var(--fg-dim);padding:0;font-size:14px;font-weight:700;background:var(--bg-1);"
            >
            {{props.col.label}}
            </q-th>
          </template>

          <template #body-cell-device="props">
            <q-td key="device" :props="props">
              {{ props.row.device.includes('-') ? props.row.device.split('-')[1]: props.row.device }}
            </q-td>
          </template>

          <template #body-cell-last="props">
            <q-td key="last" :props="props">
              {{props.row.last}}
            </q-td>
          </template>

          <template #body-cell-battery="props">
            <q-td key="battery" :props="props">
              {{props.row.battery}}
            </q-td>
          </template>

          <template #body-cell-signal="props">
            <q-td key="signal" :props="props">
              {{props.row.signal}}
            </q-td>
          </template>

          <template #body-cell-linkDevice="props">
            <q-td key="linkDevice" :props="props">
              {{props.row.linkDevice}}
            </q-td>
          </template>

          <template #body-cell-linkServer="props">
            <q-td key="linkServer" :props="props">
              {{props.row.linkServer}}
            </q-td>
          </template>
      
        </q-table>
      </div>


      <!-- Edit Gateway -->
      <q-dialog v-model="popUp_edit">
        <q-card class="add_input" id="edit_pat_form" @input="saveChanges($event)" style="background:var(--bg);grid-column: 1;font-size: large;">
          <h3 class="dialog_title">Edit Gateway {{current?.name}}</h3>
          <q-card-section class="q-pa-md q-pb-xl">
            <th style="font-weight: 600;">Friendly Name:</th><td><q-input v-model="currName" dir="auto" bg-color="brown-1" filled flat dense style="margin-left: 15px;"/></td>
            <div class="polyGroup">
              <th style="font-size:large;"><em class="PM"><b>P</b>oly<b>M</b>onitors</em>:&nbsp;</th>
              <label v-show="black.length > 0" style="display: flex;align-items: center;margin-top:10px;margin-left: 15px;">
                <!-- <q-icon dense flat size="9px" name="add" color="green-8" style="justify-content: center;align-items: center;" class="q-my-sm"/> -->
                <q-select @update:model-value="updatePoly" standout="bg-secondary text-white" :dark="colourScheme=='darkScheme'" v-model="polySelected" :options="blackList" stack-label dense style="border-left: none; color: var(--text);background: var(--bg-1);">
                  <template v-slot:selected>
                    <template v-if="polySelected">
                      {{polySelected}}
                    </template>
                    <template v-else>
                      (Select 👇)
                    </template>
                    </template>
                </q-select>
              </label>
              <div v-for="(pm, i) in white" :key="pm.id" style="font-size: medium;margin-left: 15px;">
                <q-btn dense flat @click.prevent="move(white, black, i)" size="9px" 
                icon="close" style="justify-content: center;align-items: center;" class="bg-red-8 q-my-sm text-white" no-caps> Remove
                </q-btn>
                {{ pm.name.includes('-') ? pm.name.split('-')[1]: pm.name}}
              </div>
            </div>

          <td class="buttons">
            <template v-if="mode === 'edit'">
              <q-btn label="Save" id="Gateways_save" @click.prevent="save()" dense no-caps text-color="white" color="accent" size="15px"/>
              <q-btn label="Cancel" id="Gateways_cancel" @click.prevent="mode = 'view', popUp_edit=false" dense flat no-caps color="white" text-color="accent" size="15px"/>
            </template>
          </td>

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
            Gateway {{current?.name ?? current?._id}} Saved successfully <q-icon name="verified"></q-icon>
          </q-card-section>
        </q-card>
      </q-dialog>
    </form>

    <!-- <div id="userManager"> -->
    <div id="gwTable">
      <!-- class="q-ml-md q-mr-xl shadow-9"  -->
      <div style="max-width: 350px" class="shadow-9">
        <q-toolbar style="color: var(--text-primary);box-shadow: 0 3px 5px -6px rgb(0 0 0);">
          <q-toolbar-title style="font-size:large;font-weight:600;display: flex; justify-content: space-around;">
             Gateways
          </q-toolbar-title>
          <!-- <q-btn clickable
            class="add_ses_table2 bg-amber-7 q-my-sm"
            id="edit_select" 
            @click.prevent="editGwName()" 
            :disabled="!current"
            round dense size="11px" 
          :icon="'edit'" style="justify-content: center;align-items: center;">
          </q-btn> -->
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
          <q-item v-for="gw in filteredGw" :key="gw.id" class="q-my-sm" clickable @click="viewGW(gw)" v-ripple :active="currid == gw._id" active-class="active" style="font-size:medium">
            <q-item-section avatar center :id="'gateways_polyName_'+gw._id">
            <!-- <span>{{gwIsActive(gw)}}</span> -->
              <q-icon name="circle" :color="gwIsActive(gw)"/>
               <!-- <q-icon name="call_split" size="24px"/> -->
              {{ gw.name }}
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
  name: 'Gateways',

  setup () {
    const search_text = ref('')
    return {
      search_text,
    }
  },

  data(){
    return {
      mode: 'view',
      currid: null,
      currName: '',
      white: [],
      black: [],
      polySelected: null,
      popUp_edit: false,
      popUp: false,
      interval : null,
      search: false,
    }
  },

  computed:{
    ...mapState('env', ['clock']),
    ...mapState('manage', ['gateways', 'currPolys']),
    ...mapState('layout', ['colourScheme']),
    current() { return this.$store.state.manage.currentGw;},
    // backup() { return this.$store.state.manage.backupGw;},
    filteredGw() { 
      if(this.search){ 
        return this.gateways.filter(item => {
          var name = item.name?.toString() ?? '';
          return this.search_text
            .toLowerCase()
            .split(" ")
            .every(v => name.toLowerCase().includes(v));
        }); 
      }
      return this.gateways;
    },
    attachedPMs() { return this.currPolys.filter(p => this.current.PolyMonitors.includes(p.id)); },
    unattachedPMs() { return this.currPolys.filter(p => !this.current.PolyMonitors.includes(p.id)); },
    switched() { return this.current?.disabled ?? false; },
    activate(){ return this.switched ? 'activate' : 'inactivate'; },
    blackList(){ 
      var lst = [];
      for(var p in this.black){
        lst.push(this.black[p].name);
      } 
      return lst;
    },
    details(){
      var lst = [];
      for(var m in this.current?.status){
        lst.push({
            name: this.findByMAC(m)?.name,
            device: this.findByMAC(m)?.name,
            last: this.showTime(this.current?.status[m].ts),
            battery: this.current?.status[m].battery,
            signal: this.current?.status[m].signal,
            linkDevice: this.linkStatus(this.current?.status[m].down),
            linkServer: this.linkStatus(this.current?.status[m].up),
          })
      }
      return lst;
    },
  },

  watch:{
    $route: {
      immediate: true,
      handler() { this.currid = this.$route.query.id; this.mode = 'view'; },
    },

    search_text(){ 
      if(this.search_text == '') this.clearSearch();
      // else this.filterFun();
    }
  },

  mounted: function(){
    this.$store.dispatch('manage/loadGateways');
    // this.$store.dispatch('manage/loadBackupGw');
    this.interval = setInterval(()=> this.$store.dispatch('manage/loadGateways'), 5000);
    this.$store.dispatch('manage/loadCurrPolys');
    
  },

  unmounted: function(){
    clearInterval(this.interval);
  },

  methods:{
    clearSearch(){
      this.search_text = '';
      this.$store.dispatch('manage/loadGateways');
    },
    updatePoly(poly){ this.move(this.black, this.white, this.blackList.indexOf(poly));},
    move(fromList, toList, i) { toList.push(fromList.splice(i, 1)[0]); },
    linkStatus(s) { return ['', 'Lost', 'Found', 'Searching...', 'Trying to connect...', 'Connected'][s]; },
    findByMAC(mac) { return this.currPolys.find(pm => pm.mac === mac); },
    showTime(t) { if (t) return new Date(1000 * t).toLocaleString(); return '-'; },
    viewGW({_id}) { 
      var serial = _id;
      this.$store.dispatch('manage/loadCurrentGw', {serial});
      this.$router.push({ name: 'mngGateways', query: {id: _id} }); 
    },
    gwIsActive({lastSync}) {
      const t = this.clock / 1000 - (lastSync ?? 0);
      if (t <= 10) return 'green';
      else if(t <= 20) return 'yellow-7';
      return 'grey-8';
    },
    editStart() {
      this.currName = this.current.name;
      this.white.splice(0, this.white.length, ...this.attachedPMs);
      this.black.splice(0, this.black.length, ...this.unattachedPMs);
      this.mode = 'edit'; this.popUp_edit = true;
    },
    save() {
      this.$store.dispatch('manage/updateGW', {
        id: this.currid,
        name: this.currName,
        PolyMonitors: this.white.map(pm => pm.id),
      });
      this.mode = 'view';
      this.popUp_edit=false;
      this.popUp = true;
    },
  }
}
</script>

<style scoped>

.user_content {
  justify-content: space-between;
  grid-column: 2;
  grid-row: 1;
  align-items: flex-start;
  overflow: auto auto;
  font-size: medium;
}

@media (max-width: 50em){
  .user_content{
    grid-column: 1;
    grid-row: 2; 
    margin-left: 20px;
  }
}

.user_content span{
  color: white !important;
}

.buttons{
  position: absolute;
  right: 0px;
  bottom: 0; 
  display: flex;
  align-items: baseline;
}

.buttons button{
  /* background-color: var(--q-accent); */
  font-size: 0.9rem;
  /* color: white; */
  margin: 30px 10px 14px 0px;
}

.buttons button:disabled{
  opacity: .7;
}

.buttons button:is(:hover,:focus):not(:disabled){
  border-color: var(--fg-clicky);
}

.poly-list div,
.big {
  /* font-size: 1.1em;
  font-weight: 700; */
  color: var(--fg-dim);
}

.active{
  /* color: white;
  background: #5da3a7; */
  border-right: 4px solid #5da3a7;
  color: var(--bg-4);
}

.polyGroup{
  display: inline-table;
  margin: 30px 0 60px 0px;
}

table tr{
  margin-top: 5px;
  line-height: 2rem;
}

.q-icon{
  margin-left: 10px;
  margin-right: 13px;
}

</style>
