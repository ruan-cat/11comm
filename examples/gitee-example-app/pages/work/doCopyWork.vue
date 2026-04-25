<template>
	<view>
		<view class="cu-form-group">
			<view class="title">题目</view>
			<view>{{workName}}</view>
		</view>
		<view class="cu-form-group">
			<view class="title">提交人</view>
			<view>{{createUserName}}</view>
		</view>
		<view class="margin-top">
			<radio-group class="block" @change="radioChange($event)">
				<view class="cu-form-group" v-for="(valueItem,valueIndex) in items" :key="valueIndex">
					<view class="title-1">
						<view>{{valueItem.content}}({{valueItem.staffName || '-'}})</view>
						<view>{{valueItem.createTime}}</view>
					</view>
					<radio :class="itemId==valueItem.itemId?'checked':''" v-if="valueItem.state == 'C'"
						:checked="itemId==valueItem.itemId?true:false" :value="valueItem.itemId">
					</radio>
					<view v-else-if="valueItem.state == 'W'">未办理</view>
					<view v-else>已处理</view>
				</view>
			</radio-group>
		</view>
		<view class="margin-top-xs" v-if="itemId">
			<view class="cu-form-group">
				<view class="title">处理人</view>
				<view>{{item.staffName}}</view>
			</view>
			<view class="cu-form-group">
				<view class="title">说明</view>
				<view>{{item.remark}}</view>
			</view>
			<view class="cu-form-group">
				<view class="title">完成时间</view>
				<view>{{item.finishTime}}</view>
			</view>
			<view class="cu-form-group" v-if="item.pathUrls && item.pathUrls.length>0">
				<view class="title">附件</view>
				<view v-if="item.pathUrls[0].endsWith('jpg') ||item.pathUrls[0].endsWith('png')"
					class="flex justify-start">
					<view class="" v-for="(url,index) in item.pathUrls" :key="index">
						<image class="file-image"  :data-url="url" :src="url" @tap="viewImage(url)"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="margin-top" v-if="itemId">
			<view class="cu-form-group ">
				<view class="title">评分</view>
				<picker mode="selector" :range="scores" @change="onNumberChange">
					<view class="picker">
						{{ score }}分
					</view>
				</picker>
			</view>
			<view class="cu-form-group ">
				<view class="title">扣款金额</view>
				<input v-model="deductionMoney" type="number" class="text-right" placeholder="请输入扣款金额"></input>
			</view>
			<view class="cu-form-group ">
				<textarea v-model="deductionReason" placeholder="必填,请输入内容"></textarea>
			</view>

			<view class="flex flex-direction margin-top-lg">
				<button class="cu-btn bg-blue margin-tb-sm lg" @click="submitWorkOrder">提交</button>
			</view>
		</view>
		<view-image ref="viewImageRef"></view-image>
	</view>
</template>

<script>
	import {
		finishWorkCopy,
		getWorkTaskItem,
		getWorkPool,
		getTaskWork
	} from '../../api/oa/workApi.js';
	import viewImage from '@/components/view-image/view-image.vue';
	export default {
		data() {
			return {
				deductionReason: '',
				copyId: '',
				workId: '',
				workName: '',
				itemId: '',
				createUserName: '',
				items: [],
				deductionMoney: 0,
				scores: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
				score: 10,
				item: {
					staffName: '',
					remark: '',
					finishTime: '',
					pathUrls: []
				}

			}
		},
		onLoad(options) {
			this.copyId = options.copyId;
			this.workId = options.workId;
			this._loadWorkTask();
			this._loadWorkTaskItem();
		},
		components:{
			viewImage
		},
		methods: {
			_loadWorkTask: function() {
				let _that = this;
				getWorkPool(this, {
					page: 1,
					row: 1,
					workId: this.workId,
				}).then(_data => {
					_that.workName = _data.data[0].workName;
					_that.createUserName = _data.data[0].createUserName;
				});
			},
			_loadWorkTaskItem: function() {
				let _that = this;
				getWorkTaskItem(this, {
					page: 1,
					row: 100,
					workId: this.workId,
					states: 'W,C'
				}).then(_data => {
					_that.items = _data.data;
				});
			},
			submitWorkOrder: function() {
				finishWorkCopy(this, {
					copyId: this.copyId,
					deductionReason: this.deductionReason,
					itemId: this.itemId,
					deductionMoney: this.deductionMoney,
					score: this.score,
				}).then(_data => {
					uni.navigateBack();
				})
			},
			radioChange: function(e) {
				this.itemId = e.detail.value;
				let _that = this;
				this.items.forEach(i => {
					if (_that.itemId == i.itemId) {
						_that.item = i;
					}
				})
			},
			onNumberChange(e) {
				const index = e.detail.value;
				this.score = this.scores[index];
			},
			viewImage:function(_url){
				this.$refs.viewImageRef.showThis(_url);
			}
		}
	}
</script>

<style>
	.title-1 {
		text-align: justify;
		padding-right: 30rpx;
		font-size: 30rpx;
		position: relative;

		line-height: 60rpx;
	}
	.file-image{
		width: 120upx; height: 120upx;border-radius: 10upx;
		margin-left: 10upx;
	}
</style>