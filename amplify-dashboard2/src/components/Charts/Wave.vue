<template>
  <div v-if="ready" class="wave" :style="'width: ' + width">
    <div class="wrapper" :style="'height: ' + height">
      <svg xmlns="http://www.w3.org/2000/svg" :viewBox="viewBox" preserveAspectRatio="none">
        <g>
          <line v-for="x in seconds" :key="x"
            :x1="x * header.rate" :y1="-header.digital[0]"
            :x2="x * header.rate" :y2="-header.digital[1]" />
          <line v-for="{y, cls} of yLines" :key="y"
            :y1="-y" x1="0" :class="cls"
            :y2="-y" :x2="w" />
        </g>
        <g class="wave">
          <g v-for="c of paths" :key="c" :transform="c.transform"
            >
            <!-- <line :x1="-header.rate" :y1="-header.digital[0]"
               :x2="3 * header.rate" :y2="-header.digital[1]" /> -->
            <path :d="c.path" />
          </g>
        </g>
      </svg>
      <i>{{title ?? channel}}</i>
      <b v-if="showLegend" class="min">{{minVal}} {{header.unit}}</b>
      <b v-if="showLegend" class="max">{{maxVal}} {{header.unit}}</b>
    </div>
    <div v-if="showTimes" class="times">
      <span v-for="(t, i) in times" :key="i"><time >{{t.hms}}</time></span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import fn from '../../services/fn.js';

function converter([minFrom, maxFrom], [minTo, maxTo], asInt) {
  const scale = (maxTo - minTo) / (maxFrom - minFrom), offset = minTo / scale - minFrom;
  if (asInt)
    return n => ~~((+n + offset) * scale);
  const fixed = scale < .001 ? 4 : scale < .01 ? 3 : scale < .1 ? 2 : 1;
  return n => ((+n + offset) * scale).toFixed(fixed);
}

export default {
  name: 'Wave',
  props: {
    title: String,
    channel: { type: String, required: true },
    width: { default: '150px' },
    height: { default: '100px' },
    seconds: { type: Number, default: 30 },
    minScale: { type: Number, default: -200 },
    maxScale: { type: Number, default: 200 },
    step: { type: Number, default: 40 },
    showTimes: { type: Boolean, default: true },
    showLegend: { type: Boolean, default: true },
    autoZoom: { type: Boolean, default: true },
  },
  data: () => {
    return {
      ready: false,
      latest: 0,
      times: [],
      paths: [],
      yLines: [],
      toDig: v=>v,
      fromDig: v=>v,
      top: -200,
      h: 200,
      w: 1,
      minVal: '-',
      maxVal: '-',
    }
  },
  computed: {
    ...mapState('history', ['meta', 'raw', 'results']),
    header() { return this.meta?.[this.channel]; },
    // then() { return this.last - this.seconds; },
    viewBox() { return `0 ${this.top} ${this.w} ${this.h}`; },
  },
  watch: {
    meta: { immediate: true, handler: 'init' },
    raw: 'gotData',
  },
  // mounted() {
  //   this.minZoom = this.maxZoom = 0;
  //   this.zoomer = window.setInterval(this.zoom, 40);
  //   this.updateRange = fn.debounce((min, max) => {
  //     this.minVal = this.fromDig(min);
  //     this.maxVal = this.fromDig(max);
  //   }, 500);
  // },
  // unmounted() {
  //   window.clearInterval(this.zoomer);
  //   this.updateRange.cancel();
  // },
  methods: {
    init() {
      const h = this.header;      
      console.info('h: ', h);
      if (!h) return;
      this.toDig = converter(h.range, h.digital, true);
      this.fromDig = converter(h.digital, h.range);
      // for (let i = 0, j = this.seconds; i < this.seconds; ++i, ++j) {
      //   const transform = 'translate(' + (i % this.seconds * h.rate) + ' 0)';
      //   this.paths[i] = { transform };
      //   this.paths[j] = { transform };
      //   this.times[i] = {};
      // }
      for (let i = 0; i < 60; ++i) {
        const transform = 'translate(' + (i * h.rate) + ' 0)';
        this.paths[i] = { transform };
        this.times[i] = {};
      }
      const zero = this.toDig(0), min = h.digital[0], max = h.digital[1];
      let small = Math.max(4, ~~((max - min) / 128)), big = small * 8;
      this.yLines[0] = {y: zero, cls: 't-axis'};
      for (let i = small; i <= 32768; i += small) {
        let cls = 'secondary';
        if (i % big === 0) { small *= 2; cls = 'primary'; }
        if (zero + i < max) this.yLines.push({y: zero + i, cls});
        if (zero - i > min) this.yLines.push({y: zero - i, cls});
      }
      const zMin = this.toDig(this.minScale), zMax = this.toDig(this.maxScale);
      this.top = -zMax;
      this.w = this.seconds * this.header.rate;
      this.h = zMax - zMin;
      // for (let y = this.minScale; y <= this.maxScale; y += this.step)
      //   this.yLines.push(this.toDig(y));
      this.ready = true;
    },
    gotData() {
      if (!this.ready) return;
      const tails = [];
        // latest = this.raw.filter(r => r?._id > then), then = Math.max(this.then, this.latest);
      for (let t in this.raw) {
        let raw = this.raw[t],time = raw._id ;
        // if (this.times[t].stamp === time || time < this.then) continue;
        if (!raw.hms)
          raw.hms = new Date(time * 1000).toLocaleTimeString('en-US', { hour12: false })
        Object.assign(this.times[t], { stamp: time, hms: raw.hms });
        const wave = raw[this.channel], min = Math.min(...wave), max = Math.max(...wave);
        Object.assign(this.paths[t], { time, min, max,
          path: 'M' + wave.map((v, i) => i + ' ' + -v).join('L')});
        tails.push([time - 1, wave[0]]);
      }
      // this.latest = this.last;
      // for (let [t, v] of tails) {
      //   const p = this.paths[t];
      //   if (p?.time === t) p.path += 'L' + this.header.rate + ',' + -v;
      // }
      const min = Math.min(0, ...this.paths.map(v => v.min ?? 0)),
            max = Math.max(192, ...this.paths.map(v => v.max ?? 192)),
            dif = (max - min) >> 4;
      this.minTarget = min - dif;
      this.maxTarget = max + dif;
      this.target = 50;
    },
    
  },
}
</script>

