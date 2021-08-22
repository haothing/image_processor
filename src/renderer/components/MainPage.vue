<template>
  <div class="main-content">
    <div class="image-zone">
        <img id="image-content" class="image-content" :class="{'image-content-fade': isImgFade}" 
            v-show="showImg" :src="currentImgPath" :style="imageTransforms"
            @mousewheel="onWheel" @mousedown="onMouseDown" @mouseup="onMouseUp" @mouseout="onMouseOut" @mousemove="onMouseMove" 
            @dblclick="onDbClick" @load="onImgLoaded" @transitionend="transitionendImg">
        <!-- <vue-cropper class="image-content" ref="cropper" :src="currentImgPath" :background="false" :autoCrop="false"/> -->
    </div>
    <div class="image-shadow" v-show="showImgShadow" @transitionend="transitionend">
        <img id="image-shadow" class="image-content-shadow" :class="{'image-content-shadow-fade': isImgShadowFade}" 
            :src="shadowImgPath" :style="shadowTransform">
    </div>
    <img id="image-test" :src="currentImgPath" style="max-width:100%;max-height:100%;object-fit: scale-down;" >
    <transition name="fade-action-bar">
        <div class='action-bar-container' v-show="showActionBar">
            <div class="action-box action-bar">
                <button class="button is-rounded is-hovered btn-nav" @click="preImage">
                    <span class="icon">
                        <font-awesome-icon :icon="['fas', 'caret-left']" size="lg"/>     
                    </span>
                </button>
                <button class="button is-rounded is-hovered btn-nav" @click="nextImage">                
                    <span class="icon">
                        <font-awesome-icon :icon="['fas', 'caret-right']" size="lg"/>     
                    </span></button>
                <button class="button is-rounded is-hovered btn-fun" v-if="!isSlideshow" @click="doSlideshow">
                    <span class="icon">
                        <font-awesome-icon :icon="['fas', 'video']" size="sm"/>     
                    </span>
                </button>
                <button class="button is-rounded is-hovered btn-fun" v-else @click="stopSlideshow">
                    <span class="icon">
                        <font-awesome-icon :icon="['fas', 'stop']" size="sm"/>     
                    </span>
                </button>                
                <button class="button is-rounded is-hovered btn-fun" @click="resetImage">
                    <span class="icon">
                        <font-awesome-icon :icon="['fas', 'expand']"/>     
                    </span>
                </button>
                <button class="button is-rounded is-hovered btn-fun" @click="toggleFullScreen">
                    <span class="icon">
                        <font-awesome-icon :icon="['fas', 'expand-arrows-alt']"/>         
                    </span>
                </button>
                <button class="button is-rounded is-hovered btn-fun" @click="openFile">
                    <span class="icon">
                        <font-awesome-icon :icon="['far', 'folder-open']"/>         
                    </span>
                </button>
                <button class="button is-rounded is-hovered btn-fun" @click="showSetting = !showSetting">
                    <span class="icon">
                        <font-awesome-icon :icon="['far', 'folder-open']"/>         
                    </span>
                </button>
            </div>
        </div>
    </transition>
    <transition name="fade-nav-box-left">
        <div class="nav-box nav-box-left" v-show="showNavLeft" @click="onNavLeftClick" @mouseleave="showNavLeft = false">
            <span class="icon">
                <font-awesome-icon :icon="['fas', 'angle-left']" size="6x"/>         
            </span>
        </div>
    </transition>
    <transition name="fade-nav-box-right">
        <div class="nav-box nav-box-right" v-show="showNavRight" @click="onNavRightClick" @mouseleave="showNavRight = false">
            <span class="icon">
                <font-awesome-icon :icon="['fas', 'angle-right']" size="6x"/>         
            </span>
        </div>
    </transition>
    <div class="modal" :class="{'is-active': showSetting}">
        <div class="modal-background" @click="showSetting = false"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Setting</p>
                <button class="delete" aria-label="close" @click="showSetting = false"></button>
            </header>
            <section class="modal-card-body">
                <p>Set the slideshow interval time.</p>
                <!-- <v-slider v-model="slideshowTime.minutes" label="minutes" thumb-label="always" max="60" min="0"></v-slider>
                <v-slider v-model="slideshowTime.seconds" label="seconds" thumb-label="always" max="60" min="0"></v-slider> -->
                <div class="buttons has-addons">
                    <button class="button" :class="{'is-info': slideshowTime.seconds == 1}" @click="setSlideshowTime(0, 1)">&nbsp;&nbsp;1&nbsp;sec&nbsp;&nbsp;</button>
                    <button class="button" :class="{'is-info': slideshowTime.seconds == 3}" @click="setSlideshowTime(0, 3)">&nbsp;&nbsp;3&nbsp;sec&nbsp;&nbsp;</button>
                    <button class="button" :class="{'is-info': slideshowTime.seconds == 5}" @click="setSlideshowTime(0, 5)">&nbsp;&nbsp;5&nbsp;sec&nbsp;&nbsp;</button>
                    <button class="button" :class="{'is-info': slideshowTime.seconds == 10}" @click="setSlideshowTime(0, 10)">&nbsp;10&nbsp;sec&nbsp;&nbsp;</button>
                    <button class="button" :class="{'is-info': slideshowTime.seconds == 30}" @click="setSlideshowTime(0, 30)">&nbsp;30&nbsp;sec&nbsp;&nbsp;</button>
                </div>
                <div class="buttons has-addons">
                    <button class="button" :class="{'is-info': slideshowTime.minutes == 1}" @click="setSlideshowTime(1, 0)">&nbsp;&nbsp;1&nbsp;min&nbsp;&nbsp;</button>
                    <button class="button" :class="{'is-info': slideshowTime.minutes == 3}" @click="setSlideshowTime(3, 0)">&nbsp;&nbsp;3&nbsp;min&nbsp;&nbsp;</button>
                    <button class="button" :class="{'is-info': slideshowTime.minutes == 5}" @click="setSlideshowTime(5, 0)">&nbsp;&nbsp;5&nbsp;min&nbsp;&nbsp;</button>
                    <button class="button" :class="{'is-info': slideshowTime.minutes == 10}" @click="setSlideshowTime(10, 0)">&nbsp;10&nbsp;min&nbsp;&nbsp;</button>
                    <button class="button" :class="{'is-info': slideshowTime.minutes == 30}" @click="setSlideshowTime(30, 0)">&nbsp;30&nbsp;min&nbsp;&nbsp;</button>
                </div>
                <!-- 我并不太喜欢大部分的图片阅览工具，所以我自己做了一个，如果你觉得这个小巧工具对你有帮助，你可以请我喝一杯咖啡，鼓励我继续改进它，非常感谢！-->
                <p>
                    I couldn't find a smart image tool, so I made one in my own time. <br>
                    If you think this is helpful to you, you can <a href=#>buy me a coffee</a> encourage me to continue improving it.Thank you very much!<br>
                    &#128150;&#9749;&#128170;&#128640;
                </p>                
            </section>
        </div>
    </div>    
  </div>
