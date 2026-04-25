<template>
	<view>
		<view class="cu-bar bg-white search ">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="输入报修人" v-model="repairName" confirm-type="search"></input>
			</view>
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<picker :value="repairStatesIndex" :range="repairStates" :range-key="'name'" @change="repairStatesChange">
					<view>{{repairStates[repairStatesIndex].name}}</view>
				</picker>
			</view>
			<view class="action">
				<button class="cu-btn bg-gradual-green shadow-blur round" @tap="$preventClick(_searchRepair)">搜索</button>
			</view>
		</view>
		<view class="margin-top" v-if="noData==false">
			<view class="text-df text-gray text-right margin-right-sm">
				共{{totalRecords}}条记录
			</view>
			<view v-for="(item,index) in repairOrders" :key="index" class="bg-white margin-bottom-sm margin-right-sm radius margin-left-sm padding">
				<view class="flex padding-bottom-xs solid-bottom justify-between">
					<view>{{item.repairId}}</view>
					<view class="text-gray">{{item.stateName}}</view>
				</view>
				<view class="flex margin-top justify-between">
					<view class="text-gray">报修类型</view>
					<view class="text-gray">{{item.repairTypeName}}</view>
				</view>
				<view class="flex margin-top-xs justify-between">
					<view class="text-gray">报修人</view>
					<view class="text-gray">{{item.repairName}}({{item.tel}})</view>
				</view>
				<view class="flex margin-top-xs justify-between">
					<view class="text-gray">位置</view>
					<view class="text-gray">{{item.repairObjName}}</view>
				</view>
				<view class="flex margin-top-xs justify-between">
					<view class="text-gray">预约时间</view>
					<view class="text-gray">{{item.appointmentTime }}</view>
				</view>
				<view class="flex margin-top-xs justify-between">
					<view class="text-gray">报修内容</view>
					<view class="text-gray">{{item.context}}</view>
				</view>
				<view class="solid-top flex justify-end margin-top padding-top-sm ">
					<button class="cu-btn sm line-gray" @click="_toRepairDetail(item)">详情</button>
					<view>
						<button class="cu-btn sm bg-orange margin-left" 
						v-if="item.state == 1000 && checkAuth('502019101946430010')" 
						@click="dealRepair(item,'DISPATCH')">派单</button>
						<button class="cu-btn sm bg-red margin-left"
						v-if="item.state != '1700' && item.state != '1800' && item.state != '1900' && checkAuth('502019101946430010')" 
						@click="endRepair(item)">结束</button>
						<button class="cu-btn sm bg-orange margin-left" 
						v-if="item.repairWay == 100 && item.state == 1000 && checkAuth('502021012099350016')" 
						@click="_robOrder(item)">抢单</button>
						
					</view>
				</view>
			</view>
			<uni-load-more :status="loadingStatus" :content-text="loadingContentText" />
		</view>
		<view v-else>
			<no-data-page></no-data-page>
		</view>
	</view>
</template>

