<template>
<div class="content">
  <!-- <div class="header"> -->
  <!-- <h1 v-show="header_name!=''" class="manager_header" id="headerName"><q-icon :name="header_icon"/> -->
  <!-- </h1><span >{{header_name}}</span></div> -->
  <h6 v-if="$route.path == '/'" class="text-grey-8" style="position:absolute;top:39%;left:40%;line-height: 2.2em;">Welcome to Raphael Session Manager.
    <div>Open the left menu to see the options <q-icon name="menu_open" color="primary"/></div>
  </h6>
  <router-view :key="$route.name"/>
</div>
</template>

<script>

export default {

  name: 'Manager',
  components: {
  },

  data(){
    return{
      disableMenu: false,
    }
  },

  mounted: function(){
    this.$store.commit('sessions/setCurrent', {id: null});
    this.$store.dispatch('sessions/loadAll');
    this.$store.dispatch('sessions/loadSettings');
    this.$store.dispatch('manage/loadPatients');
    this.$store.dispatch('manage/loadPolys');
    // this.$store.dispatch('manage/loadFullWards');
    this.$store.dispatch('manage/loadUsers');
    
  },
  
  watch:{
    $route: {
      immediate: true,
      handler() {
        if(this.$route.path == '/') { this.disableMenu = true; this.header_name ='';}
        else{
          this.disableMenu = false;
          // this.header_name = this.$route.path.split('/')[1];
          // this.header_name = this.header_name.charAt(0).toUpperCase() + this.header_name.slice(1);
          // switch(this.header_name){
          //   case 'Patients': this.header_icon = 'badge'; break;
          //   case 'Gateways': this.header_icon = 'call_split';break;
          //   case 'Users': this.header_icon = 'account_circle';break;
          //   case 'Locations': this.header_icon = 'room_preferences';break;
          //   case 'Polymonitors': this.header_icon = 'hub';break;
          // }
        }
      },
    }
  },
}

</script>

<style>

.row{
  align-items: canter;
}

h1 {
  text-align: center;
}

h3 {
  /* color: var(--bg-4); */
  font-size: 1.7rem;
}

.content {
  /* height: 91%; */
  margin-top: -4px;
  grid-row: 2;
  grid-column: 1/-1;
}

table tr, table td, table th{
  font-size: medium;
}

.table_details_header{
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #cfbfbf;
}

.action_header{
  text-transform: capitalize;
  margin-right: 70px;
  display: flex;
  align-items: center;
}

.dialog_title{
  /* box-shadow: 2px 0px 5px 3px grey; */
  color: white;
  font-size: 1.7rem; 
  margin: 0px;
  font-weight: 600;
  text-align: center;
  background: var(--q-secondary);
  padding:0px 4px 0px 4px;
  display: flex;
  justify-content: space-around;
  align-items: baseline;
}

.editTable{
  margin-bottom: 55px; 
  /* margin-left: 10px */
}

.editTable tr{
  line-height: 2.8rem;
}

.editTable th{
  font-weight: 500;
}

#choose_role{
  color: white;
  transition: all 0.3s;
  /* border: 1px solid rgba(255,255,255,0.5); */
  overflow: hidden;
  background-color: transparent;
  border-radius: 0.2em;
  font-size: x-large;
  border: none;
  display: block;
  position: absolute;
  margin-top: 20px;
  font-weight: 700;
  cursor: pointer;
  left:17px;
}

.grid-container {
  display: grid;
  grid-gap: 50px;
  grid-template-columns: auto auto auto;
  padding: 10px;
}

.grid-item {
  border: 1px solid rgba(0, 0, 0, 0.8);
  padding: 20px;
  font-size: 15px;
  text-align: center;
}

.roles div:empty::before {
  content: 'None';
}

.header{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 25px;
}

.header span{
  /* color: grey; */
  font-size: 1.5rem;
}

.manage_all{
  height: inherit;
  display: grid;
  grid-row-start: 1;
  grid-template-columns: 400px auto auto;
}

@media (max-width:50em) {
  .manage_all {
    grid-template-columns: 650px auto auto;
  }
  .action_header{
    margin-right: 10px;
  }
}

.user_list {
  text-align: left;
  height: -webkit-fill-available;
  padding: 15px 0 0;
  position: absolute;
  overflow-y: auto;
  list-style-type: none;
  background-color: var(--bg-1);
  box-shadow: inset 8px 3px 11px 0px #00000070;
  margin: 0;
  max-width: 20em;
  min-width: 15em;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  grid-area: sessions;
  margin-bottom: 58px;
  display: inline;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 2em 1fr;
}

.list__link {
  padding: 9px 14px;
  font-family: Verdana, Helvetica, sans-serif;
  font-size: 0.9em;
  font-weight: 700;
  display: block;
  text-decoration: none;
  color: var(--text);
  border-left: 5px solid transparent;
}

.list__link:hover {
  background: var(--bg-4);
  color: var(--bg);
}
a.list__link.active {
  background: var(--bg-4);
  color: var(--bg);
  border-right: 5px solid #009d9d;
}

.list__icon {
    padding-left: 10px;
}

.role-panel {
  z-index: 6;
  /* background: #ffffff; */
  padding: .5em;
  text-align: center;
  height: 70%;
  border-radius: 5px 5px;
  display: flex;
  flex-flow: column;
  align-content: flex-start;
  align-items: center;
  position: inherit;
}

#userManager{
  grid-column: 1;
  float:left;
  grid-row: 1;
}

.q-list--bordered {
  background: var(--bg-manager);
}

#switchOnOff[type=checkbox] {
  height: 0;
  width: 0;
  visibility: hidden;
}

#switch_label {
  cursor: pointer;
  border-radius: 100px;
  position: relative;
  grid-column: 5;
  grid-row: 1;
}

#switch_label:after {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  width: 18px;
  height: 17px;
  background: #fff;
  border-radius: 90px;
  transition: 0.3s;
}

#switchOnOff:checked + #switch_label {
  background: #70ce3e;/*#bada55;*/
}

#switchOnOff:checked + #switch_label:after {
  left: calc(100% - 5px);
  transform: translateX(-100%);
}

#switch_label:active:after {
  width: 55px;
}

.add_ses_table{
  background: transparent;
  border: none;
  cursor: copy;
  font-size: Xx-large;
}

.problem{
  display: inline-table;
}

[type="hidden"].problem ~ button { box-shadow: 0 0 .1em .1em red; }

.required{
  margin-left: 5px;
  color: var(--fg-problem);
}

</style>
