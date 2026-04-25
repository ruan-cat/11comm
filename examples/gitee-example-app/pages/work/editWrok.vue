<template>
	<view>
		<!-- <view class="cu-form-group ">
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
			<view class="title">{{staff.staffName}}</view>
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
			<view class="title">{{staff.staffName}}</view>
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
				<view class="margin-xs" v-for="(month,index) in allMonths" :key="index">
					<checkbox class="" :checked="month.checked" :value="month.index+''"></checkbox> {{month.index}}
				</view>
			</checkbox-group>
		</view>
		<view class="bg-white padding-lr" v-if="workCycle == '2002' && period=='2020022'">
			<view class="title">日</view>
			<checkbox-group class="flex justify-start flex-wrap " @change="_changeDays">
				<view class="margin-xs" v-for="(day,index) in allDays" :key="index">
					<checkbox class="" :checked="day.checked" :value="day.index+''"></checkbox> {{day.index}}
				</view>
			</checkbox-group>
		</view>
		<view class="bg-white padding-lr" v-if="workCycle == '2002' && period=='2020023'">
			<view class="title">周</view>
			<checkbox-group class="flex justify-start flex-wrap " @change="_changeWorkDays">
				<view class="margin-xs" v-for="(workday,index) in allWorkdays" :key="index">
					<checkbox class="" :checked="workday.checked" :value="workday.index+''"></checkbox>
					周{{workday.index == 7 ?'日':workday.index}}
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
					<text class=" cuIcon-camerafill text-blue file-size" @click="_changeUploadFile('IMG')"
						v-if="fileType != 'IMG'"></text>
					<text class=" cuIcon-upload text-blue  file-size" @click="_changeUploadFile('FILE')" v-else></text>
				</view>
			</view>
			<view class="margin-top" v-if="fileType != 'IMG'">
				<vc-upload-file ref="vcUploadFileRel" @uploadFile="uploadFile"></vc-upload-file>
			</view>
			<view class="margin-top-xs" v-else>
				<uploadImageAsync ref="vcUploadRef" :communityId="communityId" :maxPhotoNum="uploadImage.maxPhotoNum"
					:canEdit="uploadImage.canEdit" :title="uploadImage.imgTitle" @sendImagesData="sendImagesData">
				</uploadImageAsync>
			</view>
		</view>

		<view class="flex flex-direction margin-top-lg">
			<button class="cu-btn bg-blue margin-tb-sm lg" @click="updateWorkOrder">提交</button>
		</view>

		<select-muti-staffs ref="selectMutiStaffsRel" @getStaffs="getStaffs"></select-muti-staffs>
	</view>
</template>

<script>
	import selectMutiStaffs from '@/components/select-staff/select-muti-staffs.vue';
	import {
		queryWorkType,
		getWorkTask,
		getWorkCopy,
		queryStartWork,
		getWorkCycle,
		updateWorkPool
	} from '@/api/oa/workApi.js';
	import {
		getCommunityId
	} from '../../api/community/community.js';
	import {
		formatTime
	} from '../../lib/java110/utils/DateUtil.js';
	import vcUploadFile from '@/components/vc-upload/vc-upload-file.vue';
	import uploadImageAsync from "../../components/vc-upload-async/vc-upload-async.vue";

	export default {
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
				allMonths: [],
				allDays: [],
				allWorkdays: [],
				months: [],
				days: [],
				workdays: [],
				hours: '24',
				communityId: '',
				staffFlag: '',
				workId: '',
				fileType: '',
				uploadImage: {
					maxPhotoNum: 5,
					imgTitle: '图片上传',
					canEdit: true
				}
			}
		},
		onLoad(options) {
			this.workId = options.workId;
			this._loadWorkTypes();

			this._loadStaffs();
			this._loadStaffCopys();
			this._loadWorkCycle();
			for (let month = 1; month < 13; month++) {
				this.allMonths.push({
					index: month,
					checked: false,
				})
			}
			for (let day = 1; day < 32; day++) {
				this.allMonths.push({
					index: day,
					checked: false,
				})
			}
			for (let workDay = 1; workDay < 8; workDay++) {
				this.allWorkdays.push({
					index: workDay,
					checked: false,
				})
			}
		},
		components: {
			selectMutiStaffs,
			vcUploadFile,
			uploadImageAsync
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
			updateWorkOrder: function() {
				let _that = this;
				updateWorkPool(this, {
					workId: this.workId,
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
					uni.navigateBack();
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
					_that._loadStartWork();
				})
			},
			_loadStartWork: function() {
				let _that = this;
				queryStartWork(this, {
					page: 1,
					row: 1,
					workId: this.workId
				}).then(_data => {
					let _json = _data.data[0];
					_that.workName = _json.workName;
					_that.wtId = _json.wtId;
					_that.workCycle = _json.workCycle;
					_that.startTime = _json.startTime;
					_that.endTime = _json.endTime;
					_that.pathUrls = _json.pathUrls;
					_that.contents = [];
					_json.contents.forEach(_c => {
						_c.id = _that.contents.length + 1;
						_that.contents.push(_c);
					})
					if (_that.workCycle == '2002') {
						_that.workCycleIndex = 1;
					}
					for (let i = 0; i < _that.workTypes.length; i++) {
						if (_that.workTypes[i].wtId == _that.wtId) {
							_that.workTypeIndex = i;
						}
					}
					if(!_that.pathUrls){
						return;
					}
					if (_that.pathUrls[0].endsWith('jpg') || _that.pathUrls[0].endsWith('png')) {
						_that.fileType = 'IMG';
						setTimeout(function() {
							let _photos = [_json.url];
							_that.$refs.vcUploadRef._initImageList(_json.pathUrls);
						}, 1000);
					} else {
						_that.fileType = 'FILE';
						setTimeout(function() {
							_that.$refs.vcUploadFileRel._setFileName(_json.pathUrls[0]);
						}, 1000);
					}
				});
			},
			_loadStaffs: function() {
				let _that = this;
				getWorkTask(this, {
					page: 1,
					row: 100,
					workId: this.workId
				}).then(_data => {
					_that.staffs = _data.data;
				});
			},
			_loadStaffCopys: function() {
				let _that = this;
				getWorkCopy(this, {
					page: 1,
					row: 100,
					workId: this.workId
				}).then(_data => {
					_that.copyStaffs = _data.data;
				});
			},
			_loadWorkCycle: function() {
				let _that = this;
				getWorkCycle(this, {
					page: 1,
					row: 1,
					workId: this.workId
				}).then(_json => {
					_that.period = _json.data[0].period;
					if (_that.period == '2020023') {
						_that.periodIndex = 1
					}
					if (_json.data[0].periodMonth) {
						_that.months = _json.data[0].periodMonth.split(',');
						_that.allMonths.forEach(_aMonth => {
							_that.months.forEach(_month => {
								if (_aMonth.index == _month) {
									_aMonth.checked = true;
								}
							})
						})
					}
					if (_json.data[0].periodDay) {
						_that.days = _json.data[0].periodDay.split(',');
						_that.allDays.forEach(_aMonth => {
							_that.days.forEach(_month => {
								if (_aMonth.index == _month) {
									_aMonth.checked = true;
								}
							})
						})
					}
					if (_json.data[0].periodWorkday) {
						_that.workdays = _json.data[0].periodWorkday.split(',');
						_that.allWorkdays.forEach(_aMonth => {
							_that.workdays.forEach(_month => {
								if (_aMonth.index == _month) {
									_aMonth.checked = true;
								}
							})
						})
					}
					_that.hours = _json.data[0].hours;
				});

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