<template>
    <div>
        <!--        正常播放模式-->
        <div class="page" v-show="!RemoteControlWay" @click="PayWin = false">
            <!--        窗口-->
            <div id="mytitle" :class="{vague:ComponentDisplay!=1}">
                <div class="left"></div>
                <div class="remote_control" @click="onRemoteControl">
                    <span class="iconfont icon-yaokong"></span>
                </div>
                <titlebtn type="min"/>
                <titlebtn type="max"/>
                <titlebtn type="close"/>
            </div>
            <!--  头部-->
            <div class="head" :class="{vague:ComponentDisplay!=1}">
                <div class="search">
                    <div class="search_item">
                        <span class="iconfont icon-search"></span>
                        <input type="text" placeholder="请输入搜索内容" @keyup.enter="Submit" v-model="SearchVal"/>
                    </div>
                </div>
                <div class="head_item">
                    <div class="login" @click="onLongin">
                        <div class="head_portrait">
                            <img v-lazy="LoginInfo.avatarUrl" v-if="LoginInfo.nickname">
                            <img src="../assets/img/login.png" v-else>
                        </div>
                        <div class="name">
                            <span v-if="LoginInfo.nickname">{{LoginInfo.nickname}}</span>
                            <span v-else>登录</span>
                        </div>
                    </div>
<!--                    提示框-->
                </div>
            </div>
            <!--    主体-->
            <div class="main">
                <div class="left_list">
                    <div class="top_song">
                        <div class="list" v-for="(item,index) in MusicList" :class="{active:payIndex==index}"
                             @click.stop="onMusicPaly(item,index)" @contextmenu.prevent="onContextmenu">
                            <span :title="item.name">{{item.name}}</span>
                            <!--                        删除-->
                            <span class="iconfont icon-shanchu" @click.stop="onDelMusic(item,index)"></span>
                            <!--                        大小-->
                            <span v-if="item.size < 1048576 && item.type == 1">{{(item.size / 1024).toFixed(2)}}KB</span>
                            <span v-else-if="item.type == 1">{{(item.size / (1024 * 1024)).toFixed(2)}}MB</span>
                            <span v-else-if="item.type == 2">{{$util.timeForm(item.duration).min_sec}}</span>
                        </div>
                        <!--                    <input type="file" @change="chFileMusic" webkitdirectory multiple>-->
                        <input type="file" id="filepicker" name="fileList" ref="music" style="display: none"
                               @change.stop="chFileMusic" webkitdirectory multiple/>
                        <div class="to_lead" @click="$refs.music.click()">
                            <span>导入歌曲</span>
                        </div>
                    </div>
                </div>
                <div class="right_list" :class="{vague:ComponentDisplay!=1}">
<!--                    搜索列表-->
                    <song-list
                            v-show="ComponentDisplay==0"
                            :keyWord="keyWord"
                            @Song_list="Song_list"
                            @AddSong="AddSong">
                    </song-list>
                    <!--                    播放-->
                    <play-interface
                            :PalyStatus="paly_status"
                            :lrcUrl="SongMess.type==1||SongMess == '' ?'':SongMess.lrclink"
                            :currentTime="mp3.currentTime"
                            :SongType="SongMess.type"
                            :SongInfo="SongMess"
                            v-show="ComponentDisplay==1" :src="SongMess.type==1||SongMess.id == undefined?require('../assets/tumb.jpg'):SongMess.al.picUrl">
                    </play-interface>
                    <!--                    推荐界面-->
                    <song-recommend @SongIds="SongIds" v-show="ComponentDisplay==2"></song-recommend>
                    <!--        歌曲列表-->
                    <rec-song-list
                            :SongId="SongId"
                            @Song_list="Song_list"
                            @AddSong="AddSong"
                            v-if="ComponentDisplay==3">
                    </rec-song-list>
<!--                    我的歌单-->
                    <my-song-single :play_list="play_list"
                                    @SongIds="SongIds"
                                    v-if="ComponentDisplay==4"></my-song-single>
