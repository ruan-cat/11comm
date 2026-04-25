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
					<view class="title-1">{{valueItem.content}}</view>
					<radio :class="itemId==valueItem.itemId?'checked':''" v-if="valueItem.state == 'W'"
						:checked="itemId==valueItem.itemId?true:false" :value="valueItem.itemId">
					</radio>
					<view v-else>已处理</view>
				</view>
			</radio-group>
		</view>
		<view v-if="itemId">
			<view class="cu-form-group margin-top">
				<view class="title">动作</view>
				<picker :value="actionIndex" :range="actions" range-key="name" @change="actionChange">
					<view class="picker">
						{{actions[actionIndex].name}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group arrow margin-top-xs" v-if="action == 'T'">
				<view class="title">下一处理人</view>
				<view>
					<text @click="_selectStaff">{{staffName || '请选择'}}</text>
					<text class='cuIcon-right'></text>
				</view>
			</view>
			<view class="cu-form-group margin-top-xs">
				<textarea v-model="content" placeholder="必填,请输入内容"></textarea>
			</view>
			<view class="flex justify-between margin-top-xs">
				<view></view>
				<view class="margin-right">
					<text class=" cuIcon-camerafill text-blue file-size" @click="_changeUploadFile('IMG')"
						v-if="fileType != 'IMG'"></text>
					<text class=" cuIcon-upload text-blue  file-size" @click="_changeUploadFile('FILE')" v-else></text>
				</view>
			</view>
			<view class="margin-top-sm" v-if="fileType != 'IMG'">
				<vc-upload-file ref="vcUploadFileRel" @uploadFile="uploadFile"></vc-upload-file>
			</view>
			<view class="margin-top-xs" v-else>
				<uploadImageAsync ref="vcUploadRef" :communityId="communityId" :maxPhotoNum="uploadImage.maxPhotoNum"
					:canEdit="uploadImage.canEdit" :title="uploadImage.imgTitle" @sendImagesData="sendImagesData">
				</uploadImageAsync>
			</view>

			<view class="flex flex-direction margin-top-lg">
				<button class="cu-btn bg-blue margin-tb-sm lg" @click="submitWorkOrder">提交</button>
			</view>
		</view>

		<select-one-staffs ref="selectOneStaffsRef" @getStaffs="getStaffs"></select-one-staffs>
	</view>
</template>

<script>
	import vcUploadFile from '@/components/vc-upload/vc-upload-file.vue';
	import uploadImageAsync from "@/components/vc-upload-async/vc-upload-async.vue";

	import selectOneStaffs from '../../components/select-staff/select-one-staffs.vue';
	import {
		finishWorkTask,
		getTaskWork,
		getWorkTaskItem
	} from '@/api/oa/workApi.js';
	export default {
		data() {
			return {
				actions: [{
					name: '办理',
					value: 'C'
				}, {
					name: '转单',
					value: 'T'
				}],
				actionIndex: 0,
				action: 'C',
				content: '',
				pathUrls: [],
				taskId: '',
				workId: '',
				staffId: '',
				staffName: '',
				workName: '',
				createUserName: '',
				itemId: '',
				items: [],
				fileType: 'IMG',
				uploadImage: {
					maxPhotoNum: 5,
					imgTitle: '图片上传',
					canEdit: true
				}
			}
		},
		components: {
			vcUploadFile,
			selectOneStaffs,
			uploadImageAsync
		},
		onLoad(options) {
			this.taskId = options.taskId;
			this.workId = options.workId;
			this._loadWorkTask();
			this._loadWorkTaskItem();
		},
		methods: {
			_loadWorkTask: function() {
				let _that = this;
				getTaskWork(this, {
					page: 1,
					row: 1,
					workId: this.workId,
					taskId: this.taskId,
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
					taskId: this.taskId,
				}).then(_data => {
					_that.items = _data.data;
				});
			},
			actionChange: function(e) {
				this.actionIndex = e.detail.value;
				this.action = this.actions[this.actionIndex].value;
			},
			uploadFile: function(_obj) {
				console.log(_obj);
				this.pathUrls = [];
				this.pathUrls.push(_obj.realFileName);
			},
			_selectStaff: function() {
				this.$refs.selectOneStaffsRef.switchShow();
			},
			getStaffs: function(data) {
				console.log(data);
				if (!data.staffId) {
					return;
				}
				this.staffId = data.staffId;
				this.staffName = data.staffName;
			},
			submitWorkOrder: function() {
				finishWorkTask(this, {
					taskId: this.taskId,
					auditCode: this.action,
					auditMessage: this.content,
					staffId: this.staffId,
					staffName: this.staffName,
					pathUrls: this.pathUrls,
					itemId: this.itemId
				}).then(_data => {
					uni.navigateBack();
				})
			},
			radioChange: function(e) {
				this.itemId = e.detail.value;
			},
			_changeUploadFile: function(_fileType) {
				this.fileType = _fileType;
			},
			sendImagesData: function(_obj) {
				if(_obj.length < 1){
					this.pathUrls =[];
					return;
				}
				this.pathUrls =[];
				_obj.forEach(_o=>{
					this.pathUrls.push(_o.fileId);
				});
			}
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