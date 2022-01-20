export default {
  namespaced: true,
  state: {
    colourScheme: '',
    visible: true,
    title: '',
    statusText: '',
    statusIcon: '',
    messageText: '',
    messageStyle: '',
    popup: null,
    login: false,
    activeLink: '',
  },
  actions: {
    toggleColourScheme({commit, state}) {
      commit('setColourScheme', state.colourScheme === 'darkScheme' ? 'lightScheme' : 'darkScheme');
    },
  },
  mutations: {
    setColourScheme(state, scheme) {
      scheme = scheme ?? localStorage.getItem("colourScheme") ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? 'darkScheme' : 'lightScheme');
      localStorage.setItem("colourScheme", scheme);
      if (state.colourScheme)
        document.body.classList.remove(state.colourScheme);
      if(!scheme) scheme = 'lightScheme';
      document.body.classList.add(scheme);
      state.colourScheme = scheme;
    },
    setVisible(state, visible) {
      state.visible = !!visible;
    },
    setTitle(state, title) {
      state.title = title;
      document.title = 'RAPHAEL ' + title;
    },
    setStatus(state, {text, icon}) {
      state.statusText = text;
      state.statusIcon = icon;
    },
    setMessage(state, {text, style}) {
      state.messageText = text;
      state.messageStyle = style;
    },
    setLogin(state, bool){
      state.login = bool;
    },

    setLink(state, link){
      state.activeLink = link;
    }
  },
}
