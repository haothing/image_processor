<template>
  <div class="main-content">

    <div class="image-zone">
        <img class="image-content" :src="currentImgPath">
        <!-- <img class="image-content" src="static/images/001.jpg"> -->
    </div>
    <div class='action-bar-container'>
        <div class="cus-box action-bar">
            <button class="button is-rounded btn-nav" @click="preImage()">Previous</button>
            <button class="button is-rounded btn-nav" @click="nextImage()">Next</button>
            <button class="button is-link is-light is-rounded btn-fun" @click="openFile()">Open</button>
        </div>
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
      imgExt: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'tif', 'tiff']
    }
  },
  methods: {
    openFile () {
      let openImgPath = remote.dialog.showOpenDialog({
        title: 'Open File',
        filters: [{ name: 'Images', extensions: this.imgExt }],
        properties: ['openFile']
      })

      if (this.imgExt.indexOf(path.extname(openImgPath[0]).toLowerCase().substr(1)) !== -1) {
        this.currentImgPath = openImgPath[0]
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
    }

  }
}
</script>
<style>
html, body {
    height: 100%;
    width: 100%;
    background-color: #f0f0f0;
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
    width: 400px;
    height: 60px;
    display: flex;
    justify-content: center;
    background-color: white;
}
.btn-nav {
    width: 200px;
    margin: auto 10px;
}
.btn-fun {
    margin: auto 10px;
}
.cus-box {
    border-radius: 20px;
    box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
    margin: 0px 6px;
}
.image-content {
    max-height:100%;
    max-width:100%;
    object-fit: scale-down;
    flex: 1 0 0;
}
</style>
