<template>
    <div class="page_table" ref="rew_con" @scroll="scrollPage">
        <div class="song_disk">
<!--            <div class="disk" :style="`transform: rotate(${rotate}deg)`">-->
            <div class="disk" :class="PalyStatus?'pause play':'play'">
                <img v-lazy="src" alt="">
            </div>
            <div class="lyrics" ref="lyricsa">
                <scroll
                        class="scroll-content"
                        ref="lyricScroll"
                        :data="lyricData"
                        :probe-type="probeType"
                        :listenScroll="true"
                        :listenScrollStart="true"
                        :listenScrollEnd="true"
                        :listenTouchStart="true"
                        :listenTouchMove="true"
                        :listenTouchEnd="true"
                        @onscroll="onLyricScroll"
                        @onscrollStart="onLyricScrollStart"
                        @onscrollEnd="onLyricScrollEnd"
                        @ontouchStart="onLyricTouchStart"
                        @ontouchMove="onLyricTouchMove"
                        @ontouchEnd="onLyricTouchEnd">
                    <div class="lyr_list" ref="lyrice">
                        <div v-for="(item,index) in SongLrcList" :style="lineIndex == index?`color:${$store.state.ColorSwitch.IconColor};`:`color:${$store.state.ColorSwitch.TxtColor};`" :class="{active:lineIndex == index}"
                             ref="lyr_list">
                            <span :style="item.text==' '?`margin-top:10px;`:''">{{item.txt}}</span>
                        </div>
                    </div>
                </scroll>
                <div v-show="SongLrcList.length == 0">
                    <span>暂无歌词</span>
                </div>
            </div>
            <!--            <audio id="audio" src="http://audio01.dmhmusic.com/71_53_T10040589078_64_4_1_0_sdk-cpm/0207/M00/13/D1/ChR461n0hDaAKoXHAB_pGBxhnwE.64.aac?xcode=ced2c6afed6e4dbd4dae0ba6703e8c7b1152c57"-->
            <!--                   controls="controls" autoplay="true"></audio>-->
        </div>
