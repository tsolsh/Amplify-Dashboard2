import {createRouter, createWebHistory} from 'vue-router' 
import MainLayout      from '../layouts/MainLayout.vue'
import Manager      from '../components/Manager/MngMain.vue'

import Sessions     from '../components/Sessions/SesMain.vue'
import List     from '../components/Sessions/List.vue'
import Configure    from '../components/Sessions/TabConfigure.vue'
import Calibrate    from '../components/Sessions/TabCalibrate.vue'
import Monitor      from '../components/Sessions/TabMonitor.vue'

// import ManagerMenu  from '../components/Manager/MngMenu.vue'
import Users        from '../components/Manager/Users.vue'
import Gateways     from '../components/Manager/Gateways.vue'
import Polymonitors from '../components/Manager/Polymonitors.vue'
import Patients     from '../components/Manager/Patients.vue'
import Locations    from '../components/Manager/Locations.vue'

import Live         from '../components/Charts/Live.vue'
import LiveRaw      from '../components/Charts/LiveRaw.vue'
import Historic     from '../components/Charts/Historic.vue'

import Guest from '../components/Layout/Guest.vue'

const routes = [
    {
        path: '/',
        name: Manager,
        component: Manager,
        children:[
            // { name: 'Menu', path: '', component: ManagerMenu },
            { name: 'mngUsers', path: 'users/:username?/:id?', component: Users },
            { name: 'mngGateways', path: 'gateways', component: Gateways },
            { name: 'mngPolyMonitors', path: 'polymonitors/:pm_id?', component: Polymonitors },
            { name: 'mngPatients', path: 'patients/:action?/:p_id?', component: Patients }, /* action = edit / view / new */
            { name: 'mngLocations', path: 'locations', component: Locations },
        ]
    },
    {
        path: '/session',
        name: 'Sessions',
        component: Sessions,
        children: [
            { name: 'List', path: '', component: List },
            { name: 'tabConfiguration', path: ':id/configure', component: Configure },
            { name: 'tabCalibrating', path: ':id/calibrate', component: Calibrate },
            { name: 'tabMonitoring', path: ':id/monitor', component: Monitor },
            { name: 'tabFinished', path: ':id/finished', component: Monitor },
        ]
    },
    {
        path: '/live/:id',
        name: 'Live',
        component: Live
    },
    {
        path: '/live-raw/:id',
        name: 'LiveRaw',
        component: LiveRaw
    },
    {
        path: '/historic/:id',
        name: 'Historic',
        component: Historic
    },  
    {
        path: '/Guest',
        name: 'Guest',
        component: Guest
    },    
    
    
];

// const router = createRouter({
//     history: createWebHistory(process.env.BASE_URL),
//     routes
// });

export default routes;
