<template>
	<view>
		<view>
			<view class="block__title">充电桩</view>
			<view class="cu-form-group">
				<view class="title">名称</view>
				{{machine.machineName}}
			</view>
			<view class="cu-form-group">
				<view class="title">设备编号</view>
				{{machine.machineCode}}
			</view>
			<view class="cu-form-group" >
				<view class="title">厂家</view>
				{{machine.factoryName}}
			</view>
			<view class="cu-form-group" >
				<view class="title">充电规则</view>
				{{machine.ruleName}}
			</view>
			<view class="cu-form-group" >
				<view class="title">充电类型</view>
				{{machine.chargeTypeName}}
			</view>
			<view class="cu-form-group" >
				<view class="title">状态</view>
				{{machine.stateName}}
			</view>
			<view class="cu-form-group" v-if="machine.monitorId">
				<view class="title">监控</view>
				<view><button @click="_toPlayMonitorVideo()" class="cu-btn  line-blue round q-input">观看</button></view>
			</view>
			<scroll-view scroll-x class="bg-white nav margin-top">
				<view class="flex text-center">
					<view class="cu-item flex-sub" :class="active==0?'text-green cur':''" @tap="tabSelect(0)">
						订单
					</view>
					<view class="cu-item flex-sub" :class="active==1?'text-green cur':''" @tap="tabSelect(1)">
						插座
					</view>
				</view>
			</scroll-view>
			
			<view v-show="active == 0" class="margin-top-xs">
				<view class="bg-white margin-bottom padding-sm margin-sm radius-sm" v-for="(item,index) in orders"
					:key="index">
					<view class="apply-title flex justify-between">
						<view>
							<text class="text-bold">{{item.personName}}/{{item.personTel}}</text>
						</view>
						<view class="flex justify-start">
							{{item.orderId}}
						</view>
					</view>
					<view class="apply-content flex justify-start flex-wrap">
						<view class="item">
							<text>充电桩:</text>
							<text>{{item.machineName}}>{{item.machineCode}}</text>
						</view>
						<view class="item">
							<text>插座:</text>
							<text>{{item.portCode}}</text>
						</view>
						<view class="item">
							<text>充电小时:</text>
							<text>{{item.chargeHours}}</text>
						</view>
						<view class="item">
							<text>小时电价:</text>
							<text>{{item.durationPrice}}</text>
						</view>
						<view class="item">
							<text>充电量:</text>
							<text>{{item.energy}}</text>
						</view>
						<view class="item">
							<text>扣款金额:</text>
							<text>{{item.amount}}</text>
						</view>
						<view class="item">
							<text>开始时间:</text>
							<text>{{item.startTime}}</text>
						</view>
						<view class="item">
							<text>结束时间:</text>
							<text>{{item.endTime}}</text>
						</view>
						<view class="item">
							<text>状态:</text>
							<text>{{item.stateName}}</text>
						</view>
						<view class="item">
							<text>备注:</text>
							<text>{{item.remark}}</text>
						</view>
					</view>
				</view>
			</view>
			<view v-show="active == 1" class="margin-top-xs">
				<view class="bg-white margin-bottom padding-sm margin-sm radius-sm" v-for="(item,index) in ports"
					:key="index">
					<view class="apply-title flex justify-between">
						<view>
							<text class="text-bold">{{item.portName}}</text>
						</view>
						<view class="flex justify-start">
							{{item.portId}}
						</view>
					</view>
					<view class="apply-content flex justify-start flex-wrap">
						<view class="item">
							<text>编号:</text>
							<text>{{item.portCode}}</text>
						</view>
						<view class="item">
							<text>状态:</text>
							<text>{{item.stateName}}</text>
						</view>
						
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
	
	import oweFee from '../../components/fee/owe-fee.vue';
	import feeDetail from '../../components/fee/fee-detail.vue';
	export default {
		data() {
			return {
				machineId: '',
				machine: {},
				active:0,
				orders:[],
				ports:[],
			}
		},
		components:{
			oweFee,
			feeDetail
		},
		onLoad(options) {
			this.machineId = options.machineId;
			this._loadMachines();
		},
		methods: {
			/**
			 * 查询房屋信息
			 */
			_loadMachines: function() {
				let _that = this;
				getIotOpenApi(this, {
					page: 1,
					row: 1,
					communityId: getCommunityId(),
					machineId: this.machineId,
					iotApiCode: 'listChargeMachineBmoImpl'
				}).then(_data => {
					_that.machine = _data.data[0];
				})
			},
			tabSelect:function(_active){
				this.active = _active;
				if(this.active == 0){
					this._loadChargeMachineOrder();
					return;
				}
				if(this.active == 1){
					//listChargeMachinePortBmoImpl
					this._loadChargeMachinePort();
					return;
				}
			},
			_toPlayMonitorVideo:function(){
				let _machine = this.machine;
				uni.navigateTo({
					url:'/pages/video/playVideo?communityId='+_machine.communityId+"&machineId="+_machine.monitorId+"&machineName="+_machine.monitorName
				})
			},
			_loadChargeMachineOrder:function(){
				let _that =this;
				getIotOpenApi(this,{
					machineId:this.machineId,
					communityId:getCommunityId(),
					page:1,
					row:100,
					iotApiCode:'listChargeMachineOrderBmoImpl'
				}).then(_data=>{
					_that.orders = _data.data;
				})
			},
			_loadChargeMachinePort:function(){
				let _that =this;
				getIotOpenApi(this,{
					machineId:this.machineId,
					communityId:getCommunityId(),
					page:1,
					row:100,
					iotApiCode:'listChargeMachinePortBmoImpl'
				}).then(_data=>{
					_that.ports = _data.data;
				})
			},
		}
	}
</script>

<style lang="scss">
	.block__title {
		margin: 0;
		font-weight: 400;
		font-size: 14px;
		color: rgba(69, 90, 100, .6);
		padding: 40rpx 30rpx 20rpx;
	}

	.button_up_blank {
		height: 40rpx;
	}

	.cu-list.menu-avatar>.cu-item .content-left {
		left: 30upx;
	}

	.cu-list+.cu-list {
		margin-top: 20upx;
	}

	.cu-btn.lgplus {
		padding: 0 20px;
		font-size: 18px;
		height: 100upx;

	}

	.cu-btn.sharp {
		border-radius: 0upx;
	}

	.line-height {
		line-height: 100upx;
	}

	.sub-info {
		background-color: #fff;
		//margin-top: 0.5upx;
		padding: 15upx;

		.sub-info-item {
			width: 45%;
			margin: 10upx 15upx 0upx 15upx;
		}
	}
	.apply-title {
		height: 60upx;
		line-height: 50upx;
		border-bottom: 1upx solid #F1F1F1;
	}
	
	.apply-content {
		.item {
			width: 50%;
			margin-top: 20upx;
		}
	}
	
	.radius-sm {
		border-radius: 16upx;
	}
</style>