<!--        评论-->
        <div class="comment">
            <div class="title">
                <span>精彩评论</span>
            </div>
            <div class="comment_list">
                <div class="list" v-for="(item,index) in CommentList" :key="index">
                    <div class="tumb">
                        <img v-lazy="item.user.avatarUrl" alt="">
                    </div>
                    <div class="item">
                        <div class="name" :style="`color:${$store.state.ColorSwitch.TxtColor};`">
                            <span>{{item.user.nickname}}</span>
                        </div>
                        <div class="content">
                            <span :style="`color:${$store.state.ColorSwitch.TxtColor};`">{{item.content}}</span>
                            <div class="reply" v-if="item.beReplied.length != 0">
                                <span v-for="(value,idx) in item.beReplied" :key="idx" :style="`color:${$store.state.ColorSwitch.TxtColor};`">
                                    回复 <i>{{value.user.nickname}}</i>: {{value.content}}
                                </span>
                            </div>
                        </div>
                        <div class="date">
                            <span :style="`color:${$store.state.ColorSwitch.TxtColor};`">{{$util.dateForm(item.time).ytd}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--        歌曲背景-->
<!--        <div class="song_bg" :style="`background-image:url(${src})`"></div>-->
        <go-top @Goclick="Goclick" v-show="current_y > 100"></go-top>
    </div>
</template>

<script>
  import axios from 'axios'
  import Lyric from 'lyric-parser'
  import Scroll from '../view/scroll'
  import GoTop from '../view/GoTop'
  import {SongComment} from '../axios/api'

  export default {
    name: 'PlayInterface',
    components: {Scroll,GoTop},
    data () {
      return {
        rotate: 0,
        timer: null,
        SongLrcList: [],
        currentLyric: '',
        lineIndex: 0,
        probeType: 3,
        // 评论列表
        CommentList:[],
        current_y: '',
        offset: 0,
      }
    },
    props: {
      PalyStatus: {
        type: Boolean
      },
      src: {
        type: String,
        default: '../assets/tumb.jpg',
      },
      lrcUrl: {
        type: String
      },
      currentTime: {
        type: Number
      },
      SongType: {
        type: Number
      },
      SongInfo: {
        type: Object
      }
    },
    mounted () {
      // songlink({
      //   songIds: '548492551,358890,629969,2116442,273171230,260378783,541604624,243111573,220364,265228',
      //   hq: '0',
      //   type: 'm4a,mp3',
      //   rate: '',
      //   pt: '0',
      //   flag: '-1',
      //   s2p: '-1',
      //   prerate: '-1',
      //   bwt: '-1',
      //   dur: '-1',
      //   bat: '-1',
      //   bp: '-1',
      //   pos:' -1',
      //   auto: '-1',
      // }).then(res => {
      //
      // })
      // SongPlay({
      //   from:'android',
      //   version:'8.1.0.1',
      //   channel:'webappllqh',
      //   operator:1,
      //   method:'baidu.ting.song.getInfos',
      //   format:'json',
      //   songid:'242078437',
      //   ts:'1564724837649',
      //   e:'KEhLaiUVMdT4K92nZqFF6SUqPM9Xk8S2iA7xT/lAGUF5tCTdfnUI89zWdb86IdAM',
      //   nw:2,
      //   ucf:1,
      //   res:1,
      //   l2p:0,
      //   lpb:'',
      //   usup:1,
      //   lebo:0,
      //   aac	:1,
      // }).then(res =>{
      //   console.log(res);
      // })
    },
    computed: {
      // 用于给 scroll 绑定的数据
      lyricData () {
        return this.currentLyric ? this.currentLyric.lines : []
      },
    },
    methods: {
      handleLyric ({lineNum, txt}) {
        this.lineIndex = lineNum;
        // 若当前行大于5,开始滚动,以保歌词显示于中间位置
        if (lineNum > 5) {
          let lineEl = this.$refs.lyr_list[lineNum - 5]
          this.$refs.lyricScroll.scrollToElement(lineEl, 1000)// 滚动到元素
        } else {
          this.$refs.lyricScroll.scrollTo(0, 0, 1000)// 滚动到顶部
        }
      },
      /**
       * 监听滚动
       */
      scrollPage(e) {
        this.current_y = e.target.scrollTop;
        if(this.SongType == 2){
          // 判断是否滚动到底部了
          if(this.$refs['rew_con'].offsetHeight + e.target.scrollTop ==  this.$refs['rew_con'].scrollHeight){
            console.log('到底了');
            this.offset+=30;
            this.commentData();
          }
        }
      },
      /**
       * 获取评论数据
       */
      commentData(){
        SongComment({
          offset: this.offset,
          limit:'30',
          id: this.SongInfo.id,
        }).then(res =>{
            if(this.offset == 0){
              this.CommentList = res.hotComments;
            }else{
              this.CommentList = this.CommentList.concat(res.comments)
            }
        })
      },
      /**
       * 获取歌词数据
       */
      lyrData () {
        this.currentLyric = new Lyric(this.lrcUrl, this.handleLyric) //this.handleLyric回调函数
        this.SongLrcList = this.currentLyric.lines;
        // this.currentLyric.play();
        // axios({
        //   url: this.lrcUrl,
        //   method: 'get',
        // }).then((res) => {
        //   let lyric = res //歌词数据
        //   this.currentLyric = new Lyric(lyric, this.handleLyric) //this.handleLyric回调函数
        //   console.log(this.currentLyric)
        //   this.SongLrcList = this.currentLyric.lines
        //   this.currentLyric.togglePlay()
        //   console.log(this.$refs.lyrice.scrollHeight - this.$refs.lyricsa.clientHeight)
        // })
      },
      /**
       * 胶片滚动
       */
      BlackFilm () {
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.rotate++
        }, 150)
      },
      onLyricScroll (val) {

      },
      onLyricScrollStart (val) {

      },
      onLyricScrollEnd () {

      },
      onLyricTouchStart () {

      },
      onLyricTouchMove () {

      },
      onLyricTouchEnd () {

      },
      /**
       * 返回顶部
       */
      Goclick(){
        this.$refs['rew_con'].scrollTop = 0;
      }

    },
    watch: {
      src: function (val) {
        if(this.SongType == 2){
          this.offset = 0;
          this.commentData();
        }
        try {
          this.currentLyric.stop();
        }catch (e) {
          console.log(e);
        }
      },
      lrcUrl: function (val) {
        this.lyrData();
      },
      PalyStatus: function (val) {
        this.PalyStatus = val
        if (val) {
          this.currentLyric.togglePlay();
        }else {
          this.currentLyric.togglePlay();
        }
      },
      currentTime: function () {
        if(this.SongType == 2 &&!this.PalyStatus){
          this.currentLyric.seek(this.currentTime * 1000);
        }
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
        overflow-y: auto;
        overflow-x: hidden;
    }

    .song_bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-image: url("../assets/tumb.jpg");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 50%;
        filter: blur(65px);
        transform: translateZ(0);
        opacity: 0.6;
    }

    .song_disk {
        position: relative;
        left: 0;
        top: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .disk {
            width: 300px;
            height: 300px;
            border-radius: 100%;
            margin-left: 10%;
            overflow: hidden;
            transition: all 0.5s;
            border: 10px solid rgba(255, 255, 255, 0.1);
            img {
                width: 100%;
                height: 100%;
                background:url("../assets/tumb.jpg") no-repeat;
            }
        }
        .play{
            animation: rotate 20s linear infinite
        }
        .pause{
            animation-play-state: paused
        }

        /*.scroll-content{*/
        /*    position: relative;*/
        /*    width: 100%;*/
        /*    height: 100%;*/
        /*    overflow: hidden;*/
        /*}*/

        .lyrics {
            position: relative;
            width: 40%;
            height: 90%;
            margin-left: 5%;
            transition: all 1s;
            overflow: hidden;

            .lyr_list {
                position: absolute;
                left: 0;
                top: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                transition: all 1s;

                > div {
                    height: 20px;
                    font-size: 14px;
                    margin-top: 10px;
                    color: #484848;
                }
                >.active{
                    color: @base;
                }
            }

            /*.highlight{*/
            /*    position: absolute;*/
            /*    left: 0;*/
            /*    top: 50%;*/
            /*    width: 100%;*/
            /*    height: 20px;*/
            /*    background-color: rgba(255,255,255,0.3);*/
            /*    transform: translate(0,50%);*/
            /*}*/
        }

    }
