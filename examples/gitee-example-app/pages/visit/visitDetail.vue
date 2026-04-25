<template>
	<view>
		<view class="block__title">基础信息</view>
		<view class="cu-form-group">
			<view class="title">访客</view>
			<view>{{order.name}}({{order.phoneNumber}})</view>
		</view>

		<view class="cu-form-group">
			<view class="title">业主</view>
			<view>{{order.ownerName}}({{order.roomName}})</view>
		</view>
		<view class="cu-form-group">
			<view class="title">状态</view>
			<view>{{order.stateName}}</view>
		</view>
		<view class="cu-form-group">
			<view class="title">车牌号</view>
			<view>{{order.carNum}}</view>
		</view>
		<view class="cu-form-group arrow">
			<view class="title">拜访时间</view>
			<view>{{order.visitTime}}</view>
		</view>
		<view class="cu-form-group arrow">
			<view class="title">离开时间</view>
			<view>{{order.departureTime}}</view>
		</view>
		<view class="cu-form-group arrow">
			<view class="title">访客说明</view>
			<view>{{order.visitCase}}</view>
		</view>
		<!-- 		<view class="cu-form-group arrow">
			<view class="title">访客照片</view>
			<view class="padding-sm">
				<image :src="order.url" style="height: 200upx;width: 200upx;"></image>
			</view>
		</view> -->

		<view v-if="order.state== '0'">
			<view class="block__title">审核</view>
			<view class="cu-form-group">
				<view class="title">状态</view>
				<picker bindchange="PickerChange" :value="stateIndex" :range-key="'name'" :range="states"
					@change="stateChange">
					<view class="picker">
						{{states[stateIndex].name}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">说明</view>
				<input  v-model="audit.msg" placeholder="请说明审核意见" class="text-right"></input>
			</view>
			<view class="flex flex-direction">
				<button class="cu-btn bg-green margin-tb-sm lg" @click="authVisit()">提交</button>
			</view>
		</view>
		<view v-else style="text-align: center;" class="padding">
			<canvas style="width: 280px; height: 280px; margin: 0 auto;" canvas-id="myQrcode" ></canvas>
		</view>
	</view>
</template>

<script>
	import {
		getVisit,
		getVisitRes,
		auditVisit
	} from '@/api/visit/visitApi.js';
	import {
		getCurrentCommunity
	} from '../../api/community/community.js';
	const qrCode = require('@/lib/weapp-qrcode.js');
	export default {
		data() {
			return {
				order: {

				},
				stateIndex: 0,
				states: [{
					name: '请选择',
					state: '0',
				}, {
					name: '同意',
					state: '1',
				}, {
					name: '拒绝',
					state: '2',
				}],
				visitId: '',
				audit: {
					state: '0',
					msg: '',
				},
			}
		},
		onLoad(options) {
			this.visitId = options.visitId;
			this._loadDetail();
			let _that = this;
		},
		methods: {
			_loadDetail: function() {
				let _that = this;
				getVisit(this, {
					page: 1,
					row: 1,
					visitId: this.visitId,
					communityId: getCurrentCommunity().communityId
				}).then(_data => {
					_that.order = _data.data[0];
					if(_that.order.state == '1'){
						new qrCode('myQrcode', {
							text: this.visitId ,
							width: 260,
							height: 260,
							colorDark: "#333333",
							colorLight: "#FFFFFF",
							correctLevel: qrCode.CorrectLevel.L
						});
					}
				})
			},
			stateChange: function(e) {
				this.stateIndex = e.target.value //取其下标
				let selected = this.states[this.stateIndex] //获取选中的数组
				if (!selected) {
					return;
				}
				this.audit.state = selected.state;

			},
			authVisit:function(){
				if(!this.audit.state || !this.audit.msg){
					uni.showToast({
						icon:'none',
						title:'请填写审核信息'
					});
					return;
				}
				
				auditVisit(this,{
					visitId:this.visitId,
					state:this.audit.state,
					msg:this.audit.msg
				}).then(_data=>{
					if(_data.code != 0){
						uni.showToast({
							icon:'none',
							title:_data.msg
						});
						return ;
					}
					uni.navigateBack({
						delta:1
					})
				})
				
				
			}
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
</style>