<style scoped>

.live-wave { padding: .1em; position: relative; flex: 1;}
.wrapper { position: relative; min-height: 100px; }
i { color: var(--wave-line-color); opacity: .8; position: absolute; top: 0; left: .1em; }
b { color: var(--wave-legend-color); opacity: .6; position: absolute; right: .1em; }
b.min { bottom: 0; }
b.max { top: 0; }
.live-wave:hover :is(b, i) { opacity: 1; }

svg {
  height: 100%;
  width: 100%;
  height: -webkit-fill-available;
  width: -webkit-fill-available;
  z-index: 11;
}
svg * { vector-effect: non-scaling-stroke; }

path {
  fill: none;
  stroke: var(--wave-line-color);
  stroke-width: 1;
  transition: stroke-width 4.5s ease-out;
}

g.now { animation: 1s linear 1 both swipeIn; }
g.now path { stroke-width: 2.5; }
g.then { animation: 1s linear 1 both swipeOut; }

line { stroke: var(--wave-grid-color); stroke-width: 1; }
line.secondary { opacity: .1; stroke-width: 1; stroke-dasharray: 1 1; }
.live-wave:hover line.secondary { opacity: .3;}
line.t-axis { stroke-width: 1; stroke: var(--wave-t-axis-color); }
/* .wave line { stroke: transparent; } */

@keyframes swipeIn {
  from { clip-path: inset(0 75% 0 0); }
  to { clip-path: inset(0 50% 0 0); }
}
@keyframes swipeOut {
  from { clip-path: inset(0 0 0 25%); }
  to { clip-path: inset(0 0 0 50%); }
}

.times span {
  flex: 1;
  overflow-x: visible;
  position: relative;
}
.times {
  display: flex;
  min-height: 1.9em;
}
time {
  background: rgba(0, 0, 0, 0.6);
  color: #dee;
  opacity: 0;
  margin: 0 auto .4em 0;
  transform: rotate(15deg) scale(.9);
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 2;
  transition: opacity linear .2s, transform linear .2s;
}
.live-wave:hover time:not(.now):not(.hide) { opacity: .6; }
time.hide {
  opacity: 0;
  transform: translateX(-10px) rotate(10deg);
  transition: transform linear .2s;
}
time.now {
  opacity: 1;
  transform: translateX(0px) rotate(10deg);
  z-index: 99;
}

</style>