<!--                    播放列表-->
                    <div class="pay_win" v-show="PayWin">
                        <div class="title">
                            <div class="total">
                                <span>总({{PlayList.length}})首</span>
                            </div>
                            <div class="delAll" @click.stop="onDelAllSong">
                                <span class="iconfont icon-shanchu"></span>
                                <span>清空全部</span>
                            </div>
                        </div>
                        <div class="play_list">
                            <div class="list" v-for="(item,index) in PlayList"
                                 :style="SongIndex==index?'color:#31c27c':''"
                                 @click.stop="onPlaySongList(item,index)"
                                 :key="index">
                                <span class="title">{{item.name}}</span>
                                <span class="name">{{item.artists?item.artists[0].name:item.ar.name}}</span>
                                <span class="time">{{item.duration?$util.timeForm(item.duration).min_sec:$util.timeForm(item.dt).min_sec}}</span>
                            </div>
                            <empty content="没有歌曲数据，快去寻找下吧！" v-show="PlayList.length == 0"></empty>
                        </div>
                    </div>
                </div>
            </div>
            <!--  脚部-->
            <div class="footer">
                <!--      歌曲播放-->
                <div class="control">
                    <div class="tumb" @click="ComponentDisplay = 1;">
                        <img v-lazy="SongMess.type == 1||SongMess.id == undefined?require('../assets/tumb.jpg'):SongMess.al.picUrl" alt="">
                    </div>
                    <div class="title">
                        <span class="music_name">{{paly_music.name}}</span>
                        <span class="music_item">{{SongMess.type == 1||SongMess.id == undefined ? '未知':SongMess.ar[0].name}}</span>
                    </div>
                </div>
                <!--      控件-->
                <div class="progress">
                    <!--                播放模式-->
                    <div class="pattern">
                        <span class="iconfont icon-shunxu" v-if="paly_pattern == 0" @click="onPalyPattern"></span>
                        <span class="iconfont icon-danquxunhuan" v-if="paly_pattern == 1" @click="onPalyPattern"></span>
                        <span class="iconfont icon-xunhuanbofang" v-if="paly_pattern == 2"
                              @click="onPalyPattern"></span>
                    </div>
                    <!--                上一曲-->
                    <div class="up_first" @click="onUpFirst">
                        <span class="iconfont icon-new-upmusic"></span>
                    </div>
                    <!--                播放暂停-->
                    <div class="pay">
                        <span class="iconfont icon-bofang" @click.stop="onPaly" v-if="paly_status"></span>
                        <span class="iconfont icon-zanting" @click.stop="onStop" v-if="!paly_status"></span>
                    </div>
                    <!--                下一曲-->
                    <div class="down_first" @click="onDownFirst">
                        <span class="iconfont icon-new-downmusic"></span>
                    </div>
                    <!--                时间-->
                    <div class="play_time">
                        <span>{{PlanMinutes}}:{{PlanSeconds}}/{{minutes}}:{{seconds}}</span>
                    </div>
                </div>

                <!--      控件-->
                <div class="widget">
                    <!--      音量-->
                    <div class="volume">
                        <span class="iconfont icon-new-laba"></span>
                        <div class="plan">
                            <el-slider v-model="volume" height="10px" @change="VolumeChange"></el-slider>
                        </div>
                    </div>
                    <!--    我的歌单-->
                    <div class="pay_list" title="我的歌单" @click.stop="ComponentDisplay = 4">
                        <span class="iconfont icon-gedan"></span>
                    </div>
                    <!--        推荐列表-->
                    <div class="pay_list" title="歌曲推荐、排行榜" @click.stop="ComponentDisplay = 2">
                        <span class="iconfont icon-recmore"></span>
                    </div>
                    <!--        播放列表-->
                    <div class="pay_list" title="播放列表" @click.stop="PayWin = true">
                        <span class="iconfont icon-new-bofangliebiao"></span>
                    </div>
                </div>
                <!--            进度条-->
                <div class="progress_bar">
                    <el-slider v-model="progress" height="3" @change="PlayChange"></el-slider>
                </div>
            </div>
        </div>

        <!--        遥控模式-->
        <div class="Remote_control_mode" v-show="RemoteControlWay && !MiniStatus">
            <div class="control_div">
                <!--        歌曲展示，关闭-->
                <div class="song_title">
                    <div class="song">
                        <span class="name">{{paly_music.name}}</span>
                    </div>
                    <div class="widget">
                        <!--                    <span class="iconfont icon-mini" @click="OnMini"></span>-->
                        <span class="iconfont icon-close" @click="onRemoteControl"></span>
                    </div>
                </div>
                <!--        遥控 控件区域-->
                <div class="telecontrol_control">
                    <!--            上一曲，播放暂停，下一曲-->
                    <div class="control">
                        <span class="iconfont icon-new-upmusic" @click="onUpFirst"></span>
                        <span class="iconfont icon-bofang" @click.stop="onPaly" v-show="paly_status"></span>
                        <span class="iconfont icon-zanting" @click.stop="onStop" v-show="!paly_status"></span>
                        <span class="iconfont icon-new-downmusic" @click="onDownFirst"></span>
                    </div>
                    <div class="extension">
                        <div class="volume">
                            <span class="iconfont icon-new-laba"></span>
                            <el-slider v-model="volume" height="2px" @change="VolumeChange"></el-slider>
                        </div>
                        <div class="schema">
                            <span class="iconfont icon-shunxu" v-show="paly_pattern == 0" @click="onPalyPattern"></span>
                            <span class="iconfont icon-danquxunhuan" v-show="paly_pattern == 1"
                                  @click="onPalyPattern"></span>
                            <span class="iconfont icon-xunhuanbofang" v-show="paly_pattern == 2"
                                  @click="onPalyPattern"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="song_bg" :style="SongMess.type == 1||SongMess.id == undefined?`background-image:url(${require('../assets/tumb.jpg')})`:`background-image:url(${SongMess.al.picUrl})`"></div>
        </div>
        <!--        迷你模式-->
        <!--        <div class="mini" v-show="MiniStatus">-->
        <!--            <div class="drag"></div>-->
        <!--            <div class="mode">-->
        <!--                <span class="iconfont icon-new-upmusic" @click="onUpFirst"></span>-->
        <!--                <span class="iconfont icon-bofang" @click.stop="onPaly" v-show="paly_status"></span>-->
        <!--                <span class="iconfont icon-zanting" @click.stop="onStop" v-show="!paly_status"></span>-->
        <!--                <span class="iconfont icon-new-downmusic" @click="onDownFirst"></span>-->
        <!--            </div>-->
        <!--        </div>-->
        <!--        大背景-->
        <div class="bg_player_mask" :style="SongMess.type == 1||SongMess.id == undefined?`background-image:url(${require('../assets/tumb.jpg')})`:`background-image:url(${SongMess.al.picUrl})`"></div>
    </div>
