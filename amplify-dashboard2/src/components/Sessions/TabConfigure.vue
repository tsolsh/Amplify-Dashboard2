<template v-show="currentSession">
  <div class="q-pr-md q-gutter-y-md column items-start tab_actions" style="align-content: end;display: flex;
    flex-direction: row;
    align-items: flex-end;">
  <q-btn id="Configure_Set" class="nextCal bg-accent shadow-1" @click="moveToCal" label="Save" no-caps dense :disable="disable"/>

    <q-btn-group push class="shadow-10">
      <q-btn-dropdown v-if="patient||currentSession?.location" dropdown-icon="info" dense class="delete"  color="secondary" >
        <q-list style="background: var(--bg);color:var(--bg-4);font-weight: 600; min-width: 200px;">
          <q-item clickable v-close-popup>
            <q-item-section avatar>
              <q-avatar icon="badge" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Patient</q-item-label>
              <q-item-label caption>{{patient?.serial}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-show="currentSession?.location?.ward" clickable v-close-popup>
            <q-item-section avatar>
              <q-avatar icon="room_preferences" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Ward</q-item-label>
              <q-item-label caption>{{currentSession?.location?.ward}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-show="currentSession?.location?.room" clickable v-close-popup>
            <q-item-section avatar>
              <q-avatar icon="meeting_room" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Room</q-item-label>
              <q-item-label caption>{{currentSession?.location?.room}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-show="currentSession?.location?.bed" clickable v-close-popup>
            <q-item-section avatar>
              <q-avatar icon="bed" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Bed</q-item-label>
              <q-item-label caption>{{currentSession?.location?.bed}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup>
            <q-item-section avatar>
              <q-avatar icon="pending_actions" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Started at</q-item-label>
              <q-item-label caption>{{createdTime}}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber">
                <q-tooltip v-if="deleteMsg" class="bg-amber shadow-3 text-black" anchor="top middle" self="bottom middle">
                  {{createdDate}}
                </q-tooltip>
              </q-icon>
            </q-item-section>
          </q-item>
        </q-list>
        <template v-slot:label>
          <q-tooltip class="bg-accent shadow-3 text-white" anchor="top middle" self="bottom middle">
            details
          </q-tooltip>
        </template>
      </q-btn-dropdown>
      <q-btn v-if="currentSession?.status>10" :to="`/session/${$route.params.id}/calibrate`" class="delete" icon="navigate_next" dense color="secondary">
        <q-tooltip v-if="deleteMsg" class="shadow-3 bg-secondary text-white" anchor="top middle" self="bottom middle" id="deleteTxt" style="color:var(--action);">
          Next to calibrate
        </q-tooltip>
      </q-btn>
      <q-btn v-if="currentSession?.status>20" :to="`/session/${$route.params.id}/monitor`" class="delete" icon="last_page" dense color="secondary">
        <q-tooltip v-if="deleteMsg" class="shadow-3 bg-secondary text-white" anchor="top middle" self="bottom middle" id="deleteTxt" style="color:var(--action);">
          Next to monitor
        </q-tooltip>
      </q-btn>
      <q-btn v-if="currentSession?.status<=10" @click.prevent="pop=true" id="Nav_deleteBtn" icon="delete_forever" class="icon delete" :disable="isLive!=0" color="secondary" dense no-caps>
        <q-tooltip v-if="deleteMsg" class="shadow-3 bg-secondary text-white" anchor="top middle" self="bottom middle" id="deleteTxt" style="color:var(--action);">
          delete
        </q-tooltip>
      </q-btn>

      <q-dialog v-model="pop">
        <q-card class="bg-red text-white q-pa-sm">
          <q-card-section class="text-h6 bg-red">
            delete this session permanently ?
            <q-icon name="delete_forever"/>
          </q-card-section>
          <q-card-actions align="right" class="bg-red">
            <q-btn flat color="white" type="submit" class="q-mt-md" @click="deleteSession" id="Location_popUp_delete_yes" label="Yes" no-caps dense/>
            <q-btn flat color="white" type="button" class="q-mt-md cancel" @click.prevent="pop=false" id="Location_saveWard_delete_no" label="No" no-caps dense/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-btn-group>
  </div>

  <details open>
    <summary style="display:block"></summary>
    <form v-if="disable" class="form-elements solo q-mb-sm" style="display: flex; gap: 0.5em; align-items: center;">
      <div style="text-align:center;display: contents;">
        <label>Serial № </label>
        <span>{{patient?.serial}}</span>
      </div>
    </form>
    <form v-else id="patient" class="form-elements solo" data-refresh="list" @input="updateValue" style=" display: flex; align-items: center;">
      <label translate="no" class="row2">
       Serial №
        <q-select @update:model-value="updateSerial" standout="bg-secondary text-white" v-model="patSelected" :options="pat_options" :dark="colourScheme=='darkScheme'"
        dense :disable="disable" transition-show="jump-up" transition-hide="jump-up" :color="colourScheme=='darkScheme'? 'teal-11':'primary'" :class="{'problem': problems.selectPatient}"
         style="margin-left: 15px;">
          <template v-slot:selected>
            <template v-if="patSelected">
              {{ patSelected }}
            </template>
            <template v-else>
              {{patient?.serial?? ''}}
            </template>
          </template>
        </q-select>
        <span v-if="problems.selectPatient" style="color:red;">Required</span>
      </label>
      
      <q-btn-dropdown v-if="patient?.serial" dropdown-icon="info" flat dense class="delete" text-color="accent" >
        <q-list style="background: var(--bg);color:var(--bg-4);font-weight: 600; min-width: 200px;">
          <q-item clickable v-close-popup>
            <q-item-section>
              <q-item-label style="margin-bottom:10px;">Patient {{patient?.serial}}</q-item-label>
              <span class="row"><span>Gender: </span><span style="font-weight: 100;">{{patient?.gender}} <q-icon :name="patient.gender==='Male'? 'man':'woman'"/> </span></span>
              <span class="row"><span>Weight: </span>
                <span style="font-weight: 100;">{{weight.toUI(patient?.weight)}} {{weight.unit}} <i class="las la-weight"></i> </span>   
              </span>
              <span class="row"><span>Height: </span>
                <span style="font-weight: 100;">{{height.toUI(patient?.height)}} {{height.unit}} <i class="las la-ruler-vertical"></i></span>
              </span>
              <span class="row"><span>Date of Birth:&nbsp; </span><span style="font-weight: 100;">{{birthday}} <q-icon name="event"/></span></span>
            </q-item-section>
          </q-item>
        </q-list>
        <template v-slot:label>
          <q-tooltip class="bg-accent text-white" anchor="top middle" self="bottom middle">
            more details
          </q-tooltip>
        </template>
      </q-btn-dropdown>
    </form>
  </details>
  <details open>
    <summary style="display:block"></summary>
    <form v-if="disable" class="form-elements solo q-mb-sm" style="display: flex; gap: 0.5em; align-items: center;">
      <div style="text-align:center;">
        <label>Ward: </label>
        <span>{{loc.ward}}</span>
      </div>
      <div style="text-align:center;">
        <label>Room: </label>
        <span>{{loc.room}}</span>
      </div>
      <div style="text-align:center;">
        <label>Bed: </label>
        <span>{{loc.bed}}</span>
      </div>
    </form>

    <form v-else id="location" class="form-elements q-mb-md" data-refresh="list" @input="updateValue" style="display: inline-flex;">
      <label class="row2 ward_label" > Ward
        <q-select @update:model-value="updateWard" standout="bg-secondary text-white" v-model="wardSelected" :options="wardsOptions" class="wards_select"
        :color="colourScheme=='darkScheme'? 'teal-11':'primary'" :dark="colourScheme=='darkScheme'" dense :disable="disable"
        :class="{'problem': problems.selectWard}" transition-show="jump-up" transition-hide="jump-up">
          <template v-slot:selected>
            <template v-if="wardSelected">
              {{ wardSelected }}
            </template>
            <template v-else>
              {{loc?.ward?? ''}}
            </template>
          </template>
        </q-select>
        <span v-if="problems.selectWard" style="color:red;">Required</span>
      </label>

      <label v-show="loc.ward" class="row2 ward_label"> Room
        <q-select v-if="roomsOptions.length!=0" @update:model-value="updateRoom" standout="bg-secondary text-white" 
        v-model="roomSelected" :options="roomsOptions" class="wards_select" stack-label transition-show="jump-up" transition-hide="jump-up"
         :color="colourScheme=='darkScheme'? 'teal-11':'primary'" :dark="colourScheme=='darkScheme'" dense :disable="disable" :class="{'problem': problems.selectRoom}">
          <template v-slot:selected>
           <template v-if="roomSelected">
             {{ roomSelected }}
          </template>
          <template v-else>
            {{''}}
          </template>
          </template>
        </q-select>
        <span v-else> All rooms are occupied</span>
        <span v-if="problems.selectRoom" style="color:red;">Required</span>
      </label>

      <label v-show="loc.room" class="row2 ward_label">Bed
          <q-select v-if="bedsOptions.length!=0" @update:model-value="updateBed" standout="bg-secondary text-white" 
          v-model="bedSelected" :options="bedsOptions" class="wards_select" 
          :color="colourScheme=='darkScheme'? 'teal-11':'primary'" :dark="colourScheme=='darkScheme'" 
          :class="{'problem': problems.selectBed}" transition-show="jump-up" transition-hide="jump-up" dense :disable="disable">
          <template v-slot:selected>
            <template v-if="bedSelected">
              {{ bedSelected }}
            </template>
            <template v-else>
              {{''}}
            </template>
          </template>
        </q-select>
        <span v-else-if="roomSelected"> All beds are occupied</span>
        <span v-if="problems.selectBed" style="color:red;">Required</span>
      </label>
      
    </form>
  </details>
  
  <div>
  <!-- <q-icon name="hub" color="secondary"/> -->
  <details open>
    <summary style="display:block"></summary>
    <form v-if="disable" class="form-elements solo q-mb-sm" style="display: flex; gap: 0.5em; align-items: center;">
      <div style="text-align:center;display: contents;">
        <label>PolyMonitor № </label>
        <span>{{activePoly}}</span>
      </div>
    </form>
    <form v-else id="polyMonitor" class="poly form-elements solo"  @input="updateValue">
      <label translate="no" class="row2 notranslate"> PolyMonitor
        <q-select @update:model-value="updatePoly" standout="bg-secondary text-white" v-model="polySelected" :options="polyOptions"
        :dark="colourScheme=='darkScheme'" dense :disable="disable" class="wards_select"
         :class="{'problem': problems.selectPoly}" transition-show="jump-up" transition-hide="jump-up" style="margin-left: 15px;">
          <template v-slot:selected>
           <template v-if="polySelected">
             {{ polySelected }}
          </template>
          <template v-else>
            {{activePoly?? ''}}
          </template>
          </template>
        </q-select> 
        <span v-if="problems.selectPoly" style="color:red;">Required</span>
      </label>
    </form>
  </details>

  <details open>
    <summary  style="display:block"></summary>
    <form id="calibrate" class="visual-select" :disable="disable" @input="updateValue2">
      <label class="row shadow-8">
        <span style="font-weight: 600;">Body Position</span>
        <map name="bodyPositionMap">
          <area v-for="bp, k in bodyPositions" :key="k"
            shape="rect" href="#" :coords="bp.coords" @click="setBodyPosition($event, k)" :title="bp.text" />
        </map>
        <img alt="" id="bodyPositionImage" :usemap="disable ? undefined : '#bodyPositionMap'" width="136" height="60" :src="bodyPositionImage" :disable="disable" />
        <!-- <select id="Configure_selectBodyPosition" name="bodyPosition" :value="cali.bodyPosition" :disabled="disable" class="bpClass">
          <option disabled>(Select👇)</option>
          <option v-for="bp, k in bodyPositions" :key="k" :value="k" :id="'Configure_bodyPosition_'+bp.text">{{bp.text}}</option>
        </select> -->
        <label v-if="disable">{{bodyPositions[cali.bodyPosition]?.text?? ''}}</label>
        <q-select v-else @update:model-value="updateBP" standout="bg-secondary text-white" v-model="bpSelected"
         :options="bpOptions" dense :disable="disable" class="q-pa-xs q-mt-xs" :dark="colourScheme=='darkScheme'">
          <template v-slot:selected>
           <template v-if="cali.bodyPosition">
             {{ cali.bodyPosition.charAt(0).toUpperCase()+ cali.bodyPosition.slice(1)}}
          </template>
          <template v-else>
            (Select👇)
          </template>
          </template>
        </q-select>  

      </label>

      <label class="row shadow-8">
        <span style="font-weight: 600;"><em translate="no" class="PM notranslate"><b>P</b>oly<b>M</b>onitor</em> Body Location</span>
        <map name="polymonitorBodyLocationMap">
          <area v-for="pmp, k in PMPlacements" :key="k"
           shape="circle" href="#" :coords="pmp.coords" @click="setPMPlace($event, k)" :title="pmp.text" />
        </map>
        <img alt="" id="polymonitorBodyLocationImage" :usemap="'#polymonitorBodyLocationMap'" width="136" height="100" :src="polymonitorBodyLocationImage" :disable="disable"/>
        <!-- <select id="Configure_selectPolyLocation" name="polymonitorBodyLocation" :value="cali.polymonitorBodyLocation" :disabled="disable" class="bpClass">
          <option disabled>(Select👇)</option>
          <option v-for="pmp, k in PMPlacements" :key="k" :value="k" :id="'Configure_polyLocation_'+pmp.text">{{pmp.text}}</option>
        </select> -->
        <label v-if="disable">{{PMPlacements[cali.polymonitorBodyLocation]?.text ?? ''}}</label>
        <q-select v-else @update:model-value="updatePmp" standout="bg-secondary text-white" v-model="bpSelected" :options="pmpOptions" 
          dense :disable="disable" class="q-pa-xs q-mt-xs" :dark="colourScheme=='darkScheme'">
          <template v-slot:selected>
           <template v-if="cali.polymonitorBodyLocation">
             {{ cali.polymonitorBodyLocation.charAt(0).toUpperCase()+ cali.polymonitorBodyLocation.slice(1)}}
          </template>
          <template v-else>
            (Select👇)
          </template>
          </template>
        </q-select> 
      </label>
    </form>
  </details>
  </div>
  <details closed>
    <summary style="color:grey;">Clinical Indications</summary>
    <form id="ind" @input="updateValue">
      <label class="row" :class="ind.bp?.enabled ? 'checkOpen' : 'checkClosed'">
        <input type="checkbox" name="bp.enabled" :checked="ind.bp?.enabled" />
        <span>Enable Blood Pressure Changes detection</span>
      </label>
      <fieldset v-show="ind.bp?.enabled" class="shadow-9">
        <details open>
          <summary>Chronic Conditions</summary>
          <div class="form-elements">
            <label class="row">
              <input type="checkbox" name="bp.chronicHypertension" :checked="ind.bp?.chronicHypertension" />
              <span>Chronic Hypertension</span>
            </label>
            <label class="row">
              <input type="checkbox" name="bp.chronicHypotension" :checked="ind.bp?.chronicHypotension" />
              <span>Chronic Hypotension</span>
            </label>
          </div>
          </details>
          <details open>
          <summary>Set alerts’ thresholds compared to baseline:</summary>
          <div>
            <details>
            <summary>Systolic</summary>
            <div class="form-elements">
              <label class="row">
                <span>First level (Yellow alert)</span>
                <span>±<input type="number" name="bp.warn.sys" :min="config.min_sys" :max="config.max_sys" :value="ind.bp?.warn?.sys ?? 10" />%</span>
              </label>
              <label class="row">
                <span>Second level (Red alert)</span>
                <span>±<input type="number" name="bp.alert.sys" :min="config.min_sys" :max="config.max_sys" :value="ind.bp?.alert?.sys ?? 20" />%</span>
              </label>
            </div>
            </details>
            <details>
            <summary>Diastolic</summary>
            <div class="form-elements">
              <label class="row">
                <span>First level (Yellow alert)</span>
                <span>±<input type="number" name="bp.warn.dia" :min="config.min_dia" :max="config.max_dia" :value="ind.bp?.warn?.dia ?? 10" />%</span>
              </label>
              <label class="row">
                <span>Second level (Red alert)</span>
                <span>±<input type="number" name="bp.alert.dia" :min="config.min_dia" :max="config.max_dia" :value="ind.bp?.alert?.dia ?? 20" />%</span>
              </label>
            </div>
            </details>
            <details>
            <summary>Mean percent:</summary>
            <div class="form-elements">
              <label class="row">
                <span>First level (Yellow alert)</span>
                <span>±<input type="number" name="bp.warn.map" :min="config.min_bpMap" :max="config.max_bpMap" :value="ind.bp?.warn?.map ?? 10" />%</span>
              </label>
              <label class="row">
                <span>Second level (Red alert)</span>
                <span>±<input type="number" name="bp.alert.map" :min="config.min_bpMap" :max="config.max_bpMap" :value="ind.bp?.alert?.map ?? 20" />%</span>
              </label>
            </div>
            </details>
          </div>
        </details>
      </fieldset>
      <label class="row" :class="ind.arrhythmia?.enabled ? 'checkOpen' : 'checkClosed'">
        <input type="checkbox" name="arrhythmia.enabled" :checked="ind.arrhythmia?.enabled" />
        <span>Arrhythmia</span>
      </label>
      <fieldset v-show="ind.arrhythmia?.enabled" class="shadow-9">
        <legend>Set alerts’ thresholds compared to baseline:</legend>
        <div>
          <details open>
            <summary>Heart Rate Percent:</summary>
            <div class="form-elements">
              <label class="row">
                <span>First level (Yellow alert)</span>
                <span>±<input type="number" name="arrhythmia.warn.hr" :min="config.min_arrhythmia_hr" :max="config.max_arrhythmia_hr" :value="ind.arrhythmia?.warn?.hr ?? 10" />%</span>
              </label>
              <label class="row">
                <span>Second level (Red alert)</span>
                <span>±<input type="number" name="arrhythmia.alert.hr" :min="config.min_arrhythmia_hr" :max="config.max_arrhythmia_hr" :value="ind.arrhythmia?.alert?.hr ?? 20" />%</span>
              </label>
            </div>
          </details>
          <details open>
            <summary>Bradycardia and Tachycardia:</summary>
            <div class="form-elements">
              <label class="row">
                <span>Bradycardia Yellow Alert:</span>
                <span>When measurement falls below</span>
                <input type="number" name="arrhythmia.warn.bradycardia" :min="config.min_arrhythmia_bradycardia" :max="config.max_arrhythmia_bradycardia" :value="ind.arrhythmia?.warn?.bradycardia ?? 50" />
                <span>RPM</span>
              </label>
              <label class="row">
                <span>Bradycardia Red Alert:</span>
                <span>When measurement falls below</span>
                <input type="number" name="arrhythmia.alert.bradycardia" :min="config.min_arrhythmia_bradycardia" :max="config.max_arrhythmia_bradycardia" :value="ind.arrhythmia?.alert?.bradycardia ?? 40" />
                <span>RPM</span>
              </label>
              <label class="row">
                <span>Tachycardia Yellow Alert:</span>
                <span>When measurement rises above</span>
                <input type="number" name="arrhythmia.warn.tachycardia" :min="config.min_arrhythmia_tachycardia" :max="config.max_arrhythmia_tachycardia" :value="ind.arrhythmia?.warn?.tachycardia ?? 100" />
                <span>RPM</span>
              </label>
              <label class="row">
                <span>Tachycardia Red Alert:</span>
                <span>When measurement rises above</span>
                <input type="number" name="arrhythmia.alert.tachycardia" :min="config.min_arrhythmia_tachycardia" :max="config.max_arrhythmia_tachycardia" :value="ind.arrhythmia?.alert?.tachycardia ?? 140" />
                <span>RPM</span>
              </label>
            </div>
          </details>
        </div>
      </fieldset>
      <label class="row" :class="ind.apnea?.enabled ? 'checkOpen' : 'checkClosed'">
        <input type="checkbox" name="apnea.enabled" :checked="ind.apnea?.enabled" />
        <span>Apnea</span>
      </label>
      <fieldset v-show="ind.apnea?.enabled" class="shadow-9">
        <legend>Set alerts’ thresholds compared to baseline:</legend>
        <div>
        <details open>
          <summary>Respiration Rate %</summary>
          <div class="form-elements">
            <label class="row">
              <span>First level (Yellow alert)</span>
              <span>±<input type="number" name="apnea.warn.rr" :min="config.min_apnea_rr" :max="config.max_apnea_rr" :value="ind.apnea?.warn?.rr ?? 10" />%</span>
            </label>
            <label class="row">
              <span>Second level (Red alert)</span>
              <span>±<input type="number" name="apnea.alert.rr" :min="config.min_apnea_rr" :max="config.max_apnea_rr" :value="ind.apnea?.alert?.rr ?? 20" />%</span>
            </label>
          </div>
        </details>
        <details open>
          <summary>Bradypnea and Tachypnea</summary>
          <div class="form-elements">
            <label class="row">
              <span>Bradypnea Yellow Alert:</span>
              <span>When measurement falls below</span>
              <input type="number" name="apnea.warn.bradypnea" :min="config.min_apnea_bradypnea" :max="config.max_apnea_bradypnea" :value="ind.apnea?.warn?.bradypnea ?? 12">
              <span>BPM</span>
            </label>
            <label class="row">
              <span>Bradypnea Red Alert:</span>
              <span>When measurement falls below</span>
              <input type="number" name="apnea.alert.bradypnea" :min="config.min_apnea_bradypnea" :max="config.max_apnea_bradypnea" :value="ind.apnea?.alert?.bradypnea ?? 6">
              <span>BPM</span>
            </label>
            <label class="row">
              <span>Tachypnea Yellow Alert:</span>
              <span>When measurement rises above</span>
              <input type="number" name="apnea.warn.tachypnea" :min="config.min_apnea_tachypnea" :max="config.max_apnea_tachypnea" :value="ind.apnea?.warn?.tachypnea ?? 20">
              <span>BPM</span>
            </label>
            <label class="row">
              <span>Tachypnea Red Alert:</span>
              <span>When measurement rises above</span>
              <input type="number" name="apnea.alert.tachypnea" :min="config.min_apnea_tachypnea" :max="config.max_apnea_tachypnea" :value="ind.apnea?.alert?.tachypnea ?? 25">
              <span>BPM</span>
            </label>
          </div>
        </details>
        </div>
      </fieldset>
      <label class="row">
        <input type="checkbox" name="bodyPosition.changes" :checked="ind.bodyPosition?.enabled" />
        <span>Enable Body Position Changes.</span>
      </label>
      <label class="row" :class="ind.fever?.enabled ? 'checkOpen' : 'checkClosed'">
        <input type="checkbox" name="fever.enabled" :checked="ind.fever?.enabled" />
        <span>Enable Core Temperature Changes</span>
      </label>
      <fieldset v-show="ind.fever?.enabled" class="shadow-9">
        <legend>Algorithms details:</legend>
        <div>
        <details open>
          <summary>Core Temperature - Hypothermia and Hyperthermia:</summary>
          <div class="form-elements">
            <label class="row">
              <span>Hypothermia Yellow Alert:</span>
              <span>When measurement falls to</span>
              <span><input type="number" name="fever.warn.hypothermia" data-convert="temp"
                :value="temp.toUI(ind.fever?.warn?.hypothermia ?? 35)"
                :min="temp.toUI(config.min_fever_hypothermia)"
                :max="temp.toUI(config.max_fever_hypothermia)"
                :step="temp.delta(.1)" />°{{temp.unit}}</span>
            </label>
            <label class="row">
              <span>Hypothermia Red Alert:</span>
              <span>When measurement falls to</span>
              <span><input type="number" name="fever.alert.hypothermia" data-convert="temp"
                :value="temp.toUI(ind.fever?.alert?.hypothermia ?? 32)" 
                :min="temp.toUI(config.min_fever_hypothermia)"
                :max="temp.toUI(config.max_fever_hypothermia)"
                :step="temp.delta(.1)" />°{{temp.unit}}</span>
            </label>
            <label class="row">
              <span>Hyperthermia Yellow Alert:</span>
              <span>When measurement rises to</span>
              <span><input type="number" name="fever.warn.hyperthermia" data-convert="temp"
                :value="temp.toUI(ind.fever?.warn?.hyperthermia ?? 38)"
                :min="temp.toUI(config.min_fever_hyperthermia)"
                :max="temp.toUI(config.max_fever_hyperthermia)"
                :step="temp.delta(.1)" />°{{temp.unit}}</span>
            </label>
            <label class="row">
              <span>Hyperthermia Red Alert:</span>
              <span>When measurement rises to</span>
              <span><input type="number" name="fever.alert.hyperthermia" data-convert="temp"
                :value="temp.toUI(ind.fever?.alert?.hyperthermia ?? 39)"
                :min="temp.toUI(config.min_fever_hyperthermia)"
                :max="temp.toUI(config.max_fever_hyperthermia)"
                :step="temp.delta(.1)" />°{{temp.unit}}</span>
            </label>
          </div>
        </details>
        </div>
      </fieldset>
    </form>
  </details>
</template>

<script>

import { mapGetters, mapState } from 'vuex'
import config from '../../../public/PatientConfig.json';

export default {
  name: 'Configure',
  components: {
  },

  data:function(){
    return{
      problems: {},
      changeWeight: false,
      changeHeight: false,
      config: config,
      moreInfo: false,
      // poly_lookup: {},
      //patSelected:null,
      wardSelected: null ,
      roomSelected:null,
      bedSelected:null,
      polySelected:null,
      bpSelected:null,
      deleteMsg: true,
      lastPoly: '',
      pop:false,
      lastLast: 0,
      createdTime: '',
      createdDate: '',
      bodyPositions: {
        lying:    {text: 'Lying',    coords: '62,2,134,58'},
        sitting:  {text: 'Sitting',  coords: '32,2,64,58' },
        standing: {text: 'Standing', coords: '2,2,34,58'  },
      },
      PMPlacements: {
        lowerCentreChest: {text: 'Lower Centre Chest', coords: '67,75,12' },
        leftCentreChest:  {text: 'Left Centre Chest',  coords: '97,80,13' },
        centreUpperChest: {text: 'Centre Upper Chest', coords: '68,33,12' },
        upperLeftChest:   {text: 'Upper Left Chest',   coords: '101,30,12'},
      },
    }
  },
  
  computed:{
    ...mapGetters({'currentSession': 'sessions/current', 'patient':'manage/current'}),
    ...mapState('sessions', ['currentId', 'settings','activePolys','takenPatients']),
    ...mapState('env', ['height', 'weight', 'temp','clock']),
    ...mapState('layout', ['colourScheme']),
    // ...mapState({'sessionList': 'sessions/all'}),
    sessionList(){ return this.$store.state.sessions.all; },
    cali() { return this.settings?.calibrate || {}; },
    ind() { return this.settings?.ind || {}; },
    bpOptions(){ 
      var opt = [];
      for(var b in this.bodyPositions){
        opt.push(this.bodyPositions[b].text);
      }
      return opt;
    },
    pmpOptions(){
      var opt = [];
      for(var b in this.PMPlacements){
        opt.push(this.PMPlacements[b].text);
      }
      return opt;
    },
    isLive() {return this.lastLast + 9999 > this.clock.valueOf(); },
    patients(){
      var pats = this.$store.state.sessions.patients;
      for (var i in this.takenPatients){
        pats.find(p => p.id === this.takenPatients[i])['taken'] = 1;
      }
      return pats;
      // return this.$store.state.manage.patients;
    },
    patient() {
      return this.patients.find(p => p.id === this.settings?.patient?.$oid);
    },

    patSelected: {
      get() { return this.patient?.serial ?? ''; },
      set() {}
    },

    pat_options(){
      var patients = [];
      for(var pat in this.patients){
        if(this.patients[pat].taken!==1)
        patients.push(this.patients[pat].serial);
      }
      return patients;
    },

    polys(){
      var Polys = this.$store.state.manage.polys;
      if(Polys.length ==0) { return []; }
      for (var i in this.activePolys){
        if(this.activePolys[i] !='None'){
          Polys.find(p=> p.id === this.activePolys[i])['taken'] = true;
        }
      }
      return Polys;

    },

    polyOptions(){
      var lst = [];
      for (var p in this.polys){
        if(this.polys[p].taken == true) continue;
        // else lst.push(this.polys[p].name.includes('-') ? this.polys[p].name.split('-')[1]: this.polys[p].name);
        else lst.push(this.polys[p].name);
      }
      return lst;
    },

    activePoly(){
      return this.polys?.find(p=> p.id === this.settings?.polyMonitor?.$oid)?.name;
    },

    disable() { return this.currentSession?.status !== 10; },
    
    bodyPositionImage() {
      try {
        return require(`../../assets/img/body_position/${this.cali.bodyPosition ?? 'background'}.png`);
      } catch(e) {
        return require('../../assets/img/body_position/background.png');
      }
    },

    polymonitorBodyLocationImage() {
      try {
        return require(`../../assets/img/place_pm/${this.cali.polymonitorBodyLocation ?? 'background'}.png`);
      } catch(e) {
        return require('../../assets/img/place_pm/backgroundPm.png');
      }
    },

    loc() { return this.currentSession?.location || {}; },

    wards(){return this.$store.state.locations.wards; },

    wardsOptions(){
      var lst = [];
      for (var w in this.wards){
        lst.push(this.wards[w].name);
      }
      return lst;
    },

    rooms() { return this.wards?.find(w => w.name === this.loc?.ward)?.rooms ?? []; },

    roomsOptions(){
      var lst = [];
      for (var w in this.rooms){
        lst.push(this.rooms[w].name);
      }
      return lst;
    },

    beds() { 
      if(!(this.rooms?.find(r=> r.name == this.loc?.room)?.beds)) return [];
      var bed_lookup = {};
      for(var ses in this.sessionList){
        if(!ses) return;
        var b = this.sessionList[ses].location;
        if(this.loc?.ward && this.loc?.ward != b?.ward ) { continue; }
        if(this.loc?.room != b.room) { continue; }
        if(b && b.bed && b.bed != this.loc.bed){
          bed_lookup[b.bed] = 1;
        }
      }
      return this.rooms.find(r=> r.name == this.loc.room)?.beds.map(b => {return {name: b, taken: bed_lookup[b]}});
    },

    bedsOptions(){
      var lst = [];
      for (var b in this.beds){
        if(!this.beds[b].taken == 1) lst.push(this.beds[b].name); 
      }
      return lst;
    },
        
    birthday() {
      const bd = this.patient?.birthdate;
      if (!bd) return '';
      const b = new Date(bd), d = new Date(Date.now() - b);
      const a = d < 2_631_600_000 ? ~~(d / 86_400_000) + ' days' : d < 63_158_400_000 ? ~~(d / 2_631_600_000) + ' months' : ((d.getUTCFullYear() - 1970) + 'yo');
      return b.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }) + ' (' + a + ')';
    },
  },

  watch: {
    currentSession() {
      if (this.currentSession) {
        var created_time = new Date(this.currentSession.created * 1000);
        var now = new Date();
        this.createdTime = now - created_time < 72000000 ? created_time.toLocaleTimeString() : created_time.toLocaleDateString();
        this.createdDate = created_time.toLocaleString();
      }
    },

    wardSelected(){
      this.roomSelected = this.bedSelected = this.loc.room = this.loc.bed = null;
    },

    polySelected(){
      for (var p in this.polys){
        if(this.polys[p].name == this.activePoly) {
          this.polys[p].taken = false;
          break;
        }
      }
    },
    patSelected(){
      for(var pat in this.patients){
        if(this.patients[pat]?.serial && this.patients[pat]?.serial == this.patient?.serial){
          this.patients[pat]['taken'] = 0;
          break;
        }
      }
    },

    loc: function () { this.loadVacancy('ward'); },
    'loc.ward': function () { this.loadVacancy('ward'); },
    'loc.bed': function () { this.loadVacancy('bed'); },
  },

  methods:{
    removeItem(lst,b){
      for(var i = 0; i < lst.length; i++){    
        if (lst[i] === b) {  
          lst.splice(i, 1); 
        }
      }
      return lst;
    },

    async loadVacancy(item) {
      if (item === 'bed') return
      if (item === 'ward') {
        await this.$store.dispatch('locations/loadWardVacancy', {name: this.loc.ward});
        if (this.rooms.length === 1)
          this.updateKeyValue('location', ['room'], this.rooms[0].name);
      }
      let free = this.beds.filter(b => (b.session ?? this.currentId) === this.currentId);
      if (free.length === 1)
        this.updateKeyValue('location', ['bed'], free[0].name);
    },

    updateKeyValue(key, path, value) {
      this.lastPoly = value;
      this.$store.dispatch('sessions/updateValue', {key, path, value});
    },

    updateValue(key,path,value) {
      this.$store.commit('sessions/setNewId', {id: null});
      if (!this.currentSession) return;
      // if (el.dataset?.convert) { value = this[el.dataset?.convert].fromUI(value); }//!!!!!!! check this on new version
      var val = isNaN(value) ? value.trim() : +value;
      this.updateKeyValue(key, path, val);
    },

    updateValue2(e) {
      this.$store.dispatch('sessions/loadNewId', {id:null})
      if (!this.currentSession || !e.target.form) return;
      const el = e.target, key = el.form.id, path = el.name.split('.');
      var value = el.type === 'checkbox' ? el.checked : isNaN(el.value) ? el.value.trim() : +el.value;
      this.updateKeyValue(key, path, value);
      const ref = Object.keys(this.$refs).find(k => this.$refs[k] === el);
      if (ref) delete this.problems[ref];
    },

    updateSerial(pat){
      pat = this.patients.find(p=> p.serial == pat).id
      this.updateValue('patient', ['$oid'], pat);
    },

    updateWard(ward){
      this.updateValue('location', ['ward'], ward);
    },

    updateRoom(room){
      this.updateValue('location', ['room'], room);
    },

    updateBed(bed){
      this.updateValue('location', ['bed'], bed);
    },

    updatePoly(poly){
      poly = this.polys.find(p=> p.name == poly).id
      this.updateValue('polyMonitor', ['$oid'], poly);
    },

    updateBP(bp){
      this.updateValue('calibrate', ['bodyPosition'], bp.toLowerCase());
    },

    updatePmp(bp){
      bp = bp.split(" ").join("");
      bp = bp.charAt(0).toLowerCase()+ bp.slice(1);
      this.updateValue('calibrate', ['polymonitorBodyLocation'], bp);
    },

    setBodyPosition(e, value) { e.preventDefault(); this.updateKeyValue('calibrate', ['bodyPosition'], value.toLowerCase()); },
    
    setPMPlace(e, value) { e.preventDefault(); this.updateKeyValue('calibrate', ['polymonitorBodyLocation'], value.toLowerCase()); },

    moveToCal(e) {
      e.preventDefault();
      let p = [];
      if ((this.patient?.id ?? '') === '') p.push(['selectPatient', 'please select one']);
      if (!this.loc.ward) p.push(['selectWard', 'please select one']);
      else if (!this.loc.room) p.push(['selectRoom', 'please select one']);
      else if (!this.loc.bed) p.push(['selectBed', 'please select one']);
      if ((this.settings?.polyMonitor?.$oid ?? '') === '') p.push(['selectPoly', 'please select one']);

      if (p.length > 0) {
        this.$refs[p[0][0]]?.focus();
        this.problems = Object.fromEntries(p);
      }
      else {
        this.problems = {};
        const id = this.currentId, nextst = 20, name = 'tabCalibrating';
        this.$store.dispatch('sessions/loadStatus', { id, nextst }); 
        this.$router.push({ name, params: { id: id } });   
      }
    },
    
  }
    
}
</script>

<style scoped>

.Tabs details form {
  margin-bottom: 24px;
}

#bodyPositionImage {
  background: url('../../assets/img/body_position/background.png');
  background-size: cover;
}

#polymonitorBodyLocationImage {
  background: url('../../assets/img/place_pm/backgroundPm.png');
  background-size: cover;
}

