<template>
    <div id="role-panel" class="role-panel" v-if="user && permitted">
        <h3 id="role-choice">Choose your role</h3>
        <router-link id="manager_icon" class="role-buttons" to="/manager">Manager  🛠️</router-link>
        <router-link id="home_icon" class="role-buttons" to="/session">Home Sessions  🏠</router-link>
    </div>
    <div v-else class="role-panel">
      <router-view :key="$route.path"/>
    </div>
</template>


<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Choose',
  data() {
    return {
     permitted: false,
    }
  },

  computed: {
    ...mapState('auth', ['user']),
    ...mapState('layout', ['visible']),
    ...mapGetters({
      currentSession: 'sessions/current',
      userName: 'auth/userName',
    }),
    perms(){ if(this.user) return this.$store.state.sessions.permissions;
    else return null;
    }
  },

  mounted:function(){
  
  },

  watch:{
    perms(){
      if(this.perms && this.perms.includes('EditSessions')){
          this.permitted = true;
      }
      else{
        var name = 'Guest';
        this.$router.push({name, params:{}});
      }
    }
  },

  methods: {
    
  },
}
</script>


<style scoped>

#role-choice{
  display: block;
  /* color:white; */
  font-size: 1.55rem;
  padding-top: 13px;
}

.roles div:empty::before {
  content: 'None';
}

.manager_header{
  padding-top: 11px;
  /* margin-bottom: revert; */
  font-family: inherit;
  font-weight: bolder;
  font-size: 2.3em;
  text-shadow: 1px 1px 10px rgb(24 80 80);
  color: white;
  background: linear-gradient(#0bb0b0, var(--bg-4));
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

.manage_all{
  height: inherit;
  display: grid;
  grid-row-start: 1;
  grid-template-columns: 371px auto auto;
}

.role-panel span{
  float: right;
}

/******************sidebar info*****************/
.role-panel {
  background: #ffffff;
  padding: .5em;
  text-align: center;
  /* height: 70%; */
  border-radius: 5px 5px;
  display: flex;
  flex-flow: column;
  align-items: center;
  position: relative;
  /* top: auto; */
  /* left: auto; */
  grid-column: 2;
  grid-row: 2;
  grid-template-columns: auto auto auto auto;
  flex-direction: column;
  justify-content: center;
}

.role-buttons{
  border: none;
  margin: 8px;
  box-shadow: 0 0 10px 0px rgb(0 0 0 / 50%);
  background-color: #199696;
  width: 230px;
  height: 35px;
  font-weight: bold;
  font-family: Trebuchet MS;
  font-size: large;
  transition: all 0.25s;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-around;
  align-content: stretch;
}

.role-buttons:hover{
  text-shadow:0px -40px 0px rgba(255, 255, 255, 0);
  transform:translateY(0%) translateZ(0) scale(1.1);
  color:#dcefef;
}

#sessionsPanel{
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: -webkit-pictograph;

}

@media (max-width: 50em){
  .role-buttons {
    height: auto;
    width: auto;
  }
  .user_list{
    height: inherit;
    position: absolute;
  }
  .manu{
    height:20%;
  }
  div.user_content{
    grid-column: 1;
    grid-row: 3/4;
  }
  .manage_all{
    grid-template-rows: 50px 50px auto;
  }
}
</style>
