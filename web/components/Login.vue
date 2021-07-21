<template>
  <v-app>
    <v-main>
      <v-alert
        v-model="alert"
        v-if="Message !== 'clear'"
        dense
        dismissible
        type="success"
        >
        {{Message}} 正在前往登入頁...
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
      <form class="box" @submit.prevent="login" v-if="showform">
        <h1>Radius帳號管理系統</h1>
        <input type="text" name="" placeholder="Username" v-model="user.account">
        <input type="password" name="" placeholder="Password" v-model="user.password">
        <input type="submit" name="" value="Login">
      </form>
    </v-main>
  </v-app>
  
</template>

<script>
export default {
  data() {
    return {
      user: {
        account: "",
        password: "",
        
      },
      alert: false,
      showform: true,
    }
  },
  methods:{
    login(){
      this.$store.dispatch('handAuth',{
        account: this.user.account,
        password: this.user.password,
      });
      setTimeout(()=>{
        this.$store.dispatch("handClearMsg", 'clear');
        this.$store.dispatch("handClearErrMsg", 'clear');
      }, 3000);
      console.log(this.$store.getters.Message);
    }
  },
  mounted(){
    console.log(this.$store.getters.Message);
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      setTimeout(() => this.$nuxt.$loading.finish(), 500)
    })
  },
  beforeDestroy(){
    clearTimeout();
  },
  computed:{
    Message(){
      console.log("MESSAGE",this.$store.getters.Message);
      if (this.$store.getters.Message == "登入成功" || this.$store.getters.Message == 'claer') {
        console.log("conputed");
        this.alert = false;
        this.message = this.$store.getters.Message;
        return this.$store.getters.Message;
      }
      if (this.$store.getters.Message == "登出成功") {
        this.showform = false;
        setTimeout(()=>{
          this.$store.dispatch("LogoutClear");
        }, 2000)
      }
      return this.$store.getters.Message;
    },
    ErrMessage(){
        this.alert = true;
        console.log("ERROR",this.$store.getters.ErrMessage);
        this.err_message = this.$store.getters.ErrMessage;
        return this.$store.getters.ErrMessage;
    },
  }
}
</script>

<style>
.v-main{
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background-color: #1e2b38;
}

.box{
  width:400px;
  padding: 50px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background: #191919;
  text-align: center;
  border-radius: 5px;
}

.box h1{
  color: white;
  /* text-transform: uppercase; */
  font-weight: 500;
}

.box input[type="text"], .box input[type="password"]{
  border: 0;
  background: none;
  display: block;
  margin: 20px auto;
  text-align: center;
  border: 2px solid #3498db;
  padding: 14px 10px;
  width: 200px;
  outline: none;
  color: white;
  border-radius: 24px;
  transition: 0.25s;
}

.box input[type="text"]:focus, .box input[type="password"]:focus{
  width: 280px;
  border-color: #2ecc71;
}

.box input[type="submit"]{
  border: 0;
  background: none;
  display: block;
  margin: 20px auto;
  margin-top: 30px;
  text-align: center;
  border: 2px solid #2ecc71;
  padding: 14px 40px;
  outline: none;
  color: white;
  border-radius: 24px;
  transition: 0.25s;
  cursor: pointer;
}
.box input[type="submit"]:hover{
  background: #2ecc71;
}
</style>