/*    评论*/
    .comment{
        width: 94%;
        margin: 10px auto;
        >.title{
            display: flex;
            align-items: center;
            width: 100%;
            height: 40px;
            border-bottom: 1px solid hsla(0,0%,100%,.2);
            span{
                font-size: 14px;
                color: #484848;
            }
        }
        .comment_list{
            width: 100%;
            >.list{
                display: flex;
                align-items: center;
                width: 100%;
                min-height: 100px;
                border-bottom: 1px solid hsla(0,0%,100%,.2);
                .tumb{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 10%;
                    height: 100%;
                    img{
                        width: 50px;
                        height: 50px;
                        border-radius: 100%;
                    }
                }
                .item{
                    width: 90%;
                    line-height: 25px;
                    .name{
                        display: flex;
                        align-items: center;
                        width: 100%;
                        height: 33%;
                        color: #333333;
                        span{
                            font-size: 14px;
                        }
                    }
                    .content{
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        width: 100%;
                        height: 33%;
                        span{
                            font-size: 14px;
                            color: #484848;
                        }
                        .reply{
                            display: flex;
                            flex-direction: column;
                            width: 90%;
                            border-top: 1px solid hsla(0,0%,100%,.2);
                            margin-left: 3%;
                            margin-top: 10px;
                            span{
                                font-size: 12px;
                                color: #484848;
                                i{
                                    font-style: normal;
                                    color: #0077aa;
                                }
                            }
                        }
                    }
                    .date{
                        display: flex;
                        align-items: center;
                        width: 100%;
                        height: 33%;
                        span{
                            font-size: 12px;
                            color: #484848;
                        }
                    }
                }
            }
        }
    }

</style>
