<template>
    {{id}} Trend<br/>
    <svg width="100%" :viewBox="viewbox">
        <defs>
            <marker :id="id + 'trendArrow'" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M 0 5 L 10 0 L 5 5 L 10 10 z" fill="lime" />
            </marker>
        </defs>
        <g class="labels">
            <g v-for="(L, j) in labels" :key="j" :transform="`translate(${L.left}, ${-height})`">
                <rect :width="w" :height="height" />
                <text v-for="(v, i) in L.values" :key="i" :x="mid" :y="v.scaled">{{v.value}}</text>
            </g>
        </g>
        <g><path v-for="(d, i) in paths" :key="i" :d="d" :marker-mid="`url(#${id}trendArrow)`" /></g>
    </svg>
</template>


<script>
export default {
  name: 'Trend',
  props: {
    id: String,
    height: { type: Number, default: 80 },
    width: { type: Number, default: 300 },
    points: { type: Number, default: 15 },
    min: Number,
    max: Number,
    values: Array,
  },

  computed: {
    w() { return this.width / this.points; },
    mid() { return this.w / 2; },
    viewbox() { return [-this.width, this.mid - this.height, this.width, this.height].join(' '); },
    goodValues() { return this.values.flat().filter(v=>v && !isNaN(v)); },
    minimun() { return Math.min(this.min, ...this.goodValues); },
    scaler() { return (Math.max(this.max, ...this.goodValues) - this.minimun) / (this.height - this.w); },
    scaled() { return this.values.map(a => a.map(v => v && !isNaN(v) ? this.mid + (v - this.minimun) / this.scaler : null)); },
    scaledMin() { return -this.min * this.scaler; },
    scaledMax() { return -this.max * this.scaler; },
    paths() { return this.scaled.map((a, i) => a.map((v, j) =>
        v ? (this.values[i][j - 1] ? 'L' : 'M') + -(this.mid + this.w * j) + '-' + (v ?? 0) : '').join('')); },
    labels() { return Array(this.points).fill(0).map((_, i) => this.getLabel(i)) },
  },

  methods: {
      getLabel(i) {
          return {
            left: -(i+1) * this.w,
            values: this.values.map(v => {
                return v[i] ? { value: v[i], scaled: this.height - this.scaler * v[i] } : null;
            }).filter(v => v),
          };
      },
  }
}
</script>


<style scoped>
path, circle {
    stroke: currentColor;
    stroke-width: 1;
    fill: rgb(0 0 0 / .1);
}
/* line {
    stroke: #c69;
    opacity: .1;
    stroke-width: 4;
} */
rect {
    stroke: #c69;
    opacity: .1;
    stroke-width: 2;
}
text {
    fill: var(--fg);
    opacity: .01;
    text-anchor: middle;
    transition: opacity .5s ease;
}
.labels g:hover text { opacity: 1; }
</style>