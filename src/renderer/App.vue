<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: '996Music',
  }
</script>

<style>
  /* CSS */
  @import url('./assets/font/iconfont.css');
  body{
    margin: 0;
    padding: 0;
    -webkit-user-select: none; /*Chrome/ Safari/ Opear新版本*/
    -moz-user-select: none; /*Foxfire */
    -ms-user-select: none; /*Internet Explorer/ Edge*/
    -o-user-select: none; /*Opear老版本*/
    -khtml-user-select: none; /* Konqueror */
    -webkit-touch-callout: none; /* iOS Safari */
    user-select: none;
  }
  ::-webkit-scrollbar {
    width: 4px;
    cursor: pointer;
    /*display: none;*/
  }

  ::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.1);
  }

  ::-webkit-scrollbar-track {
    /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);*/
    /*border-radius: 0;*/
    /*background: rgba(0,0,0,0.1);*/
  }
</style>
