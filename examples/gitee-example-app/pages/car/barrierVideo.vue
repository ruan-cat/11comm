<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	import {
		getIotOpenApi,
	} from '../../api/machine/machineApi.js';
	import conf from '../../conf/config.js'
	export default {
		data() {
			return {
				url:'',
				machineId:'',
				communityId:'',
			}
		},
		onLoad(options) {
			this.machineId = options.machineId;
			this.communityId = options.communityId;
			this._loadVideoUrl();
		},
		methods: {
			_loadVideoUrl:function(){
				let _that =this;
				getIotOpenApi(this, {
					machineId: this.machineId,
					communityId: this.communityId,
					iotApiCode: 'getBarrierCloudVideoBmoImpl',
				}).then(_data => {
					_that.machines = _data.data;
					let _url = conf.commonBaseUrl+"/h5/jessibuca/video.html?tt="
					+encodeURIComponent(_data.data.url)
					+"&time="+new Date().getTime();
					_that.url = _url;
				})
				
				
			}
		}
	}
</script>

<style>

</style>
