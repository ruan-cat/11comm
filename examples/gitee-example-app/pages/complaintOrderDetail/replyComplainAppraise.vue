<template>
	<view>

		<view class="cu-form-group margin-top">
			<textarea v-model="replyContext" placeholder="请输入回复说明"></textarea>
		</view>

		<view class="flex flex-direction margin-top">
			<button class="cu-btn bg-green margin-tb-sm lg" @click="_dispatchComplaint()">提交</button>
		</view>
	</view>
</template>

<script>
	import {replyComplaintAppraise} from '../../api/complaint/complaint.js'
	import {getCommunity,getCurrentCommunity} from '../../api/community/community.js'
	export default {
		data() {
			return {
				replyContext: '',
				appraiseId:'',
			}
		},
		onLoad(options) {
			this.java110Context.onLoad();
			this.appraiseId = options.appraiseId;
		},
		methods: {
			_dispatchComplaint: function() {
				replyComplaintAppraise({
					replyContext:this.replyContext,
					communityId:getCurrentCommunity().communityId,
					appraiseId:this.appraiseId,
				},this)
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
		}
	}
</script>

<style>

</style>
