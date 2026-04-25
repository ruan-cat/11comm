<template>
	<view class="cu-modal bottom-modal" :class="showModel?'show':''">
		<view class="cu-dialog">
			<view class="cu-bar bg-white ">
				<view class="action">
					<view class="q-query flex justify-start flex-wrap">
						<view class="q-item">
							<input type="text" class="q-input" placeholder="员工名称" v-model="staffName"></input>
						</view>
						<view class="q-item-btn">
							<button class="cu-btn  line-blue round q-input" @click="_loadStaffList">搜索</button>
						</view>
					</view>
				</view>
				<view class="action">
					<button class="cu-btn  line-red round q-input" @click="cancel">关闭</button>
				</view>
			</view>
			<scroll-view scroll-y style="height: 700upx;" class="bg-white">
				<view class="cu-form-group " v-for="(item,index) in staffs" :key="index">
					<view class="title">{{item.name}}({{item.orgName}})</view>
					<view class="text-right">
						<button class="cu-btn bg-blue margin-tb-sm sm" @click="_chooseStaff(item)">选择</button>
					</view>
				</view>

			</scroll-view>
		</view>

	</view>
</template>

<script>
	import {
		queryStaffListInfo
	} from '../../api/common/common.js';
	import {
		getCommunityId
	} from '../../api/community/community.js'

	export default {
		name: 'selectMutiStaffs',
		data() {
			return {
				showModel: false,
				staffs: [],
				page: 1,
				selectStaffIds: [],
				staffName: ''
			}
		},
		mounted() {
			this._loadStaffList();
		},

		methods: {
			switchShow: function(_staffs) {
				this.showModel = !this.showModel;
			},

			_loadStaffList: function() {
				let _that = this;
				let _data = {
					page: 1,
					row: 100,
					communityId: getCommunityId(),
					staffName: this.staffName
				};
				queryStaffListInfo(this, _data)
					.then(function(res) {
						let _tempStaffs = res.data.staffs;
						_tempStaffs.forEach(_t => {
							_t.staffId = _t.userId;
							_t.staffName = _t.name;
						})
						_that.staffs = _tempStaffs;
					});
			},
			_chooseStaff: function(_staff) {
				this.$emit('getStaffs', _staff);
				this.showModel = false;
				this.staffName = "";
			},

			cancel: function() {
				this.showModel = false;
				this.staffName = "";
			}
		}
	}
</script>

<style lang="scss">
	.q-query {
		background-color: #FFF;
		padding: 15upx;

		.q-item {
			width: 70%;
			margin-right: 15upx;
			padding: 10upx 15upx;
			border-radius: 15upx;
			background-color: #f1f1f1;

			.q-input {
				height: 40upx;
			}

		}

		.q-item-btn {
			
			margin-left: 15upx;

			.q-input {
				height: 60upx;
			}
		}
	}

	.select-resource {
		position: fixed;
		top: 100rpx;
		left: 0;
		background-color: #fff;
		width: 100%;
		height: 100%;
		overflow-y: scroll;
		z-index: 1;
		padding-bottom: 100rpx;
	}

	.btn-box {
		padding: 40rpx 0;
		display: flex;
		flex-direction: row;
	}

	.btn-box button {
		width: 40%;
	}

	.cu-list.menu-avatar>.cu-item .content {
		left: 40rpx;
		width: 80%;
	}

	.cu-list {
		margin: 0;
	}
</style>
