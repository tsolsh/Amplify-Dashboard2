import auth from "../../services/auth.js"
import { Auth, API } from 'aws-amplify';
import api, { setToken } from "../../services/api.js"

export default {
  namespaced: true,
  state: {
    ready: false,
    error: '',
    user: null,
    newPassword: null,
    token: null,
    permissions: {},
    usersList: {},
    currentAttr: null,
    username: '',
    roles : [],
  },

  getters: {
    userName: state => state.user?.getUsername() ?? 'Guest',
    roles: state => state.user?.signInUserSession.getIdToken().payload["cognito:groups"] ?? [],
  },

  actions: {
    autoLogin ({commit}) {
      auth.recoverStoredUser(user => commit('login', user), () => commit('readyNow'));
      commit('readyNow');
    },

    async login ({commit}, {username,password}) {
      try {
        const user = await Auth.signIn(username, password);
        // console.info(user);
        commit('login', user);
      } catch (error) {
        commit('setError', error); 
      }
    },

    async signUp() {
      try {
        const { user } = await Auth.signUp({
          username,
          password,
          attributes: {
              email,
              phone_number,
          }
        });
        console.log(user);
        commit('login', user);
        commit('newPasswordFunction', true);
        try {
          await Auth.confirmSignUp(username, code);
        } catch (error) {
            console.log('error confirming sign up', error);
        }
      } catch (error) {
        console.log('error signing up:', error);
      }
    },

    async confirmSignUp({commit},{username, code}) {
      try {
        await Auth.confirmSignUp(username, code);
        commit('newPasswordFunction', false);
      } catch (error) {
          console.log('error confirming sign up', error);
      }
    },

    logout ({commit}) {
      commit('logout');
    },

    async getUserRoles({commit},{username}){
      const res = await api('user/get_user_roles/'+ username);
      commit('setUserRoles',res.data);
    },

    async getUsers ({commit}) {
      const res = await api('user/get_users');
      commit('setUsers',res.data);

      // let apiName = 'AdminQueries';
      // let path = '/listUsersInGroup';
      // let myInit = { 
      //     queryStringParameters: {
      //       "groupname": "user-group",
      //       "token": nextToken
      //     },
      //     headers: {
      //       'Content-Type' : 'application/json',
      //       Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      //     }
      // }
      // const { NextToken, ...rest } =  await API.get(apiName, path, myInit);
      // nextToken = NextToken;
      // return rest;
    },

    async getUserInfo({}, {user}) {
      await Auth.getUser(user.Username);
      console.log('attributes:', user.Attributes);
    },

    async updateUser ({}, userData) {
      // Auth.updateUser(user);
      const res = await api('user/update_user','put', userData);
      commit('setUsers',res.data);
    },
   /* async updateUser({}, {user, attributes}) {
      // const user2 = await Auth.getUser(user.Username);
      // console.info("User authenticated:", user2);
      console.info("User clicked:", user);
      await Auth.updateUserAttributes(user, attributes)
      .then((user) => {
        console.info(user)
      })
      .catch((err) => {
        console.log(err)
      })

    },*/

    async setUsername({commit}, username){
      let apiName = 'AdminQueries';
      let path = '/getUser';
      let myInit = { 
          queryStringParameters: {
            "username": username.username
          },
          headers: {
            'Content-Type' : 'application/json',
            Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
          }
      }
      
      try{
        const rest = await API.get(apiName, path, myInit);
        console.info(rest);
      }
      catch (error) {
        console.log('error getting user', error);
      }
      commit('setUsername', {username});
    }
    
  },

  mutations: {
    login(state, userSession) {
      state.user = userSession;
      state.token = userSession.signInUserSession.getIdToken().getJwtToken();
      state.error = '';
      state.newPassword = null;
      setToken(state.token);
      state.ready = true;
    },

    readyNow(state) {
      state.ready = true;
    },

    logout(state){
      if (state.user) state.user.signOut();
      state.user = null;
      state.token = '';
      setToken();
      state.error = '';
      state.permissions = {};
    },

    setError(state, { message, code }) {
      state.error = message;
      if (code === 'NotAuthorizedException')
        state.newPassword = null;
    },

    newPasswordFunction(state, { fn }) {
      state.error = '';
      state.newPassword = fn;
    },

    setUsers(state,payload) { state.usersList = payload.Users;},

    setUsername(state, name) { state.username = name.username.username; },

    setUserRoles(state,roles){ state.roles = roles; }
  },
}
