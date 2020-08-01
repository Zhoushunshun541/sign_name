<template>
  <div id="app">
    <sign-name @getImgInfo="getImgInfo"></sign-name>
  </div>
</template>

<script>
import signName from "./components/sign_name.vue";

export default {
  name: "App",
  components: {
    signName
  },
  data() {
    return {
      signInfo: ""
    };
  },
  methods: {
    getImgInfo(file) {
      this.signInfo = file;
    }
  }
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
