<template>
  <form v-show="!newPassword" @submit.prevent="login">
    <h1>Log In</h1>
    <label :class="{missing: user === ''}">
      <span style="color:var(--bg);">Username:</span>
      <input ref="userInput" id="login_username" dir="ltr" v-model.trim="user" required />
    </label>
    <label :class="{missing: password === ''}">
      <span style="color:var(--bg);">Password:</span>
      <input id="login_password" dir="ltr" :type="passType" v-model.trim="password" required />  
      <a id="login_showPassword" @click="toggleShowPassword"><q-icon :name="showPassword? 'visibility' : 'visibility_off'"/></a>
    </label>
    <p id="login_errorMsg" class="error">{{error}}</p>
    <q-btn type="submit" class="bg-primary shadow-5" text-color="white" label="Log In" no-caps size="1rem" style="display: flex;"></q-btn>
  </form>
  <form id="login_newPasswordForm" v-show="newPassword" @input="comparePass" @submit.prevent="updatePassword">
    <h1>Welcome, {{user}}</h1>
    <p>Please choose a new password:</p>
    <label :class="{missing: password1 === ''}">
      <span>New password:</span>
      <input id="login_newPassword" ref="pass1Input" dir="ltr" :type="passType" v-model.trim="password1" required />  
      <a id="login_showPassword" @click="toggleShowPassword">👁</a>
    </label>
    <label :class="{missing: password2 === ''}">
      <span>Repeat new password:</span>
      <input id="login_newPasswordRepeat" dir="ltr" :type="passType" v-model.trim="password2" required />
    </label>
    <p id="login_errorNewPasswordMsg" class="error">{{error}}</p>
    <button id="login_saveNewPassword" type="submit" class="btn" :disabled="passNotPass">Set New Password</button>
  </form>
</template>


<script>
import { ref } from 'vue'
import { mapState } from 'vuex'

export default {
  name: 'Login',

  setup() {
    return {
      userInput: ref(null),
      pass1Input: ref(null),
    };
  },

  data() {
    return {
      user: '',
      password: '',
      password1: '',
      password2: '',
      code:'',
      showPassword: false,
    }
  },

  computed: {
    ...mapState('auth', ['userName', 'error', 'newPassword']),
    passType() { return this.showPassword ? 'text' : 'password'; },
    passNotPass() { return this.password1 !== '' && this.password2 !== '' && this.password1 !== this.password2; },
  },
  
  mounted() {
    this.user = this.userName ?? '';
    this.userInput.focus();
  },

  watch: {
    newPassword(fn){
      if (fn) {
        this.password = '';
        this.pass1Input.focus();
      } else {
        this.password1 = this.password2 = '';
        this.userInput.focus();
      }
    }
  },

  methods:{
    login() {
      // this.$store.dispatch('auth/login', {
      //   Username: this.user,
      //   Password: this.password
      // });
      var username = this.user, password= this.password;
       this.$store.dispatch('auth/login',{username, password});
    },

    confirm(){
      var username = this.user, code= this.code;
      this.$store.dispatch('auth/confirmSignUp', {username, code});
    },

    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },

    comparePass() {
      this.$store.commit('auth/setError', {
        message: this.passNotPass ? 'Passwords are not identical.' : ''
      });
    },

    updatePassword() {
      if (this.password1 === this.password2)
        this.newPassword(this.password1);
    },
  }
}
</script>

<style scoped>

form {
  background: var(--q-secondary);
  /* border: 1px outset var(--fg-dim); */
  border-radius: 0.8ex;
  box-sizing: border-box;
  box-shadow: 7px 6px 6px rgb(0 0 0 / 30%);
  margin: auto;
  padding: 5ex;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 21em;
  width: fit-content;
}

form > * {
    display: block;
    margin: 1.3rem auto;
    width: 18em;
    width: fit-content;
    color: var(--fg);
    /* text-shadow: 0px 2px 3px #777777; */
}

@media (max-height: 30em){
    form > * {
        margin: 0 auto;
    }
}

h1 {
    text-align: center;
    font-size:2.3rem;
    margin-top: 0;
}

input {
  background: transparent;
  border: none;
  border-bottom: 1px solid #fff;
  color: var(--fg);
  font-size: 100%;
  height: 2em;
  outline: none;
  margin: 1ex 0 2ex;
  padding: .5ex 4ex .5ex 1ex;
  transition: box-shadow 0.3s;
  width: 100%;
}

input:focus {
  box-shadow: 0 0 .5em rgba(0,0,255,.5);
  outline: 0;
}

input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus,input:-webkit-autofill:active
{
 --webkit-box-shadow: 0 0 0 30px var(--bg-4) inset !important;
}

input:-webkit-autofill
{
 -webkit-text-fill-color: #000 !important;
}

label {
  display: block;
  padding: 1em 0 0;
  position: relative;
  margin: 1ex auto;
}

label span {
  color: var(--bg);
  position: absolute;
  top: -1ex;
  left: 0;
  padding: 8px 0;
  pointer-events: none;
  font-size: 95%;
  transition: .5s;
  }

label:not(:focus-within).missing span {
  top: 1ex;
  font-size: 85%;
  color: var(--fg);
  /* text-shadow: -1px 1px 0 var(--bg-2), -1px 1px 2px var(--bg-2); */
}

a {
  cursor: pointer;
  font-size: x-large;
  position: absolute;
  right: .2em;
}

.btn {
  background:var(--fg-dim);
  border: none;
  color: var(--bg);
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  height: 3em;
  line-height: 1em;
  padding: .5em 1em;
  position: relative;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  width: 100%;
  width: fit-content;
  max-width: initial;
	transition: background 0s linear;
  /* font: 1em Trebuchet MS; */
}

.btn:not(:disabled):hover {
  background: var(--bg-4);
  border: solid;
}

.btn:disabled:hover {
  background: var(--fg-problem);
  cursor: not-allowed;
}

.error:not(:empty) {
  background: var(--bg-warn);
  color: var(--fg-problem);
  border: 3px solid;
  padding: 1ex;
  text-align: center;
  max-width: 18em;
}
</style>
