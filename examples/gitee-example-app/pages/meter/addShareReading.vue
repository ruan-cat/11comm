<template>
	<view>
		<form>
			<view class="cu-form-group">
				<view class="title">公摊名称</view>
				<input placeholder="楼栋公摊"　v-model="name" disabled="disabled"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">上期度数</view>
				<input placeholder="上期度数"　v-model="preDegrees"  type="number"></input>
			</view>
			
			<view class="cu-form-group">
				<view class="title">本期度数</view>
				<input placeholder="本期度数"　v-model="curDegrees"  type="number"></input>
			</view>
			
			<view class="cu-form-group">
				<view class="title">上期时间</view>
				<uni-datetime-picker v-model="preReadingTime" ></uni-datetime-picker>
			</view>
			
			<view class="cu-form-group">
				<view class="title">本期时间</view>
				<uni-datetime-picker v-model="curReadingTime"></uni-datetime-picker>
			</view>
			
			<view class="cu-form-group align-start">
				<view class="title">备注</view>
				<textarea maxlength="-1" v-model="remark" placeholder="备注信息"></textarea>
			</view>
			
			<view class=" flex flex-direction">
				<button class="cu-btn bg-red margin-tb-sm lg" @tap="submitMeter">提交</button>
			</view>
			
		</form>
	</view>
</template>

<script>
	import dateObj from '../../lib/java110/utils/date.js'
	import uniDatetimePicker from '@/components/uni-datetime-picker/uni-datetime-picker.vue'
	import {getCommunityId} from '@/api/community/community.js';
	import {getFloorShareMeter,saveFloorShareReading} from '@/api/fee/fee.js';

	export default {
		data() {
			return {
				communityId: '',
				preDegrees: 0,
				preReadingTime:　null,
				curDegrees: '',
				curReadingTime:　null,
				remark: '',
				fsmId:'',
				name:'',
			};
		},
		components:{
			uniDatetimePicker
		},
		
		onLoad(options){
			this.fsmId = options.fsmId;
			this.java110Context.onLoad();
			this.preReadingTime = dateObj.getCurrentDateTime();
			this._loadFloorShareMater();
		},
		
		methods: {
			
			// 费用类型change
			_loadFloorShareMater: function() {
				let _that = this;
				getFloorShareMeter(this, {
					page: 1,
					row: 100,
					fsmId:this.fsmId,
					communityId: getCommunityId()
				}).then(_json => {
					let _data = _json.data[0];
					_that.preDegrees = _data.curDegree;
					_that.preReadingTime = _data.curReadingTime;
					_that.name=_data.floorNum+"栋-"+_data.meterTypeName+"("+_data.meterNum+")";
				});
			},
			submitMeter(){
				let msg = '';
				 if(this.fsmId == ''){
					msg = "没有公摊表";
				}else if(this.preDegrees === '' || this.preDegrees < 0){
					msg = "上期度数必填";
				}else if(this.preReadingTime == '' || this.preReadingTime == null){
					msg = "上期读表时间必填";
				}else if(this.curDegrees === '' || this.curDegrees < 0){
					msg = "本期度数必填";
				}else if(this.curReadingTime == '' || this.curReadingTime == null){
					msg = "本期读表时间必填";
				}else if(parseFloat(this.curDegrees) < parseFloat(this.preDegrees)){
					msg = "本期度数不能小于上期度数";
				}else{
					let start = Date.parse(new Date(this.preReadingTime.replace(/-/g, '/')))
					let end = Date.parse(new Date(this.curReadingTime.replace(/-/g, '/')))
					if (end == 0 || start - end >= 0) {
						msg = "本期读表时间有误";
					}
				}
				
				if(msg != ''){
					uni.showToast({
						title:msg,
						icon:'none'
					})
					return;
				}
				uni.showLoading({
					title:'正在提交'
				});
				let _objData = {
					communityId: getCommunityId(),
					fsmId: this.fsmId,
					curDegrees: this.curDegrees,
					curReadingTime: this.curReadingTime,
					preDegrees: this.preDegrees,
					preReadingTime: this.preReadingTime,
					remark: this.remark,
				};
				saveFloorShareReading(this,_objData)
				.then((res) => {
					uni.hideLoading();
					uni.showToast({
						title: res.msg,
						duration: 1500
					})
					if(res.code == 0){
						setTimeout(() => {
							uni.navigateBack({
								delta:1
							})
						}, 1500)
					}
				},err=>{
					uni.hideLoading();
				})
			},
		}
	}
</script>

<style>
	.cu-form-group .title {
		min-width: calc(6em + 15px);
	}
</style>
