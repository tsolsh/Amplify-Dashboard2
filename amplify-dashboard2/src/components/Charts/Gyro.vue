<template>
    <svg viewBox="-40 -40 79 79" :class="{mirror: y < 0}">
        <title>
            ({{x}},{{y}},{{z}})
        </title>
        <path :style="{transform: r1}" :d="d" />
    </svg>
</template>


<script>
import { mapState, mapGetters } from 'vuex'
// const PMPlacements = {
//     lowerCentreChest: {text: 'Lower Centre Chest', coords: '67,75,12' },
//     leftCentreChest:  {text: 'Left Centre Chest',  coords: '97,80,13' },
//     centreUpperChest: {text: 'Centre Upper Chest', coords: '68,33,12' },
//     upperLeftChest:   {text: 'Upper Left Chest',   coords: '101,30,12'},
// };

const gyro_vertices = [[35, 1.5,-17  ],
    [-5, -.8,-13.5],   [30, 1.8,-13.5],
    [-5,  .5, -1  ],   [20, 2.5,-10  ],
    [-4, 2  ,  6  ],   [ 8, 2  , -4  ],
    [ 6, 2  ,  0  ],   [ 8, 2  , -2  ],

    [25, 1  ,   .5],   [ 9,12  , -2  ],
                       [ 6,13  , -1  ],
                       [ 2,13  ,  0  ],
    [16, 4  ,  4  ],   [ 4,13  , -2  ],
                       [ 2,16  ,  0  ],
                       [ 0,17  ,  0  ],
    [-20,-10, -9  ],   [18, 6  ,-11  ],
                       [21, 5  ,-11  ]
];
function gyro_vertex(x, y, i) {
    const [a, b, c] = gyro_vertices[i];
    return (a - x*b + y*c).toFixed(1);
}

export default {
  name: 'Gyro',
  props: {
    placement: String,
  },

  computed:{
      ...mapState('live', ['meta']),
      ...mapGetters('live', ['lastRaw']),
      x: function() { return this.lastRaw?.Acceleration_X?.[9] ?? -1024; },
      y: function() { return this.lastRaw?.Acceleration_Y?.[9] ?? 0; },
      z: function() { return this.lastRaw?.Acceleration_Z?.[9] ?? 0; },
      //z: function() { return 1200 - Math.sqrt(this.x**2 + this.y**2) ; },
      g: function() { return Math.sqrt(this.x**2 + this.y**2 + this.z**2); },
      r1: function() { return `rotate(${Math.asin(this.x / this.g)}rad)`; },
      d: function() {
        const z = this.z / this.g, Z = Math.abs(z),
            L = i => gyro_vertex(-z, Z, i),
            R = i => gyro_vertex(z, Z, i);
        return `M-42${-L(0)}Q${L(1)}${-L(2)} ${L(3)}${-L(4)}Q${L(5)},${-L(6)} ${L(7)}${-L(8)}
            A18,15 1,1,1 ${R(7)},${R(8)}Q${R(5)},${R(6)} ${R(3)},${R(4)}Q${R(1)},${R(2)} -42,${R(0)}Z
            
            M${L(9)},${L(10)}Q27,${L(11)} ${R(9)},${L(12)}
            M${L(9)},${-R(12)}Q27,${-R(11)} ${R(9)},${-R(10)}
            
            M${L(13)},${L(14)}L17,${L(15)}Q15,${-R(16)} 17,${-R(15)}L${R(13)},${-R(14)}
            
            M12,${L(12)}L12,${-R(12)}
            
            M${L(17)},${L(18)}L-41,${L(19)}
            M${R(17)},${-R(18)}L-41,${-R(19)}`;
    },
  }
};
</script>


<style scoped>
svg {
    background: var(--bg-1);
    border: thin solid var(--fg-dim);
    border-radius: 50%;
    width: 2em;
    height: 2em;
}
svg.mirror { transform: scale(-1,1); }
svg:hover { transform: scale(1.5); }
svg.mirror:hover { transform: scale(-1.5,1.5); }
path {
    fill: #fc99;
    stroke: #410;
    stroke-width: 2;
    transition: all 1s linear;
}
</style>
