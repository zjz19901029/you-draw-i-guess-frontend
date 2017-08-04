<template>
	<img v-if="avatar" :src="avatar" :height="height" :width="width">
	<img v-else src="../assets/img/avatar.jpg" :height="height" :width="width">
</template>
<script>
export default {
	name: 'userAvatar',
	props: {
		userInfo: Object,
		height: {
			type: Number,
			default: 30,
		},
		width: {
			type: Number,
			default: 30,
		}
	},
	computed: {
		avatar () {
			return !!this.userInfo.avatar
		}
	}
}
</script>
<style scoped>
	img{border-radius: 50%;}
</style>