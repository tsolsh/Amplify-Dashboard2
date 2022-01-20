<template>
  <section class="contact" id="contact">
    <div class="container">
      <div class="heading text-center">
        <!-- <h2> ATLASense Biomed </h2> -->
        <!-- <img src="../../assets/img/new_logo_atlasense.png" alt="" width="280" height="120"/> -->
        <div class="head_font">
          <svg style="color: rgb(3 168 168); fill: rgb(34 175 152);" width="280" height="90"><use href="../../assets/img/i.svg#ATLASenseBioMed"/></svg><br/>
          &nbsp; Monitoring anytime, anywhere
        </div>
        <p>Welcome to Atlasense biomed session manager.
        <br>Already have an account? <q-btn @click="open_login" color="secondary" no-caps flat dense size="20px">Login</q-btn> <br>If not, please contact us.</p>
      </div>
      <div style="flex:1;"></div>
      <div class="row" style=" position: absolute; bottom: 10%;">
        <div style="text-align:center;display: flex;flex-direction: column;">
          <q-btn class="title" label="Contact Us" @click="contact_info = true" no-caps color="secondary" size="17px" outline rounded/>
          
          <q-dialog v-model="contact_info">
            <q-card class="add_input" @input="saveChanges($event)" style="min-width: 760px;max-width: 80vw;background:var(--bg);grid-column: 1;font-size: large;">
              <q-card-section class="header shadow-9">
                <h5 class="dialog_title">Contact Us</h5>
                <q-btn icon="close" flat round v-close-popup text-color="black"/>
              </q-card-section>
              <div class="all">
                <table>
                  <tr>
                  <td>
                    <q-input v-model="name" name="name" placeholder="Your Name" :class="{problem: problems.name}" dense outlined class="contact_input"/>
                    <span class="required">{{problems.name}}</span>
                  </td>
                  </tr>

                  <tr>
                  <td> 
                    <q-input v-model="phone" name="phone" placeholder="Phone Number" :class="{problem: problems.phone}" dense  outlined class="contact_input">
                    <template v-slot:prepend>
                      <q-icon name="call" style="top: 20%;"/>
                    </template>
                    <span class="required">{{problems.phone}}</span>
                    </q-input>
                  </td>
                  </tr>

                  <tr>
                  <td> 
                    <q-input v-model="email" name="email" placeholder="Email" :class="{problem: problems.email}" dense outlined class="contact_input">
                      <template v-slot:prepend>
                        <q-icon name="mail" style="top: 20%;"/>
                      </template>
                      <span class="required">{{problems.email}}</span>
                    </q-input>
                  </td>
                  </tr>

                  <tr>
                  <td> 
                    <q-input v-model="company" name="company" placeholder="Company" :class="{problem: problems.company}" dense  outlined class="contact_input">
                      <template v-slot:prepend>
                        <q-icon name="business_center" style="top: 20%;"/>
                      </template>
                      <span class="required">{{problems.company}}</span>
                    </q-input>
                  </td>
                  </tr>

                  <tr>
                  <td> 
                    <q-input v-model="subject" name="subject" placeholder="Subject" :class="{problem: problems.subject}" dense  outlined class="contact_input">
                    <span class="required">{{problems.subject}}</span>
                  </q-input>
                  </td>
                  </tr>

                  <tr>
                  <td> 
                    <q-input v-model="question" name="question" placeholder="Qusetion" :class="{problem: problems.question}" 
                    type="textarea" counter
                    @keyup.enter.stop dense outlined class="contact_input"/>
                    <span class="required">{{problems.question}}</span>
                  </td>
                  </tr>

                </table>

                <div class="content">
                  <div class="info">
                    <i class="fas fa-mobile-alt"></i>
                    <h4 class="d-inline-block">PHONE :
                      <br>
                      <span>+972-54-7706688</span></h4>
                  </div>
                  <div class="info">
                    <i class="far fa-envelope"></i>
                    <h4 class="d-inline-block">EMAIL :
                      <br>
                      <span>info@atlasensebiomed.com</span></h4>
                  </div>
                  <div class="info">
                    <i class="fas fa-map-marker-alt"></i>
                    <h4 class="d-inline-block">Location :<br>
                      <span>Tel Aviv, 6116101 Israel</span></h4>
                  </div>
                  <div class="info">
                    <i class="fas fa-globe"></i>
                    <h4 class="d-inline-block">Website :<br>
                      <span>www.atlasensebiomed.com</span></h4>
                  </div>
                </div>
              </div>

              <div class="q-pa-md" id="edit_form" style="position: absolute; bottom: 0;right: 0;">
                 <q-btn text-color="secondary" label="Send" no-caps size="15px" icon-right="send" outline rounded class="q-pa-sm"/>
                  <!-- <q-btn type="submit" id="Polys_Cancel" class="cancelBtn1" @click.prevent="cancleBtn()" dense no-caps>Cancel</q-btn>   -->
              </div>  
          </q-card>
          </q-dialog>

          
          
        </div>
      </div>
    </div>
  </section>
</template>


<script>
// import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Guest',
  data() {
    return {
     permitted: false,
     contact_info: false,
     name: null,
     phone: null,
     email: null,
     company: null,
     subject: null,
     question: null,
     problems: {
        name: null,
        phone: null,
        email: null,
        company: null,
        subject: null,
        question: null,
      },
    }
  },

  watch:{
  },

  methods: {
    open_login(){
      this.$store.commit('layout/setLogin', true);
    }
  },
}
</script>


