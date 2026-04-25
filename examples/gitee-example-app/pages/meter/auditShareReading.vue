<template>
	<view>

		<view class="cu-form-group margin-top">
			<view class="title">审核</view>
			<picker :value="stateIndex" :range="states" range-key="stateName" @change="stateChange">
				<view class="picker">
					{{stateIndex == -1?'请选择审核':states[stateIndex].stateName}}
				</view>
			</picker>
		</view>

		<view class="cu-form-group margin-top-xs">
			<textarea v-model="auditRemark" placeholder="请填写说明"></textarea>
		</view>

		<view class="flex flex-direction margin-top-lg">
			<button class="cu-btn bg-blue margin-tb-sm lg" @click="submitAudit">提交</button>
		</view>

	</view>
</template>

<script>
	import {
		auditFloorShareReading
	} from '@/api/fee/fee.js';
	import {getCommunityId} from '@/api/community/community.js'
	export default {
		data() {
			return {
				states: [{
					stateName: '同意',
					value: 'C'
				}, {
					stateName: '拒绝',
					value: 'F'
				}],
				stateIndex: -1,
				state: '',
				auditRemark: '',
				readingId: '',
			}
		},
		components: {},
		onLoad(options) {
			this.readingId = options.readingId;
		},
		methods: {
			stateChange: function(e) {
				this.stateIndex = e.detail.value;
				this.state = this.states[this.stateIndex].value;
			},
			submitAudit: function() {
				uni.showLoading({
					title:'正在提交'
				});
				auditFloorShareReading(this, {
					state: this.state,
					auditRemark: this.auditRemark,
					readingId: this.readingId,
					communityId:getCommunityId()
				}).then(_data => {
					uni.hideLoading();
					uni.navigateBack();
				},_err=>{
					uni.hideLoading();
				})
			},
			
		}
	}
</script>

<style lang="scss">
	.centent-btn {
		font-size: 22px;
	}

	.title-1 {
		text-align: justify;
		padding-right: 30rpx;
		font-size: 30rpx;
		position: relative;

		line-height: 60rpx;
	}

	.file-size {
		font-size: 48upx;
	}
</style>