<template>
    <div class="page_table">
        <!--        我的歌单-->
        <div class="recommend_song">
            <div class="title">
                <span>我的歌单</span>
            </div>
            <div class="recommend">
                <div class="list" v-for="(item,index) in play_list"
                     @click="onSongLists(item,index)"
                     :key="index">
                    <div class="tumb">
                        <img v-lazy="item.coverImgUrl" alt="">
<!--                        <div class="tag">-->
<!--                            <span class="iconfont icon-erji" style="margin-right: 3%"></span>-->
<!--                            <span v-show="item.playCount.toLocaleString().length > 5">{{parseInt(item.playCount / 10000)}}万</span>-->
<!--                            <span v-show="item.playCount.toLocaleString().length < 5">{{item.playCount}}万</span>-->
<!--                        </div>-->
                    </div>
                    <div class="title">
                        <span>{{item.name}}</span>
                    </div>
                </div>
                <empty content="没有歌单数据，快去登录试一试吧！" v-show="play_list.length == 0"></empty>
            </div>
        </div>
    </div>
</template>

<script>
    import empty from './Empty'
  export default {
    name: 'MySongSingle',
    components:{
      empty
    },
    data(){
      return {
        SongId: '',
      }
    },
    props:{
      play_list:{
        type: Array,
      }
    },
    methods:{
      onSongLists(item,index){
        this.SongId = item.id;
        this.$emit('SongIds',this.SongId);
      },
    }
  }
</script>

<style scoped lang="less">
    @import "../assets/css/style";

    .page_table {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
    /*    音乐推荐*/
    .recommend_song {
        width: 94%;
        margin: 0 auto;

        > .title {
            display: flex;
            align-items: center;
            width: 100%;
            height: 50px;

            > span {
                font-size: 16px;
                font-weight: bold;
                color: @wordColor;
            }
        }

        .recommend {
            display: flex;
            flex-wrap: wrap;
            width: 100%;

            > .list {
                width: 19%;
                height: 140px;
                margin: 0 1.2% 10px 0;
                cursor: pointer;
                .tumb {
                    position: relative;
                    width: 110px;
                    height: 110px;

                    img {
                        width: 100%;
                        height: 100%;
                    }

                    .tag {
                        display: flex;
                        align-items: center;
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        width: 100%;
                        height: 20px;
                        background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .5));
                        padding: 0 4%;

                        span {
                            color: #ffffff;
                            font-size: 12px;
                        }
                    }
                }

                > .title {
                    display: flex;
                    align-items: center;
                    width: 110px;
                    height: 30px;
                    line-height: 14px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;

                    span {
                        font-size: 12px;
                        color: #484848;
                    }
                }
            }

            > .list:nth-child(5n) {
                margin-right: 0;
            }
        }
    }
</style>
