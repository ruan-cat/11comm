<template>
	<view>
		<view class="q-query flex justify-start flex-wrap">
			<view class="q-item">
				<input type="text" placeholder="输入充电桩名称" v-model="machineNameLike" confirm-type="search"></input>
			</view>
			<view class="q-item-btn text-right">
				<button class="cu-btn  line-blue round q-input" @click="_loadMachines">搜索</button>
			</view>
		</view>
		<view class="index-undo margin-top" v-if="machines && machines.length>0">
			<view class="undo-title">
				<text class="text-bold">充电桩</text>
			</view>
			<view class="cu-list grid " :class="'col-2'">
				<view class="cu-item" @click="_toChargeDetail(item);" v-for="(item,index) in machines" :key="index">
					<view>
						<image :src="item.photoUrl" v-if="item.photoUrl" class="radius-sm" style="width: 90%;height: 200upx;"></image>
						<image src="/static/image/noPhoto.jpg" class="radius-sm" v-else style="width: 90%;height: 200upx;"></image>
					</view>
					<view>
						<text>{{item.machineName}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getIotOpenApi
	} from '../../api/machine/machineApi.js';
	import {
		getCommunityId
	} from '../../api/community/community.js';
	export default {
		data() {
			return {
				machineNameLike: '',
				maId: '',
				machines: [],
			}
		},
		onLoad() {
			this._loadMachines();

		},
		methods: {
			
			_loadMachines: function() {
				let _that = this;
				getIotOpenApi(this, {
					page: 1,
					row: 50,
					communityId: getCommunityId(),
					machineNameLike: this.machineNameLike,
					iotApiCode: 'listChargeMachineBmoImpl'
				}).then(_data => {
					_that.machines = _data.data;
				})
			},
			_toChargeDetail:function(_machine){
				uni.navigateTo({
					url:'/pages/charge/chargeDetail?communityId='+_machine.communityId+"&machineId="+_machine.machineId+"&machineName="+_machine.machineName
				})
			}
		}
	}
</script>

<style lang="scss">
	.q-query {
		background-color: #FFF;
		padding: 15upx;

		.q-item {
			width: 45%;
			margin-left: 15upx;
			padding: 10upx 15upx;
			border-radius: 15upx;
			background-color: #f1f1f1;

			.q-input {
				height: 40upx;
			}

			margin-bottom: 15upx;
		}

		.q-item-btn {
			
			margin-left: 15upx;

			.q-input {
				height: 60upx;
				margin-right: 30upx;
			}
		}
	}

	.apply-title {
		height: 60upx;
		line-height: 50upx;
		border-bottom: 1upx solid #F1F1F1;
	}

	.apply-content {
		.item {
			//width: 50%;
			margin-top: 20upx;

			image {
				width: 180upx;
				height: 180upx;
				border-radius: 10upx;
			}
		}
	}

	.radius-sm {
		border-radius: 16upx;
	}

	.index-undo {
		background-color: #ffffff;

		.undo-title {
			padding: 20upx;
			border-bottom: 1upx solid #F1F1F1;
		}

		.undo-menu {
			padding: 20upx;

			.menu-item {
				width: 33.33%;
				padding: 30upx;
				text-align: center;

				image {
					width: 80upx;
					height: 80upx;
				}

				border-bottom: 1upx solid #F1F1F1;
				border-right: 1upx solid #F1F1F1;
			}

			.menu-item:nth-child(3n+3) {
				border-right: none;
			}

			.menu-item:nth-child(n+4) {
				border-bottom: none;
			}
		}
	}
</style>