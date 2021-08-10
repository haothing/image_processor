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
        <img id="image-shadow" class="image-content-shadow" :class="{'image-content-shadow-fade': isImgShadowFade}" :src="shadowImgPath">
    </div>
    <!-- <div class="gallery-zone" style="display:none">
        <ul id="images">
            <li v-for="(path, index) in imgPathInDir" :key="index">
                <img class="gallery-content" :src="path">
            </li>
        </ul>
    </div> -->
    <div class='action-bar-container'>
        <div class="action-box action-bar">
            <button class="button is-rounded btn-nav" @click="preImage">Previous</button>
            <button class="button is-rounded btn-nav" @click="nextImage">Next</button>
            <button class="button is-light is-rounded btn-fun" @click="openFile">
                <span class="cus-icon">
                    <font-awesome-icon :icon="['far', 'folder-open']"/>         
                </span>
            </button>
            <button class="button is-light is-rounded btn-fun" @click="resetImage">
                <span class="cus-icon">
                    <font-awesome-icon :icon="['far', 'folder-open']"/>         
                </span>
            </button>
            <button class="button is-light is-rounded btn-fun" @click="testImage">
                <span class="cus-icon">
                    <font-awesome-icon :icon="['far', 'folder-open']"/>         
                </span>
            </button>
        </div>
    </div>
    <div class="nav-box nav-box-left" v-bind:class="{ navActive: isNavLeft }"
        @click="preImage" @mouseover="displayNavLeft" @mouseout="displayNavLeft">
    </div>
    <div class="nav-box nav-box-right" v-bind:class="{ navActive: isNavRight }" 
        @click="nextImage" @mouseover="displayNavRight"  @mouseout="displayNavRight">
    </div>
  </div>
</template>
<script>
import path from 'path'
import fs from 'fs'
import { remote } from 'electron'
// import VueCropper from 'vue-cropperjs'
// import 'cropperjs/dist/cropper.css'
// import Viewer from 'viewerjs'
// import 'viewerjs/dist/viewer.css'
// import 'viewerjs/dist/viewer.css'
import '@/assets/css/MainPage.css'
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
      isNavLeft: false,
      isNavRight: false,
      isMouseDown: false,
      showImg: true,
      isImgFade: false,
      showImgShadow: false,
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
      }
    }
  },
  computed: {
    imageTransforms: function () {
      return {
        transform: `scale(${this.transform.scaleX}, ${this.transform.scaleY}) translate(${this.transform.translateX}px, ${this.transform.translateY}px)`,
        transformOrigin: `${this.transform.originX}px ${this.transform.originY}px`
      }
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
      let openImgPath = remote.dialog.showOpenDialog({
        title: 'Open File',
        filters: [{ name: 'Images', extensions: this.imgExt }],
        properties: ['openFile']
      })
      if (openImgPath != null && openImgPath.length > 0) {
        this.setCurrentFile(openImgPath[0])
      }
    },
    resetImage () {
      // this.viewer.reset()
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
        // this.$nextTick(() => {
        //   this.viewer.update()
        // })
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
        // this.$nextTick(() => {
        //   this.gallery.destroy()
        //   console.log(document.getElementById('images').querySelectorAll('img').length)
        //   this.gallery = new Viewer(document.getElementById('images'))
        // })
      })
    },
    preImage () {
      if (this.imgPathInDir.length > 0) {
        this.currentImgIndex -= 1
        if (this.currentImgIndex < 0) {
          this.currentImgIndex = this.imgPathInDir.length - 1
        }
        this.currentImgPath = this.imgPathInDir[this.currentImgIndex]
        // this.$nextTick(() => {
        //  this.viewer.update()
        // })
        // this.$refs.cropper.replace(this.imgPathInDir[this.currentImgIndex])
      }
    },
    nextImage () {
      console.log('0 nextImage start')
      if (this.imgPathInDir.length > 0) {
        // this.isImgFade = false
        console.log('1')
        // if (!this.showImgShadow) {
        if (this.showImg) {
          console.log('2 set shadow path')
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
          console.log('3 nextImage end')
          // this.currentImgPath = this.imgPathInDir[this.currentImgIndex]
        }

        // setTimeout(() => { this.isImgShadowFade = true }, 50)
        // this.showImg = false
        // this.isImgFade = false
        // setTimeout(() => {this.showImg = true}, 10)
        // setTimeout(() => {this.isImgFade = true}, 20)
        // this.$refs.cropper.replace(this.imgPathInDir[this.currentImgIndex])
      }
    },
    displayNavLeft () {
      this.isNavLeft = !this.isNavLeft
    },
    displayNavRight () {
      this.isNavRight = !this.isNavRight
    },
    testImage () {
      this.showImg = false
      this.isImgShadowFade = false
      // set shadow element style
      this.shadowImgPath = this.currentImgPath
      this.showImgShadow = true
      // this.isImgShadowFade = true
      setTimeout(() => { this.isImgShadowFade = true }, 10)
    },
    onShadowImgLoaded: function () {
      // this.isImgShadowFade = true
      // setTimeout(() => { this.showImgShadow = false }, 1000)
      console.log('4 shadow loaded')
      if (!this.showImgShadow) {
        console.log('5 shadow display')
        this.showImgShadow = true
        setTimeout(() => {
          console.log('7 shadow set anime')
          this.isImgShadowFade = true
        }, 50)
        console.log('6')
      }
    },
    onImgLoaded: function () {
      console.log('10 image load')
      this.showImg = true
      //   setTimeout(() => {   
      //     this.showImg = true
      //     // this.isImgFade = true
      //     console.log('11 image displayed')
      //   }, 10)
      setTimeout(() => {
        this.isImgFade = true
        this.isImgShadowFade = true
        console.log('12 image fade')
      }, 20)
      //   this.$nextTick(() => {
      //     this.resetImage()
      //   })
    },
    transitionend: function () {
      console.log('20 transitionend')
      this.showImgShadow = false
      this.isImgShadowFade = false
      console.log('21 end')
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
      console.log('scale', deltaY, scale)
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
        // console.log((this.transform.translateX), (this.transform.translateY))
        this.transform.translateX -= (this.transform.mouseX - e.x) / this.transform.scaleX
        this.transform.translateY -= (this.transform.mouseY - e.y) / this.transform.scaleY

        this.transform.mouseX = e.x
        this.transform.mouseY = e.y
      }
    },
    onDbClick: function (e) {
      e.preventDefault()
      e.stopPropagation()
      this.resetImage()
    }
  }
}
</script>
<style>
</style>
