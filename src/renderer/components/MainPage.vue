<template>
  <div class="main-content">
    <div class="image-zone">
        <!-- <transition name="fade">
            <img id="image-content" class="image-content" :class="{'image-content-fade': isImgFade}" v-show="isShowImg" :src="currentImgPath" :style="imageTransforms" 
                @mousewheel="onWheel" @mousedown="onMouseDown" @mouseup="onMouseUp" @mouseout="onMouseOut" @mousemove="onMouseMove" @dblclick="onDbClick"
                @load="onImgLoaded">
        </transition> -->

        <img id="image-content" class="image-content" :class="{'image-content-fade': isImgFade}" 
            v-show="showImg" :src="currentImgPath" :style="imageTransforms" 
            @mousewheel="onWheel" @mousedown="onMouseDown" @mouseup="onMouseUp" @mouseout="onMouseOut" @mousemove="onMouseMove" 
            @dblclick="onDbClick" @load="onImgLoaded">
        <!-- <vue-cropper class="image-content" ref="cropper" :src="currentImgPath" :background="false" :autoCrop="false"/> -->
    </div>
    <div class="image-shadow" v-show="showImgShadow" @transitionend="transitionend">
        <img id="image-shadow" class="image-content-shadow" :class="{'image-content-shadow-fade': isImgShadowFade}" 
            :src="shadowImgPath" :style="shadowTransform">
    </div>
    <!-- <div class="gallery-zone" style="display:none">
        <ul id="images">
            <li v-for="(path, index) in imgPathInDir" :key="index">
                <img class="gallery-content" :src="path">
            </li>
        </ul>
    </div> -->
    <div class='action-bar-container' v-show="showActionBar" ref="$actionBar">
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
        </div>
    </div>
    <div class="nav-box nav-box-left" v-bind:class="{ navActive: showNavLeft }"
        @click="preImage" @mouseover="onMouseMoveNavLeft" @mouseout="onMouseMoveNavLeft">
        <span class="icon">
            <font-awesome-icon :icon="['fas', 'angle-left']" size="6x"/>         
        </span>
    </div>
    <div class="nav-box nav-box-right" v-bind:class="{ navActive: showNavRight }" 
        @click="nextImage" @mouseover="onMouseMoveNavRight"  @mouseout="onMouseMoveNavRight">
        <span class="icon">
            <font-awesome-icon :icon="['fas', 'angle-right']" size="6x"/>         
        </span>
    </div>
  </div>
</template>
<script>
import path from 'path'
import fs from 'fs'
import { remote, ipcRenderer } from 'electron'
// import VueCropper from 'vue-cropperjs'
// import 'cropperjs/dist/cropper.css'
// import Viewer from 'viewerjs'
// import 'viewerjs/dist/viewer.css'
// import 'viewerjs/dist/viewer.css'
import '@/assets/css/MainPage.css'
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
        padY: 0
      },
      shadowTransform: {}
    }
  },
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
      }
    },
    getTransformsCss (t) {
      return {
        transform: `scale(${t.scaleX}, ${t.scaleY}) translate(${t.translateX}px, ${t.translateY}px)`,
        transformOrigin: `${t.originX}px ${t.originY}px`
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
        mouseY: 0
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
    onMouseMoveNavLeft () {
      this.showNavLeft = !this.showNavLeft
    },
    onMouseMoveNavRight () {
      this.showNavRight = !this.showNavRight
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
      }, 10)
      this.debugLog('11')
      setTimeout(() => {
        // this.isImgFade = true
        this.debugLog('14 image shadow fade start')
        this.resetImage()
        this.isImgShadowFade = true
        this.debugLog('15 image shadow fade end')
      }, 10)
      this.debugLog('12')
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
      if (this.isMouseDown && this.moveable) {
        this.transform.translateX -= (this.transform.mouseX - e.x) / this.transform.scaleX
        this.transform.translateY -= (this.transform.mouseY - e.y) / this.transform.scaleY

        this.transform.mouseX = e.x
        this.transform.mouseY = e.y
      }
      let actionBarHeight = this.$refs.$actionBar.clientHeight
      console.log(e.x, e.y, window.innerHeight - actionBarHeight - 40)
      if (e.y < (window.innerHeight - actionBarHeight - 40)) {
        this.showActionBar = false
      } else {
        this.showActionBar = true
      }
    },
    onDbClick: function (e) {
      console.log('db click !!!')
      this.toggleFullScreen()
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
