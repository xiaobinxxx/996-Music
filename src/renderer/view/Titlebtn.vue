<template>
    <div class="title_btn" v-bind:style="style" v-on:click="click">
        <div class="iconfont" :class="type"></div>
    </div>
<!--    <div-->
<!--            class="titlebtn"-->
<!--            v-bind:style="style"-->
<!--            v-on:click="click"/>-->
</template>

<script>
  const {ipcRenderer: ipc} = require('electron');
  const style = {
    min: {
      right: '60px'
    },
    max: {
      right: '35px'
    },
    close: {
      right: '10px'
    }
  };
  export default {
    name: 'Titlebtn',
    props: ['type'],
    computed: {
      style: function () {
        return style[this.type];
      }
    },
    methods: {
      click: function () {
        ipc.send(this.type);
      }
    }
  }
</script>

<style lang="less">
    @import "../assets/css/style";
    .title_btn {
        display: flex;
        align-items: center;
        position: absolute;
        top: 0;
        right: 10px;
        height: 100%;
        margin-left: 10px;
        -webkit-app-region: no-drag;
    }
    .title_btn > div{
        width: 14px;
        height: 14px;
        border-radius: 10px;
        background-color: #484848;
        transition: all 0.5s;
    }
    .title_btn > .min:hover{
        background-color: green;
    }
    .title_btn > .max:hover{
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: yellow;
    }
    /*.title_btn > .max:hover:before{*/
    /*    content: "\e630";*/
    /*    font-size: 10px;*/
    /*    font-weight: bold;*/
    /*    color: #484848;*/
    /*}*/
    .title_btn > .close:hover{
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: red;
    }
    /*.title_btn > .close:hover:before{*/
    /*    content: "\e603";*/
    /*    font-size: 10px;*/
    /*    font-weight: bold;*/
    /*    color: #484848;*/
    /*}*/
</style>