</template>

<script>
  import Empty from '../view/Empty'
  const fs = require('fs');
  const path = require('path')
  const {ipcRenderer: ipc} = require('electron');
  const electron = require('electron');
  import Titlebtn from '../view/Titlebtn'
  import AudioVisualization from '../view/AudioVisualization'
  import PlayInterface from '../view/PlayInterface'
  import SongList from '../view/SongList'
  import SongRecommend from '../view/SongRecommend'
  import RecSongList from '../view/RecSongList'
  import MySongSingle from '../view/MySongSingle'
  import {SongLyric,SongDetail,LoginIn} from '../axios/api'
  export default {
    name: 'home',
    components: {
      Empty,
      Titlebtn,
      AudioVisualization,
      PlayInterface,
      SongList,
      SongRecommend,
      RecSongList,
      MySongSingle
    },
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
        // 播放状态
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
        DelMusicArr: [],
        // 遥控模式切换
        RemoteControlWay: false,
        // 迷你模式状态
        MiniStatus: false,
        // 搜索值
        keyWord: '',
        // 网络歌曲信息
        SongMess: {},
        // 选择网络歌曲列表
        SongList: [],
        // 搜索内容
        SearchVal:'',
        // 播放列表
        PlayList: [],
        // 在听歌曲列表索引值
        SongIndex:-1,
        // 列表状态 true 我的列表  false 在听列表
        ListStatus: true,
        // 在听列表弹窗状态
        PayWin: false,
        // 推荐，排行歌曲id
        SongId: '',
        // 组件显示状态 // 搜索列表 0 磁盘显示 1 推荐歌曲显示 2 歌曲列表 3
        ComponentDisplay: 2,
        // 登录信息
        LoginInfo: {},
        // 信列表
        play_list: [],
        // 本地是否导入过歌曲状态
        locality: false,
      }
    },
    created () {
      console.log(path.resolve('/'))
      var that = this
      // 缓存获取音频播放的模式
      if (localStorage.getItem('paly_pattern')) {
        this.paly_pattern = localStorage.getItem('paly_pattern')
      }
      // 缓存获取已删除的文件
      if (localStorage.getItem('DelMusicArr')) {
        this.DelMusicArr = JSON.parse(localStorage.getItem('DelMusicArr'))
      }
      // 获取在听列表
      if(localStorage.getItem('PlayList')){
        this.PlayList = JSON.parse(localStorage.getItem('PlayList'));
      }
      // 获取登录状态
      if(localStorage.getItem('UID')){
        // 登录接口
        LoginIn({
          uid: localStorage.getItem('UID'),
        }).then(res =>{
          console.log(res)
          this.LoginInfo = res.playlist[0].creator;
          this.play_list = res.playlist;
          this.$message({
            type: 'success',
            message: '欢迎您' + this.LoginInfo.nickname,
          })
        })
      }
      // 获取网络缓存音频文件
      if (localStorage.getItem('SongList')) {
        this.SongList = JSON.parse(localStorage.getItem('SongList'))
        for(let i = 0; i < this.SongList.length;i++){
          this.MusicList.push({
            name: this.SongList[i].name,
            size: this.SongList[i].m.size,
            url: `https://music.163.com/song/media/outer/url?id=${this.SongList[i].id}.mp3`,
            duration: this.SongList[i].dt,
            songinfo: this.SongList[i],
            id: this.SongList[i].id,
            type: 2,
          });
        }
      }
      // 缓存获取音频路径
      if (localStorage.getItem('url')) {
        //调用文件遍历方法
        this.fileDisplay(path.resolve(localStorage.getItem('url')));
      }

      // fs.readFile(path.join(__dirname, '../assets/css/style.less'), 'utf8', function (err, data) {
      //   if (err) throw err;
      //   console.log(data)
      // })
      console.log(path.join(__dirname, '../assets/css/style.less'));
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
      arrSelect (arr, val) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].name == val) return i
        }
        return -1
      },
      /**
       * 读取文件函数
       */
      fileDisplay (filePath) {
        var that = this;
        var i = 0;
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
            var SuffixName = /\.[^\.]+$/.exec(filename);
            //获取当前文件的绝对路径
            var filedir = path.join(filePath, filename);
            //根据文件路径获取文件信息，返回一个fs.Stats对象
            fs.stat(filedir, function (eror, stats) {
              if (eror) {
                console.warn('获取文件stats失败')
                throw err
              }

              var isFile = stats.isFile()//是文件
              var isDir = stats.isDirectory();//是文件夹
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
                  // let base = new Buffer(data).toString('base64');
                  // let base64 = 'data:' + mineType.lookup(path.resolve(filedir)) + ';base64,' + base;
                  // 地址赋值
                  arr.url = url;
                  arr.src = blob;
                  arr.type = 1;
                  arr.id = i++;
                  arr.songinfo = {picUrl:'',type:1};
                  that.MusicList.push(arr);
                  // 判断有没有网络歌曲
                  if(!that.locality && localStorage.getItem('SongList')){
                    that.locality = true;
                    that.SongList = JSON.parse(localStorage.getItem('SongList'))
                    for(let i = 0; i < that.SongList.length;i++){
                      that.MusicList.push({
                        name: that.SongList[i].name,
                        size: that.SongList[i].m.size,
                        url: `https://music.163.com/song/media/outer/url?id=${that.SongList[i].id}.mp3`,
                        duration: that.SongList[i].dt,
                        songinfo: that.SongList[i],
                        id: that.SongList[i].id,
                        type: 2,
                      });
                    }
                  }
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
                  // console.log('不是音频文件',SuffixName);
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
        for (let i = 0; i < this.DelMusicArr.length; i++) {
          let index = this.arrSelect(this.MusicList, this.DelMusicArr[i])
          this.MusicList.splice(index, 1)
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
        this.paly_status = false
        if (this.payIndex == -1 && this.ListStatus) {
          this.paly(this.MusicList[0], 0)
          return
        }
        this.mp3.play()
      },
      onStop () {
        this.mp3.pause()
        this.paly_status = true
      },
      /**
       * 播放音频函数
       */
      paly (item, index) {
        var that = this
        this.payIndex = index;
        that.SongMess = item.songinfo;
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
        // 播放的歌曲信息
        that.paly_music = item
        that.mp3 = document.createElement('audio')
        // 存储转换完地址
        that.mp3.src = item.url

        // 检测音频是否播放失败
        that.mp3.onerror = function (err) {
          that.payIndex = that.payIndex+1;
          that.$message({
            type: 'info',
            message: '播放失败，自动切换到下一首',
          })
          // 播放歌曲的信息
          that.paly_music = that.MusicList[that.payIndex];
          that.SongMess = that.MusicList[that.payIndex].songinfo;
          that.mp3.src = that.MusicList[that.payIndex].url
          that.mp3.play()
        }

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
          that.getvideoprogress();
          that.mp3.volume = 1;
          // 列表播状态
          that.ListStatus = true;
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
            // 播放的歌曲信息
            that.paly_music = that.MusicList[that.payIndex];
            that.SongMess = that.MusicList[that.payIndex].songinfo;
            that.paly_status = true
          }
        }
      },
      /**
       * 在听歌曲列表播放
       */
      SonfPaly (item, index) {
        var that = this
        this.SongIndex = index;
        that.SongMess = item.songinfo;
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
        // 播放的歌曲信息
        that.paly_music = item
        that.mp3 = document.createElement('audio')
        // 存储转换完地址
        that.mp3.src = item.url
        // 检测音频是否播放失败
        that.mp3.onerror = function (err) {
          that.SongIndex = that.SongIndex+1;
          that.$message({
            type: 'info',
            message: '播放失败，自动切换到下一首',
          })
          that.songListPlay();
        }


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
          that.getvideoprogress();
          that.mp3.volume = 1;
          // 列表播放状态
          that.ListStatus = false;
          // 监听播放完毕
          that.mp3.onended = function () {
            switch (parseInt(that.paly_pattern)) {
              case 0:
                that.SongIndex = that.SongIndex + 1
                that.songListPlay();
                if (that.SongIndex < that.PlayList.length) {
                }
                break
              case 1:
                that.songListPlay();
                break
              case 2:
                that.SongIndex = that.SongIndex + 1
                if (that.SongIndex == that.PlayList.length) {
                  that.SongIndex = 0
                }
                that.songListPlay();
                break
            }
            // 播放状态
            that.paly_status = true
          }
        }
      },
      /**
       * 音频上传
       * @param e
       */
      chFileMusic (e) {
        localStorage.setItem('url', e.target.files[0].path)
        //调用文件遍历方法
        this.fileDisplay(path.resolve(e.target.files[0].path));
      },
      /**
       * 播放点击的音频
       */
      onMusicPaly (item, index) {
        this.SongIndex = -1;
        this.paly(item, index);
      },
      /**
       * 音量调节
       */
      VolumeChange (val) {
        this.mp3.volume = val / 100
      },
      /**
       * 播放进度跳转
       */
      PlayChange (val) {
        this.mp3.pause()
        this.mp3.currentTime = (this.mp3.duration * val) / 100
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
        // 判断是在哪个列表播放的
        if(this.ListStatus){
          that.payIndex--
          that.mp3.pause()
          that.mp3.pause.currentTime = 0.0
          if (that.payIndex < 0) {
            that.payIndex = that.MusicList.length -1;
          }
          that.SongMess = that.MusicList[that.payIndex].songinfo;
          that.paly_music = that.MusicList[that.payIndex];
          that.mp3.src = that.MusicList[that.payIndex].url
          that.mp3.play()
        }else{
          that.SongIndex--
          that.mp3.pause()
          that.mp3.pause.currentTime = 0.0
          if (that.SongIndex < 0) {
            that.SongIndex = that.PlayList.length -1;
          }
          that.songListPlay();
        }

      },
      /**
       * 下一首点击
       */
      onDownFirst () {
        var that = this
        // 判断是从哪个列表播放的
        if(this.ListStatus){
          that.payIndex++
          that.mp3.pause()
          that.mp3.pause.currentTime = 0.0
          if (that.payIndex >= that.MusicList.length) {
            that.payIndex = 0
          }
          that.SongMess = that.MusicList[that.payIndex].songinfo;
          that.paly_music = that.MusicList[that.payIndex]
          that.mp3.src = that.MusicList[that.payIndex].url
          that.mp3.play()
        }else {
          that.SongIndex++
          that.mp3.pause()
          that.mp3.pause.currentTime = 0.0
          if (that.SongIndex >= that.PlayList.length) {
            that.SongIndex = 0
          }
          that.songListPlay();
        }

      },
      /**
       * 鼠标右键点击
       * @param e
       */
      onContextmenu (e) {
        console.log(e)
      },
      /**
       * 删除歌曲点击
       */
      onDelMusic (item, index) {
        console.log(item);
        this.MusicList.splice(index, 1);
        this.SongList.splice(index, 1);
        this.DelMusicArr.push(item.name);
        localStorage.setItem('DelMusicArr', JSON.stringify(this.DelMusicArr));
        localStorage.setItem('SongList', JSON.stringify(this.SongList));
      },
      /**
       * 遥控，模式切换
       */
      onRemoteControl () {
        // 获取屏幕宽高
        var winW = electron.screen.getPrimaryDisplay().workAreaSize.width
        var winH = electron.screen.getPrimaryDisplay().workAreaSize.height
        // 模式切换
        this.RemoteControlWay = !this.RemoteControlWay
        let WinParams = {}
        if (this.RemoteControlWay) {
          WinParams = {
            width: 270,
            height: 100,
            AlwaysOnTop: true,
            Resizable: false,
            Maximizable: false,
            SkipTaskbar: true,
          }
          ipc.send('remote-control', WinParams)
        } else {
          WinParams = {
            width: 1000,
            height: 563,
            AlwaysOnTop: false,
            Resizable: true,
            Maximizable: true,
            SkipTaskbar: false
          }
          ipc.send('remote-control', WinParams)
        }
      },
      /**
       * 关闭遥控模式
       */
      onCloseRemoteControl () {
        this.RemoteControlWay = false
      },
      /**
       * 迷你模式
       */
      OnMini () {
        this.MiniStatus = true
        let WinParams = {
          width: 270,
          height: 50,
          AlwaysOnTop: true,
          Resizable: true,
          Maximizable: false,
        }
        ipc.send('remote-control', WinParams)
      },
      /**
       * 搜索提交
       */
      Submit () {
        this.ComponentDisplay = 0;
        this.keyWord = this.SearchVal;
      },
      /**
       * 数组去重
       */
      // filter (...args) {
      //   var map = {}
      //   args.forEach(arr => {
      //     arr.forEach(v => {
      //       map[v.id] = v
      //     })
      //   })
      //   return Object.entries(map).map(v => v[1])
      // },
      /**
       * 查找数组想要元素取出下标
       * @param arr
       * @param val
       * @returns {number}
       */
      arrSelect(arr,val){
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id == val) return i;
        }
        return -1;
      },
      /**
       * 往我的列表加入歌曲
       */
      AddSong(val){
        let id = '';
        SongLyric({
          id: val.id,
        }).then(res =>{
          val.lrclink = res.lrc.lyric;
          val.type = 2;
          if(this.arrSelect(this.SongList,val.id) == -1){
            this.SongList.push(val);
            localStorage.setItem('SongList', JSON.stringify(this.SongList));
            this.MusicList.push({
              name: val.name,
              size: val.m.size,
              singer: val.ar[0].name,
              url: `https://music.163.com/song/media/outer/url?id=${val.id}.mp3`,
              duration: val.dt,
              songinfo: val,
              id: val.id,
              type: 2,
              lrclink: val.lrclink,
            })
          }
        })
      },
      /**
       * 在听歌曲列表播放
       */
      songListPlay(){
        SongDetail({
          ids: this.PlayList[this.SongIndex].id,
        }).then(res => {
          let song = res.songs[0];
          SongLyric({
            id: song.id,
          }).then(ress => {
            song.lrclink = ress.lrc.lyric;
            song.type = 2;
            this.PlayList[this.SongIndex].name = song.name;
            this.PlayList[this.SongIndex].size = song.m?song.m.size:0;
            this.PlayList[this.SongIndex].singer = song.ar[0].name;
            this.PlayList[this.SongIndex].url = `https://music.163.com/song/media/outer/url?id=${song.id}.mp3`;
            this.PlayList[this.SongIndex].duration = song.dt;
            this.PlayList[this.SongIndex].songinfo = song;
            this.PlayList[this.SongIndex].id = song.id;
            this.PlayList[this.SongIndex].type = 2;
            this.PlayList[this.SongIndex].lrclink = song.lrclink;
            // 播放
            this.SonfPaly(this.PlayList[this.SongIndex],this.SongIndex);
            this.SongMess = this.PlayList[this.SongIndex].songinfo;
            this.paly_music = this.PlayList[this.SongIndex];
          })
        })
      },
      /**
       * 歌曲列表组件传的值
       */
      Song_list (val) {
        this.PlayList = val;
        this.SongIndex = val.index;
        localStorage.setItem('PlayList', JSON.stringify(this.PlayList));
        this.songListPlay();
      },
      /**
       * 在听歌曲列表点击
       */
      onPlaySongList(item,index){
        this.SongIndex = index;
        this.payIndex = -1;
        this.songListPlay();
      },
      /**
       * 清空全部在听歌曲
       */
      onDelAllSong(){
        this.PlayList = [];
        localStorage.removeItem('PlayList');
      },
      /**
       * 推荐歌曲列表id
       * @param val
       */
      SongIds(val){
        console.log(val)
        this.SongId = val;
        this.ComponentDisplay = 3;
      },
      /**
       * 登录
       */
      onLongin(){
        // 判断是否登录
        if(this.LoginInfo.avatarUrl){
          this.$confirm('此操作将要退出登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            localStorage.removeItem('UID');
            this.LoginInfo = {};
            this.play_list = [];
            this.$message({
              type: 'success',
              message: '退出登录成功!'
            });
          })
          return
        }

        this.$prompt('请输入您的网易云UID', '登录', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: '',
          inputErrorMessage: '格式不正确'
        }).then(({ value }) => {
          value = value.replace(/[^\d]/g,'');
          // 登录接口
          LoginIn({
            uid: value,
          }).then(res =>{
            if(res.playlist.length == 0){
              this.$message({
                type: 'error',
                message: '登录失败，请检查UID是否正确',
              })
              return
            }
            this.LoginInfo = res.playlist[0].creator;
            this.play_list = res.playlist;
            localStorage.setItem('UID',value);
            this.$message({
              type: 'success',
              message: '欢迎您' + this.LoginInfo.nickname,
            })
          })
        })
      }
    },
  }

