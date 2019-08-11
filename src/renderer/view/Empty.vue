<template>
    <div class="empty">
        <div class="tumb">
            <img src="../assets/img/404.png" alt="">
        </div>
        <div class="title">
            <span>{{content}}</span>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Empty',
    props:{
      content:{
        type: String,
      }
    }
  }
</script>

<style scoped lang="less">
    .empty{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        .tumb{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 200px;
            img{
                width: 100px;
                height: 100px;
            }
        }
        .title{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 50px;
            span{
                font-size: 14px;
                color: #484848;
            }
        }
    }
</style>
