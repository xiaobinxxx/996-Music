<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  const fs = require('fs')
  const path = require('path')
  const url = require('url')
  export default {
    name: 'music',
    created(){
      // let fileName = 'icon.ico'
      // let sourceFile = path.join(__dirname,'./assets', fileName)
      // let destPath = path.resolve('./',fileName);
      // let readStream = fs.createReadStream(sourceFile)
      // let writeStream = fs.createWriteStream(destPath)
      // readStream.pipe(writeStream)
    },
    mounted () {
    }
  }
</script>

<style>
  /* CSS */
  @import url('./assets/font/iconfont.css');
</style>
