<template>
  <div class="main-content">

    <div class="image-zone">
        <img id="image-content" class="image-content" :src="currentImgPath" @mousewheel="onWheel" :style="imageTransforms">
        <!-- <vue-cropper class="image-content" ref="cropper" :src="currentImgPath" :background="false" :autoCrop="false"/> -->
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

export default {
  name: 'main-page',
  components: {},
  data () {
    return {
      currentImgPath: 'F:/repositories/workspaces/image_processor/static/images/6.jpg',
      currentImgIndex: 0,
      imgExt: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'tif', 'tiff'],
      imgPathInDir: ['F:/repositories/workspaces/image_processor/static/images/1.jpg',
        'F:/repositories/workspaces/image_processor/static/images/2.jpg',
        'F:/repositories/workspaces/image_processor/static/images/3.jpg',
        'F:/repositories/workspaces/image_processor/static/images/4.jpg',
        'F:/repositories/workspaces/image_processor/static/images/5.jpg'],
      isNavLeft: false,
      isNavRight: false,
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
        transform: `scale(${this.transform.scaleX})`,
        transformOrigin: `${this.transform.originX}px ${this.transform.originY}px`
        //  translate(${this.transform.translateX}px)
      }
    }
  },
  created () {
    // this.setCurrentFile('F:/repositories/workspaces/image_processor/static/images/1.jpg')
    // this.$nextTick(() => {
    //   console.log(document.getElementById('images').querySelectorAll('img'))
    //   this.gallery = new Viewer(document.getElementById('images'))
    // })
  },
  mounted () {
    // this.viewer = new Viewer(document.getElementById('image-content'), {
    //   title: false,
    //   inline: true,
    //   movable: false,
    //   button: false,
    //   navbar: false,
    //   fullscreen: true,
    //   transition: false,
    //   loading: false,
    //   toolbar: false,
    //   //   toolbar: {
    //   //     zoomIn: 4,
    //   //     zoomOut: 4,
    //   //     oneToOne: {show: 1, size: 'large'},
    //   //     reset: 4,
    //   //     prev: {show: 1, size: 'small'},
    //   //     play: {show: 1, size: 'large'},
    //   //     next: 1,
    //   //     rotateLeft: 4,
    //   //     rotateRight: 4,
    //   //     flipHorizontal: 4,
    //   //     flipVertical: 4
    //   //   },
    //   view () {
    //     console.log('1:' + new Date())
    //     this.showViewer = false
    //   },
    //   viewed () {
    //     console.log('2:' + new Date())
    //     this.showViewer = true
    //   },
    //   zoomed () {
    //     if (!this.viewer.options.movable) {
    //       this.viewer.options.movable = true
    //     }
    //   }
    // })
    // this.gallery = new Viewer(document.getElementById('images'))
    document.addEventListener('drop', (e) => {
      e.preventDefault()
      e.stopPropagation()
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
      this.setCurrentFile(openImgPath[0])
    },
    resetImage () {
      this.viewer.reset()
    },
    setCurrentFile (filePath) {
      if (this.imgExt.indexOf(path.extname(filePath).toLowerCase().substr(1)) !== -1) {
        this.currentImgPath = filePath
        this.imgPathInDir = []
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
      if (this.imgPathInDir.length > 0) {
        this.currentImgIndex += 1
        if (this.currentImgIndex >= this.imgPathInDir.length) {
          this.currentImgIndex = 0
        }
        this.currentImgPath = this.imgPathInDir[this.currentImgIndex]
        console.log(this.currentImgPath)
        // this.$nextTick(() => {
        //  this.viewer.update()
        // })
        // this.$refs.cropper.replace(this.imgPathInDir[this.currentImgIndex])
      }
    },
    displayNavLeft () {
      this.isNavLeft = !this.isNavLeft
    },
    displayNavRight () {
      this.isNavRight = !this.isNavRight
    },
    onWheel: function (e) {
    //   this.transform.translateX = e.x
    //   this.transform.translateY = e.y
      let w = e.srcElement.naturalWidth
      let h = e.srcElement.naturalHeight
      // let canvasW = e.srcElement.clientWidth
      // let canvasH = e.srcElement.clientHeight

      console.log(this.transform.padX, this.transform.padY)
      this.transform.originX = e.x// + this.transform.padX
      this.transform.originY = e.y// + this.transform.padY

      let scale = 0.001 * e.deltaY
      this.transform.scaleX -= scale
      this.transform.scaleY -= scale

      this.transform.padX = (w * scale)
      this.transform.padY = (h * scale)

      console.log(e.x + ';    ' + e.y + ';    ' + this.transform.scaleX + ';    ' + e.srcElement.naturalWidth)
      e.preventDefault()
      e.stopPropagation()
    }
  }
}
</script>
<style>
html, body {
    height: 100%;
    width: 100%;
    background-color: #000000;
}
.cus-icon {
    color: #000000;
}
::-webkit-scrollbar {
    display: none;
}
.main-content {
    height: 100%;
    width: 100%;
}
.image-zone {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    overflow: hidden;
}
.action-bar-container {
    position: fixed;
    left: 8px;
    right: 8px;
    bottom: 10px;
    text-align: center;
}
.action-bar {
    width: 950px;
    height: 60px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    background: rgba(255,255,255,.2); 
}
.btn-nav {
    width: 160px;
    margin: auto 10px;
}
.btn-fun {
    width: 40px;
    margin: auto 10px;
}
.action-box {
    border-radius: 20px;
    box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
}
.nav-box-right {
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    width: 15%;
    height: 100%;
    background: rgba(255,255,255,.0); 
}
.nav-box-left {
    position: fixed;
    top: 0px;
    left: 0px;
    bottom: 0px;
    width: 15%;
    height: 100%;
    background: rgba(255,255,255,.0); 
}
.navActive {
    background: rgba(255,255,255,.1);
}
.image-content {
    max-height:100%;
    max-width:100%;
    flex: 1 0 0;
    object-fit: scale-down;
}
</style>
