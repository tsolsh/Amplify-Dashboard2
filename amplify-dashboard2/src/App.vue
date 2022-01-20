<template>
  <q-layout v-if="visible" view="hHh Lpr fFf" style="position: relative;">
    <Header/>

    <q-toolbar v-show="visible && user">
      <q-drawer 
        v-model="leftDrawerOpen"
        bordered elevated
        :width="200" :breakpoint="0"
        :mini="miniState" show-if-above 
        @mouseover="miniState = false"
        @mouseout="miniState = true"
        class="bg-primary text-white"
      >
        <q-list style="position: relative; top: 15%;">
          <div v-for="mi in menuList" :key="mi.link">
            <q-item v-show="permits.includes(mi.label)" :to="mi.link" clickable :class="isActive(mi)? 'appDrawer active': 'appDrawer'" v-ripple :disable="server === null || !ready" style="line-height: 3.3rem;">
              <q-item-section avatar><q-icon :name="mi.icon" style=""/></q-item-section>
              <q-item-section>{{ mi.label }}</q-item-section>
            </q-item>
          </div>
        </q-list>
      </q-drawer>
    </q-toolbar>
    
    <q-page-container class="q-pl-xl q-pt-none appCont" style="background(--bg);overflow-y: scroll; position: absolute; bottom: 0;height: 94%; top: 6%; right: 0;left: 0;">
      <p v-if="server === null" class="serverMsg">Connecting...<q-spinner-facebook color="primary" size="1.7em" /></p>
      <p v-else-if="!ready" class="serverMsg">Connecting...<q-spinner-facebook color="primary" size="1.7em"/></p>
      <router-view v-else-if="user" :key="$route.name"/>
      <Login v-else-if="login" /> 
      <Guest v-else />
    </q-page-container>
    <Footer v-if="user"/>
  </q-layout>
  <router-view v-else-if="user"/>
  <Login v-else />
</template>


<script>
import { mapState , mapGetters} from 'vuex'
import { handleError } from '../src/services/api.js'
import Header from '../src/components/Layout/Header.vue';
import Login from '../src/components/Layout/Login.vue';
import Footer from '../src/components/Layout/Footer.vue';
import Guest from '../src/components/Layout/Guest.vue';
import { ref } from 'vue'
import { useMeta } from 'quasar'

const menuList = [
  {
    icon: 'account_circle',
    label: 'Users',
    link: '/users',
  },
  {
    icon: 'hub',
    label: 'PolyMonitors',
    link:'/polymonitors',
  },
  {
    icon: 'call_split',
    label: 'Gateways',
    link: '/gateways',
  },
  {
    icon: 'room_preferences',
    label: 'Locations',
    link:'/locations',
  },
  {
    icon: 'badge',
    label: 'Patients',
    link:'/patients',
  },
  {
    icon: 'receipt_long',
    label: 'Sessions',
    link: '/session',
  },  
  
]

