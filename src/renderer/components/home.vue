<template>
    <div class="page">
        <!--  头部-->
        <div class="head">
            <div class=""></div>
        </div>
        <!--    主体-->
        <div class="main">
            <div class="left_list">
                <div class="top_song">
                    <div class="list" v-for="(item,index) in MusicList" :class="{active:payIndex==index}" @click.stop="onMusicPaly(item,index)" @contextmenu.prevent="onContextmenu">
                        <span :title="item.name">{{item.name}}</span>
                        <!--                        删除-->
                        <span class="iconfont icon-shanchu" @click.stop="onDelMusic(item,index)"></span>
                        <!--                        大小-->
                        <span v-if="item.size < 1048576">{{(item.size / 1024).toFixed(2)}}KB</span>
                        <span v-else>{{(item.size / (1024 * 1024)).toFixed(2)}}MB</span>
                    </div>
                    <!--                    <input type="file" @change="chFileMusic" webkitdirectory multiple>-->
                    <input type="file" id="filepicker" name="fileList" ref="music" style="display: none"
                           @change.stop="chFileMusic" webkitdirectory multiple/>
                    <div class="to_lead" @click="$refs.music.click()">
                        <span>导入歌曲</span>
                    </div>
                </div>
                <div class="down_song" v-show="paly_music != ''">
                    <!--                <div class="tumb">-->
                    <!--                    <img src="/static/images/fengmian.jpg" alt="">-->
                    <!--                </div>-->
                    <div class="song_name">
                        <span>{{paly_music.name}}</span>
                        <!--                    <span>1111</span>-->
                    </div>
                </div>
            </div>
        </div>
        <!--  脚部-->
        <div class="footer">
            <!--      上一首下一首播放-->
            <div class="control">
                <div class="up_first" @click="onUpFirst">
                    <span class="iconfont icon-icon-up_first"></span>
                </div>
                <div class="pay">
                    <span class="iconfont icon-bofang" @click.stop="onPaly" v-if="paly_status"></span>
                    <span class="iconfont icon-zanting" @click.stop="onStop" v-if="!paly_status"></span>
                </div>
                <div class="down_first" @click="onDownFirst">
                    <span class="iconfont icon-icon-down_first"></span>
                </div>
            </div>
            <!--      进度条-->
            <div class="progress">
                <div class="start_time">
                    <span>{{PlanMinutes}}:{{PlanSeconds}}</span>
                </div>
                <div class="plan">
                    <el-slider v-model="progress" @change="PlayChange"></el-slider>
                </div>
                <div class="end_time">
                    <span>{{minutes}}:{{seconds}}</span>
                </div>
            </div>
            <!--      控件-->
            <div class="widget">
                <!--      音量-->
                <div class="volume">
                    <span class="iconfont icon-laba"></span>
                    <!--                    <div class="plan" ref="plan" @mouseup="onVolumeStart" @mousemove="onVolumeMove" @mousedown="onVolumeDwon">-->
                    <!--                        <div class="limit" :style="`width:${PlanWidth}%`">-->
                    <!--                            <span></span>-->
                    <!--                        </div>-->
                    <!--                    </div>-->
                    <div class="plan">
                        <el-slider v-model="volume" height="10px" @change="VolumeChange"></el-slider>
                    </div>
                </div>
                <!--        播放模式-->
                <div class="pattern">
                    <span class="iconfont icon-shunxu" v-if="paly_pattern == 0" @click="onPalyPattern"></span>
                    <span class="iconfont icon-danquxunhuan" v-if="paly_pattern == 1" @click="onPalyPattern"></span>
                    <span class="iconfont icon-xunhuanbofang" v-if="paly_pattern == 2" @click="onPalyPattern"></span>
                </div>
                <!--        播放列表-->
                <div class="pay_list">
                    <span class="iconfont icon-bofangliebiao"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  const fs = require('fs')
  const path = require('path')
  const url = require('url')
  export default {
    name: 'home',
    data () {
      return {
        mp3: '',
        // 时长分钟
        minutes: '00',
        // 时长秒
        seconds: '00',
        // 进度分钟
        PlanMinutes: '00',
        // 进度秒
        PlanSeconds: '00',
        // 播放进度百分比
        progress: 0,
        paly_status: true,
        length: 0,
        // 音频列表
        MusicList: [],
        // 播放模式状态 0 顺序播放 1 单曲循环 2 列表循环播放 3 随机播放
        paly_pattern: 0,
        // 记录点击次数
        number: 1,
        // 播放的歌曲
        paly_music: '',
        // 当前播放索引值
        payIndex: -1,
        // 音量滚动条进度
        PlanWidth: 100,
        // 音量进度
        volume: 100,
        // 删除歌曲列表
        DelMusicArr:[]
      }
    },
    created () {
      var that = this
      // 缓存获取音频路径
      if (localStorage.getItem('url')) {
        //调用文件遍历方法
        this.fileDisplay(path.resolve(localStorage.getItem('url')));
      }
      // 缓存获取音频播放的模式
      if (localStorage.getItem('paly_pattern')) {
        this.paly_pattern = localStorage.getItem('paly_pattern')
      }
      // 缓存获取已删除的文件
      if(localStorage.getItem('DelMusicArr')){
        this.DelMusicArr = JSON.parse(localStorage.getItem('DelMusicArr'));
      }
    },
    mounted () {
    },
    methods: {
      /**
       * 查找数组想要元素取出下标
       * @param arr
       * @param val
       * @returns {number}
       */
      arrSelect(arr,val){
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].name == val) return i;
        }
        return -1;
      },
      /**
       * 读取文件函数
       */
      fileDisplay (filePath) {
        var that = this
        //根据文件路径读取文件，返回文件列表
        fs.readdir(filePath, function (err, files) {
          if (err) {
            throw err
          }
          //遍历读取到的文件列表
          files.forEach(function (filename, index) {
            var arr = {}
            arr.name = filename
            // 获取文件后缀名正则
            var SuffixName = /\.[^\.]+$/.exec(filename)
            //获取当前文件的绝对路径
            var filedir = path.join(filePath, filename)
            //根据文件路径获取文件信息，返回一个fs.Stats对象
            fs.stat(filedir, function (eror, stats) {
              if (eror) {
                console.warn('获取文件stats失败')
                throw err
              }

              var isFile = stats.isFile()//是文件
              var isDir = stats.isDirectory()//是文件夹
              // 判断是否是文件
              if (isFile) {
                // 判断是否是音频文件
                if (SuffixName == '.mp3') {
                  arr.size = stats.size
                  let data = fs.readFileSync(path.resolve(filedir))
                  // 转blob
                  var blob = new Blob([data], {type: 'application/octet-binary'})
                  var url = URL.createObjectURL(blob)
                  // 转base64
                  // data = new Buffer(data).toString('base64');
                  // let base64 = 'data:' + mineType.lookup(path.resolve(filedir)) + ';base64,' + data;

                  // 地址赋值
                  arr.url = url
                  that.MusicList.push(arr);
                  // 读取文件内容
                  // fs.readFile(filedir, function (err, data) {
                  //   if (err) throw err
                  //   arr.url = new Buffer(data,'base64');
                  //   that.MusicList.push(arr)
                  //   console.log(that.MusicList)
                  //   // Buffer.isBuffer(data);
                  //   // console.log(data.toString('base64'))
                  //
                  // })
                } else {
                  // console.log('不是音频文件',SuffixName)
                }
              }
              // 是否是文件夹
              if (isDir) {
                that.fileDisplay(filedir)//递归，如果是文件夹，就继续遍历该文件夹下面的文件
              }
            })
          })
        })
        // 循环删除之前记录的文件
        for(let i = 0; i < this.DelMusicArr.length;i++){
          let index = this.arrSelect(this.MusicList, this.DelMusicArr[i]);
          this.MusicList.splice(index,1);
        }
      },
      /**
       * 计算时间
       */
      getvideoprogress () {
        setTimeout(() => {
          var currentTime = this.mp3.currentTime.toFixed(1)
          if (currentTime == this.mp3.duration.toFixed(1)) {
            //触发
            return false
          }
          // 播放进度百分比
          this.progress = parseInt(currentTime) / parseInt(this.mp3.duration) * 100
          var minute = currentTime / 60
          this.PlanMinutes = parseInt(minute)
          if (this.PlanMinutes < 10) {
            this.PlanMinutes = '0' + this.PlanMinutes
          }
          //秒
          var second = currentTime % 60
          this.PlanSeconds = Math.round(second)
          if (this.PlanSeconds < 10) {
            this.PlanSeconds = '0' + this.PlanSeconds
          }
          this.getvideoprogress()
        }, 50)
      },
      onPaly () {
        this.mp3.play()
        this.paly_status = false

      },
      onStop () {
        this.mp3.pause();
        this.paly_status = true
      },
      /**
       * 音频上传
       * @param e
       */
      chFileMusic (e) {
        localStorage.setItem('url', e.target.files[0].path)
        //调用文件遍历方法
        this.fileDisplay(path.resolve(e.target.files[0].path))
      },
      /**
       * 播放点击的音频
       */
      onMusicPaly (item, index) {
        var that = this
        this.payIndex = index
        // 异常捕获
        try {
          //运行代码
          that.mp3.pause()
          that.mp3.pause.currentTime = 0.0
          that.paly_status = true
        } catch (err) {
          //处理错误
          console.log(111)
        }
        that.paly_music = item
        that.mp3 = document.createElement('audio')
        // 存储转换完地址
        that.mp3.src = item.url
        // 监听播放
        that.mp3.oncanplay = function () {
          var minute = that.mp3.duration / 60
          that.minutes = parseInt(minute)
          if (that.minutes < 10) {
            that.minutes = '0' + that.minutes
          }
          //秒
          var second = that.mp3.duration % 60
          that.seconds = Math.round(second)
          if (that.seconds < 10) {
            that.seconds = '0' + that.seconds
          }
          that.mp3.play()
          that.paly_status = false
          that.getvideoprogress()
          that.mp3.volume = 1
          // 监听播放完毕
          that.mp3.onended = function () {
            switch (parseInt(that.paly_pattern)) {
              case 0:
                that.payIndex = that.payIndex + 1
                if (that.payIndex < that.MusicList.length) {
                  that.mp3.src = that.MusicList[that.payIndex].url
                  that.mp3.play()
                }
                break
              case 1:
                that.mp3.src = that.MusicList[that.payIndex].url
                that.mp3.play()
                break
              case 2:
                that.payIndex = that.payIndex + 1
                if (that.payIndex == that.MusicList.length) {
                  that.payIndex = 0
                }
                that.mp3.src = that.MusicList[that.payIndex].url
                that.mp3.play()
                break
            }
            that.paly_music = that.MusicList[that.payIndex]
            that.paly_status = true
          }
        }
      },
      VolumeChange(val){
        this.mp3.volume = val/100;
      },
      PlayChange(val){
        this.mp3.pause()
        this.mp3.currentTime = (this.mp3.duration*val)/100;
      },
      /**
       * 音量抬起事件
       */
      onVolumeStart (e) {
        console.log('抬起');
        this.moveEndX = 0;
        this.max = '';
        this.left = '';
      },
      /**
       * 音量移动事件
       */
      onVolumeMove (e) {
        console.log('移动');
        var g = document, b = window, m = Math;
        var thisX = (e || b.event).clientX;
        // 计算值
        var to = m.min(this.max, m.max(-2,this.left + (thisX - this.moveEndX)));
        b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
        // 设置音量进度
        this.PlanWidth = parseInt((to/this.max)*100);
        try {
          // 设置音量
          this.mp3.volume = parseInt(((to/this.max)*100))/100;
        }catch (e) {
          // console.log(e);
        }
        this.$forceUpdate();
      },
      /**
       *  音量按下事件
       */
      onVolumeDwon (e) {
        console.log('按下');
        var b = window
        this.moveEndX = (e || b.event).clientX;
        this.left = e.target.offsetLeft;
        this.max = this.$refs['plan'].offsetWidth - e.target.offsetWidth;
      },
      /**
       * 播放，模式点击
       */
      onPalyPattern () {
        this.paly_pattern = this.number
        localStorage.setItem('paly_pattern', this.paly_pattern)
        if (this.number != 2) {
          this.number++
          return
        }
        this.number = 0

      },
      /**
       * 上一首点击
       */
      onUpFirst () {
        var that = this
        that.payIndex--
        that.mp3.pause()
        that.mp3.pause.currentTime = 0.0
        if (that.payIndex <= 0) {
          that.payIndex = that.MusicList.length
        }
        that.paly_music = that.MusicList[that.payIndex]
        that.mp3.src = that.MusicList[that.payIndex].url
        that.mp3.play()
      },
      /**
       * 下一首点击
       */
      onDownFirst () {
        var that = this
        that.payIndex++
        that.mp3.pause()
        that.mp3.pause.currentTime = 0.0
        if (that.payIndex >= that.MusicList.length) {
          that.payIndex = 0
        }
        that.paly_music = that.MusicList[that.payIndex]
        that.mp3.src = that.MusicList[that.payIndex].url
        that.mp3.play()
      },
      /**
       * 鼠标右键点击
       * @param e
       */
      onContextmenu(e){
        console.log(e)
      },
      /**
       * 删除歌曲点击
       */
      onDelMusic(item,index){
        console.log(item);
        this.MusicList.splice(index,1);
        this.DelMusicArr.push(item.name);
        localStorage.setItem('DelMusicArr',JSON.stringify(this.DelMusicArr));
      }
    },
    // watch:{
    //   length(val){
    //     console.log(val)
    //     this.MusicList = new Array(val).fill({})
    //   }
    // }
  }
