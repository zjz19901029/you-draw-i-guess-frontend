<template>
	<div class="wrap" :class="{show:isShow}">
		<ul>
			<li v-for="player in players" :class="{painting:isCurrentPlayer(player),offline:player.isOffline}">
				<avatar :userInfo="player" :height="20" :width="20" class="avatar"></avatar>
				<p>{{player.name}}</p>
				<div class="score">{{player.score}}</div>
			</li>
		</ul>
		<div class="btn" @click="isShow = !isShow">
			<span></span>
		</div>
	</div>
</template>

<script>
	import avatar from '../../components/userAvatar'
	export default{
		name: "playerList",
		components: { avatar },
		props: ['players','currentPlayer'],
		data () {
			return {
				isShow : false
			}
		},
		methods: {
			isCurrentPlayer (player) {
				return player.uid == this.currentPlayer
			}
		}
	}
</script>

<style lang="less" scoped>
	.wrap{
		position: absolute;
		width: 25px;
		height: 50px;
		z-index: 2;
		transition:all .5s;
		&.show{
			transform:translate(-100px,0);
			.btn{opacity: 1;}
			.btn span{
				transform-origin:15px 50%;
				transform:rotate(180deg);
			}
		}
		.btn{
			width: 100%;
			height: 100%;
			border-radius: 5px 0 0 5px;
			background: rgba(0, 0, 0, 0.4);
			opacity: 0.5;
			span{
				position: absolute;
				top:15px;
				display: block;
				width: 0px;
				height: 0px;
				border:10px #fff solid;
				border-color:transparent #fff transparent transparent;
			}
		}
		ul{
		    position: absolute;
		    width: 100px;
		    height: 240px;
		    right: -100px;
		    top: 50%;
		    transform: translate(0, -50%);
		    background: rgba(0, 0, 0, 0.4);
		    border-radius: 5px 0 0 5px;
		    overflow:hidden;
			li{
					height: 40px;
					position: relative;
			    text-align: left;
	    		padding: 10px 4px;
	    		color:#fff;
	    		font-size: 12px;
	    		border-bottom: 1px #7b7b7b solid;
	    	&.offline{
	    		filter: grayscale(100%);
	    	}
    		&.painting{
    			background: #6b6b6b;
    		}
				p{
					float: left;
			    height: 20px;
			    line-height: 20px;
			    margin-left: 5px;
				}
				.avatar{
					float: left;
				}
				.score{
					position: absolute;
					right: 4px;
					top:0;
					height: 40px;
					line-height: 40px;
				}
			}
		}
	}
</style>