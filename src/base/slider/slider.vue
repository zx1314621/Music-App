<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">                                                       <!--active 为特殊的dot样式，css中定义 当滑动到该页面时，将active加入到对应dot的样式中-->
      <span class="dot" v-for="(item,index) in dots" :key="(item,index)" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<!--JS部分-->
<script type="text/ecmascript-6">
//  引入addClass方法，内部手写
import {addClass} from 'common/js/dom'
// 引入better-scroll 外部部件引入，用以实现推荐页轮播器
import BScroll from 'better-scroll'

export default {
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  // 参数设置
  props: {
    // loop 用于设置是否循环 取值为 true 或 false
    loop: {
      type: Boolean,
      default: true
    },
    // autoPlay 用于设置轮播器是否自动部分 取值为 true 或 false
    autoPlay: {
      type: Boolean,
      default: true
    },
    // interval 用于设置轮播器自动播放的间隔时间 单位为ms
    interval: {
      type: Number,
      default: 4000
    }
  },

  // 在向后台请求到数据后执行
  mounted() {
    // 20ms之后执行_setSliderWidth()，_initDots()， _initSlider()
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      // 检测是否自动播放，则调用_play()
      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    // 监听窗口大小的改变事件
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      // 使用refresh函数 刷新slider
      this.slider.refresh()
    })
  },
  // 书写内部方法
  methods: {
    // isResize 检测是否改变窗口大小
    // 设置slider的宽度
    _setSliderWidth(isResize) {
      // 获取需要展示在轮播器中的图片
      this.children = this.$refs.sliderGroup.children

      // 初始化width
      let width = 0
      // 设置初始化sliderWidth
      let sliderWidth = this.$refs.slider.clientWidth

      // 遍历所有需要添加的图片
      for (let i = 0; i < this.children.length; i++) {
        // 赋值局部变量
        let child = this.children[i]
        // 将该图片加入到slider中，addClass在common/js/dom.js中声明
        addClass(child, 'slider-item')
        // 设置图片的宽度，px为单位，指像素
        child.style.width = sliderWidth + 'px'
        // 设置轮播器的总宽度
        width += sliderWidth
      }

      // 如果允许循环， 则需要将轮播器的两侧各加上一个单独的播放小格， 即需要将slider的总宽度多加两张图片的宽度
      // 其目的是实现循环播放，具体来说就是将第一张的左侧显示最后一张， 最后一张的的右侧显示第一张
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      // 设置slider的总宽度， px为单位， 指像素
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    // 初始化所有dot
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    // 初始化slider
    _initSlider() {
      // 初始化slider 填写slider各种参数
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: true,
        momentum: false,
        snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400
        // click: true  //设置click为true会导致，必须双击才能产生页面跳转，所以此处取消设置
      })
      // 当每一个slider滑到最后时执行 scrollEnd指slider最后
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX

        // 如果允许循环，则将pageIndex复制到currentPageIndex，由于currentPageIndex由0开始，所以此处需要-1
        if (this.loop) {
          pageIndex -= 1
        }
        this.currentPageIndex = pageIndex

        // 如果允许自动播放则执行下面操作
        if (this.autoPlay) {
          clearTimeout(this.timer) // 清除计时器，因为如果不清除，手动拖拽轮播器就不会重置计时，
          // 例如如果在快要自动切换到下一张图片时，手动拖拽一张就会出现连续切换两张的效果
          this._play()
        }
      })
    },

    // _play函数 将轮播器向后跳一页
    _play() {
      // 获取当前页面，由于currentPageIndex是由0开始的，所有此处需要+1
      let pageIndex = this.currentPageIndex + 1

      // 如果允许循环，则将pageIndex+1， pageIndex指要跳的的页面
      if (this.loop) {
        pageIndex += 1
      }
      // 间隔interval时间之后执行goToPage函数向后跳转一页
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400) // 0代表Y方向，我们这里只改变X方向的索引，400为间隔
      }, this.interval)
    }
  },

  // 在调用销毁函数时，清理资源，释放内存
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
