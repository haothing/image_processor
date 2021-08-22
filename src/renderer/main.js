import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import 'bulma/css/bulma.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSync, faUndo, faExpand, faExpandArrowsAlt, faCaretLeft, faCaretRight,
  faAngleLeft, faAngleRight, faVideo, faStop, faHeart } from '@fortawesome/free-solid-svg-icons'
import { faFolderOpen, faKissBeam } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// import Vuetify from 'vuetify'
// import 'vuetify/dist/vuetify.min.css'
// vue.use(Vuetify)
import vuetify from '@/plugins/vuetify'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios

library.add(faFolderOpen, faSync, faUndo, faExpandArrowsAlt, faExpand, faCaretLeft, faCaretRight,
  faAngleLeft, faAngleRight, faVideo, faStop, faKissBeam, faHeart)
Vue.component('font-awesome-icon', FontAwesomeIcon)
// Vue.component('v-slider', vSlider)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  vuetify
}).$mount('#app')
