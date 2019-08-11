<template>
    <div class="page_table" ref="page_table">
        <input type="file" name="" @change="onChange" id="musicFile">
        <button @click="onClick">停止</button>
        <canvas id="casvased" width="500" height="300"></canvas>
    </div>
</template>

<script>
  export default {
    name: 'AudioVisualization',
    data () {
      return {
        audioContext: '',
        canvas: '',
        canvasCtx: '',
        AudioSrc: '',
        audioBufferSourceNode:'',
      }
    },
    // props:{
    //   src: {
    //     type: Object
    //   }
    // },
    mounted () {
      // this.AudioSrc = this.src
      //展示音频可视化
      this.canvas = document.getElementById('casvased')
      this.canvasCtx = this.canvas.getContext('2d')
      // 赋值宽高
      this.canvas.width = this.$refs['page_table'].offsetWidth
      this.canvas.height = this.$refs['page_table'].offsetHeight

      //首先实例化AudioContext对象 很遗憾浏览器不兼容，只能用兼容性写法；audioContext用于音频处理的接口，并且工作原理是将AudioContext创建出来的各种节点(AudioNode)相互连接，音频数据流经这些节点并作出相应处理。
      //总结就一句话 AudioContext 是音频对象，就像 new Date()是一个时间对象一样
      var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext
      if (!AudioContext) {
        alert('您的浏览器不支持audio API，请更换浏览器（chrome、firefox）再尝试，另外本人强烈建议使用谷歌浏览器！')
      }
      this.audioContext = new AudioContext();//实例化
      var GainNode = this.audioContext.createGain();
      GainNode.gain.value = 1;
      // this.getData();
    },
    methods: {
      //随机变颜色
      randomRgbColor () { //随机生成RGB颜色
        var r = Math.floor(Math.random() * 256) //随机生成256以内r值
        var g = Math.floor(Math.random() * 256) //随机生成256以内g值
        var b = Math.floor(Math.random() * 256) //随机生成256以内b值
        return `rgb(${r},${g},${b})` //返回rgb(r,g,b)格式颜色
      },
      //随机数 0-255
      sum (m, n) {
        var num = Math.floor(Math.random() * (m - n) + n)
        return num
      },
      getData(){
        let that = this
        let files = this.AudioSrc;
        var fileReader = new FileReader()//使用FileReader异步读取文件
        fileReader.readAsArrayBuffer(files)//开始读取音频文件
        fileReader.onload = function (e) {
          console.log(e.target.result)
          //e.target.result 即为读取的音频文件（此文件为二进制文件）
          //下面开始解码操作 解码需要一定时间，这个时间应该让用户感知到
          var count = 0
          console.log('开始解码')
          // var timer = setInterval(function(){
          //   count++;
          //   console.log('解码中,已用时'+count+'秒')
          // },1000)

          //开始解码，解码成功后执行回调函数
          that.audioContext.decodeAudioData(e.target.result, function (buffer) {
            // clearInterval(timer)
            console.log('解码成功，用时共计:' + count + '秒')
            // 创建AudioBufferSourceNode 用于播放解码出来的buffer的节点
            that.audioBufferSourceNode = that.audioContext.createBufferSource()
            // 创建AnalyserNode 用于分析音频频谱的节点
            var analyser = that.audioContext.createAnalyser()
            //fftSize (Fast Fourier Transform) 是快速傅里叶变换，一般情况下是固定值2048。具体作用是什么我也不太清除，但是经过研究，这个值可以决定音频频谱的密集程度。值大了，频谱就松散，值小就密集。
            analyser.fftSize = 256
            // 连接节点,audioContext.destination是音频要最终输出的目标，`
            // 我们可以把它理解为声卡。所以所有节点中的最后一个节点应该再
            // 连接到audioContext.destination才能听到声音。
            that.audioBufferSourceNode.connect(analyser)
            analyser.connect(that.audioContext.destination)
            console.log(that.audioContext.destination)
            // 播放音频
            that.audioBufferSourceNode.buffer = buffer //回调函数传入的参数
            that.audioBufferSourceNode.start() //部分浏览器是noteOn()函数，用法相同
            //可视化 创建数据
            // var dataArray = new Uint8Array(analyser.fftSize);
            // analyser.getByteFrequencyData(dataArray)//将数据放入数组，用来进行频谱的可视化绘制
            var bufferLength = analyser.frequencyBinCount
            console.log(bufferLength)
            var dataArray = new Uint8Array(bufferLength)
            console.log(dataArray)
            that.canvasCtx.clearRect(0, 0, that.$refs['page_table'].offsetWidth, that.$refs['page_table'].offsetHeight)
            function draw () {
              requestAnimationFrame(draw)
              analyser.getByteFrequencyData(dataArray)
              // 开始绘画
              that.canvasCtx.fillStyle = 'rgba(25, 25, 38,1)'
              //canvasCtx.fillStyle = ;
              that.canvasCtx.fillRect(0, 0, that.$refs['page_table'].offsetWidth, that.$refs['page_table'].offsetHeight)
              var barWidth = (that.$refs['page_table'].offsetHeight / bufferLength) * 2.5
              var barHeight
              var x = 0
              for (var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i]
                //随机数0-255   Math.floor(Math.random()*255)
                // 随机数  10*Math.random()
                // that.canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',' + Math.floor(Math.random() * (20 - 120) + 120) + ',' + Math.floor(Math.random() * (10 - 50) + 50) + ')'
                that.canvasCtx.fillStyle = `rgb(133,247,${that.sum(255, 0)})`;
                // that.canvasCtx.fillStyle = that.randomRgbColor();
                that.canvasCtx.fillRect(x, that.$refs['page_table'].offsetHeight - barHeight / 1, barWidth, barHeight / 1)
                x += barWidth + 1
              }
            }

            draw()
          })
        }
      },
      onClick(){
        console.log(this.audioBufferSourceNode.currentTime)
        // this.audioBufferSourceNode.stop(this.audioBufferSourceNode.currentTime)
      },
      onChange (e) {
        let that = this
        let files = e.target.files[0]
        var fileReader = new FileReader()//使用FileReader异步读取文件
        fileReader.readAsArrayBuffer(files)//开始读取音频文件
        fileReader.onload = function (e) {
          console.log(e.target.result)
          //e.target.result 即为读取的音频文件（此文件为二进制文件）
          //下面开始解码操作 解码需要一定时间，这个时间应该让用户感知到
          var count = 0
          console.log('开始解码')
          // var timer = setInterval(function(){
          //   count++;
          //   console.log('解码中,已用时'+count+'秒')
          // },1000)

          //开始解码，解码成功后执行回调函数
          that.audioContext.decodeAudioData(e.target.result, function (buffer) {
            // clearInterval(timer)
            console.log('解码成功，用时共计:' + count + '秒')
            // 创建AudioBufferSourceNode 用于播放解码出来的buffer的节点
            that.audioBufferSourceNode = that.audioContext.createBufferSource()
            // 创建AnalyserNode 用于分析音频频谱的节点
            var analyser = that.audioContext.createAnalyser()
            //fftSize (Fast Fourier Transform) 是快速傅里叶变换，一般情况下是固定值2048。具体作用是什么我也不太清除，但是经过研究，这个值可以决定音频频谱的密集程度。值大了，频谱就松散，值小就密集。
            analyser.fftSize = 256
            // 连接节点,audioContext.destination是音频要最终输出的目标，`
            // 我们可以把它理解为声卡。所以所有节点中的最后一个节点应该再
            // 连接到audioContext.destination才能听到声音。
            that.audioBufferSourceNode.connect(analyser)
            analyser.connect(that.audioContext.destination)
            console.log(that.audioContext.destination)
            // 播放音频
            that.audioBufferSourceNode.buffer = buffer //回调函数传入的参数
            that.audioBufferSourceNode.start() //部分浏览器是noteOn()函数，用法相同
            //可视化 创建数据
            // var dataArray = new Uint8Array(analyser.fftSize);
            // analyser.getByteFrequencyData(dataArray)//将数据放入数组，用来进行频谱的可视化绘制
            // console.log(analyser.getByteFrequencyData)
            var bufferLength = analyser.frequencyBinCount
            console.log(bufferLength)
            var dataArray = new Uint8Array(bufferLength)
            console.log(dataArray)
            that.canvasCtx.clearRect(0, 0, that.$refs['page_table'].offsetWidth, that.$refs['page_table'].offsetHeight)
            function draw () {
              requestAnimationFrame(draw)
              analyser.getByteFrequencyData(dataArray)
              // 开始绘画
              that.canvasCtx.fillStyle = 'rgba(25, 25, 38,1)';
              //canvasCtx.fillStyle = ;
              that.canvasCtx.fillRect(0, 0, that.$refs['page_table'].offsetWidth, that.$refs['page_table'].offsetHeight)
              var barWidth = (that.$refs['page_table'].offsetHeight / bufferLength) * 2.5
              var barHeight
              var x = 0
              for (var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i]
                //随机数0-255   Math.floor(Math.random()*255)
                // 随机数  10*Math.random()
                // that.canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',' + Math.floor(Math.random() * (20 - 120) + 120) + ',' + Math.floor(Math.random() * (10 - 50) + 50) + ')'
                that.canvasCtx.fillStyle = `rgb(133,247,${that.sum(255, 0)})`;
                // that.canvasCtx.fillStyle = that.randomRgbColor();
                that.canvasCtx.fillRect(x, that.$refs['page_table'].offsetHeight - barHeight / 1, barWidth, barHeight / 1)
                x += barWidth + 1
              }
            }

            draw()
          })
        }
      }
    }
  }
</script>

<style scoped>
    .page_table {
        width: 100%;
        height: 100%;
    }
</style>