</script>
<style lang="less">
    // 音量
    .widget .volume > .plan > div .el-slider__runway{
        height: 4px;
        border-radius: 10px;
        background-color: #999999;
    }
    .widget .volume > .plan > div .el-slider__bar{
        height: 4px;
        border-radius: 10px;
        background-color: #0193C8;
    }
    .widget .volume > .plan > div .el-slider__button{
        width: 10px;
        height: 10px;
        border-color: #0193C8;
    }
    // 播放进度
    .progress .plan > div .el-slider__runway{
        height: 4px;
        border-radius: 10px;
        background-color: #999999;
    }
    .progress .plan > div .el-slider__bar{
        height: 4px;
        border-radius: 10px;
        background-color: #0193C8;
    }
    .progress .plan > div .el-slider__button{
        width: 10px;
        height: 10px;
        border-color: #0193C8;
    }
</style>
<style lang="less" scoped>
    @import "../assets/css/style";

    .page {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        font-family: 微软雅黑;
    }

    /*头部*/
    .head {
        width: 100%;
        height: 8%;
        min-height: 50px;
        background-color: @base;
    }

    .main {
        width: 100%;
        height: 82%;
        background-color: #ffffff;
    }

    .main .left_list {
        position: relative;
        width: 25%;
        height: 100%;
        background-color: #ffffff;
    }

    .main .left_list .top_song {
        width: 100%;
        height: 85%;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    .main .left_list .top_song::-webkit-scrollbar {
        width: 4px;
        cursor: pointer;
        /*display: none;*/
    }

    .main .left_list .top_song::-webkit-scrollbar-thumb {
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.1);
    }

    .main .left_list .top_song::-webkit-scrollbar-track {
        /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);*/
        /*border-radius: 0;*/
        /*background: rgba(0,0,0,0.1);*/

    }

    .main .left_list .top_song > .list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 4%;
        height: 40px;
        /*background-color: #f6f6f6;*/
        border-bottom: 1px solid #f6f6f6;
        cursor: pointer;
        transition: all .5s;
    }
    .main .left_list .top_song > .active{
        height: 60px;
        color: @base;
        background-color: #f6f6f6;
    }
    .main .left_list .top_song > .active > span{
        /*font-weight: bold;*/
    }

    .main .left_list .top_song > .list span {
        font-size: 12px;
        transition: all .5s;
    }

    .main .left_list .top_song > .list span:nth-child(1) {
        width: 70%;
        white-space: nowrap; /*规定段落中的文本不进行换行*/
        overflow: hidden; /*内容会被修剪，并且其余内容是不可见的。*/
        text-overflow: ellipsis; /*显示省略号来代表被修剪的文本*/
    }

    .main .left_list .top_song > .list span:nth-child(2) {
        opacity: 0;
        width: 10%;
        font-size: 18px;
        text-align: center;
    }
    .main .left_list .top_song > .list:hover span:nth-child(2){
        opacity: 1;
    }

    .main .left_list .top_song > .to_lead {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 4%;
        height: 40px;
    }

    .main .left_list .top_song > .to_lead span {
        font-size: 12px;
        text-decoration: underline;
        cursor: pointer;
    }

    .main .left_list .down_song {
        display: flex;
        align-items: center;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        /*height: 15%;*/
        max-height: 15%;
        border: 1px solid #cccccc;
        box-sizing: border-box;
        padding: 10px;
    }

    .main .left_list .down_song .tumb {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30%;
        height: 100%;
    }

    .main .left_list .down_song .tumb img {
        width: 60px;
        height: 60px;
    }

    .main .left_list .down_song .song_name {
        display: flex;
        align-items: center;
        flex-direction: column;
        /*width: 70%;*/
        height: 100%;
    }

    .main .left_list .down_song .song_name span {
        font-size: 12px;
    }

    /*脚部*/
    .footer {
        display: flex;
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 10%;
        background-color: @assist;
        min-height: 50px;
    }

    /*上一首下一首播放*/
    .footer .control {
        display: flex;
        width: 20%;
        height: 100%;
    }

    .footer .control > div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32%;
        height: 100%;
    }

    .footer .control > div > span {
        font-size: 28px;
        color: #f6f6f6;
        cursor: pointer;
    }

    /*进度条*/
    .progress {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 50%;
        height: 100%;
    }

    .progress .start_time {
        display: flex;
        justify-content: center;
        width: 10%;
    }

    .progress .start_time span {
        font-size: 14px;
        color: #f6f6f6;
    }

    .progress .plan {
        width: 78%;
        height: 4px;
        /*background-color: #666666;*/
        border-radius: 10px;
    }
    .progress .plan > div{
        margin-top: -16px;
    }

    .progress .plan .limit {
        position: relative;
        width: 50%;
        height: 100%;
        border-radius: 10px;
        background-color: @base;
    }

    .progress .plan .limit span {
        position: absolute;
        right: 0;
        top: 50%;
        width: 6px;
        height: 6px;
        background-color: @base;
        border-radius: 100%;
        transform: translate(0, -50%);
        border: 1px solid #f6f6f6;
        cursor: pointer;
    }

    .progress .end_time {
        display: flex;
        justify-content: center;
        width: 10%;
    }

    .progress .end_time span {
        font-size: 14px;
        color: #f6f6f6;
    }

    /*  控件*/
    .widget {
        display: flex;
        align-items: center;
        width: 30%;
        height: 100%;
    }

    .widget .volume {
        display: flex;
        align-items: center;
        width: 50%;
    }

    .widget .volume > span {
        width: 10%;
        font-size: 16px;
        color: #f6f6f6;
    }

    .widget .volume > .plan {
        width: 85%;
        height: 4px;
        /*background: #666666;*/
        border-radius: 4px;
        margin-left: 5%;
    }
    .widget .volume > .plan > div{
        margin-top: -16px;
    }

    .widget .volume > .plan .limit {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        background-color: @base;
        cursor: pointer;
    }

    .widget .volume > .plan .limit span {
        position: absolute;
        right: 0;
        top: 50%;
        width: 6px;
        height: 6px;
        background-color: @base;
        border-radius: 100%;
        transform: translate(0, -50%);
        border: 1px solid #f6f6f6;
        cursor: pointer;
    }

    .widget .pattern {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25%;
        height: 100%;
    }

    .widget .pattern span {
        font-size: 18px;
        color: #f6f6f6;
        cursor: pointer;
    }

    .widget .pay_list {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25%;
        height: 100%;
    }

    .widget .pay_list span {
        font-size: 18px;
        color: #f6f6f6;
        cursor: pointer;
    }
</style>
