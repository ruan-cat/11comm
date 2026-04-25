<template>
	<view>

		<view class="cu-form-group margin-top">
			<textarea v-model="content" placeholder="请输入处理意见"></textarea>
		</view>

		<view class="flex flex-direction margin-top">
			<button class="cu-btn bg-green margin-tb-sm lg" @click="_dispatchComplaint()">提交</button>
		</view>
	</view>
</template>

<script>
	import {auditComplaint} from '../../api/complaint/complaint.js'
	import {getCommunity,getCurrentCommunity} from '../../api/community/community.js'
	export default {
		data() {
			return {
				content: '',
				complaintId:'',
			}
		},
		onLoad(options) {
			this.java110Context.onLoad();
			this.complaintId = options.complaintId;
		},
		methods: {
			_dispatchComplaint: function() {
				let _data = {
					context:this.content,
					communityId:getCurrentCommunity().communityId,
					complaintId:this.complaintId,
				}
				auditComplaint(this,_data)
				.then(function(res){
					if (res.statusCode != 200) {
						uni.showToast({
							icon:'none',
							title:res.data
						});
						return;
					}
					uni.navigateBack({
						delta:1
					})
				})

			},
			stateChange:function(e){
				this.stateIndex = e.target.value //取其下标
				if (this.stateIndex == 0) {
					this.state = '' //选中的id
					return;
				}
				let selected = this.stateCloums[this.stateIndex] //获取选中的数组
				
				this.state = selected.id //选中的id
			}
		}
	}
</script>

<style>

</style>
