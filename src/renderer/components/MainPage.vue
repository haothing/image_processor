<template>
  <div class="main-content">

    <div class="image-zone">
        <img class="image-content" :src="currentImgPath">
        <!-- <img class="image-content" src="static/images/001.jpg"> -->
    </div>
    <div class='action-bar-container'>
        <div class="action-box action-bar">
            <button class="button is-rounded btn-nav" @click="preImage()">Previous</button>
            <button class="button is-rounded btn-nav" @click="nextImage()">Next</button>
            <button class="button is-link is-light is-rounded btn-fun" @click="openFile()">
                <span class="cus-icon">
                    <font-awesome-icon :icon="['far', 'folder-open']"/>         
                </span>
            </button>
        </div>
    </div>
    <div class="nav-box nav-box-left" v-bind:class="{ navActive: isNavLeft }" 
        @click="preImage()" @mouseover="displayNavLeft()" @mouseout="displayNavLeft()">
    </div>
    <div class="nav-box nav-box-right" v-bind:class="{ navActive: isNavRight }" 
        @click="nextImage()" @mouseover="displayNavRight()"  @mouseout="displayNavRight()">
    </div>
  </div>
</template>
<script>
import path from 'path'
import fs from 'fs'
import { remote } from 'electron'

export default {
  name: 'main-page',
  components: {},
  data () {
    return {
      currentImgPath: 'static/images/2.jpg',
      currentImgIndex: 0,
      imgPathInDir: [],
      imgExt: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'tif', 'tiff'],
      isNavLeft: false,
      isNavRight: false
    }
  },
  mounted () {
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
    setCurrentFile (filePath) {
      if (this.imgExt.indexOf(path.extname(filePath).toLowerCase().substr(1)) !== -1) {
        this.currentImgPath = filePath
        this.imgPathInDir = []
      } else {
        return
      }

      let dir = path.dirname(this.currentImgPath)
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
        this.currentImgIndex -= 1
        if (this.currentImgIndex < 0) this.currentImgIndex = this.imgPathInDir.length - 1
        this.currentImgPath = this.imgPathInDir[this.currentImgIndex]
      }
    },
    nextImage () {
      if (this.imgPathInDir.length > 0) {
        this.currentImgIndex += 1
        if (this.currentImgIndex >= this.imgPathInDir.length) this.currentImgIndex = 0
        this.currentImgPath = this.imgPathInDir[this.currentImgIndex]
      }
      this.x = this.$refs.offsetTop
    },
    displayNavLeft () {
      this.isNavLeft = !this.isNavLeft
    },
    displayNavRight () {
      this.isNavRight = !this.isNavRight
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
}
.action-bar-container {
    position: fixed;
    left: 8px;
    right: 8px;
    bottom: 18px;
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
    width: 50px;
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
    object-fit: scale-down;
    flex: 1 0 0;
}
</style>
