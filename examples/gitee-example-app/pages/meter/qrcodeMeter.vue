<template>
	<view>

		<view class="block__title">上期抄表</view>
		<view class="cu-form-group">
			<view class="title">房屋</view>
			<input placeholder="房屋" 　v-model="roomNum" disabled="true"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">上期度数</view>
			<input placeholder="上期度数" 　v-model="preDegrees"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">抄表时间</view>
			<uni-datetime-picker v-model="preReadingTime" :disabled="true"></uni-datetime-picker>
		</view>
		<view class="block__title">本期抄表</view>
		<view class="cu-form-group">
			<view class="title">本期度数</view>
			<input placeholder="本期度数" 　v-model="curDegrees"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">抄表时间</view>
			<uni-datetime-picker v-model="curReadingTime"></uni-datetime-picker>
		</view>

		<view class="cu-form-group align-start">
			<view class="title">备注</view>
			<textarea maxlength="-1" v-model="remark" placeholder="备注信息"></textarea>
		</view>

		<view class=" flex flex-direction">
			<button class="cu-btn bg-red margin-tb-sm lg" @tap="$preventClick(submitMeter)">提交</button>
		</view>

	</view>
</template>

<script>
	import {
		queryFeeTypesItems,
		queryPreMeterWater,
		saveMeterWater,
		listMeterType
	} from '../../api/meter/meter.js'
	import dateObj from '../../lib/java110/utils/date.js'
	import uniDatetimePicker from '../../components/uni-datetime-picker/uni-datetime-picker.vue'
	import {
		getCurrentCommunity
	} from '../../api/community/community.js'
	// 防止多次点击
	import {
		preventClick
	} from '../../lib/java110/utils/common.js';
	import {
		loadRooms
	} from '../../api/room/room.js';
	import Vue from 'vue'
	Vue.prototype.$preventClick = preventClick;
	export default {
		data() {
			return {
				onoff: true,
				roomNum: '',
				communityId: '',
				objType: '3333',
				preDegrees: 0,
				preReadingTime: null,
				curDegrees: '',
				curReadingTime: null,
				remark: '',
			};
		},
		components: {
			uniDatetimePicker
		},

		onLoad(options) {
			this.configId = options.configId;
			this.meterType = options.meterType;
			this.roomId = options.roomId;
			this.communityId = options.communityId;
			this.java110Context.onLoad();
			this.preReadingTime = dateObj.getCurrentDateTime();
			this.curReadingTime = dateObj.getCurrentDateTime();

			this._queryPreMeterWater();
			this._loadRoom();
		},

		methods: {

			_loadRoom: function() {
				let _that = this;
				loadRooms(this, {
					page: 1,
					row: 1,
					roomId: this.roomId,
					communityId: this.communityId
				}).then(_data => {
					console.log(_data)

					_that.roomNum = _data.data.rooms[0].roomName;
				})
			},

			// 查询上期缴费信息
			_queryPreMeterWater() {
				let _objData = {
					communityId: this.communityId,
					objId: this.roomId,
					objType: this.objType,
					meterType: this.meterType,
				};
				queryPreMeterWater(this, _objData)
					.then((res) => {
						console.log(res);
						if (res.total < 1) {
							this.preDegrees = 0;
							return;
						}
						this.preDegrees = res.data[0].curDegrees;
						this.preReadingTime = res.data[0].curReadingTime;
					})
			},

			submitMeter() {
				if (!this.java110Context.hasPrivilege('502021012558990030')) {
					uni.showToast({
						icon: 'none',
						title: '无权限，联系管理员'
					});
					return;
				}
				let msg = '';
				if (this.roomId == '') {
					msg = "请选择房屋";
				} else if (this.preDegrees === '' || this.preDegrees < 0) {
					msg = "上期度数必填";
				} else if (this.preReadingTime == '' || this.preReadingTime == null) {
					msg = "上期读表时间必填";
				} else if (this.curDegrees === '' || this.curDegrees < 0) {
					msg = "本期度数必填";
				} else if (this.curReadingTime == '' || this.curReadingTime == null) {
					msg = "本期读表时间必填";
				} else if (parseFloat(this.curDegrees) < parseFloat(this.preDegrees)) {
					msg = "本期度数不能小于上期度数";
				} else {
					let start = Date.parse(new Date(this.preReadingTime.replace(/-/g, '/')))
					let end = Date.parse(new Date(this.curReadingTime.replace(/-/g, '/')))
					if (end == 0 || start - end > 0) {
						msg = "本期读表时间有误";
					}
				}

				if (msg != '') {
					uni.showToast({
						title: msg,
						icon: 'none'
					})
					this.onoff = true;
					return;
				}
				let _objData = {
					communityId: this.communityId,
					configId: this.configId,
					curDegrees: this.curDegrees,
					curReadingTime: this.curReadingTime,
					preDegrees: this.preDegrees,
					preReadingTime: this.preReadingTime,
					objId: this.roomId,
					roomId: this.roomId,
					objType: this.objType,
					remark: this.remark,
					meterType: this.meterType
				};
				saveMeterWater(this, _objData)
					.then((res) => {
						uni.showToast({
							title: res.msg,
							duration: 1500
						})
						if (res.code == 0) {
							setTimeout(() => {
								this.onoff = true;
								this.clearAddMeterWaterInfo();
							}, 1500)
						} else {
							this.onoff = true;
						}
					})
			},

			// 清空页面数据
			clearAddMeterWaterInfo() {
				uni.navigateTo({
					url: '/pages/meter/meterReading'
				})
			},
		}
	}
</script>

<style>
	.cu-form-group .title {
		min-width: calc(6em + 15px);
	}

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

	.block__bottom {
		height: 180rpx;
	}
</style>