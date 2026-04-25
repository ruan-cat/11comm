<template>
	<view>
		<view class="login-nav flex justify-center align-center">
			<text>
				请登录
			</text>
		</view>
		<scroll-view :scroll-y="true">
			<view class="flex justify-center logo">
				<view class="cu-avatar xl round  lage-avatar logo-lage" :style="'background-image:url('+logoUrl+');'">
				</view>
			</view>
			<view class="margin-top">
				<view class="cu-form-group margin-top">
					<view class="title">用户名</view>
					<input placeholder="请输入用户名" name="input" v-model="username"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">密码</view>
					<input placeholder="请输入密码" type="password" name="input" v-model="password"></input>
				</view>
			</view>

			<view class="padding flex flex-direction">
				<button class="cu-btn bg-blue margin-tb-sm lg" @tap="doLogin()">登录</button>
			</view>
		</scroll-view>

		<view class="cu-modal " :class="showModal?'show':''">
			<view class="cu-dialog">
				<scroll-view scroll-y>
					<view class="cu-list  menu">
						<view class="cu-item" @click="_chooseLoginUser(item)" v-for="(item,index) in loginUsers"
							:key="index">
							<view class="content padding-tb-sm ">
								<view class="text-left">
									<view class="text-cut" style="width:220px">{{item.userName}}</view>
								</view>
								<view class="text-gray text-sm text-left">
									<text>编号：{{item.userId}}</text>
								</view>
								<view class="text-gray text-sm text-left">
									<text>隶属：{{item.storeName}}</text>
								</view>
							</view>
							<view class="action">
								<text class="text-grey text-sm">登陆</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		login,
		reLogin
	} from '../../lib/java110/api/Java110SessionApi.js';
	import java110Config from '@/lib/java110/Java110Config.js';
	import conf from '../../conf/config.js';
	import {
		getCurrentCommunity,
		getCommunity
	} from '../../api/community/community.js';
	import {
		desDecrypt,
		desEncrypt
	} from '@/lib/java110/utils/DesUtil.js';
	import date from '@/lib/java110/utils/date.js'
	import {
		isNull
	} from '../../lib/java110/utils/StringUtil.js'
	import {
		listStaffPrivileges
	} from '../../api/index/index.js'
	import mapping from '../../constant/mapping.js'
	import {
		rejects
	} from 'assert';
	export default {
		data() {
			return {
				logoUrl: '',
				username: '',
				password: '',
				loginUsers: [],
				showModal: false
			}
		},
		onLoad() {
			uni.hideTabBar({
				animation: false
			});
			reLogin();

			this.logoUrl = conf.baseUrl + 'logo.png';

		},
		onBackPress(options) {
			if (options.from === 'navigateBack') {
				return false;
			}
			plus.runtime.quit();
			return true;
		},
		methods: {

			doLogin: function() {
				let _that = this;
				if (this.username == '') {
					uni.showToast({
						icon: 'none',
						title: "用户名不能为空"
					});
					return;
				}

				if (this.password == '') {
					uni.showToast({
						icon: 'none',
						title: "密码不能为空"
					});
					return;
				}
				_that.loginUsers = [];
				login(this.username, this.password)
					.then(res => {
						console.log(res);
						//				
						let _data = res.data;
						_data.forEach(item => {
							if (item.storeTypeCd == '800900000003') {
								_that.loginUsers.push(item);
							}
						})
						if (_that.loginUsers.length <1 ) {
							uni.showToast({
								icon: 'none',
								title: '用户不存在'
							});
							return;
						}
						if (_that.loginUsers.length > 1) {
							_that.showModal = true;
							return;
						}
						_that._chooseLoginUser(_that.loginUsers[0]);

					}, err => {
						rejects(err);
					})
			},
			_chooseLoginUser: function(_tmpUserInfo) {
				_tmpUserInfo['passwd'] = this.password;
				_tmpUserInfo['username'] = this.username;
				let _userInfo = desEncrypt(JSON.stringify(_tmpUserInfo));
				uni.setStorageSync(java110Config.USER_INFO, _userInfo);
				uni.setStorageSync(java110Config.TOKEN, _tmpUserInfo.token);
				let afterOneHourDate = date.addHour(new Date(), 1);
				//let afterOneHourDate = date.addMinutes(new Date(), 1);
				wx.setStorageSync(java110Config.LOGIN_FLAG, {
					sessionKey: _tmpUserInfo.userName,
					expireTime: afterOneHourDate.getTime(),
					createTime: new Date().getTime()
				});
				this._initUserLogin();
			},
			_initUserLogin: function() {
				let _that = this;
				listStaffPrivileges(_that);
				getCommunity(true)
					.then(function(_communitys) {
						if (!_communitys || _communitys.length < 1) {
							uni.showToast({
								icon: 'none',
								title: '员工未分配小区'
							});
							return;
						}
						//随机放一个小区
						let _tmpCommunityInfo = _communitys[0];
						uni.setStorageSync(mapping.CURRENT_COMMUNITY_INFO, JSON.stringify(
							_tmpCommunityInfo));
						uni.reLaunch({
							url: '/pages/index/index'
						})
					})
			}

		}
	}
</script>

<style>
	.logo {
		margin-top: 160upx;
		margin-bottom: 140upx;
	}

	.logo .logo-lage {
		height: 180upx;
		width: 180upx;
	}

	.login-nav {
		background-color: #368CFE;
		height: 120upx;
	}

	.login-nav text {
		color: #FFFFFF;
		font-size: 30upx;
	}
</style>