<style scoped>
h6{
  font-size: 1.25rem;
    font-weight: 500;
    /* line-height: 0.1rem; */
    margin-bottom: 20px;
}
#role-choice{
  display: block;
  /* color:white; */
  font-size: 1.55rem;
  padding-top: 13px;
}

.roles div:empty::before {
  content: 'None';
}

.manager_header{
  padding-top: 11px;
  /* margin-bottom: revert; */
  font-family: inherit;
  font-weight: bolder;
  font-size: 2.3em;
  text-shadow: 1px 1px 10px rgb(24 80 80);
  color: white;
  background: linear-gradient(#0bb0b0, var(--bg-4));
}

.grid-container {
  display: grid;
  grid-gap: 50px;
  grid-template-columns: auto auto auto;
  padding: 10px;
}

.grid-item {
  border: 1px solid rgba(0, 0, 0, 0.8);
  padding: 20px;
  font-size: 15px;
  text-align: center;
}

.roles div:empty::before {
  content: 'None';
}

.manage_all{
  height: inherit;
  display: grid;
  grid-row-start: 1;
  grid-template-columns: 371px auto auto;
}

.role-panel span{
  float: right;
  font-size:1.1rem;
}

/******************sidebar info*****************/
.role-panel {
  /* background: #ffffff; */
  padding: .5em;
  text-align: center;
  /* height: 70%; */
  border-radius: 5px 5px;
  display: flex;
  flex-flow: column;
  align-items: center;
  position: relative;
  /* top: auto; */
  /* left: auto; */
  grid-column: 2;
  grid-row: 2;
  grid-template-columns: auto auto auto auto;
  flex-direction: column;
  justify-content: center;
}

.role-buttons{
  border: none;
  margin: 8px;
  box-shadow: 0 0 10px 0px rgb(0 0 0 / 50%);
  background-color: #199696;
  width: 230px;
  height: 35px;
  font-weight: bold;
  font-size: large;
  transition: all 0.25s;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-around;
  align-content: stretch;
}

.role-buttons:hover{
  text-shadow:0px -40px 0px rgba(255, 255, 255, 0);
  transform:translateY(0%) translateZ(0) scale(1.1);
  color:#dcefef;
}

#sessionsPanel{
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: -webkit-pictograph;

}

@media (max-width: 50em){
  .role-buttons {
    height: auto;
    width: auto;
  }
  .user_list{
    height: inherit;
    position: absolute;
  }
  .manu{
    height:20%;
  }
  div.user_content{
    grid-column: 1;
    grid-row: 3/4;
  }
  .manage_all{
    grid-template-rows: 50px 50px auto;
  }
}

.contact {
  padding: 60px 93px;
}

.title h2 {
  font-size: 30px;
  font-weight: 700;
  margin: 0;
  padding: 0;
}

.title h2 span {
    color: var(--bg-4);
}

.contact .heading p {
  font-size: 20px;
  font-weight: 400;
  line-height: 1.7;
  color: #727e7c;
  margin: 20px 0 60px;
  padding: 0;
}

.contact .form-control {
  padding: 25px;
  font-size: 13px;
  margin-bottom: 10px;
  background: #f9f9f9;
  border: 0;
  border-radius: 10px;
}

.contact .title h3 {
  font-size: 18px;
  font-weight: 600;
}

.contact .title p {
  font-size: 14px;
  font-weight: 400;
  color: #999;
  line-height: 1.6;
  margin: 0 0 40px;
    
}

.content{
  margin-left: 9%;
  margin-top: 40px;
  grid-column: 2;
  grid-row: 1;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;
  align-content: strech;
  justify-items: center;
  align-items: center;
}

.content .info {
  margin-right: 40px;
  text-align-last: center;
  display: grid;
  align-items: center;
  flex-direction: row;
  justify-items: start;
}

.content .info i {
  font-size: 25px;
  color: var(--q-secondary);
  /* margin-right: 20px; */
  grid-column: 1;
    
}

.content .info h4 {
  font-size: 13px;
  line-height: 1.4;
  grid-column: 2;
}

.content .info h4 span {
  font-size: 13px;
  font-weight: 300;
  color: #999999;
}

.container{
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: flex-end;
}

.head_font{
  color: rgb(34 175 152);
  font-family:Calibri Light;
  font-style: italic;
  font-weight: bold;
  font-size: 1.4rem;

}

.dialog_title{
  color: white;
  font-size: 2.1rem; 
  margin: 0px;
  font-weight: bolder;
  text-align: center;
  padding:0px 4px 0px 4px;
  position: relative;
  left: 40%;
}

.header{
  margin-bottom: 30px;
  background:var(--q-secondary);
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  box-shadow: 2px 0px 5px 3px grey;

}

table{
  margin-left: 20px;
  margin-bottom: 70px;
  margin-right: 40px;
  grid-column: 1;
} 

table td{
  display: grid;
  padding: 9px;
  /* align-items: flex-end; */
}

.all{
  display: grid;
  flex-direction: column;
}

.row :is(input, select) {
  width: 300px;
  border: none;
  box-shadow: none;
}

.row > * {
  display: grid;
  vertical-align: baseline;
}

.q-field__prepend.q-field__marginal.row.no-wrap.items-center {
  display: flex;
}
</style>
