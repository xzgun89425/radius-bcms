<template>
  <v-app> 
    <SilderBar v-if="isLogin" />
    <Nuxt />
  </v-app>
</template>

<script>
 import SilderBar from "../components/SilderBar.vue";
 export default{
    components:{
     SilderBar,
   },
   computed:{
    isLogin(){
      return this.$store.getters.loginState
    },
   }
 }
</script>
<style scoped>

</style>
