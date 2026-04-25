<template>
	<view>

		<view class="cu-form-group margin-top">
			<textarea v-model="replyContext" placeholder="请输入回复说明"></textarea>
		</view>

		<view class="flex flex-direction margin-top">
			<button class="cu-btn bg-green margin-tb-sm lg" @click="_reply()">提交</button>
		</view>
	</view>
</template>

<script>
	import {replyRepairAppraise} from '../../api/repair/repair.js'
	import {getCommunity,getCurrentCommunity} from '../../api/community/community.js'
	export default {
		data() {
			return {
				replyContext: '',
				repairId:'',
				ruId:''
			}
		},
		onLoad(options) {
			this.java110Context.onLoad();
			this.ruId = options.ruId;
			this.repairId = options.repairId;
		},
		methods: {
			_reply: function() {
				replyRepairAppraise({
					replyContext:this.replyContext,
					communityId:getCurrentCommunity().communityId,
					ruId:this.ruId,
					repairId:this.repairId
				},this)
				.then(function(res){
					if (res.code != 0) {
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
