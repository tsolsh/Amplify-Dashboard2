<template>

  <div class="manage_all">
    <div class="user_content" v-if="currentName">
      <div class="table_details_header">
        <h3 style="color:var(--bg-4);">User {{currentName}} <q-icon name="account_circle"/></h3>
        <div>
          <q-btn 
            class="q-my-sm" id="edit_select" 
            @click.prevent="editUserBtn()" 
            :disabled="false"
            dense size="15px" flat
            icon="edit" style="color:var(--action);">
          </q-btn>
          <q-btn 
            class="q-my-sm" id="edit_select" 
            @click.prevent="editUserBtn()" 
            :disabled="true"
            dense size="15px" flat
            icon="delete" style="color:var(--action);margin-left:10px;">
          </q-btn>
        </div>
      </div>

      <table class="q-mt-md">
        <!-- <tr v-for="(attr, i) in currentAttr" :key="i">
          <th>{{attr.Name}}</th><td>{{attr.Value}}</td>
        </tr> -->
        <tr><th>sub:</th>
          <td>{{currentAttr?.find(n => n.Name === 'sub').Value}}</td>
        </tr>
        <tr><th>given_name:</th>
          <td>{{currentAttr?.find(n => n.Name === 'given_name').Value}} 
            <q-icon name="person"/>
          </td>
        </tr>
        <tr><th>family_name:</th>
          <td>{{currentAttr?.find(n => n.Name === 'family_name').Value}} 
            <q-icon name="people"/>
          </td>
        </tr>
        <tr><th>phone_number:</th>
          <td>{{currentAttr?.find(n => n.Name === 'phone_number').Value}}
            <q-icon name="call"/>
          </td>
        </tr>
        <tr><th>email:</th>
          <td>{{currentAttr?.find(n => n.Name === 'email').Value}}
            <q-icon name="email"/>
          </td>
        </tr> 
        
        <tr><th>roles:</th>
          <td v-for="role in roles" :key="role">{{role}}
            <!-- <q-icon name="email"/> -->
          </td>
        </tr> 

        <tr><th>Created:</th>
          <td>{{current?.UserCreateDate}} 
            <q-icon name="event"/>
          </td>
        </tr>
        <tr><th>Last modified:</th>
          <td>{{current?.UserLastModifiedDate}} 
            <q-icon name="event_available"/>
          </td>
        </tr>
        <tr style="margin-top: 20px;"><th>email_verified:</th>
          <td>{{currentAttr?.find(n => n.Name === 'email_verified').Value? 'Yes': 'No'}}
             <q-icon :name="currentAttr?.find(n => n.Name === 'email_verified').Value === 'true'? 'verified':''"/>
          </td>
        </tr>
        <tr><th>phone_number_verified:</th>
          <td>{{currentAttr?.find(n => n.Name === 'phone_number_verified').Value? 'Yes': 'No'}} 
            <q-icon :name="currentAttr?.find(n => n.Name === 'phone_number_verified').Value ? 'verified':''"/>
          </td>
        </tr>
        <tr><th>Enabled:</th>
          <td>{{current?.Enabled? 'Yes': 'No'}} 
          <q-icon :name="current?.Enabled? 'verified':''"/>
          </td>
        </tr>
      </table>

       <!-- Edit/ ADD User -->
      <q-dialog v-model="popUp_edit">
        <q-card class="add_input" id="edit_pat_form" @input="saveChanges($event)" style="min-width: 26%;background:var(--bg);grid-column: 1;font-size: large;">
          <h3 class="dialog_title shadow-3">{{saveBtn}} User {{saveBtn == 'Edit' ? currentName: ''}}</h3>
          <table class="editTable q-pa-md">
            <tr><th>Given name:</th> 
              <td>
                <q-input v-model="currUser.given_name" :placeholder="saveBtn !== 'Add'? currentAttr?.find(n => n.Name === 'given_name').Value : ''" 
                name="given_name" :class="{problem: problems.given_name}" bg-color="brown-1" filled dense/>
                <span class="required">{{problems.given_name}}</span>
              </td>
            </tr>

            <tr><th>Family name</th> 
              <td>
                <q-input v-model="currUser.family_name" :placeholder="saveBtn !== 'Add'? currentAttr?.find(n => n.Name === 'family_name').Value: ''"
                  name="family_name" :class="{problem: problems.family_name}" bg-color="brown-1" filled dense/>
                <span class="required">{{problems.family_name}}</span>
              </td>
            </tr>

            <tr><th>Phone №:</th> 
              <td>
                <q-input v-model="currUser.phone_number" :placeholder="saveBtn !== 'Add'? currentAttr?.find(n => n.Name === 'phone_number').Value:''" 
                name="phone_number" :class="{problem: problems.phone_number}" bg-color="brown-1" filled dense/>
                <span class="required">{{problems.phone_number}}</span>
              </td>
            </tr>

            <tr><th>email:</th> 
              <td>
                <q-input v-model="currUser.email" :placeholder="saveBtn !== 'Add'? currentAttr?.find(n => n.Name === 'email').Value: ''" 
                name="email" :class="{problem: problems.email}" bg-color="brown-1" filled dense/>
                <span class="required">{{problems.email}}</span>
              </td>
            </tr>
      
            <!-- <tr>
              <div v-if="currid" style="display: flex;align-items: baseline;font-weight:700;">
                <label for="Users_enabled">Active:</label>
                <input id="Users_enabled" type="checkbox" v-model="UserEnabled"/>
                <q-toggle v-model="UserEnabled" label="Active" left-label color="yellow-8" id="Users_enabled"/>
              </div>
            </tr> -->
          </table>

          <form class="edit_input" id="edit_form">
            <div class="update_loc">
            <q-btn label="Save" type="submit" id="Users_saveNewPat" @click.prevent="addNewUser()" text-color="white" color="accent" dense no-caps/>
            <q-btn label="Cancel" type="submit" id="Users_Cancel" class="cancelBtn" @click.prevent="cancleBtn()" color="white" text-color="accent" flat dense no-caps/>
            </div>
          </form> 
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
            User {{currentName}} {{saveBtn == 'Edit'? 'Saved': 'Added'}} successfully <q-icon name="verified"></q-icon>
          </q-card-section>
        </q-card>
      </q-dialog>

    </div>

    <div id="userTable">
      <!-- class="q-ml-md q-mr-xl shadow-9"  -->
      <div style="max-width: 350px;" class="shadow-9">
        <q-toolbar style="color: var(--text-primary);box-shadow: 0 3px 5px -6px rgb(0 0 0);">
          <q-toolbar-title style="font-size:large;font-weight:600;display: flex; justify-content: space-around;">Users</q-toolbar-title>
          <!-- <q-btn class="add_ses_table2 bg-orange-7 q-my-sm no-padding"
            clickable @click="addUserBtn()" 
            round dense size="11px" 
            id="Users_addUserBtn" :icon="'add'">
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
          <q-item v-for="user in filteredUsers" :key="user" class="q-my-sm" clickable @click="showContent(user.Username)" v-ripple 
          :active="currentName == user?.Username" active-class="active" style="font-size:medium">
            <q-item-section avatar center>
              <q-avatar color="secondary" text-color="white" clickable class="q-my-sm no-padding">
                {{ user?.Username.charAt(0).toUpperCase() }}
              </q-avatar>
              {{ user?.Username }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import config from '../../../public/PatientConfig.json';

export default {
  
  name: 'Users',
  components: { },

  setup () {
    // const loading = ref(false)
    const search_text = ref('')
    return {
      // loading,
      search_text,
    }
  },

  data(){
    return{
      hideData: true,
      saveBtn: 'Edit',
      pop: false,
      popUp_edit:false,
      popUp: false,
      warning: false,
      config: config, 
      disable: false,
      clicked: '',
      search: false,
      currentName: '',
      fields: {},
      new_gender: null,
      problems: {
        given_name: null,
        family_name: null,
        phone_number: null,
        email: null,
      },
      currUser: {
        given_name: null,
        family_name: null,
        phone_number: null,
        email: null,
        // disabled: false,
      },
    }
  },

  mounted: function(){
    // this.$store.dispatch('manage/loadUsers');
    this.$store.dispatch('auth/getUsers');
  },

  computed:{
    users() { return this.$store.state.auth.usersList; },
    username_clicked() { return this.$store.state.auth.username; },
    roles() { return this.$store.state.auth.roles; },
    filteredUsers() { 
      if(this.search){ 
        return this.users.filter(item => {
          var name = item.Username?.toString() ?? '';
          return this.search_text
            .toLowerCase()
            .split(" ")
            .every(v => name.toLowerCase().includes(v));
        }); 
      }
      return this.users;
    },
    current() { return this.$store.state.manage.currentUser; },
    currentAttr () { return this.current?.Attributes; }, 
    switched() {
      return this.currUser?.disabled?? false;
    },
    activate(){ return this.switched? 'activate':'inactivate'; }
  },

  watch:{
    $route: {
      immediate: true,
      async handler() {
        this.action = this.$route.params.action;
        this.currentName = this.$route.params.username;
        // this.current = this.users.find(s => s.Username === this.currentName); 
      },
    },
    search_text(){ 
      if(this.search_text == '') this.clearSearch();
      // else this.filterFun();
    }
  },

  methods:{
    showContent(username){
      this.hideData = this.warning = false;
      this.clicked = '';
      var user = this.users.find(u=> u.Username === username);
      // this.copyUser(user);
      this.$store.dispatch('manage/loadCurrentUser', { user });
      var name = 'mngUsers', id = this.currentAttr.find(n => n.Name === 'sub').Value;
      this.$router.push({ name, params: {username: username, id: id} });
      this.$store.dispatch('auth/setUsername', { username });
      this.$store.dispatch('auth/getUserRoles',{username});
    },

    copyUser(user) {
      var key;
      if (!user) {
        for (key in this.currUser) this.currUser[key] = null;
        return;
      }
      for (key in this.currUser) this.currUser[key] = user[key];
    },

    noProblems() {
      for (let key in this.problems) this.problems[key] = null;
    },

    saveChanges(e){
      const el = e.target; var inputVal = el.value;
      if(el.value!="") {
        if(el.type == 'number') { inputVal = parseFloat(inputVal); }
        this.fields[el.name] = inputVal
      }
      this.disable = true;
    },

    addNewUser(){
      if(this.fields['given_name']) {
        for(var i in this.users){
          // if(!this.users[i].Username) { continue; }
          var name = this.users[i].Attributes.find(at=> at.Name === 'given_name').Value;
          var currsub = this.currentAttr.find(at=> at.Name === 'sub').Value;
          var sub = this.users[i].Attributes.find(at=> at.Name === 'sub').Value;
          if(this.fields['given_name'] == name && currsub != sub){
            this.warning = true;
            return;
          }
          else{
            this.warning = false;
          }
        }
      }

      if (this.saveBtn == 'Edit'){
        for(var p in this.currUser){
          if(!(p in this.fields)) { this.fields[p] = this.currUser[p]; }
        }
      }
      // if (!this.fields['given_name']) this.problems.given_name = 'Required';
      // if (!this.fields['family_name']) this.problems.family_name = 'Required';
      // if (!this.fields['phone_number']) this.problems.phone_number = 'Required';
      // if (!this.fields['email']) this.problems.email = 'Required';

      if (Object.values(this.problems).filter(v => v).length === 0) {
        
        var attr = [];
        if (this.saveBtn == 'Edit'){
          for(var f in this.fields){
            if(this.fields[f] == null) continue;
            attr.push({'Name': f, 'Value': this.fields[f]});
          }
        }

        /*
        var attributes = {};
        for(var at in this.currentAttr){
          attributes[this.currentAttr[at].Name] = this.currentAttr[at].Value;
        }
        var user = this.users.find(u => u.Username === this.currentName);
        this.$store.dispatch('auth/updateUser', {user,attributes});
        */
        
        var userData = {Username: this.currentName, Attributes: attr}
        this.$store.dispatch('auth/updateUser', {userData});
        this.popUp = true;
        this.noProblems();
        this.cancleBtn();
      }
    },

    editUserBtn(){
      this.clicked ='edit_user', this.saveBtn = 'Edit';
      this.popUp_edit = true;
      this.fields = {};
    },

     addUserBtn(){
      this.clicked = 'edit_pat'; this.saveBtn = 'Add';
      this.popUp_edit = true;
      this.fields = {};
    },

    cancleBtn(){
      this.clicked='';
      this.disabled= this.warning = this.popUp_edit= false;
    },

    clearSearch(){
      this.search_text = '';
      this.$store.dispatch('manage/loadUsers');
    },
  }

}
</script>

<style scoped>

table tr{
  margin-top: 5px;
  line-height: 2rem;
}

table td{ 
  margin-left: 30px;
  display: flex;
  align-items: center
}

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

.user_list{
  text-align: left;
}

.q-avatar__content.row.flex-center.overflow-hidden {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.q-avatar__content.row {
  display: flex !important;
  align-items: center !important;
  justify-content: space-around !important;
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

@media (max-width: 50em){
  .user_list{
    height: inherit;
    position: absolute;
  }
  .manu{
    height:20%;
  }
}

.active{
  /* color: white;
  background: #5da3a7; */
  border-right: 4px solid #5da3a7;
}

.form-popup {
  grid-row: 1;
  grid-column: 2;
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

.q-input{
  min-width: 220px;
}

.q-icon{
  margin-left: 10px;
  margin-right: 13px;
}

</style>