.checkClosed::after {
    content: '... ';
}

.checkOpen::after {
    content: ': ';
}

.q-select{
  font-size: medium;
}

.nextCal{
  /* background-color: var(--fg-ok); */
  color: rgba(255,255,255,1);
  display: block;
  font-size: large;
  margin: 0 0 0 auto;
  margin-right: 20px;
}

.size{
  color:grey;
  border: none;
  background: transparent;
}

.size.active{
  color:var(--fg);
  font-size: medium;
}

.moreInfo{
  background: transparent;
  border:none;
  color:black;
}

.moreInfo:hover{
  color: rgb(39, 122, 199);
}

option:disabled{
  background: lightgray;
}

@media (min-width: 0) {
  .row > .col, .flex > .col, .row > .col-auto, .flex > .col-auto, .row > .col-grow, .flex > .col-grow, .row > .col-shrink, .flex > .col-shrink, .row > .col-xs, .flex > .col-xs, .row > .col-xs-auto, .row > .col-12, .row > .col-xs-12, .row > .col-11, .row > .col-xs-11, .row > .col-10, .row > .col-xs-10, .row > .col-9, .row > .col-xs-9, .row > .col-8, .row > .col-xs-8, .row > .col-7, .row > .col-xs-7, .row > .col-6, .row > .col-xs-6, .row > .col-5, .row > .col-xs-5, .row > .col-4, .row > .col-xs-4, .row > .col-3, .row > .col-xs-3, .row > .col-2, .row > .col-xs-2, .row > .col-1, .row > .col-xs-1, .row > .col-0, .row > .col-xs-0, .flex > .col-xs-auto, .flex > .col-12, .flex > .col-xs-12, .flex > .col-11, .flex > .col-xs-11, .flex > .col-10, .flex > .col-xs-10, .flex > .col-9, .flex > .col-xs-9, .flex > .col-8, .flex > .col-xs-8, .flex > .col-7, .flex > .col-xs-7, .flex > .col-6, .flex > .col-xs-6, .flex > .col-5, .flex > .col-xs-5, .flex > .col-4, .flex > .col-xs-4, .flex > .col-3, .flex > .col-xs-3, .flex > .col-2, .flex > .col-xs-2, .flex > .col-1, .flex > .col-xs-1, .flex > .col-0, .flex > .col-xs-0, .row > .col-xs-grow, .flex > .col-xs-grow, .row > .col-xs-shrink, .flex > .col-xs-shrink {
    width: auto;
    min-width: 60px;
    max-width: 100%;
  }
}

