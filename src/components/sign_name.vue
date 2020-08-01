<template>
  <div id="signName" class="sign-name">
    <div class="content">
      <div>请用正楷在下框写入您的真实姓名：</div>
      <div class="sign-wrap" id="signWrap">
        <canvas id="myCanvas" width="100%" height="100%"></canvas>
      </div>
    </div>
    <div class="fix-btn flex">
      <button size="large" @click="clearArea()">清除</button>
      <button size="large" type="primary" @click="saveSign()">
        提交
      </button>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  name: 'signName',
  data() {
    return {
      w: '',
      h: '',
      image: '',
      mousePressed: false,
      signInfo: {}, // 签名滑板的信息
      canvasContext: {},
      lastX: 0,
      lastY: 0,
    }
  },
  mounted() {
    // 强制横屏
    var evt = 'onorientationchange' in window ? 'orientationchange' : 'resize'
    window.addEventListener(evt, this.landscape(), false)
    // 初始化
    this.image = ''
    this.mousePressed = false
    this.canvasContext = document.getElementById('myCanvas').getContext('2d')
    this.signInfo = document.getElementById('myCanvas')
    var signWrap = document.getElementById('signWrap')
    this.signInfo.width = signWrap.clientWidth //设置宽度
    this.signInfo.height = signWrap.clientHeight //设置高度
    //监听touchstart事件，touchmove事件，touchend事件等事件
    this.InitThis()
  },
  methods: {
    // 初始化
    InitThis() {
      // 触摸屏
      var that = this
      this.signInfo.addEventListener(
        'touchstart',
        function(event) {
          if (event.targetTouches.length == 1) {
            event.preventDefault() // 阻止浏览器默认事件，重要
            var touch = event.targetTouches[0]
            // 标记  我要开始签名了
            this.mousePressed = true
            // 因为是横屏
            that.Draw(touch.pageY, that.w - touch.pageX, false)
            // that.Draw(touch.pageX, touch.pageY, false)
          }
        },
        false
      )

      this.signInfo.addEventListener(
        'touchmove',
        function(event) {
          if (event.targetTouches.length == 1) {
            event.preventDefault() // 阻止浏览器默认事件，重要
            var touch = event.targetTouches[0]
            if (this.mousePressed) {
              that.Draw(touch.pageY, that.w - touch.pageX, true)
            }
          }
        },
        false
      )

      this.signInfo.addEventListener(
        'touchend',
        function(event) {
          if (event.targetTouches.length == 1) {
            event.preventDefault() // 阻止浏览器默认事件，防止手写的时候拖动屏幕，重要
            // var touch = event.targetTouches[0];
            this.mousePressed = false
          }
        },
        false
      )
    },
    // 因为是横屏
    // x  当前点  距离底部的距离   y  当前点距离左边的距离
    Draw(x, y, isDown) {
      if (isDown) {
        // 画布的相关设置
        this.canvasContext.beginPath()
        this.canvasContext.strokeStyle = '#000' //颜色
        this.canvasContext.lineWidth = 3 //线宽
        this.canvasContext.lineJoin = 'round'
        this.canvasContext.lineMax = 10 //设置画笔最大线宽
        this.canvasContext.lineMin = 3 //设置画笔最小线宽
        this.canvasContext.linePressure = 1.2 //设置画笔笔触压力
        this.canvasContext.smoothness = 30 //设置画笔笔触大小变化的平滑度。
        // 从某一个点 移动到另一个点
        // moveTo 相当于起始坐标
        this.canvasContext.moveTo(this.lastX, this.lastY)
        // 相当于终点坐标
        this.canvasContext.lineTo(x, y)
        // 绘制当前点到初始点的线
        this.canvasContext.closePath()
        // 画出来
        this.canvasContext.stroke()
      }
      this.lastX = x
      this.lastY = y
    },
    // 清除绘画
    clearArea() {
      console.log('清空画板')
      this.canvasContext.setTransform(1, 0, 0, 1, 0, 0)
      this.canvasContext.clearRect(
        0,
        0,
        this.canvasContext.canvas.width,
        this.canvasContext.canvas.height
      )
    },
    // 保存签名
    saveSign() {
      // 获取html的canvas对象，我这个id="myCanvas"
      var canvas = document.getElementById('myCanvas')
      //再创建一个空的canvas
      var blank = document.createElement('canvas')
      blank.width = canvas.width
      blank.height = canvas.height
      // 如果数据源相等  说明当前的canvas没有进行签名
      if (canvas.toDataURL() == blank.toDataURL()) {
        this.$emit('getImgInfo', false)
        return
      } else {
        var image = canvas.toDataURL('image/png') //得到生成后的签名base64位  url 地址
        console.log(image)
        this.$emit('getImgInfo', image)
        //将base64转换为文件
        var arr = image.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        var file = new File([u8arr], 'signName.png', { type: mime })
        const data = new FormData()
        data.append('file', file)
        // axios
        //   .post('http://121.41.99.232:20001/shard_upload', data, {
        //     headers: {
        //       token:
        //         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbiI6InRvYiIsImNoaWxkX3VzZXJfaWQiOjU1Niwic2Nob29sX2NvZGUiOiJrMTJzY2hvb2xfMDJfdGVzdCIsInVzZXJfaWQiOjE2ODN9.pY6RCE0mcZGxqmi3UArtaeC0W2iwbRQ9Oo8vLw9CA7c'
        //     }
        //   })
        //   .then(res => {
        //     console.log(res)
        //   })
      }
    },
    // 强制横屏
    landscape() {
      var w = document.documentElement.clientWidth
      var h = document.documentElement.clientHeight
      this.w = w
      this.h = h
      var el = document.getElementById('signName')
      // 说明是竖屏
      if (w < h) {
        el.style.width = h + 'px'
        el.style.height = w + 'px'
        el.style.top = (h - w) / 2 + 'px'
        el.style.left = 0 - (h - w) / 2 + 'px'
        el.style.transform = 'rotate(90deg)'
        el.style.transformOrigin = '50% 50%'
      } else {
        el.style.width = w + 'px'
        el.style.height = h + 'px'
        el.style.top = 0
        el.style.left = 0
        el.style.transform = 'none'
        el.style.transformOrigin = '50% 50%'
      }
    },
  },
}
</script>

<style lang="less">
.sign-message-ele {
  top: 50% !important;
  left: 45%;
  z-index: 2001;
  margin-top: -10.6vw;
  transform: rotate(90deg);
}
@media screen and (orientation: portrait) {
  html {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  body {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  #signName {
    position: absolute;
  }
}
@media screen and (orientation: landscape) {
  html {
    width: 100%;
    height: 100%;
  }
  body {
    width: 100%;
    height: 100%;
  }
  #signName {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
#signName {
  width: 100%;
  height: 100%;
  font-size: 3.7vw;
  .content,
  #signWrap {
    height: 100%;
  }
  .fix-btn {
    width: 100%;
    justify-content: center;
    position: absolute;
    bottom: 2.6667vw;
    button {
      width: 26vw;
      padding: 0 5.3vw;
      height: 8vw;
      line-height: 8vw;
      font-size: 4vw;
      margin: 0 4vw;
    }
  }
}
</style>
