<template>
  <v-app> 
    <v-main v-if="isLogin">
      <v-container>
        <v-row justify="center">
          <v-col lg="4" md="4" sm="4" xs="12">
            <v-alert
              v-model="alert"
              v-if="Message !== 'clear'"
              dense
              dismissible
              type="success"
            >
              {{Message}}
            </v-alert>
            <v-alert
              v-model="alert"
              v-if="ErrMessage !== 'clear'"
              dense
              dismissible
              type="error"
              >
              {{ErrMessage}}
            </v-alert>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col lg="5" md="10" sm="8" xs="12">
            <v-card dark class="card">
              <v-card-title>
                帳號管理
                <v-spacer></v-spacer>
                <EditPwd/>
              </v-card-title>
              
              <v-divider class="mx-4"></v-divider>
              <v-card-text>
                <v-container>
                  <v-row justify="center">
                    <v-col lg="8" md="8" sm="8" xs="12">
                      <v-text-field
                        v-model="name"
                        color="indigo darken-2"
                        label="姓名"
                        :disabled="!CanEdit"
                      >{{isName}}</v-text-field>
                    </v-col>
                    <v-col lg="8" md="8" sm="8" xs="12">
                      <v-text-field
                        v-model="number"
                        color="indigo darken-2"
                        label="工號"
                        :disabled="!CanEdit"
                      >{{isNumber}}</v-text-field>
                    </v-col>
                    <v-col lg="8" md="8" sm="8" xs="12">
                      <v-text-field
                        v-model="username"
                        color="indigo darken-2"
                        label="帳號"
                        required
                        :disabled="!CanEdit"
                      >{{isUsername}}</v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="!CanEdit"
                  color="primary"
                  @click="edit"
                >
                  編輯
                </v-btn>
                <v-btn
                  v-if="CanEdit"
                  color="error"
                  light
                  @click="edit"
                >
                  取消
                </v-btn>
                <v-btn
                  color="green darken-1"
                  @click="save"
                  :disabled="!CanEdit"
                >
                  儲存
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container> 
    </v-main>
  </v-app>
</template>

<script>
import EditPwd from "../components/EditPwd.vue";
export default {
  components:{
    EditPwd
  },
  layout: 'Slider',
  data() {
    return {
      showPwd: false,
      showPwdCheck: false,
      password: 'Password',
      CanEdit: false,
      username: this.$store.getters.loginUsername,
      number: this.$store.getters.loginNumber,
      name: this.$store.getters.loginName,
      alert: false,
      message: this.$store.getters.Message,
      err_message: this.$store.getters.ErrMessage,
    }
  },
  mounted(){
    if(!this.$cookies.get("auth")?.token){ //?=檢查有沒有token 重要
      this.$router.push('/'); 
    }
    else{
      console.log("reset1",this.$store.getters.Message);
      this.$store.dispatch("handUserData",{
        token: this.$cookies.get("auth").token,
      });
      this.$store.dispatch("handIsLogin", true, this.username, this.name, this.number);
      if (this.$store.getters.Message) {
          this.alert = true;
          setTimeout(()=>{
            this.$store.dispatch("handClearMsg", 'clear');
          }, 3000);
      }
    }
  },
  beforeDestroy(){
    clearTimeout();
  },
  computed:{
    isLogin(){
      return this.$store.getters.loginState
    },
    isName(){
      this.name = this.$store.getters.loginName
      return this.$store.getters.loginName
    },
    isNumber(){
      this.number = this.$store.getters.loginNumber
      return this.$store.getters.loginNumber
    },
    isUsername(){
      this.username = this.$store.getters.loginUsername
      return this.$store.getters.loginUsername
    },
    Message(){
      console.log("MESSAGE",this.$store.getters.Message);
      this.alert = true;
      this.message = this.$store.getters.Message;
      return this.$store.getters.Message;
    },
    ErrMessage(){
        this.alert = true;
        console.log("ERROR",this.$store.getters.ErrMessage);
        this.err_message = this.$store.getters.ErrMessage;
        return this.$store.getters.ErrMessage;
    },
  },
  methods:{
    edit() {
      this.CanEdit = !this.CanEdit;
    },
    save(){
      this.CanEdit = !this.CanEdit;
      this.$store.dispatch("handDataChange",{
        token: this.$cookies.get("auth").token,
        username: this.username,
        number: this.number,
        name: this.name,
      });
      setTimeout(()=>{
        this.$store.dispatch("handClearMsg", 'clear');
        this.$store.dispatch("handClearErrMsg", 'clear');
      }, 3000);
      // this.$store.dispatch("handClearMsg", '');
      // console.log("3");
      // this.message = this.$store.getters.Message;
    }
  }
}
</script>

<style>
.v-main{
  background-color: rgb(22, 22, 22);
}
.card{
  margin-top: 10px;
}

</style>