</script>
<style lang="less">
    @import "../assets/css/style";
    // 音量
    .widget .volume > .plan > div .el-slider__runway {
        height: 3px;
        border-radius: 10px;
        background-color: #e4e4e4;
    }

    .widget .volume > .plan > div .el-slider__bar {
        height: 3px;
        border-radius: 10px;
        background-color: @base;
    }

    .widget .volume > .plan > div .el-slider__button {
        display: none;
        width: 10px;
        height: 10px;
        border-color: @base;
    }

    // 播放进度
    .progress_bar .el-slider__runway {
        height: 3px;
        border-radius: 10px;
        background-color: #e4e4e4;
        margin: 0;
    }

    .progress_bar .el-slider__bar {
        height: 3px;
        background-color: @base;
    }

    .progress_bar .el-slider__button {
        width: 10px;
        height: 10px;
        border-color: @base;
        margin: 0;
    }

    .progress_bar .el-slider__button-wrapper {
        display: none;
    }

    /*    遥控音量*/
    .Remote_control_mode .extension .el-slider__runway {
        height: 3px;
        border-radius: 10px;
        background-color: #999999;
        margin: 0;
    }

    .Remote_control_mode .extension .el-slider__bar {
        height: 3px;
        background-color: @base;
    }

    .Remote_control_mode .extension .el-slider__button {
        width: 10px;
        height: 10px;
        border-color: @base;
        margin: 0;
    }

    .Remote_control_mode .extension .el-slider__button-wrapper {
        display: none;
    }
