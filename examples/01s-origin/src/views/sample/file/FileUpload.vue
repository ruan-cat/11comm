<template>
	<el-upload
		action="no-action"
		:show-file-list="false"
		:http-request="uploadUseFormData"
		@success="handleSuccess"
		@error="handleError"
	>
		<el-button size="small" type="primary">
			<el-icon style="vertical-align: middle">
				<icon-upload />
			</el-icon>
			<span style="vertical-align: middle">FormData上传文件</span>
		</el-button>
	</el-upload>

	<div class="wrap-space"></div>

	<el-upload
		ref="upload"
		action="no-action"
		:show-file-list="false"
		:http-request="uploadUseStream"
		@success="handleSuccess"
		@error="handleError"
	>
		<el-button size="small" type="primary">
			<el-icon style="vertical-align: middle">
				<icon-upload />
			</el-icon>
			<span style="vertical-align: middle">Stream上传文件</span>
		</el-button>
	</el-upload>
	<div class="wrap-space"></div>

	<el-button type="primary" size="small" @click="exportFile">
		<el-icon style="vertical-align: middle">
			<icon-download />
		</el-icon>
		<span style="vertical-align: middle">导出报表</span>
	</el-button>
</template>

<script setup lang="ts">
import Request from "@/apis/request";
import { ElMessage } from "element-plus";

// 成功回调
function handleSuccess(response: any) {
	console.log(response);
	ElMessage.success("上传成功");
}

// 失败回调
function handleError(error: any) {
	console.log(error);
	ElMessage.error("上传失败");
}

// 使用FormData的方式上传文件
function uploadUseFormData(params: any) {
	return Request.postFile(
		"/file/upload",
		{
			nickname: "小米",
			age: 18,
			file: params.file,
		},
		{ baseURL: "http://localhost:8090" },
	);
}

// 使用Stream方式上传
function uploadUseStream(params: any) {
	return new Promise((resolve, reject) => {
		Request.postFileStream(
			"/user/modify-user?nickname=莉莉丝&age=10",
			params.file,
			(res: any) => {
				resolve(res);
			},
			(err: any) => {
				reject(err);
			},
			{ baseURL: "http://localhost:8090" },
		);
	});
}

// 下载文件
function downFile(blob: any, filename: string) {
	const link = document.createElement("a");
	link.href = window.URL.createObjectURL(blob); // 创建下载的链接
	link.download = filename; // 下载后文件名
	link.style.display = "none";
	document.body.appendChild(link);
	link.click(); // 点击下载
	window.URL.revokeObjectURL(link.href); // 释放掉blob对象
	document.body.removeChild(link); // 下载完成移除元素
}

// 请求文件数据
function exportFile() {
	Request.requestForm(
		Request.GET,
		"/sample/export",
		{
			pageIndex: 1,
			pageSize: 10,
		},
		{
			responseType: "blob",
			baseURL: "http://localhost:8090",
		},
	)
		.then((res) => {
			if (res.data) {
				const headers = res.headers;
				const contentType = headers["content-type"];
				const blob = new Blob([res.data], { type: contentType });
				const contentDisposition = headers["content-disposition"];
				let filename = "tmp.xlsx";
				if (contentDisposition) {
					filename = window.decodeURI(contentDisposition.split("=")[1]);
				}
				downFile(blob, filename);
				ElMessage.success("下载成功");
				return;
			}
			console.warn(res);
			ElMessage.error("下载失败");
		})
		.catch((res) => {
			console.warn(res);
			ElMessage.error("下载失败");
		});
}
</script>

<style scoped>
.wrap-space {
	padding: 5px;
}
</style>
