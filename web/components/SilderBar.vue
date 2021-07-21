<template>
  <v-main>
    <v-navigation-drawer
      v-model="drawer"
      app
      dark
      color="grey darken-4"
    >
      <v-list>
        <router-link to="/dashboard">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>

            <v-list-item-title>我的帳號</v-list-item-title>
          </v-list-item>
        </router-link>

        <router-link to="/list">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-account-box</v-icon>
            </v-list-item-icon>

            <v-list-item-title>員工管理</v-list-item-title>
          </v-list-item>
        </router-link>
      </v-list>
    </v-navigation-drawer>

    <!-- Header -->
    <v-app-bar 
    color="black"
    dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" v-if="showdrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Radius帳號管理</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout">
        Logout
      </v-btn>
      <!-- <v-col lg="4" md="6">
        <v-text-field
          v-model="search"
          clearable
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="mdi-magnify"
          label="Search"
        ></v-text-field>
      </v-col> -->
      
    </v-app-bar>
  </v-main>
</template>

<script>
  export default {
    data () {
      return {
        drawer: true,
        showdrawer: true,
        search: '',
      }  
    },
    mounted(){
      console.log(this.$store.getters.loginAdmin);
      if (this.$store.getters.loginAdmin == 0) {
        this.showdrawer = false;
        this.drawer = false;
      }
    },
    methods:{
      logout(){
        this.$store.dispatch("Logout",{
          token: this.$cookies.get("auth").token,
        });
        // setTimeout(()=>{
        //   this.$store.dispatch("handClearMsg", 'clear');
        //   this.$store.dispatch("handClearErrMsg", 'clear');
        // }, 3000);
      },
    },
    computed:{
      isAdmin(){
        return this.$store.getters.loginAdmin
      },
    },
  }
</script>

<style lang="scss" scoped>
a{
  text-decoration: none;
}
</style>

