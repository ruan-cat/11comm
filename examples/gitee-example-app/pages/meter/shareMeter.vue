<template>
	<view>
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="active==0?'text-blue cur':''" @tap="tabSelect(0)">
					全部
				</view>
				<view class="cu-item flex-sub" :class="active==1?'text-blue cur':''" @tap="tabSelect(1)">
					公摊抄表
				</view>
			</view>
		</scroll-view>
		
		<view v-if="active == 0">
			<share-reading  ref="shareReadingRef"></share-reading>
		</view>
		<view v-if="active == 1">
			<share-mater ref="shareMaterRef" @tabSelect="tabSelect"></share-mater>
		</view>
	</view>
</template>

<script>
	import shareReading from '@/components/fee/share-reading.vue';
	import shareMater from '@/components/fee/share-mater.vue';
	export default {
		data() {
			return {
				active:0,
			}
		},
		components:{
			shareReading,
			shareMater
		},
		onLoad() {
			
		},
		onShow() {
			this.tabSelect(this.active);
		},
		methods: {
			tabSelect:function(_active){
				this.active = _active;
				let _that = this;
				if(this.active == 0){
					setTimeout(function(){
						_that.$refs.shareReadingRef._loadFloorShareReading();
					},500)
					
					return;
				}
				
				if(this.active == 1){
					setTimeout(function(){
						_that.$refs.shareMaterRef._loadFloorShareMater();
					},500)
				}
			}
		}
	}
</script>

<style>

</style>
