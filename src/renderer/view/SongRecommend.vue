<template>
    <div class="page_table">
        <div class="ranking_list">
            <!--            排行榜-->
            <div class="title">
                <span>音乐排行榜</span>
            </div>
            <div class="ranking">
                <div class="list" v-for="(item,index) in RankingList"
                     v-if="index < 4"
                     @click="onSongLists(item,index)"
                     :key="index">
                    <div class="tumb">
                        <img v-lazy="item.coverImgUrl"
                             alt="">
                        <div class="tag">
                            <span>{{$util.dateForm(item.trackNumberUpdateTime).month_day}}更新</span>
                        </div>
                    </div>
                    <div class="song_list">
                        <div class="list" v-for="(value,idx) in item.tracks" :key="idx">
                            <span>{{idx+1}}</span>
                            <span>{{value.first}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--        推荐专区-->
        <div class="recommend_song">
            <div class="title">
                <span>音乐推荐</span>
            </div>
            <div class="recommend">
                <div class="list" v-for="(item,index) in RecommendList"
                     @click="onSongLists(item,index)"
                     :key="index">
                    <div class="tumb">
                        <img v-lazy="item.picUrl"
                             alt="">
                        <div class="tag">
                            <span class="iconfont icon-erji" style="margin-right: 3%"></span>
                            <span v-show="item.playCount.toLocaleString().length > 5">{{parseInt(item.playCount / 10000)}}万</span>
                            <span v-show="item.playCount.toLocaleString().length < 5">{{item.playCount}}万</span>
                        </div>
                    </div>
                    <div class="title">
                        <span>{{item.name}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {RecommendSongList,RankingList} from '../axios/api'
  import RecSongList from './RecSongList'
  export default {
    name: 'SongRecommend',
    components:{
      RecSongList,
    },
    data(){
      return {
        // 排行榜列表
        RankingList: '',
        // 推荐列表
        RecommendList: '',
        // 歌曲列表id
        SongId:'',
      }
    },
    created(){
      this.getData();
      this.RecommendData();
    },
    mounted () {

    },
    methods:{
      getData(){
        RankingList().then(res =>{
          this.RankingList = res.list;
        })
      },
      /**
       * 歌曲推荐数据
       */
      RecommendData(){
        RecommendSongList().then(res =>{
          this.RecommendList = res.result;
        })
      },
      /**
       * 点击
       */
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

    /*排行榜*/
    .ranking_list {
        width: 94%;
        height: 300px;
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

        .ranking {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            width: 100%;
            height: 250px;

            > .list {
                width: 45%;
                height: 110px;
                background-color: @footColr;
                cursor: pointer;
                .tumb {
                    float: left;
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
                        justify-content: center;
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        width: 100%;
                        height: 20px;
                        background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .5));

                        span {
                            color: #ffffff;
                            font-size: 12px;
                        }
                    }
                }

                .song_list {
                    display: flex;
                    flex-direction: column;
                    padding: 0 4%;
                    height: 90%;

                    > .list {
                        display: flex;
                        align-items: center;
                        width: 100%;
                        height: 33.33%;
                        cursor: pointer;
                        > span {
                            font-size: 14px;
                            color: #484848;
                            margin-right: 6px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 1;
                            -webkit-box-orient: vertical;
                        }
                    }
                }
            }
        }
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
