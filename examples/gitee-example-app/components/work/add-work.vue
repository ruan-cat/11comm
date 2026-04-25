<template>
	<view>
		<!-- <view class="cu-form-group margin-top">
			<view class="title">标题</view>
			<input v-model="workName" class="text-right" placeholder="必填,请输入标题"></input>
		</view> -->
		<view class="cu-form-group margin-top">
			<view class="title">工作单类型</view>
			<picker :value="workTypeIndex" :range="workTypes" range-key="typeName" @change="workTypeChange">
				<view class="picker">
					{{workTypeIndex == -1? '请选择':workTypes[workTypeIndex].typeName}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">处理人</view>
			<view class="text-right">
				<text class="lg text-red cuIcon-roundadd centent-btn" @click="selectStaffs()"></text>
			</view>
		</view>

		<view class="cu-form-group" v-for="(staff,index) in staffs" :key="index">
			<view class="title">{{staff.staffName}}({{staff.orgName}})</view>
			<view class="text-right">
				<text class="lg text-red cuIcon-roundclose centent-btn" @click="deleteStaffPerson(staff)"></text>
			</view>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">抄送人</view>
			<view class="text-right">
				<text class="lg text-red cuIcon-roundadd centent-btn" @click="selectCopyStaffs()"></text>
			</view>
		</view>
		<view class="cu-form-group" v-for="(staff,index) in copyStaffs" :key="index">
			<view class="title">{{staff.staffName}}({{staff.orgName}})</view>
			<view class="text-right">
				<text class="lg text-red cuIcon-roundclose centent-btn" @click="deleteCopyPerson(staff)"></text>
			</view>
		</view>

		<view class="cu-form-group arrow  margin-top">
			<view class="title">完成日期</view>
			<picker mode="date" :value="endTime" start="2020-09-01" end="2050-09-01" @change="dateChange">
				<view class="picker">
					{{endTime || '请选择'}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">工单标识</view>
			<picker :value="workCycleIndex" :range="workCycles" range-key="name" @change="workCycleChange">
				<view class="picker">
					{{workCycles[workCycleIndex].name}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group " v-if="workCycle == '2002'">
			<view class="title">完成小时</view>
			<input v-model="hours" class="text-right"></input>小时内完成
		</view>

		<view class="cu-form-group " v-if="workCycle == '2002'">
			<view class="title">周期</view>
			<picker :value="periodIndex" :range="periods" range-key="name" @change="periodChange">
				<view class="picker">
					{{periods[periodIndex].name}}
				</view>
			</picker>
		</view>
		<view class="bg-white padding-lr" v-if="workCycle == '2002' && period=='2020022'">
			<view class="title">月</view>
			<checkbox-group class="flex justify-start flex-wrap" @change="_changeMonths">
				<view class="margin-xs" v-for="index in 12">
					<checkbox class="" :value="index+''"></checkbox> {{index}}
				</view>
			</checkbox-group>
		</view>
		<view class="bg-white padding-lr" v-if="workCycle == '2002' && period=='2020022'">
			<view class="title">日</view>
			<checkbox-group class="flex justify-start flex-wrap " @change="_changeDays">
				<view class="margin-xs" v-for="index in 31">
					<checkbox class="" :value="index+''"></checkbox> {{index}}
				</view>
			</checkbox-group>
		</view>
		<view class="bg-white padding-lr" v-if="workCycle == '2002' && period=='2020023'">
			<view class="title">周</view>
			<checkbox-group class="flex justify-start flex-wrap " @change="_changeWorkDays">
				<view class="margin-xs" v-for="index in 7">
					<checkbox class="" :value="index+''"></checkbox> 周{{index == 7 ?'日':index}}
				</view>
			</checkbox-group>
		</view>
		<view class="cu-form-group margin-top" v-for="(item,index) in contents" :key="index">
			<textarea v-model="item.content" :placeholder="'内容'+(index+1)+',必填请填写内容'"></textarea>
			<view v-if="index == 0">
				<text class="lg text-red cuIcon-roundadd centent-btn" @click="addWorkContent()"></text>
			</view>
			<view v-else>
				<text class="lg text-red cuIcon-roundclose centent-btn" @click="deleteWorkContent(item)"></text>
			</view>

		</view>
		<view class="margin-top-sm">
			<view class="flex justify-between">
				<view></view>
				<view class="margin-right">
					<text class=" cuIcon-camerafill text-blue file-size" @click="_changeUploadFile('IMG')" v-if="fileType != 'IMG'"></text>
					<text class=" cuIcon-upload text-blue  file-size" @click="_changeUploadFile('FILE')" v-else></text>
				</view>
			</view>
			<view class="margin-top-xs" v-if="fileType != 'IMG'">
				<vc-upload-file ref="vcUploadFileRel" @uploadFile="uploadFile"></vc-upload-file>
			</view>
			<view class="margin-top-xs" v-else>
				<uploadImageAsync ref="vcUploadRef" :communityId="communityId" :maxPhotoNum="uploadImage.maxPhotoNum"
					:canEdit="uploadImage.canEdit" :title="uploadImage.imgTitle" @sendImagesData="sendImagesData">
				</uploadImageAsync>
			</view>

		</view>

		<view class="flex flex-direction margin-top-lg">
			<button class="cu-btn bg-blue margin-tb-sm lg" @click="submitWorkOrder">提交</button>
		</view>

		<select-muti-staffs ref="selectMutiStaffsRel" @getStaffs="getStaffs"></select-muti-staffs>
	</view>
</template>

<script>
	import selectMutiStaffs from '../select-staff/select-muti-staffs.vue';
	import {
		queryWorkType,
		saveWorkPool
	} from '@/api/oa/workApi.js';
	import {
		getCommunityId
	} from '../../api/community/community.js';
	import {
		formatTime
	} from '../../lib/java110/utils/DateUtil.js';
	import vcUploadFile from '../vc-upload/vc-upload-file.vue';
	import uploadImageAsync from "../../components/vc-upload-async/vc-upload-async.vue";
	
	export default {
		name: "addWork",
		data() {
			return {
				workName: '',
				workTypes: [],
				workTypeIndex: -1,
				wtId: '',
				workCycles: [{
					name: '一次性工单',
					value: '1001'
				}, {
					name: '周期性工单',
					value: '2002'
				}],
				workCycleIndex: 0,
				workCycle: '1001',
				startTime: '',
				endTime: '',
				staffs: [],
				copyStaffs: [],
				pathUrls: [],
				contents: [],
				period: '2020022',
				periodIndex: 0,
				periods: [{
					name: '月/天',
					value: '2020022'
				}, {
					name: '按周',
					value: '2020023'
				}],
				months: [],
				days: [],
				workdays: [],
				hours: '24',
				communityId: '',
				staffFlag: '',
				fileType: 'IMG',
				uploadImage: {
					maxPhotoNum: 5,
					imgTitle: '图片上传',
					canEdit: true
				}
			};
		},
		components: {
			selectMutiStaffs,
			vcUploadFile,
			uploadImageAsync
		},
		mounted() {
			this._loadWorkTypes();
		},
		methods: {
			workTypeChange: function(e) {
				this.workTypeIndex = e.detail.value;
				this.wtId = this.workTypes[this.workTypeIndex].wtId;
			},
			workCycleChange: function(e) {
				this.workCycleIndex = e.detail.value;
				this.workCycle = this.workCycles[this.workCycleIndex].value;
			},
			dateChange: function(e) {
				this.endTime = e.detail.value;
			},
			periodChange: function(e) {
				this.periodIndex = e.detail.value;
				this.period = this.periods[this.periodIndex].value;
			},
			_changeMonths: function(e) {
				this.months = e.detail.value;
			},
			_changeDays: function(e) {
				this.days = e.detail.value;
			},
			_changeWorkDays: function(e) {
				this.workdays = e.detail.value;
			},
			submitWorkOrder: function() {
				let _that = this;
				saveWorkPool(this, {
					workName: this.workName,
					wtId: this.wtId,
					workCycle: this.workCycle,
					startTime: formatTime(new Date()),
					endTime: this.endTime,
					staffs: this.staffs,
					copyStaffs: this.copyStaffs,
					pathUrls: this.pathUrls,
					contents: this.contents,
					period: this.period,
					months: this.months,
					days: this.days,
					workdays: this.workdays,
					hours: this.hours,
					communityId: getCommunityId(),
				}).then(_data => {
					this._initAddWork();
					_that.$emit('tabSelect', 0);
				})
			},
			selectStaffs: function() {
				let _selectStaffIds = [];
				this.staffs.forEach(_staff => {
					_selectStaffIds.push(_staff.staffId);
				});
				this.staffFlag = 'staff';
				this.$refs.selectMutiStaffsRel.switchShow(_selectStaffIds);

			},
			deleteStaffPerson: function(staff) {
				let _selectStaffs = [];
				this.staffs.forEach(_staff => {
					if (_staff.staffId != staff.staffId) {
						_selectStaffs.push(_staff);
					}
				});
				this.staffs = _selectStaffs;
			},
			selectCopyStaffs: function() {
				let _selectStaffIds = [];
				this.copyStaffs.forEach(_staff => {
					_selectStaffIds.push(_staff.staffId);
				});
				this.staffFlag = 'copyStaff';
				this.$refs.selectMutiStaffsRel.switchShow(_selectStaffIds);

			},
			deleteCopyPerson: function(staff) {
				let _selectStaffs = [];
				this.copyStaffs.forEach(_staff => {
					if (_staff.staffId != staff.staffId) {
						_selectStaffs.push(_staff);
					}
				});
				this.copyStaffs = _selectStaffs;
			},
			getStaffs: function(staff) {
				if (this.staffFlag == 'staff') {
					this.staffs.push(staff);
					return;
				}
				this.copyStaffs.push(staff);

			},
			uploadFile: function(_obj) {
				console.log(_obj);
				this.pathUrls = [];
				this.pathUrls.push(_obj.realFileName);
			},
			_loadWorkTypes: function() {
				let _that = this;
				queryWorkType(this, {
					page: 1,
					row: 100,
					communityId: getCommunityId()
				}).then(_data => {
					_that.workTypes = _data.data;
				});
			},
			_initAddWork: function() {
				this.workName = '';
				this.wtId = '';
				this.workCycle = '1001';
				this.startTime = '';
				this.endTime = '';
				this.staffs = [];
				this.copyStaffs = [];
				this.pathUrls = [];
				this.contents = [];
				this.period = '2020022';
				this.months = [];
				this.days = [];
				this.workdays = [];
				this.hours = '24';
				this.staffFlag = '';
				this.fileType = "IMG";
				this.addWorkContent();

			},
			addWorkContent: function() {
				let _contents = this.contents;
				let id = this.contents.length + 1;
				_contents.push({
					id: id,
					content: ''
				});
			},
			deleteWorkContent: function(_content) {
				let _contents = this.contents;
				let _newContents = [];
				_contents.forEach(_c => {
					if (_c.id != _content.id) {
						_newContents.push(_c);
					}
				});
				this.contents = _newContents;
			},
			_changeUploadFile:function(_fileType){
				this.fileType = _fileType;
			},
			sendImagesData:function(_obj){
				if(_obj.length < 1){
					this.pathUrls =[];
					return;
				}
				this.pathUrls =[];
				_obj.forEach(_o=>{
					this.pathUrls.push(_o.fileId);
				})
			}
		}
	}
</script>

<style lang="scss">
	.centent-btn {
		font-size: 22px;
	}

	.file-size {
		font-size: 48upx;
	}
</style>