<script>
	import noDataPage from '@/components/no-data-page/no-data-page.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import {getCurrentCommunity} from '../../api/community/community.js'
	import {queryDictInfo} from '../../api/repair/repair.js'
	import conf from '../../conf/config.js'
	import url from '../../constant/url.js'
	// 防止多次点击
	import {preventClick} from '../../lib/java110/utils/common.js';
	import Vue from 'vue'
	Vue.prototype.$preventClick = preventClick;
	export default {
		data() {
			return {
				onoff: true,
				orderImg: conf.baseUrl + 'img/order.png',
				repairOrders: [],
				repairName: '',
				noData:false,
				page: 1,
				loadingStatus : 'loading',
				loadingContentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				totalRecords: 0,
				repairStates: [{
					name: '请选择'
				}],
				repairStatesIndex: 0,
				repairState: '',
			}
		},
		components: {
			noDataPage,
			uniLoadMore
		},
		onLoad() {
			this.java110Context.onLoad();
			 this.loadRepairState();
		},
		onShow() {
			let _userInfo = this.java110Context.getUserInfo();
			let _storeId = _userInfo.storeId;
			this.storeId = _storeId;
			this.repairOrders = [];
			this.page = 1;
			this._loadRepairOrders();
		},
		onReachBottom : function(){
			if(this.loadingStatus == 'noMore'){
				return;
			}
			this._loadRepairOrders();
		},
		methods: {
			
			loadRepairState: function(){
				let _that = this;
				let _objData = {
					'name': "r_repair_pool",
					'type': "state",
				};
				queryDictInfo(this,_objData)
				.then(function(res){
					_that.repairStates = _that.repairStates.concat(res);
				})
			},
			
			repairStatesChange: function(e){
				this.repairStatesIndex = e.target.value;
				if (this.repairStatesIndex == 0) {
					this.repairState = '';
					return;
				}
				let selected = this.repairStates[this.repairStatesIndex];
				this.repairState = selected.statusCd;
			},
			
			checkAuth: function(pid){
				return this.java110Context.hasPrivilege(pid);
			},
			
			_loadRepairOrders: function() {
				this.loadingStatus = 'more';
				let _that = this;
				let _userInfo = this.java110Context.getUserInfo();
				let storeId = _userInfo.storeId;
				let _objData = {
					page: _that.page,
					row: 15,
					storeId: storeId,
					userId: _userInfo.userId,
					communityId: getCurrentCommunity().communityId,
					repairName: _that.repairName,
					state: _that.repairState,
					reqSource: 'mobile'
				};
				this.java110Context.request({
					url: url.listOwnerRepairs,
					header: _that.java110Context.getHeaders(),
					method: "GET",
					data: _objData, //动态数据
					success: function(res) {
						let _json = res.data;
						if (_json.code != 0) {
							_that.onoff = true;
							uni.showToast({
								icon: 'none',
								title: _json.msg
							});
							return;
						}
						_that.totalRecords = _json.total;

						let _data = _json.data;
						_data.forEach(function(item) {
							let dateStr = item.appointmentTime;
							let _date = new Date(dateStr.replace(/-/g, "/"));
							item.appointmentTime = (_date.getMonth() + 1) + '-' + _date.getDate();
						});
						_that.repairOrders = _that.repairOrders.concat(_data);
						_that.page ++;

						if(_that.repairOrders.length < 1){
							_that.onoff = true;
							_that.noData = true;
							return ;
						}else{
							_that.noData = false;
						}
						if(_that.repairOrders.length == _json.total){
							_that.onoff = true;
							_that.loadingStatus = 'noMore';
							return;
						}
					},
					fail: function(e) {
						wx.showToast({
							title: "服务器异常了",
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			_searchRepair: function() {
				this.repairOrders = [];
				this.page = 1;
				this._loadRepairOrders();
			},
			_toRepairDetail: function(_item) {
				uni.navigateTo({
					url: "/pages/repairDetail/repairDetail?repairId=" + _item.repairId + '&storeId=' + this.storeId
				});
			},
			
			/**
			 * 抢单
			 * @param {Object} _item
			 */
			_robOrder: function(_item){
				uni.showLoading({
					title: '请稍候...'
				})
				let _that = this;
				let _userInfo = this.java110Context.getUserInfo();
				let _objData = {
					communityId: getCurrentCommunity().communityId,
					repairId: _item.repairId,
					userName: _userInfo.userName
				};
				this.java110Context.request({
					url: url.robRepairOrder,
					header: _that.java110Context.getHeaders(),
					method: "POST",
					data: _objData, //动态数据
					success: function(res) {
						uni.hideLoading();
						wx.showToast({
							title: res.data.msg,
							duration: 2000,
							icon: 'none'
						});
						setTimeout(()=>{
							_that.repairOrders = [];
							_that.page = 1;
							_that._loadRepairOrders();
						},1500)
					},
					fail: function(e) {
						uni.hideLoading();
						wx.showToast({
							title: "服务器异常了",
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			/**
			 * 派单
			 * @param {Object} _item
			 */
			dealRepair: function(item, action){
				uni.navigateTo({
					url: '/pages/repairHandle/repairHandle?action=' +
						action + "&repairId=" + item.repairId +
						"&repairType=" + item.repairType +
						"&preStaffId=" + item.preStaffId +
						"&preStaffName=" + item.preStaffName +
						"&repairObjType=" + item.repairObjType
				});
			},
			endRepair:function(repair){
				uni.navigateTo({
					url: '/pages/repairOrder/repairEnd?repairId=' + repair.repairId +
						"&communityId=" + repair.communityId
				});
			}

		}
	}
</script>

<style lang="scss">
	.cu-list{
		
		border-radius: 10px;
		.cu-item{
			margin:20px
		}
	}
	.cu-list.menu-avatar>.cu-item .content-left {
		left: 30upx;
	}

	.cu-list+.cu-list {
		margin-top: 20upx;
	}
	
	/* 抢单按钮 */
	.rob-order{
		width: 80upx;
		height: 80upx;
		line-height: 80upx;
		border-radius: 50%;
	}
	.record-add{
		position: fixed;
		right: 10rpx;
		bottom: 50rpx;
		width: 100rpx;
		height: 100rpx;
	}
	.record-add img{
		width: 100%;
		height: 100%;
	}
	.ellip{
		  overflow: hidden;
		  text-overflow: ellipsis;
		  white-space: normal;
		  word-break: break-all;
		  display: -webkit-box;
		  -webkit-line-clamp: 2;
		  -webkit-box-orient: vertical;
		  align-content: center;
		  width: 400rpx;
	}
</style>