/*    提示框*/
    .el-input.is-active .el-input__inner, .el-input__inner:focus{
        border-color: @base !important;
    }
    .el-button--primary{
        background-color: @base !important;
        border-color: @base !important;
    }
</style>
<style lang="less" scoped>
    @import "../assets/css/style";
    /*窗口*/
    #mytitle {
        position: absolute;
        width: 100%;
        height: 4%;
        -webkit-app-region: drag;
    }

    #mytitle .left {
        width: 25%;
        height: 100%;
        background-color: @assist;
    }

    #mytitle .remote_control {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right: 80px;
        top: 0;
        width: 20px;
        height: 100%;
        cursor: pointer;
        -webkit-app-region: no-drag;
    }

    #mytitle .remote_control > span {
        font-size: 18px;
        color: #484848;
    }

    #mytitle .remote_control:hover span {
        color: @base;
    }

    .page {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        font-family: 微软雅黑;
        transition: all 0.5s;
    }
    .page .vague{
        background-color: @baseColor;
    }

    /*头部*/
    .head {
        display: flex;
        width: 100%;
        height: 10%;
        min-height: 50px;
    }

    .head .search {
        display: flex;
        align-items: flex-end;
        width: 25%;
        height: 100%;
        background-color: @assist;
    }

    .head .search .search_item {
        display: flex;
        align-items: center;
        width: 90%;
        height: 20px;
        margin: 0 auto;
        border-radius: 30px;
        background-color: #ebebeb;
    }

    .head .search .search_item > span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 10%;
        font-size: 14px;
        color: @wordColor;
    }

    .head .search .search_item > input {
        display: flex;
        align-items: center;
        outline: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        width: 90%;
        height: 20px;
        border: none;
        background-color: transparent;
        color: @wordColor;
    }
    .head .head_item{
        display: flex;
        align-items: center;
        width: 75%;
        height: 100%;
    }
    .head .head_item .login{
        display: flex;
        align-items: center;
        padding-left: 3%;
        height: 80%;
        margin-top:3%;
        cursor: pointer;
    }
    .head .head_item .login .head_portrait{
        width: 30px;
        height: 30px;
    }
    .head .head_item .login .head_portrait > img{
        width: 100%;
        height: 100%;
        border-radius: 100%;
    }
    .head .head_item .login .name{
        display: flex;
        align-items: center;
        margin-left: 10px;
    }
    .head .head_item .login .name > span{
        font-size: 14px;
        color: #484848;
    }
    .main {
        display: flex;
        width: 100%;
        height: 80%;
    }

    .main .left_list {
        position: relative;
        width: 25%;
        height: 100%;
        background: @assist;
    }

    .main .left_list .top_song {
        width: 100%;
        height: 100%;
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
        /*border-bottom: 1px solid #f6f6f6;*/
        cursor: pointer;
        transition: all .5s;
        color: @wordColor;
    }

    .main .left_list .top_song > .active {
        height: 60px;
        color: @base;
    }

    .main .left_list .top_song > .active > span {
        /*font-weight: bold;*/
    }

    .main .left_list .top_song > .list span {
        font-size: 12px;
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

    .main .left_list .top_song > .list:hover span:nth-child(2) {
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

    /*右边*/
    .main .right_list {
        position: relative;
        width: 75%;
        height: 100%;
    }
    .main .right_list .pay_win{
        position: absolute;
        z-index: 111;
        right: 0;
        bottom: 0;
        width: 80%;
        height: 80%;
        background-color: #fafafa;
        -moz-box-shadow:-2px 1px 13px rgba(0,0,0,0.3);
        -webkit-box-shadow:-2px 1px 13px rgba(0,0,0,0.3);
        box-shadow:-2px 1px 13px rgba(0,0,0,0.3);
    }
    .main .right_list .pay_win > .title{
        display: flex;
        align-items: center;
        padding: 0 4%;
        height: 10%;
        font-size: 14px;
        border-bottom: 1px solid #f0f0f0;
        color: @wordColor;
    }
    .main .right_list .pay_win > .title > .total{
        display: flex;
        align-items: center;
        width: 80%;
        height: 100%;
    }
    .main .right_list .pay_win > .title > .delAll{
        display: flex;
        align-items: center;
        width: 20%;
        height: 100%;
    }
    .main .right_list .pay_win > .title > .delAll .icon-shanchu{
        font-size: 16px;
    }
    .main .right_list .pay_win .play_list{
        width: 100%;
        height: 90%;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .main .right_list .pay_win .play_list > .list{
        display: flex;
        align-items: center;
        padding: 0 4%;
        height: 40px;
        color: @wordColor;
        font-size: 14px;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
    }
    .main .right_list .pay_win .play_list > .list > .title{
        width: 70%;
    }
    .main .right_list .pay_win .play_list > .list > .name{
        width: 20%;
    }
    .main .right_list .pay_win .play_list > .list > .time{
        width: 10%;
    }
    .main .right_list .pay_win .play_list::-webkit-scrollbar {
        width: 4px;
        cursor: pointer;
        /*display: none;*/
    }

    .main .right_list .pay_win .play_list::-webkit-scrollbar-thumb {
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.1);
    }

    .main .right_list .pay_win .play_list::-webkit-scrollbar-track {
        /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);*/
        /*border-radius: 0;*/
        /*background: rgba(0,0,0,0.1);*/
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
    }

    /*歌曲播放*/
    .footer .control {
        display: flex;
        width: 25%;
        height: 100%;
    }

    .footer .control > .tumb {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30%;
        height: 100%;
    }

    .footer .control > .tumb > img {
        width: 45px;
        height: 45px;
        border-radius: 5px;
    }

    .footer .control > .title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 70%;
        height: 100%;
    }

    .footer .control > .title > .music_name {
        font-size: 14px;
        color: @wordColor;
    }

    .footer .control > .title > .music_item {
        font-size: 12px;
        color: #484848;
    }

    /*控件*/
    .footer .progress {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 45%;
        height: 100%;
    }

    .footer .progress > div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 15%;
        height: 100%;
    }

    .footer .progress > div > span {
        font-size: 28px;
        color: @base;
        cursor: pointer;
    }

    .footer .progress > .pattern > span {
        font-size: 16px;
        color: #484848;
    }

    .footer .progress > .up_first > span {
        font-size: 20px;
        color: @base;
    }

    .footer .progress > .down_first > span {
        font-size: 20px;
        color: @base;
    }

    .footer .progress > .play_time > span {
        font-size: 12px;
        color: #484848;
    }

    /*  控件*/
    .widget {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 30%;
        height: 100%;
    }

    .widget .volume {
        display: flex;
        align-items: center;
        width: 50%;
    }

    .widget .volume > span {
        width: 15%;
        font-size: 24px;
        color: #7e818d;
    }

    .widget .volume > .plan {
        width: 80%;
        height: 4px;
        /*background: #666666;*/
        border-radius: 4px;
        margin-left: 5%;
    }

    .widget .volume > .plan > div {
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
        font-size: 14px;
        color: #7e818d;
        cursor: pointer;
    }

    .widget .pay_list {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20%;
        height: 100%;
    }
    .widget .pay_list span {
        font-size: 18px;
        color: #7e818d;
        cursor: pointer;
    }

    /*    进度条*/
    .progress_bar {
        position: absolute;
        left: 0;
        top: 0px;
        width: 100%;
        height: 4px;
    }


    /*    遥控模式*/
    .Remote_control_mode {
        width: 270px;
        height: 100px;
        background-color: #f0f0f0;

        .control_div {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
            width: 100%;
            height: 100%;
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
            filter: blur(50px);
            transform: translateZ(0);
            opacity: 0.7;
        }
    }

    /*顶部歌曲部分*/
    .song_title {
        display: flex;
        padding: 0 5%;
        height: 50px;

        .song {
            display: flex;
            align-items: center;
            width: 80%;
            height: 100%;

            span {
                font-size: 14px;
                color: #ffffff;
            }

            -webkit-app-region: drag;
        }

        .widget {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            width: 20%;
            height: 100%;
            cursor: pointer;

            > span {
                font-size: 16px;
                color: #7e818d;
                margin-left: 25%;
            }
        }
    }

    /*    控件*/
    .telecontrol_control {
        position: relative;
        display: flex;
        padding: 0 5%;
        height: 50px;

        /*上一首，播放暂停，下一曲*/

        .control {
            display: flex;
            align-items: center;
            width: 50%;
            height: 100%;

            > span {
                font-size: 24px;
                color: @base;
                margin-right: 16%;
                cursor: pointer;
            }

            > span:last-child {
                margin-right: 0;
            }

            .icon-bofang {
                color: @base;
            }
        }

        /*    音量，播放模式*/

        .extension {
            display: flex;
            align-items: center;
            width: 50%;
            height: 100%;

            .volume {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 60%;
                height: 100%;
                cursor: pointer;

                > span {
                    width: 20%;
                    font-size: 18px;
                    color: #484848;
                }

                > div {
                    width: 70%;
                    height: 2px;
                    background-color: #484848;
                    border-radius: 2px;
                    margin-left: 10%;
                }
            }

            .schema {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 25%;
                height: 100%;
                cursor: pointer;

                > span {
                    font-size: 18px;
                    color: #484848;
                }
            }
        }
    }

    /*    迷你模式*/
    .mini {
        width: 100%;
        height: 40px;
        background-color: #000;
        /*-webkit-app-region: drag;*/
    }

    .mini .drag {
        width: 100%;
        height: 20%;
        -webkit-app-region: drag;
    }

    .mini .mode {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 80%;
    }

    .mini .mode > span {
        font-size: 22px;
        color: #ffffff;
        cursor: pointer;
    }

    /*    大背景*/
        .bg_player_mask{
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
            transition: all .8s;
        }
</style>