.bpClass{
  padding: 4px 11px;
  margin-top: inherit;
  background: var(--bg-highlight);
  left: 0;
  height: inherit;
  border: 2px solid transparent;
  transition: border-color 0.36s cubic-bezier(0.4, 0, 0.2, 1);
  right: 0;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  letter-spacing: 0.00937em;
  outline: none;
  cursor:pointer;
  box-shadow:0px 0px 0px 0px #495858;
  border-radius: 4px;
}

.bpClass:hover{
  transition-duration: 300ms;
  background: #e7d4bb;
  /* color: var(--fg-highlight); */
}

.bpClass::after{
  background:teal;
}

option{
  background: white;
  cursor: pointer;
  line-height: 10px;
  margin-bottom: 10px;
}

.visual-select{
  display: flex;
}

.visual-select > * {
  align-items: center;
  background: var(--bg);
  /* border-radius: 6px; */
  /* box-shadow: 0 2px 3px -1px rgb(0 0 0 / 28%), 0 2px 5px rgb(0 0 0 / 18%), 0 1px 10px rgb(0 0 0 / 12%); */
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  margin: 1em 1rem 1rem 0.3rem;
  padding: .6em;
  text-align: center;
}

.wards_select{
  border-left: none;
  width: 121px ;
  position: inherit;
  margin-right:5px;
}

.ward_label{
  margin-top: 6px;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  /* font-family: trebuchet ms; */
  /* color: var(--q-primary); */
}

.row :is(input, select) {
  border-style: none none solid;
  border-width: 2px thin;
  border: none;
  /* box-shadow: 0px 0px 2px #b4bbbb; */
}

.delete{
  font-size: 0.9rem !important;
  /* width: 50px !important;
  height: 45px !important; */
  /* right: 12px;
  top:0px;
  position: absolute; */
}

#ind input{
  border: none;
  /* box-shadow: 0px 0px 3px 0px #252524bd; */
  margin-bottom: 2px;
  /* text-decoration: none; */
  outline: none;
  background: #f2f2f2;
  /* height: 31px; */
  border-radius: 4px 4px 0 0;
  color: black;
}

.q-item__label--caption {
  color: var(--text);
}

.form-elements {
  margin-bottom: 7px;
}

fieldset {
  margin: 1em 0em;
  border-color: white;
}

legend{
  font-weight: 500;
}

.tab_actions button{
  padding: 0.3rem 0.5rem;
}
</style>