export default {
  name: 'App',
  components: { 
    Login,
    Footer,
    Header,
    Guest,
    },

  setup () {
    const title = ref('Develope - ATLASense Biomede') // we define the "title" prop
    useMeta(() => {
      return {
        title: title.value
      }
    })

    function setAnotherTitle (newTitle) {
      title.value = newTitle 
    }

    const leftDrawerOpen = ref(false)
    return { 
      miniState: ref(true),
      menuList,
      leftDrawerOpen,
      setAnotherTitle,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },

   data() {
    return {
      permits: [],
    }
  },

  computed: {
    ...mapGetters('auth', ['roles']),
    ...mapState('env', ['server']),
    ...mapState('auth', ['ready', 'user']),
    ...mapState('layout', ['visible', 'login']),
    perms(){ return this.user ? this.$store.state.sessions.permissions : null; },
    port(){ return this.$store.state.env.port }
  },
  
  watch:{
    server() { this.$store.dispatch('auth/autoLogin'); },
    user() {
      this.$store.dispatch('sessions/loadPermissions');
      this.$store.dispatch('env/initUserUnits');
    },
    perms(){
      if(this.perms){
        this.checkPermissions();
      }
    },
    port(){ 
      switch(this.port){
        case '':
          this.setAnotherTitle('Develope - ATLASense Biomed')
          break;
        case 8000: this.setAnotherTitle('Develope - ATLASense Biomed'); break;
        case 8080: this.setAnotherTitle('QA - ATLASense Biomed'); break;
        case 9090: this.setAnotherTitle('Develope - ATLASense Biomed'); break;
        default: this.setAnotherTitle('default');
      }
    }
  },
  created() {
    this.$store.dispatch('env/startTheClock');
    this.$store.commit('layout/setColourScheme');
    this.$store.commit('live/setAnimation');
    this.$store.commit('live/setECGMeasures');
    this.$store.commit('live/setRespMeasures');
    this.$store.dispatch('env/load');
    this.$store.dispatch('env/setPort');
    handleError(error => {
      console.info(error); // TODO: logout if 403, message unauthorized if 401
      return Promise.reject(error);
    }/*, res=>{
      console.info(res.config.url, res.data);
      return res;
    }*/);
  },
  methods: {
    isActive({link}) { return this.$route.path.startsWith(link); },
    checkPermissions() {
      if(this.roles.includes('user-group') || this.roles.includes('web-admin')|| this.roles.includes('research-group')) {
        this.permits.push('Patients','Sessions','Gateways','PolyMonitors','Locations', 'Users'); 
      } 
      else if(this.roles.includes('patient-group')) {
        this.permits.push('Patients','Sessions');
      }
      else if(this.roles.includes('nurse-group')) {
        this.permits.push('Sessions');
        var name = 'Sessions'
        this.$router.push({name});
      }
      else if(this.roles.includes('gateway')) {
        this.permits.push('Gateways');
        var name = 'mngGateways'
        this.$router.push({name});
      }// }else if(this.perms.includes('MANAGE_USERS')) {
      //   this.permits.push('Users','Sessions');
      // }else if(this.perms.includes('MANAGE_PM')) {
      //   this.permits.push('PolyMonitors','Sessions');// 
      
    }
  },
}
</script>


<style>
.q-toolbar__title {
    flex: 1 1 0%;
    min-width: 1px;
    max-width: 100%;
    font-size: 15px;
    font-weight: normal;
    letter-spacing: 0.01em;
    padding: 0 12px;
}
/* @font-face { 
  font-family: 'PT Sans';
  font-style: normal;
  font-weight: 400;
  src: local('PT Sans'), local('PTSans-Regular'),
      url('./fonts/pt-sans-v12-latin-regular.woff2') format('woff2'), 
      url('./fonts/pt-sans-v12-latin-regular.woff') format('woff'); 
}*/

* {
   /* box-sizing: border-box;  */
   font-family: "Avenir Next",-apple-system,Segoe UI,sans-serif
   
   }

:is(a, button, input):disabled {
  cursor: not-allowed;
}

area, :is(a, button):not(:disabled), form:not([disabled]) label, summary {
  cursor: pointer;
}

/* Trademark */

svg.as-logo { fill: #fff; color: #fff; filter: drop-shadow(1px 1px 0 #13b5b5); transition: all 1s ease; }
svg.as-logo:hover { fill: #9f9; color: #9ff; filter: drop-shadow(1px 1px 1px #000); }

em.PM {
  color: var(--poly);
  /*display: inline-block;*/
  font: 600 1em Arial, sans-serif;
  transform: scaleY(.9);
}

em.PM b {
  font-weight: 700;
}

body, h1, h2 {
  /* margin: 0; */
  /* font-family: Trebuchet MS; */
  overflow: hidden;
}

.select select, .select::after {
  grid-area: select;
}

.select:not(.select--multiple)::after {
  content: "";
  justify-self: end;
  width: 0.8em;
  height: 0.5em;
  background-color: var(--select-arrow);
  -webkit-clip-path: polygon(100% 0%, 0 0%, 50% 100%);
          clip-path: polygon(100% 0%, 0 0%, 50% 100%);
}

.select--disabled {
  cursor: not-allowed;
  background-color: #eee;
  background-image: linear-gradient(to top, #ddd, #eee 33%);
}

.disable{
  display:inline-block;
  padding: 0.1em 0.7em;
  border-radius:2em;
  box-sizing: border-box;
  text-decoration:none;
  /* font-family:Trebuchet MS; */
  font-weight:300;
  font-size: large;
  text-align:center;
  background-color:teal;
  cursor: pointer;
  color: rgba(255,255,255,1);
  transition: all 0.5s;
  border: 1px solid rgba(255,255,255,0.5);
  margin-left: 80%;
  position:absolute;
}

.serverMsg{
  left: 42%;
  top: 42%;
  position: absolute;
  font-size: 1.5rem;
  color: var(--q-primary);
  /* font-family: trebuchet ms; */
}

@keyframes rotating {
  from {transform: rotate(0deg);}
  to {transform: rotate(-360deg);}
}

#overlay {
  display: none;
  position: absolute;
  background: rgb(0 0 0 / 71%);
  width: 100%;
  height:100%;
  padding: 20px;
  z-index: 2;
  bottom: 0px;
}

.ses-list {border-collapse: collapse;margin: .5em 0}
.ses-list :is(td,th) {border: 1px solid #00f;font-weight: 100;padding:.1em .5em}
.ses-list a { color: blue; font-weight:900 }
:is(.ses-list,footer) svg { height: 1em; width:1em; vertical-align: middle; }


@keyframes grow {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.03);
  }
}

div > a {
  text-decoration: none;
}

/*~- Login/Signup Popups -~*/
#togglePass, #togglePass2{
  margin-left: -30px;
  margin-top: 15px;
  position: absolute;
  text-decoration: none;
  font-size: x-large;
}

form.token {
    background: #3b7373;
    border: 0px outset darkcyan;
    border-radius: 1ex;
    width: 21em;
    margin: -2em auto;
    padding-bottom: 1em;
    box-shadow: 7px 6px 6px rgb(0 0 0 / 30%);
}

form.token > * {
    display: block;
    margin: 2rem auto;
    width: 15rem;
    color:white;
    cursor: pointer;
}

@media (max-height: 30em){
    form.token > * {
        margin: 0 auto;
    }
}

form.token h1 {
  text-align: center;
  FONT-SIZE: xx-large;
  color:white;
  display: table-cell;
}

form.token [type="submit"] {
  background-color: #094040;
  border: none;
  /* box-shadow: inset 0px 1px 0px #2be, 0px 5px 0px 0px #577, 0px 10px 5px #999; */
  cursor: pointer;
  /* height: 2em; */
  font-size: 1em;
  font-weight: bold;
  color: #9ed6d6;
  text-transform: uppercase;
  text-align: center;
  padding: 0ex;
}

form.token [type="submit"]:hover {
	/* transition: background 0.1s linear; */
  background-color: #305d5d;
  border: solid;
}

form.token .error:not(:empty) {
  color: red;
  border: solid;
  text-align: center;
}

/*~- Fluid Layout (narrow displays) -~*/

@media (min-width: 50em) {
  #loginRequired { top: 3em; }
}

@media (max-width: 50em) {
  header {
    flex-flow: row wrap;
  }

  header h1 {
    order: 99;
    flex: 1 0 100%;
    text-align: center;
  }
  #loginRequired { top: 0; }
}
/**************************************************************************************************/
.input-group {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.input-group:last-of-type {
  border-top: none;
}

.input-group span {
  min-width: 53px;
  border: none;
}

.input-group span i {
  font-size: 1.5em;
  color: rgba(255, 255, 255, 0.2);
}

.btn {
  color: darkcyan;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  line-height: 45px;
  margin: 0 0 2em;
  max-width: 90px;
  height: 55px;
  position: relative;
  text-decoration: none;
  text-transform: uppercase;
  width: 100%; 
}

@media (min-width: 600px) {
  .btn {
    margin: 0 1em 2em;
  }
}

.btn:hover::before{
	transform: rotateX(60deg) translate(0px,40px) ;
}
.btn:hover::after{
	transform: rotateX(-60deg) translate(0px,-40px) ;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }
  50%,100% {
    left: 100%;
  }
} 


.problem{
  background-color: var(--bg-problem) !important;
  color: var(--fg-problem) !important;
}

details[open] summary ~ * {
  animation: sweep .5s ease-in-out;
}

@keyframes sweep {
  0%    {opacity: 0; margin-left: -10px}
  100%  {opacity: 1; margin-left: 0px}
}

:not([open]) > summary {
  color: var(--q-secondary);
  margin-top: 4px;
  font-weight: bold;
}

[open] > summary {
    color: var(--q-primary);
    font-weight: 600;
    /* width: 39%; */
    font-size:0.9rem;
    /* text-decoration: underline; */
    text-shadow: 0px 0px 1px #0080806b;
    margin-top: 14px;
    /* display: contents; */
}

:not([open]) > summary::after {
    content: '...';
    color: #ddffff;
}

.checkOpen{
  display: inline;
}

details > :is(div, form) {
  padding-left: 0.5em;
  /* border-left: thin solid var(--q-primary); */
  /* border-top: 2px solid var(--bg-2); */
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
}

.showNext + label::after {
    content: '...'
}

.showNext:checked + label::after {
    content: ':';
}

.showNext + label + fieldset {
    margin: .1em .1em 0 .8em;
    max-height: 50em;
    transition: max-height 1s ease;
}

.showNext:not(:checked) + label + fieldset {
    display: none;
    max-height: 0;
}

input[type="number"] {
    width: 4em;
}

th { text-align: left; }

.scale {
    display: flex;
    justify-content: space-between;
}

    .scale > * {
        flex: 1 0 3em;
        text-align: center;
    }

    .scale > :first-child {
        text-align: left;
    }

    .scale > :last-child {
        text-align: right;
    }

nav {
  display: flex;
  background: #eee;
  padding: 0;
}

  nav a {
    text-decoration: none;
    color: var(--fg-clicky);
    padding: .5em;
    background: #f7f7f7;
    border: thin solid #009;
    border-radius: 1em 1em 0 0 / 100%;
  }

    nav a.active {
      background: #fff;
      border-bottom: none;
    }

nav span::before {
  content: '';
  background: #f33;
  width: .8em;
  height: .8em;
  display: inline-block;
  border-radius: 50%;
  margin-right: .2em;
}

nav.saved span::before {
    background: lime;
}

nav span::after {
    content: 'not saved';
    color: #f33;
    margin-right: 1em;
}

nav.saved span::after {
    content: 'saved';
    color: #0c0
}

time.timer {
  background: black;
  border: thin inset green;
  color: lime;
  display: inline-block;
  font: 700 1.1em monospace;
  min-width: 7em;
}
time.timer::before {
    content: '⏱ '
}

.form-elements {
    display: table;
}

.form-elements.solo{
  /* border-left: thick solid var(--bg-2); */
  margin-bottom: 14px;
  position: relative;
}

.form-elements.solo label{
  margin:6px 4px;
  align-items: center;
  display: flex;
  font-weight: 600;
  border-left: none !important;
  /* color: var(--q-primary); */
}

.form-elements > .row {
    display: table-row;
    vertical-align: baseline;
    margin-right: 15px;
    margin-top: 3px;
}

label.row:focus-within {
  background-color: var(--bg-focused);
  color: var(--fg-focused);
}

label.row:hover {
  background-color: var(--bg-highlight);
  color: var(--fg-highlight);
}


.appDrawer.active{
  border-right: 3px solid white;
  font-weight: 700;
  color:white;
  background: #20756d;
}

.active::after{
  transition: all 3s ease;
}

.row > * {
  display: table-cell;
  vertical-align: baseline;
}

.row > span {
    line-height: 1.5em;
    padding: .1em .5em;
    /* font-weight: 600; */
    /* font-family: Trebuchet MS; */
    /* color: var(--q-primary); */
}

.row :is(input, select) {
  /* background: var(--input); */
  font-size: 1em;
  margin: 0 .2em;
  /* height: 1.4em;
  margin: .1em .5em; */
  /* border-style: none none solid;
  border-width: 2px thin;
  border: none;
  box-shadow: 0px 0px 4px #495858; */
}

details,summary{
  display: revert;
}

/*~- RTL (Chrome auto translate) -~*/

.lang-hint { display: none; }

.translated-rtl body { direction: rtl; }
.translated-rtl .lang-hint,
.translated-ltr .lang-hint { display: inline; font-style: inherit; }

.translated-rtl .session-list li.active {
    transform: translate(-1ex, -1px);
}
.translated-rtl [open] > summary {
    background: linear-gradient(-2deg, #0cc 9%, #dff 10%, #dff 30%, transparent 31%);
}

.translated-rtl details > div {
    border-left: none;
    padding-right: .5em;
    border-right: thick solid #0cc;
}

.ECG { --wave-line-color: var(--ecg); }
.Respiration { --wave-line-color: var(--resp); }

:root {
    color-scheme: light;
    --bg: #fff;
    --bg-1: #e8fafa;
    --bg-2: #9cc;
    --bg-3: #0cc;
    --bg-4: #009688;
    --bg-highlight: #fed;
    --bg-focused: #fde;
    --bg-problem: #fab;
    --fg: #000;
    --fg-dim: #047878;
    --fg-alt: #ffe;
    --fg-clicky: #009;
    --fg-highlight: #800;
    --fg-problem: #c00;

    --list: #e2ffff96;
    --nav: #fff;/*#f0f3f3;*/
    --nav-icon: #000;
    --ecg: green;
    --resp: darkcyan;
    --temp: #555;
    --rii: #c60;
    --bp: #88c177;
    --poly: #228844;
    
    --edit: #388e3c;
    --action: #43525a;
    --bg-ok: transparent;
    --bg-warn: #fed;
    --bg-alert: #ff0;
    --fg-ok: #42085c;
    --fg-warn: #f60;
    --fg-alert: #f00;
    --contents: white;
    --text: black;
    --input: transparent;
    --text-primary: #0a665d;
    --accent: #342661;
    
    --wave-title-color: rgb(90% 60% 0%);
    --wave-legend-color: rgb(60% 20% 40%);
    --wave-line-color: red;
    --wave-grid-color: rgb(60% 60% 60% / .6);
    --wave-t-axis-color: rgb(60% 20% 40%);
}

body.darkScheme,
.forceDarkScheme {
    color-scheme: dark;
    --bg: #0b3d39;
    --bg-1: #337d7d;
    --bg-2: #066;
    --bg-3: #009999;
    --bg-4: #7dbfbf;
    --bg-popup: rgb(0 51 0 / .9);
    --bg-highlight: #e9b668a8;
    --bg-focused: #603;
    --bg-problem: #900;
    --fg: #cee;
    --fg-popup: #efe;
    --fg-dim: #0cc;
    --fg-alt: #eed;
    --fg-clicky: #30f;
    --fg-highlight: #fea;
    --fg-problem: #ee3;

    --list: #8ccccc;
    --action: #e0e6e9;
    --nav: #194542;
    --nav-icon: #7dbfbf;
    --ecg: rgb(27, 183, 189);
    --hr: var(--ecg);
    --resp: cyan;
    --temp: white;
    --rii: #4a0;
    --bp: magenta;
    --contents: black;
    --text: white;
    --input: #028080;
    --poly: #4db370;
    
    --edit: #53c461;
    --bg-warn: #300;
    --bg-alert: #fc0;
    --fg-ok: #42085c;
    --fg-warn: #ee0;
    --fg-alert: #f00;
    --text-primary: #ffffff;
    --accent: #8468df;
    --wave-title-color: rgb(94% 80% 0%);
    --wave-legend-color: rgb(80% 40% 60%);
}

:root {
    --anim-linear: linear;
    --anim-ease: ease; 
    --anim-ease-in: ease-in; 
    --anim-ease-out: ease-out; 
}
/*
.ANIM-Smooth {
    --anim-linear: linear;
    --anim-ease: ease; 
    --anim-ease-in: ease-in; 
    --anim-ease-out: ease-out; 
}*/

.ANIM-Bulky {
    --anim-linear: steps(5, start);
    --anim-ease: steps(5, start); 
    --anim-ease-in: steps(5, start); 
    --anim-ease-out: steps(5, start); 
}

.ANIM-Minimal {
    --anim-linear: steps(2, start);
    --anim-ease: steps(2, start); 
    --anim-ease-in: steps(2, start); 
    --anim-ease-out: steps(2, start);
}

.ANIM-Off {
    --anim-linear: step-start;
    --anim-ease: step-start; 
    --anim-ease-in: step-start; 
    --anim-ease-out: step-start; 
}

body {
  background: var(--bg);
  color: var(--fg);
  --hr: var(--ecg);
}

.appCont{
  top: 0 !important;
}
</style>