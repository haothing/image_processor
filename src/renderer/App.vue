<template>
  <div id="app" class="app">
    <v-app>
        <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
  export default {
    name: 'image_processor'
  }
</script>

<style>
.app, #app {
    height: 100%;
    background-color: #000000!important;
}
</style>
