// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import '@/assets/less/golbal.less'
import '@/assets/less/components.less'

Vue.use(MintUI)

Vue.config.productionTip = false

Vue.prototype.loading = text => {
	Vue.prototype._currentLoading = MintUI.Indicator.open({
		text,
		spinnerType: 'snake'
	})
}
Vue.prototype.loaded = _ => {
	Vue.nextTick(_ => MintUI.Indicator.close())
}
Vue.prototype.$messageBox = MintUI.MessageBox

Vue.prototype.$message = (message, time = message.length / 4 * 1000) => {
  return MintUI.Toast({
    message: message,
    duration: time
  })
}

router.beforeEach((to, from, next) => {
	if (to.path != "/"&&!store.state.userInfo) {
		router.replace({path: '/'})
	} else {
		next()
	}
})

Vue.mixin({
	created() {
		const events = this.socketEvents
		if (events) {
			Object.keys(events).forEach(k => {
				store.state.pomelo.on(k, events[k].bind(this))
			})
		}
	},
	beforeDestroy() {
		const events = this.socketEvents
		if (events) {
			Object.keys(events).forEach(k => {
				store.state.pomelo.removeAllListeners(k)
			})
		}
	}
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})

/*store.state.pomelo.on('disconnect',() => {//断线自动重连
	if(!store.state.connected){return}
	Vue.prototype.loading('连接中...')
	store.dispatch('connect',{
		callback () {
			Vue.prototype.loaded()
		}
	})
})*/