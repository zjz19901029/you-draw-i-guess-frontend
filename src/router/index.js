import Vue from 'vue'
import Router from 'vue-router'
import App from '@/APP'
import noPage from '@/views/no-page'
import index from '@/views/index'
import roomlist from '@/views/roomlist'
import room from '@/views/room/room'
import begin from '@/views/play/begin'
import create from '@/views/room/create'

Vue.use(Router)

export default new Router({
	routes: [{
		path: '/',
		component: App
	}, {
		path: '/no-page/:message',
		name: 'no-page',
		component: noPage
	}, {
		path: '/index',
		name: 'index',
		component: index
	}, {
		path: '/roomlist',
		name: 'roomlist',
		component: roomlist
	}, {
		path: '/room/:id',
		name: 'room',
		component: room
	}, {
		path: '/begin/:id',
		name: 'begin',
		component: begin
	}, {
		path: '/create-room',
		name: 'create-room',
		component: create
	}]
})
