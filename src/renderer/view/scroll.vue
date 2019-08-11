<template>
  <div ref="wrapper" @touchstart="onTouchstart" @touchmove="onTouchmove" @touchend="onTouchend">
    <slot>
    </slot>
  </div>
</template>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>

<script type="text/ecmascript-6">
  import BetterScroll from 'better-scroll'
  export default {
    name: 'scroll',
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      refreshDelay: {
        type: Number,
        default: 20
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      listenScrollStart: {
        type: Boolean,
        default: false
      },
      listenScrollEnd: {
        type: Boolean,
        default: false
      },
      listenTouchStart: {
        type: Boolean,
        default: false
      },
      listenTouchMove: {
        type: Boolean,
        default: false
      },
      listenTouchEnd: {
        type: Boolean,
        default: false
      },
      scrollX: {
        type: Boolean,
        default: false
      },
      scrollY: {
        type: Boolean,
        default: true
      }
    },
    mounted () {
      this.$nextTick(() => {
        this._initScroll()
      })
    },
    methods: {
      _initScroll () {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BetterScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          scrollX: this.scrollX,
          scrollY: this.scrollY
        })
        if (this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('onscroll', pos)
          })
        }
        if (this.listenScrollEnd) {
          let me = this
          this.scroll.on('scrollEnd', (pos) => {
            me.$emit('onscrollEnd', pos)
          })
        }
        if (this.listenScrollStart) {
          let me = this
          this.scroll.on('scrollStart', (pos) => {
            me.$emit('onscrollStart', pos)
          })
        }
      },
      // 存在自动滚动时（如歌词的自动播放）
      // 需要监听根据对 touch 事件的监听判断 scroll 过程是自动播放触发的还是用户 touch 触发的
      onTouchstart (e) {
        if (!this.listenTouchStart) {
          return
        }
        this.$emit('ontouchStart', e)
      },
      onTouchmove (e) {
        if (!this.listenTouchMove) {
          return
        }
        this.$emit('ontouchMove', e)
      },
      onTouchend (e) {
        if (!this.listenTouchEnd) {
          return
        }
        this.$emit('ontouchEnd', e)
      },
      disable () {
        this.scroll && this.scroll.disable()
      },
      enable () {
        this.scroll && this.scroll.enable()
      },
      refresh () {
        this.scroll && this.scroll.refresh()
      },
      scrollTo () {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement () {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data: {
        handler (newValue, oldValue) {
          setTimeout(() => {
            this.refresh()
          }, this.refreshDelay)
        },
        deep: true
      }
    }

  }
</script>
