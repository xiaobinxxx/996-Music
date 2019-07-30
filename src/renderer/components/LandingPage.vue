<template>
  <div id="wrapper">
1111
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  const {ipcRenderer: ipc} = require('electron');
  export default {
    name: 'landing-page',
    mounted(){
      ipc.send('synchronous-message');
    },
    methods: {
    }
  }
</script>

<style>

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  #wrapper{
    width: 270px;
    height: 100px;
  }
</style>
