<template>
	<view>
		<view class="padding margin-top">
			<text>订单信息</text>
		</view>
		<view class="cu-list menu">
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-edit text-green"></text>
					<text class="text-grey">投诉编码</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{auditHistoryOrder.complaintId}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-ticket text-green"></text>
					<text class="text-grey">房屋编码</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{auditHistoryOrder.roomName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-footprint text-green"></text>
					<text class="text-grey">类型</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{auditHistoryOrder.typeName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-profile text-green"></text>
					<text class="text-grey">投诉人</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{auditHistoryOrder.complaintName}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-phone text-green"></text>
					<text class="text-grey">投诉电话</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{auditHistoryOrder.tel}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-time text-green"></text>
					<text class="text-grey">投诉时间</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{auditHistoryOrder.createTime}}</text>
				</view>
			</view>
			<view class="cu-item">
				<view class="content padding-tb-sm">
					<view>
						<text class="cuIcon-comment text-blue margin-right-xs"></text>投诉内容
					</view>
					<view class="text-gray text-sm">
						<text class="cuIcon-infofill margin-right-xs"></text>{{auditHistoryOrder.context}}
					</view>
				</view>
			</view>
		</view>

		<view class="cu-timeline margin-top">
			<view class="cu-time">工单</view>
			<view class="cu-item " v-for="(item,index) in audits" :key="index">
				<view class="bg-cyan content" v-if="item.eventType == '1000'">
					<text>{{item.createUserName}} 于</text> {{item.createTime}} 投诉
				</view>
				<view class="bg-cyan content" v-if="item.eventType == '1001'">
					<text>{{item.createUserName}} 于</text> {{item.createTime}}处理
				</view>
				<view class="bg-cyan content" v-if="item.eventType == '1001'">
					<text>处理意见：</text> {{item.remark}}
				</view>
				<view class="bg-cyan content" v-if="item.eventType == '2002'">
					<text>{{item.createUserName}} 于</text> {{item.createTime}}评价
				</view>
				<view class="bg-cyan content" v-if="item.eventType == '2002'">
					<text>评价内容：</text> {{item.remark}}
				</view>
				<view class="bg-cyan content" v-if="item.eventType == '3003'">
					<text>{{item.createUserName}} 于</text> {{item.createTime}}回复
				</view>
				<view class="bg-cyan content" v-if="item.eventType == '3003'">
					<text>回复内容：</text> {{item.remark}}
				</view>
			</view>

		</view>

		<view class="margin-top bg-white padding" v-for="(item,index) in appraise" :key="index">
			<view class="flex justify-between">
				<view>工单评价</view>
				<view> 
					<button class="cu-btn sm bg-green  margin-left" v-if="item.state == 'W'" @click="replyAppraise(item)">回复</button>
				</view>
			</view>
			<view class="margin-top">
				<text>评价内容：</text>
				<text>{{item.context}}</text>
			</view>
			<view class="margin-top">
				<text>评价分数：</text>
				<text>{{item.score}}</text>
			</view>
			<view class="margin-top" v-if="item.state == 'C'">
				<text>回复内容：</text>
				<text>{{item.replyContext}}</text>
			</view>
		</view>
		<view class="cu-modal" :class="viewImage?'show':''">
			<view class="cu-dialog">
				<view class="bg-img" :style="'background-image: url('+ viewImageSrc +');height:800rpx;'">
					<view class="cu-bar justify-end text-white">
						<view class="action" @tap="closeViewImage()">
							<text class="cuIcon-close "></text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getComplaintEvent,
		getComplaintAppraise
	} from '../../api/complaint/complaint.js';
	import {
		getCurrentCommunity
	} from '../../api/community/community.js'
	export default {
		data() {
			return {
				complaintId: '',
				auditHistoryOrder: {},
				audits: [],
				appraise:[],
				srcPath: '',
				viewImage: false,
				viewImageSrc: '',
			}
		},
		onLoad(options) {
			this.java110Context.onLoad();
			let _complaintId = options.complaintId;

			console.log('options', options);
			this.complaintId = _complaintId;
			this.srcPath = this.url.hcBaseUrl;
			
		},
		onShow() {
			this._loadComplaintHistoryOrder();
			this._listWorkflowAuditInfo();
			this._listComplaintAppraise();
		},
		methods: {
			_loadComplaintHistoryOrder: function() {
				//
				this.auditHistoryOrder = wx.getStorageSync("_complaintOrderDetail_" + this.complaintId);

			},
			_listWorkflowAuditInfo: function(_active) {
				let _that = this;
				getComplaintEvent({
					complaintId: _that.complaintId,
					page: 1,
					row: 100,
					communityId: getCurrentCommunity().communityId
				}, this).then(_data => {
					_that.audits = _data.data;
				})
			},
			_listComplaintAppraise:function(){
				let _that = this;
				getComplaintAppraise({
					complaintId: _that.complaintId,
					page: 1,
					row: 100,
					communityId: getCurrentCommunity().communityId
				}, this).then(_data => {
					_that.appraise = _data.data;
				})
			},
			
			preview: function(e) {
				console.log('图片地址', e);
				let _url = e.target.dataset.url;
				this.viewImageSrc = _url;
				this.viewImage = true;
			},
			closeViewImage: function() {
				this.viewImage = false;
			},
			replyAppraise:function(_appraise){
				uni.navigateTo({
					url:'/pages/complaintOrderDetail/replyComplainAppraise?appraiseId='+_appraise.appraiseId+'&communityId='+getCurrentCommunity().communityId
				})
			}
		}
	}
</script>

<style>

</style>