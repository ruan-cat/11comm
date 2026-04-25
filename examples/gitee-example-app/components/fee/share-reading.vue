<template>
	<view>

		<view class="cu-form-group margin-top">
			<view class="title">楼栋公摊表</view>
			<picker :value="floorMaterIndex" :range="floorMaters" range-key="name" @change="floorMaterChange">
				<view class="picker">
					{{floorMaters[floorMaterIndex].name}}
				</view>
			</picker>
		</view>

		<view class="margin-top" v-if="readings.length > 0">
			<view class="bg-white margin-bottom padding-sm margin-sm radius-sm" v-for="(reading,index) in readings"
				:key="index">
				<view class="apply-title flex justify-between">
					<view>
						<text class="text-bold">{{reading.title}}({{(reading.curDegrees-reading.preDegrees)}}度)</text>
					</view>
					<view class="flex justify-start">
						<button class="cu-btn round sm line-red margin-left-sm" v-if="reading.state == 'W' && hasAudit"
							@tap="_toAuditShareReading(reading)">审核</button>
						<button class="cu-btn round sm line-red margin-left-sm" v-if="reading.state == 'W'"
							@tap="_deleteReading(reading)">删除</button>
					</view>
				</view>
				<view class="apply-content flex justify-start flex-wrap">
					<view class="item-half">
						<text>上期度数:</text>
						<text class="margin-left-sm">{{reading.preDegrees}}</text>
					</view>
					<view class="item-half">
						<text>本期度数:</text>
						<text class="margin-left-sm">{{reading.curDegrees}}</text>
					</view>
					<view class="item-half">
						<text>上期时间:</text>
						<text class="margin-left-sm">{{reading.preReadingTime}}</text>
					</view>
					<view class="item-half">
						<text>本期时间:</text>
						<text class="margin-left-sm">{{reading.curReadingTime}}</text>
					</view>
					<view class="item-half">
						<text>抄表人:</text>
						<text class="margin-left-sm">{{reading.createStaffName || '-'}}</text>
					</view>
					<view class="item-half">
						<text>审核人:</text>
						<text class="margin-left-sm">{{reading.auditStaffName || '-'}}</text>
					</view>
					<view class="item-half">
						<text>状态:</text>
						<text class="margin-left-sm" v-if="reading.state == 'W'">待审核</text>
						<text class="margin-left-sm" v-else-if="reading.state == 'C'">审核通过</text>
						<text class="margin-left-sm" v-else>审核不通过</text>
					</view>
					<view class="item">
						<text>创建时间:</text>
						<text class="margin-left-sm">{{reading.createTime}}</text>
					</view>
					<view class="item" v-if="reading.remark">
						<text>说明:</text>
						<text class="margin-left-sm">{{reading.remark}}</text>
					</view>
					<view class="item" v-if="reading.stateMsg">
						<text>审核意见:</text>
						<text class="margin-left-sm">{{reading.stateMsg}}</text>
					</view>
					<view class="item" v-if="reading.shareMsg">
						<text>公摊进度:</text>
						<text class="margin-left-sm">{{reading.shareMsg}}</text>
					</view>

				</view>
			</view>
		</view>
		<view v-else>
			<no-data-page></no-data-page>
		</view>
		<view class="cu-modal" :class="delShareReadFlag==true?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">温馨提示</view>
					<view class="action" @tap="_cancleCall()">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					您确认删除抄表记录？
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action margin-0 flex-sub  solid-left" @tap="_cancleDelete()">取消</view>
					<view class="action margin-0 flex-sub text-green solid-left" @tap="_doDeleteReading()">确认</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import noDataPage from '../no-data-page/no-data-page.vue';
	import {
		getCommunityId
	} from '@/api/community/community.js'
	import {
		getFloorShareReading,
		getFloorShareMeter,
		deleteFloorShareReading
	} from '@/api/fee/fee.js';
	export default {
		name: "shareReading",
		data() {
			return {
				workNameLike: '',
				staffNameLike: '',
				readings: [],
				floorMaters: [{
					name: '请选择',
					fsmId: ''
				}],
				floorMaterIndex: 0,
				fsmId: '',
				delShareReadFlag:false,
				curRead:{},
				hasAudit:false,
			};
		},
		created() {
			//this._loadFloorShareReading();
		},
		components: {
			noDataPage
		},
		methods: {
			_loadFloorShareReading: function() {
				this.hasAudit = this.java110Context.hasPrivilege('502025032678040006');
				let _that = this;
				getFloorShareReading(this, {
					page: 1,
					row: 100,
					fsmId: this.fsmId,
					communityId: getCommunityId()
				}).then(_data => {
					_that.readings = _data.data;
				});
				this._loadFloorShareMeter();

			},
			_loadFloorShareMeter: function() {
				let _that = this;
				_that.floorMaters = [{
					name: '请选择',
					fsmId: ''
				}];
				getFloorShareMeter(this, {
					page: 1,
					row: 100,
					communityId: getCommunityId()
				}).then(_data => {
					_data.data.forEach(_meter => {
						_that.floorMaters.push({
							name: _meter.floorNum + '栋-' + _meter.meterTypeName,
							fsmId: _meter.fsmId
						});
					});
				});
			},
			_toAuditShareReading: function(_read) {
				uni.navigateTo({
					url: '/pages/meter/auditShareReading?readingId=' + _read.readingId
				})
			},
			floorMaterChange: function(e) {
				this.floorMaterIndex = e.detail.value;
				this.fsmId = this.floorMaters[this.floorMaterIndex].fsmId;
				this._loadFloorShareReading();
			},
			_deleteReading:function(_reading){
				this.delShareReadFlag = true;
				this.curRead = _reading;
			},
			_doDeleteReading:function(){
				let _objData = {
					communityId: getCommunityId(),
					readingId: this.curRead.readingId,
				};
				let _that = this;
				deleteFloorShareReading(this,_objData)
				.then((res) => {
					_that._cancleDelete();
					uni.showToast({
						icon:'none',
						title:res.msg,
						duration:3000
					});
					if(res.code == 0){
						_that._loadFloorShareReading();
					}
				},err=>{
				})
			},
			_cancleDelete:function(){
				this.delShareReadFlag = false;
				this.curRead = {};
			}
		}
	}
</script>

<style lang="scss">
	.q-query {
		background-color: #FFF;
		padding: 15upx;

		.q-item {
			width: 30%;
			margin-right: 15upx;
			padding: 10upx 15upx;
			border-radius: 15upx;
			background-color: #f1f1f1;

			.q-input {
				height: 40upx;
			}

		}

		.q-item-btn {
			width: 30%;
			margin-left: 15upx;

			.q-input {
				height: 60upx;
			}
		}
	}

	.apply-title {
		height: 60upx;
		line-height: 50upx;
		border-bottom: 1upx solid #F1F1F1;
	}

	.apply-content {
		.item-half {
			width: 50%;
			margin-top: 20upx;
		}

		.item {
			width: 100%;
			margin-top: 20upx;
		}

	}

	.radius-sm {
		border-radius: 16upx;
	}
</style>