</template>
<script>
/* global Caman */
import path from 'path'
import fs from 'fs'
import { remote, ipcRenderer } from 'electron'
// import VueCropper from 'vue-cropperjs'
// import 'cropperjs/dist/cropper.css'
// import Viewer from 'viewerjs'
// import 'viewerjs/dist/viewer.css'
// import 'viewerjs/dist/viewer.css'
import '@/assets/css/MainPage.css'

// const Caman = require('caman').Caman
// import Caman from 'caman/dist/caman.js'
// const Caman = require('caman/dist/caman.js').Caman
let delay = new Date()
export default {
  name: 'main-page',
  components: {},
  data () {
    return {
      currentImgPath: 'F:/repositories/workspaces/image_processor/static/images/5.jpg',
      shadowImgPath: '',
      currentImgIndex: 4,
      imgExt: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'tif', 'tiff'],
      imgPathInDir: ['F:/repositories/workspaces/image_processor/static/images/1.jpg',
        'F:/repositories/workspaces/image_processor/static/images/2.jpg',
        'F:/repositories/workspaces/image_processor/static/images/3.jpg',
        'F:/repositories/workspaces/image_processor/static/images/4.jpg',
        'F:/repositories/workspaces/image_processor/static/images/5.jpg'],
      showNavLeft: false,
      showNavRight: false,
      showImg: true,
      showImgShadow: false,
      showActionBar: true,
      showSetting: false,
      isMouseDown: false,
      isImgFade: false,
      isImgShadowFade: false,
      moveable: false,
      transform: {
        scaleX: 1,
        scaleY: 1,
        translateX: 0,
        translateY: 0,
        originX: 0,
        originY: 0,
        padX: 0,
        padY: 0,
        cursor: 'default'
      },
      shadowTransform: {},
      isSlideshow: false,
      slideshowInterval: null,
      slideshowTime: {minutes: 0, seconds: 5}
    }
  },
  // created () {
  //   this.loadScript('caman/dist/caman.full.min.js', () => {
  //     console.log('caman is ok !')
  //   })
  // },
  computed: {
    imageTransforms: function () {
      return this.getTransformsCss(this.transform)
    }
  },
  mounted () {
    document.addEventListener('drop', (e) => {
      e.preventDefault()
      // e.stopPropagation()
      for (const f of e.dataTransfer.files) {
        this.setCurrentFile(f.path)
      }
    })
    document.addEventListener('dragover', (e) => {
      e.preventDefault()
      e.stopPropagation()
    })
    document.addEventListener('dragstart', (e) => {
      e.preventDefault()
      e.stopPropagation()
    })
    // let recaptchaScript = document.createElement('script')
    // recaptchaScript.setAttribute('src', 'node_modules/caman/dist/caman.full.min.js')
    // document.head.appendChild(recaptchaScript)
  },
  methods: {
    openFile () {
      let openImgPath = remote.dialog.showOpenDialogSync({
        title: 'Open File',
        filters: [{ name: 'Images', extensions: this.imgExt }],
        properties: ['openFile']
      })
      if (openImgPath != null && openImgPath.length > 0) {
        this.setCurrentFile(openImgPath[0])
        this.stopSlideshow()
      }
    },
    getTransformsCss (t) {
      return {
        transform: `scale(${t.scaleX}, ${t.scaleY}) translate(${t.translateX}px, ${t.translateY}px)`,
        transformOrigin: `${t.originX}px ${t.originY}px`,
        cursor: t.cursor
      }
    },
    resetImage () {
      this.moveable = false
      this.transform = {
        scaleX: 1,
        scaleY: 1,
        translateX: 0,
        translateY: 0,
        originX: 0,
        originY: 0,
        padX: 0,
        padY: 0,
        mouseX: 0,
        mouseY: 0,
        cursor: 'default'
      }
    },
    setCurrentFile (filePath) {
      if (this.imgExt.indexOf(path.extname(filePath).toLowerCase().substr(1)) !== -1) {
        this.currentImgPath = filePath
        this.imgPathInDir = []
        this.resetImage()
      } else {
        return
      }

      let dir = path.dirname(filePath)
      fs.readdir(dir, (err, files) => {
        if (err) throw err
        const targetFiles = files.filter(file => {
          return this.imgExt.indexOf(path.extname(file).toLowerCase().substr(1)) !== -1
        })
        targetFiles.forEach((fileName, index) => {
          let imgPath = path.join(dir, fileName)
          this.imgPathInDir.push(imgPath)
          if (this.currentImgPath === imgPath) {
            this.currentImgIndex = index
          }
        })
      })
    },
    onNavLeftClick () {
      this.preImage()
      this.stopSlideshow()
      let fsSave = this.saveCallback
      Caman('#image-test', function () {
        this.brightness(30)
        this.render(function () {
          fsSave(document.getElementById('image-test'), './output.jpg')
        })
      })
    },
    onNavRightClick () {
      this.nextImage()
      this.stopSlideshow()
    },
    preImage () {
      if (this.imgPathInDir.length > 0) {
        if (this.showImg) {
          console.log('2 set shadow path')
          this.shadowTransform = this.getTransformsCss(this.transform)
          this.showImgShadow = true
          this.isImgShadowFade = false
          this.shadowImgPath = this.currentImgPath

          this.currentImgIndex -= 1
          if (this.currentImgIndex < 0) {
            this.currentImgIndex = this.imgPathInDir.length - 1
          }
          this.showImg = false
          this.isImgFade = false
          this.currentImgPath = this.imgPathInDir[this.currentImgIndex]
        }
      }
    },
    nextImage () {
      this.debugLog('0 nextImage start')
      if (this.imgPathInDir.length > 0) {
        // this.isImgFade = false
        this.debugLog('1')
        // if (!this.showImgShadow) {
        if (this.showImg) {
          this.debugLog('2 set shadow path')
          this.shadowTransform = this.getTransformsCss(this.transform)
          this.showImgShadow = true
          this.isImgShadowFade = false
          this.shadowImgPath = this.currentImgPath

          this.currentImgIndex += 1
          if (this.currentImgIndex >= this.imgPathInDir.length) {
            this.currentImgIndex = 0
          }
          this.showImg = false
          this.isImgFade = false
          this.currentImgPath = this.imgPathInDir[this.currentImgIndex]
          this.debugLog('3 nextImage end')
        }
      }
    },
    toggleFullScreen () {
      ipcRenderer.send('toggleFullScreen')
    },
    onImgLoaded: function () {
      this.debugLog('10 image load')
      this.showImg = true
      setTimeout(() => {
        this.isImgFade = true
        // this.isImgShadowFade = true
        this.debugLog('13 image fade')
      }, 50)
      this.debugLog('11')
      setTimeout(() => {
        // this.isImgFade = true
        this.debugLog('14 image shadow fade start')
        if (!this.isSlideshow) {
          this.resetImage()
        }
        this.isImgShadowFade = true
        this.debugLog('15 image shadow fade end')
      }, 100)
      this.debugLog('12')
    },
    transitionendImg: function () {
      this.debugLog('30 img transitionend')
    },
    transitionend: function () {
      this.debugLog('20 transitionend')
      this.showImgShadow = false
      this.isImgShadowFade = false
      this.debugLog('21 end')
    },
    onWheel: function (e) {
      e.preventDefault()
      e.stopPropagation()

      if (this.isSlideshow) {
        return
      }
      // Calculate the offset after resetting the origin
      this.transform.padX = (this.transform.scaleX - 1) / this.transform.scaleX * (e.x - this.transform.originX)
      this.transform.padY = (this.transform.scaleY - 1) / this.transform.scaleY * (e.y - this.transform.originY)

      this.transform.translateX += this.transform.padX
      this.transform.translateY += this.transform.padY

      this.transform.originX = e.x
      this.transform.originY = e.y

      let deltaY = Math.abs(e.deltaY) > 200 ? e.deltaY / Math.abs(e.deltaY) * 200 : e.deltaY
      let scale = (0.0007 * deltaY).toFixed(4)
      let scaleX = this.transform.scaleX - scale
      let scaleY = this.transform.scaleY - scale

      // limit scale size from 15 to 0.1
      if (scaleX < 15 && scaleX >= 0.1 && scaleY < 15 && scaleY >= 0.1) {
        this.transform.scaleX = scaleX
        this.transform.scaleY = scaleY
      }
      if (!this.moveable && scaleX > 1) {
        this.moveable = true
      }
    },
    onMouseDown: function (e) {
      e.preventDefault()
      e.stopPropagation()
      this.isMouseDown = true
      this.transform.mouseX = e.x
      this.transform.mouseY = e.y
    },
    onMouseUp: function (e) {
      e.preventDefault()
      e.stopPropagation()
      this.isMouseDown = false
    },
    onMouseOut: function (e) {
      e.preventDefault()
      e.stopPropagation()
      this.isMouseDown = false
    },
    onMouseMove: function (e) {
      e.preventDefault()
      e.stopPropagation()

      // Set image transform
      if (this.isMouseDown && this.moveable && !this.isSlideshow) {
        this.transform.translateX -= (this.transform.mouseX - e.x) / this.transform.scaleX
        this.transform.translateY -= (this.transform.mouseY - e.y) / this.transform.scaleY

        this.transform.mouseX = e.x
        this.transform.mouseY = e.y
      }

      // Set action bar to display on/off
      let actionBarHeight = 60
      // console.log(e.x, e.y, window.innerHeight - actionBarHeight - 100)
      if (e.y > window.innerHeight - 10 || e.y < (window.innerHeight - actionBarHeight - 50)) {
        if (this.showActionBar) {
          this.showActionBar = false
        }
      } else {
        this.showActionBar = true
      }

      // Set left navigate box to display on/off
      let navBoxWidth = window.innerWidth * 0.075
      // console.log(e.x, navBoxWidth + 50)
      if (e.x < (navBoxWidth + 20)) {
        this.showNavLeft = true
      } else {
        if (this.showNavLeft) {
          this.showNavLeft = false
        }
      }
      // Set right navigate box to display on/off
      // console.log(e.x, navBoxWidth + 50)
      if (e.x > (window.innerWidth - navBoxWidth - 20)) {
        this.showNavRight = true
      } else {
        if (this.showNavRight) {
          this.showNavRight = false
        }
      }
    },
    onDbClick: function (e) {
      this.toggleFullScreen()
      //   clearInterval(this.isSlideshow)
      //   this.isSlideshow = setInterval(() => {
      //     this.nextImage()
      //   }, 2000)
    },
    doSlideshow: function (e) {
      this.isSlideshow = true
      this.showActionBar = false
      this.transform.cursor = 'none'
      let t = (this.slideshowTime.minutes * 60 + this.slideshowTime.seconds) * 1000
      this.slideshowInterval = setInterval(() => {
        this.nextImage()
      }, t)
    },
    stopSlideshow: function (e) {
      if (this.isSlideshow) {
        this.isSlideshow = false
        this.transform.cursor = 'default'
        clearInterval(this.slideshowInterval)
      }
    },
    setSlideshowTime: function (min, sec) {
      this.slideshowTime.minutes = min
      this.slideshowTime.seconds = sec
    },
    saveCallback: async function (canvas, filePath) {
      // Get the DataUrl from the Canvas
    //   const url = canvas.toDataURL('image/jpg', 0.8)
    //   // remove Base64 stuff from the Image
    //   const base64Data = url.replace(/^data:image\/png;base64,/, '')
    //   fs.writeFile(filePath, base64Data, 'base64', function (err) {
    //     console.log(err)
    //   })

      // const blob = new Promise((resolve) => canvas.toBlob(blob => resolve(blob), 'image/jpg', 0.8))
      canvas.toBlob(async function (blob) {
        const buffer = Buffer.from(await blob.arrayBuffer())
        fs.writeFile(filePath, buffer, 'binary', function (err) {
          console.log(err)
        })
      }, 'image/jpeg', 0.8)
    },
    debugLog: (key) => {
      console.log(key, (new Date()) - delay)
      // delay = new Date()
    }
  }
}
</script>
<style>
</style>
