import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import VueForceNextTick from 'vue-force-next-tick'

import 'bulma/css/bulma.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios

library.add(faFolderOpen)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false
Vue.use(VueForceNextTick)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
