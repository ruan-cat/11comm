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
				url: '',
				machineId: '',
				communityId: '',
				machineName: ''
			}
		},
		onLoad(options) {
			this.machineId = options.machineId;
			this.communityId = options.communityId;
			this.machineName = options.machineName;
			if (this.machineName) {
				uni.setNavigationBarTitle({
					title: this.machineName // 设置为你想要显示的标题文本
				});
			}
			this._loadVideoUrl();
		},
		methods: {
			_loadVideoUrl: function() {
				let _that = this;

				getIotOpenApi(this, {
					page: 1,
					row: 50,
					communityId: this.communityId,
					machineId: this.machineId,
					iotApiCode: 'getPlayVideoUrlBmoImpl'
				}).then(_data => {
					// #ifndef H5
					let _url = conf.commonBaseUrl + "/h5/jessibuca/video.html?tt=" +
						encodeURIComponent(_data.data) +
						"&time=" + new Date().getTime();
					// #endif
					// #ifdef H5
					let _url = conf.commonBaseUrl + "/h5/jessibuca/videoh5.html?tt=" +
						encodeURIComponent(_data.data) +
						"&time=" + new Date().getTime();
					// #endif
						console.log(_url)
					_that.url = _url;
				})
			}
		}
	}
</script>

<style>

</style>