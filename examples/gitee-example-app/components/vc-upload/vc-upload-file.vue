<template>
	<view>
		<view class=" text-left">
			<view class="button_up_blank"></view>
			<view>{{fileName}}</view>
			<view class="flex flex-direction">
				<button class="cu-btn bg-white margin-b-sm lg" @click="_doUploadFile()">上传附件</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getHeaders
	} from '../../lib/java110/api/SystemApi.js';
	import url from '@/constant/url.js'

	export default {
		name: "vcUploadFile",
		data() {
			return {
				fileName: '',
			};
		},
		methods: {
			_setFileName: function(_fileName) {
				this.fileName = _fileName;
			},
			_doUploadFile: function() {
				let _that = this;
				// #ifdef H5
				uni.chooseFile({
					count: 1, //默认100
					type: 'all',
					extension: ['.zip', '.jpg', '.png', '.xlsx', '.doc', 'docx', '.xls'],
					success: (res) => {
						console.log(res);
						if (res.tempFiles[0].size / 1024 / 1024 > 20) {
							uni.showToast({
								icon:'none',
								title:'附件大小不能超过20M'
							})
							return;
						}
						_that.resultPath(res.tempFiles[0].path, res.tempFiles[0].name);
					}
				});
				// #endif
				// #ifndef H5
				uni.chooseMessageFile({
					count: 1, //默认100
					type: 'all',
					extension: ['.zip', '.jpg', '.png', '.xlsx', '.doc', 'docx', '.xls'],
					success: (res) => {
						console.log(res);
						if (res.tempFiles[0].size / 1024 / 1024 > 20) {
							uni.showToast({
								icon:'none',
								title:'附件大小不能超过20M'
							})
							return;
						}
						_that.resultPath(res.tempFiles[0].path, res.tempFiles[0].name);
					}
				});
				// #endif
			},
			resultPath(path, fileName) {
				let _that = this;
				uni.showLoading({
					title: '上传中...',
				});
				uni.uploadFile({
					url: url.uploadVideo,
					filePath: path,
					name: 'uploadFile',
					header: getHeaders(),
					formData: {
						// 'user': 'test'
					},
					success: (uploadFileRes) => {
						uni.hideLoading();
						let obj = JSON.parse(uploadFileRes.data);
						_that.fileName = obj.fileName;
						_that.realFileName = obj.realFileName;
						_that.$emit('uploadFile', obj);

					},
					fail: (err) => {
						console.log(err)
						uni.showToast({
							icon: 'none',
							title: '上传失败'
						})
						uni.hideLoading();
					}
				});
			}
		}
	}
</script>

<style>

</style>