<template>
  <details>
    <summary>👩‍💻 Developer Options</summary>
    <fieldset v-if="gwLink">
      <legend>Web Gateway</legend>
      <p>
        PolyMonitor
        {{['🔎 trying to reconnect', '🔍 scanning', '❌ disconnected', '🔹 connecting', '🟢 connected'][1 - ~gwLink.pm]}}.
        <a v-show="gwLink.pm === 0" @click="gwLink.poly.find()">(connect)</a>
        <a v-show="gwLink.pm === 2" @click="gwLink.poly.loose()">(disconnect)</a>
      </p>
      <p v-show="gwLink.ws">Server 🟢 connected. <a @click="gwLink.ws.close()">(disconnect)</a></p>
      <p v-show="!gwLink.ws">Server ❌ disconnected. <a @click="gwConnect">(connect)</a></p>
    </fieldset>
    <button v-else @click.prevent="gwFind">🔍 Use Web Gateway</button>
    <label class="row" :class="channels.enabled ? 'checkOpen' : 'checkClosed'">
      <input type="checkbox" :checked="channels.enabled" @input="setEnabled" id="DevOptions_btn"/>
      <span>Turn on these channels (NO algorithms!)</span>
    </label>
    <fieldset v-show="channels.enabled">
      <div class="form-elements">
        <span class="header row"><b>Signal</b><b>Rate</b><b>Range</b></span>
        <label class="row" v-for="c in pmChannels" :key="c.label" :title="
            'Digital Range: ' + c.digital.join(' ⋯ ') +
            (c.filter ? ('\nFilter: ' + c.filter) : '') +
            '\nTransducer: ' + c.xducer">
          <b>
            <input type="checkbox" :checked="c.label in channelsOn" @input="toggleChannel(c.label, $event)"/>
            {{c.label.replace(/_/g, ' ')}}
          </b>
          <span>{{c.rate}} Hz</span>
          <i>{{c.range[0]}} ⋯</i>
          <i>{{c.range[1]}}</i>
          <i>{{c.unit}}</i>
        </label>
      </div>
      <div>Data rate: <b>{{bps}}</b> bytes per second ({{bps + markers}} with record markers)</div>
    </fieldset>
  </details>
</template>


<script>
import { /*mapState,*/ mapGetters } from "vuex";
import api from '../../services/api.js'

export default {
  name: 'DevOptions',
  data() {
    return {
      pm: null,
      pmChannels: [],
      channelsOn: {},
      bps: 0,
      markers: 40,
    };
  },

  computed: {
    ...mapGetters({currentSession: 'sessions/current', gwLinkFn: 'gateway/link'}),
    gwLink() { return this.gwLinkFn(this.pm); },
    channels() { return this.currentSession?.dev?.channels || {}; },
  },

  watch: {
    currentSession: { immediate: true, handler: 'loadPolyData' },
  },

  methods:{
    async loadPolyData() {
      this.pm = this.currentSession?.polyMonitor?.$oid;
      if (this.pm) {
        const res = await api('/polymonitor/channels/' + this.pm);
        if (res.data) {
          this.pmChannels = res.data;
          this.channelsOn = Object.fromEntries((this.channels.on || []).map(p => [p, 1]));
          this.updateBytesPerSecond();
        }
      }
    },

    updateChannels(key, value) {
      this.$store.dispatch('sessions/updateValue', {key: 'dev', path: ['channels', key], value});
    },

    setEnabled({target}) {
      this.updateChannels('enabled', target.checked);
    },

    toggleChannel(label, {target}) {
      if (target.checked) this.channelsOn[label] = 1;
      else delete this.channelsOn[label];
      this.updateChannels('on', Object.keys(this.channelsOn));
      this.updateBytesPerSecond();
    },
    
    updateBytesPerSecond() {
      this.bps = this.pmChannels.reduce((a, b) => a + (b.label in this.channelsOn ? 2 * b.rate : 0), 0);    
    },

    gwFind() {
      this.$store.dispatch('gateway/load');
      if (this.pm)
        this.$store.dispatch('gateway/findPoly', this.pm);
    },
    gwConnect() {
      this.$store.dispatch('gateway/connect', {name: this.pm, session: this.currentSession.id});
    },
  },
}
</script>


<style scoped>
.header b {
  text-align: center;
}

i {
  padding: .1em .2ex;
  text-align: right;
}

:not([open]) > summary {
  margin-top: 22px;
}
</style>