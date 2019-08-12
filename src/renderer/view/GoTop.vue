<template>
    <!--        返回顶部-->
    <div class="back_top" @click="$emit('Goclick')">
        <span class="iconfont icon-dingbu"></span>
    </div>
</template>

<script>
  export default {
    name: 'GoTop'
  }
</script>

<style scoped lang="less">
    /*    返回顶部*/
    .back_top {
        position: fixed;
        right: 10px;
        bottom: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;

        span {
            font-size: 22px;
            color: #484848;
        }
    }
</style>
