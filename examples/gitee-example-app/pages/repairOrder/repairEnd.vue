<template>
	<view>
		<view class="cu-form-group margin-top">
			<textarea v-model="content" placeholder="请输入结束原因,比如缺材料"></textarea>
		</view>
		<view class="flex flex-direction margin-top">
			<button class="cu-btn bg-blue margin-tb-sm lg" :disabled="!content" @click="_doEndRepair()">结束工单</button>
		</view>
	</view>
</template>

<script>
	import {
		repairEnd
	} from '@/api/repair/repair.js'
	export default {
		data() {
			return {
				repairId: '',
				content: ''
			}
		},
		onLoad(options) {
			this.java110Context.onLoad();
			this.repairId = options.repairId;
			this.communityId = options.communityId;
		},
		methods: {
			_doEndRepair: async function() {
				const {code,msg} = await repairEnd(this,{
					repairId: this.repairId,
					communityId: this.communityId,
					context: this.content
				});
				if(code != 0 ){
					uni.showToast({
						icon:'none',
						title:msg
					})
					return;
				}
				uni.navigateBack()
			}
		}
	}
</script>

<style>

</style>