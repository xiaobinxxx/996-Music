<template>
    <div class="page_table">
        <!--        顶部 暂时预留-->
        <div class="song_top"></div>
        <!--        歌曲列表-->
        <div class="song_list">
            <div class="song_title">
                <div class="list" style="width: 50%">
                    <span>歌曲</span>
                </div>
                <div class="list" style="width: 30%">
                    <span>歌手</span>
                </div>
                <div class="list" style="width: 20%">
                    <span>专辑</span>
                </div>
<!--                <div class="list" style="width: 10%">-->
<!--                    <span>时长</span>-->
<!--                </div>-->
            </div>
            <div class="music_list" ref="rew_con" @scroll="scrollPage">
                <div class="list" v-for="(item,index) in SongList" :key="index">
                    <div class="title">
                        <span>{{item.name}}</span>
                        <span class="quality">HQ</span>
                        <div class="control">
                            <span class="iconfont icon-bofang" @click="onPlaySong(item,index)"></span>
                            <span class="iconfont icon-jiahao" @click="onAddSong(item,index)"></span>
                        </div>
                    </div>
                    <div class="singer">
                        <span>{{item.artists[0].name}}</span>
                    </div>
                    <div class="album">
                        <span>{{item.album.name}}</span>
                    </div>
<!--                    <div class="duration">-->
<!--                        <span>02:22</span>-->
<!--                    </div>-->
                </div>
                <empty content="没有歌曲数据，换个搜索试一试吧！" v-show="SongList.length == 0"></empty>
            </div>
        </div>
    </div>
</template>

<script>
  import {SongSearch,SongLyric,SongDetail} from '../axios/api'
  import Empty from './Empty'

  export default {
    name: 'SongList',
    components: {Empty},
    data () {
      return {
        // 歌曲列表
        SongList: '',
        // 歌曲相关资料
        SongInfo: '',
        current_y: '',
        offset: 0,
      }
    },
    props: {
      keyWord: {
        type: String
      }
    },
    created () {

    },
    methods: {
      getData () {
        this.$loading({lock: true, text: '', spinner: 'el-icon-loading', background: 'rgba(255, 255, 255, 0.7)'});
        SongSearch({
          offset:this.offset,
          limit:30,
          keywords: this.keyWord,
        }).then((res) => {
          this.$loading().close();
          if(this.offset == 0){
            this.SongList = res.result.songs;
          }else{
            this.SongList = this.SongList.concat(res.result.songs);
          }

        })
      },
      /**
       * 监听滚动
       */
      scrollPage(e) {
        this.current_y = e.target.scrollTop;
        // 判断是否滚动到底部了
        if(this.$refs['rew_con'].offsetHeight + e.target.scrollTop ==  this.$refs['rew_con'].scrollHeight){
          console.log('到底了');
          this.offset+=30;
          this.getData();
        }
      },
      /**
       * 播放歌曲
       */
      onPlaySong (item,index) {
        this.SongList.index = index;
        // this.$emit('SongList','')
        this.$emit('Song_list',this.SongList);
        // this.$emit('SongList',this.SongList);
        // SongDetail({
        //   ids: item.id,
        // }).then(res =>{
        //   console.log(res);
        //   this.SongInfo = res.songs[0];
        //
        // })
      },
      /**
       * 加入歌曲列表
       */
      onAddSong(item,index){
        SongDetail({
          ids: item.id,
        }).then(res =>{
          this.$emit('AddSong',res.songs[0])
        })
      },
      /**
       * 获取歌词
       */
      getLyric(){
        SongLyric({
          id: item.id,
        }).then((res) => {
          this.SongInfo = res;
          // this.$emit('SongInfo',this.SongInfo)
        })
      }
    },
    watch: {
      keyWord: function (val) {
        this.getData()
      }
    }
  }
</script>

<style scoped lang="less">
    @import "../assets/css/style";

    .page_table {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .song_top {
        width: 100%;
        height: 10%;
    }

    /*歌曲列表*/
    .song_list {
        width: 100%;
        height: 90%;
        .song_title {
            display: flex;
            align-items: center;
            padding: 0 4%;
            height: 10%;

            .list {
                display: flex;
                align-items: center;
                width: 25%;
                height: 100%;
                color: @wordColor;

                > span {
                    font-size: 14px;
                }
            }
        }

        .music_list {
            padding: 0 4%;
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            .list {
                display: flex;
                align-items: center;
                width: 100%;
                height: 40px;
                border-bottom: 1px solid #f0f0f0;

                .title {
                    position: relative;
                    display: flex;
                    align-items: center;
                    width: 50%;
                    height: 100%;
                    font-size: 14px;
                    color: @wordColor;

                    .quality {
                        font-size: 8px;
                        padding: 0 5px;
                        color: @base;
                        border: 1px solid @base;
                        border-radius: 4px;
                        margin-left: 3%;
                    }

                    .control {
                        position: absolute;
                        left: 0;
                        top: 0;
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        width: 90%;
                        height: 100%;
                        padding: 0 4%;

                        span {
                            font-size: 16px;
                            cursor: pointer;
                            margin-left: 3%;
                            color: #484848;
                        }
                    }
                }

                .singer {
                    width: 30%;
                    font-size: 14px;
                    color: @wordColor;
                }

                .album {
                    width: 20%;
                    font-size: 14px;
                    color: @wordColor;
                }

                .duration {
                    width: 10%;
                    font-size: 14px;
                    color: #7e818d;
                }
            }
        }
    }
    .music_list::-webkit-scrollbar {
        width: 4px;
        cursor: pointer;
        /*display: none;*/
    }

    .music_list::-webkit-scrollbar-thumb {
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.1);
    }

    .music_list::-webkit-scrollbar-track {
    /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);*/
    /*border-radius: 0;*/
    /*background: rgba(0,0,0,0.1);*/
    }

</style>
