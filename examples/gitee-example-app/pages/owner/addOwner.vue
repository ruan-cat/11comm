<template>
	<view>
		<view class="block__title">基本信息</view>
		<view class="cu-form-group">
			<view class="title">人员角色</view>
			<picker :value="personRoleIndex" :range="personRoles" range-key="name" @change="_changePersonRole">
				<view class="picker">
					{{personRoleIndex == -1 ?'请选择':personRoles[personRoleIndex].name}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">姓名</view>
			<input v-model="name" placeholder="必填,请输入成员名称"></input>
		</view>
		<view class="cu-form-group" >
			<view class="title">身份证</view>
			<input v-model="idCard" placeholder="选填,请输入身份证"></input>
		</view>
		<view class="cu-form-group" >
			<view class="title">性别</view>
			<picker bindchange="PickerChange" :value="index" :range="sexArr" @change="sexChange">
				<view class="picker">
					{{sex == '0'? '男':'女'}}
				</view>
			</picker>
		</view>
		
		<view class="cu-form-group">
			<view class="title">房屋</view>
			<input v-model="roomName" placeholder="必填,请输入房屋楼栋-单元-房屋"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">地址</view>
			<input type="text" v-model="address" placeholder="选填,请输入地址"></input>
		</view>

		<view class="block__title">联系信息</view>
		<view class="cu-form-group" v-if="personType == 'C'">
			<view class="title">联系人</view>
			<input v-model="concactPerson" placeholder="必填,请输入联系人"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">手机号</view>
			<input v-model="link" placeholder="必填,请输入手机号(没有手机号随便写一个)"></input>
		</view>

		<view class="block__title">相关图片</view>
		<uploadImageAsync ref="vcUploadRef" :communityId="communityId" :maxPhotoNum="uploadImage.maxPhotoNum"
			:canEdit="uploadImage.canEdit" :title="uploadImage.imgTitle" @sendImagesData="sendImagesData">
		</uploadImageAsync>


		<view class="cu-form-group margin-top">
			<textarea v-model="remark" placeholder="选填,请输入备注"></textarea>
		</view>

		<view class="flex flex-direction margin-top margin-bottom">
			<button class="cu-btn bg-green margin-tb-sm lg" @click="_submitOwnerMember()">提交</button>
		</view>
	</view>
</template>

<script>
	// pages/enterCommunity/enterCommunity.js
	import {
		isIDCard,
		checkPhoneNumber,
		idCardInfoExt
	} from '../../lib/java110/utils/StringUtil.js'
	import uploadImageAsync from "../../components/vc-upload-async/vc-upload-async.vue";
	import {saveRoomOwner} from '../../api/owner/owner.js';
	
	export default {
		data() {
			return {
				name: "",
				sexArr: ["男", "女"],
				index: 0,
				sex: "0",
				link: "",
				remark: "",
				personRoles: [{
						value: '3',
						name: '家庭成员'
					},
					{
						value: '2',
						name: '租客'
					},
					{
						value: '4',
						name: '公司员工'
					},
					{
						value: '99',
						name: '其他'
					}
				],
				personRoleIndex: -1,
				personRole:'',
				personType:'P',
				ownerTypeCd: "1002",
				idCard: "",
				address: "",
				roomName: "",
				communityId:'',
				concactPerson:'',
				photos: [],
				uploadImage: {
					maxPhotoNum: 1,
					imgTitle: '图片上传',
					canEdit: true
				}
			};
		},
		components: {
			uploadImageAsync
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			this.communityId = this.getCommunityId();
		},
		methods: {
			sendImagesData: function(e) {
				this.photos = e[0].url;
			},
			sexChange: function(e) {
				this.sex = e.detail.value;
			},
			_submitOwnerMember: function(e) {
				let obj = {
					"name": this.name,
					"link": this.link,
					"remark": this.remark,
					"ownerTypeCd": this.ownerTypeCd,
					"personRole":this.personRole,
					"personType":this.personType,
					"roomName": this.roomName,
					"communityId": this.getCommunityId(),
					"idCard": this.idCard,
					"address": this.address,
					sex:this.sex,
					"ownerPhotoUrl": this.photos
				}

				let msg = "";
			 if (obj.name == "") {
					msg = "请填写姓名";
				} else if (obj.link == "") {
					msg = "请填写手机号";
				} else if (!checkPhoneNumber(obj.link)) {
					msg = "手机号有误";
				}
				if (msg != "") {
					uni.showToast({
						title: msg,
						icon: 'none',
						duration: 2000
					});
					return;
				}
				saveRoomOwner(this,obj).then(_data=>{
					if(_data.code != 0){
						uni.showToast({
							icon:'none',
							title:_data.msg
						});
						return;
					}
					uni.navigateBack()
				})
			},
			_changePersonRole: function(e) {
				this.personRoleIndex = e.detail.value;
				this.personRole = this.personRoles[this.personRoleIndex].value;
			},
			_changePersonType: function(e) {
				this.personTypeIndex = e.detail.value;
				this.personType = this.personTypes[this.personTypeIndex].value;
			},
		}
	};
</script>
<style>
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
