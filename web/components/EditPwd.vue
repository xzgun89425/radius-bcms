<script>
export default {
  data(){
      return {
          dialog: false,
          showPwd: false,
          showNewPwd: false,
          showPwdCheck: false,
          password: 'Password',
          old_pw: "",
          new_pw: "",
          new_pw_check: "",
          alert: true,
          message: this.$store.getters.Message,
      }
  },
  computed:{
      isValue(){
          console.log(this.$store.getters.loginValue);
          return this.$store.getters.loginValue
      }
  },
  methods:{
    handTokentest(){
        this.dialog = !this.dialog;
        console.log("123=>",this.isValue);
        console.log("123=>",this.$cookies.get("auth").token);
        this.$store.dispatch("handPwChange",{
            token: this.$cookies.get("auth").token,
            old_pw: this.old_pw,
            new_pw: this.new_pw,
            new_pw_check: this.new_pw_check,
        });
        setTimeout(()=>{
          this.$store.dispatch("handClearMsg", 'clear');
          this.$store.dispatch("handClearErrMsg", 'clear');
          this.old_pw = "";
          this.new_pw = "";
          this.new_pw_check = "";
        }, 3000);
    },
    closeEditPw(){
      this.dialog = false;
      this.old_pw = "";
      this.new_pw = "";
      this.new_pw_check = "";
    }
  },
  beforeDestroy(){
    clearTimeout();
  },
}
</script>
<template>
    <v-dialog
      v-model="dialog"
      width="400"
      persistent
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="warning"
          dark
          v-bind="attrs"
          v-on="on"
        >
          修改密碼
        </v-btn>
      </template>
      
      <v-card dark>
        <v-card-title>
          修改密碼
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-container>
                <v-row justify="center">
                    <v-col lg="9" md="9" sm="8" xs="12">
                      <v-text-field
                        v-model="old_pw"
                        color="indigo darken-1"
                        label="原密碼"
                        :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPwd ? 'text' : 'password'"
                        @click:append="showPwd = !showPwd"
                      ></v-text-field>
                    </v-col>
                    <v-col lg="9" md="9" sm="8" xs="12">
                      <v-text-field
                        v-model="new_pw"
                        color="indigo darken-1"
                        label="新密碼"
                        :append-icon="showNewPwd ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showNewPwd ? 'text' : 'password'"
                        @click:append="showNewPwd = !showNewPwd"
                      ></v-text-field>
                    </v-col>
                    <v-col lg="9" md="9" sm="8" xs="12">
                      <v-text-field
                         v-model="new_pw_check"
                        color="indigo darken-1"
                        label="確認密碼"
                        :append-icon="showPwdCheck ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPwdCheck ? 'text' : 'password'"
                        @click:append="showPwdCheck = !showPwdCheck"
                      ></v-text-field>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            light
            @click="closeEditPw"
          >
            取消
          </v-btn>
          <v-btn
            color="green darken-1"
            @click="handTokentest"
          >
            修改
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<style>

</style>