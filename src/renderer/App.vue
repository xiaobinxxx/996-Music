<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'music',
  }
</script>

<style>
  /* CSS */
  @import url('./assets/font/iconfont.css');
  body{
    margin: 0;
    padding: 0;
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
