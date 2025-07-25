import http from "axios";
import { DataUpType } from "../plugins/http";

/**
 * 请求回调函数
 */
export type RequestCallback = (res: any) => void;

/**
 * 封装一个Http请求工具类
 */
export default class Request {
	/** get请求 */
	static get GET() {
		return 1;
	}
	/** post请求 */
	static get POST() {
		return 2;
	}
	/** put请求 */
	static get PUT() {
		return 3;
	}
	/** delete请求 */
	static get DELETE() {
		return 4;
	}

	/**
	 * 发送请求
	 * @param method 请求方式，如Request.GET
	 * @param url 请求地址
	 * @param data 上传数据
	 * @param upType 上传数据方式，如DataUpType.form
	 * @param options [可选]其他配置选项
	 * @returns {Promise} 请求发送后的Promise对象
	 */
	static request(method: number, url: string, data: any, upType: number, options?: any) {
		// 组装参数
		const config = {
			url: url,
			upType: upType,
			...options,
		};
		switch (method) {
			case Request.GET:
				config.method = "get";
				config.params = data;
				break;
			case Request.POST:
				config.method = "post";
				config.data = data;
				break;
			case Request.PUT:
				config.method = "put";
				config.data = data;
				break;
			case Request.DELETE:
				config.method = "delete";
				config.data = data;
				break;
		}
		return http.request(config);
	}

	/**
	 * 发送表单请求
	 * @param method 请求方式，如Request.GET
	 * @param url 请求地址
	 * @param data 上传数据
	 * @param options [可选]其他配置选项
	 * @returns {Promise} 请求发送后的Promise对象
	 */
	static requestForm(method: number, url: string, data: any, options?: any) {
		return Request.request(method, url, data, DataUpType.form, options);
	}

	/**
	 * 发送JSON请求
	 * @param method 请求方式，如Request.POST
	 * @param url 请求地址
	 * @param data 上传数据
	 * @param options [可选]其他配置选项
	 * @returns {Promise} 请求发送后的Promise对象
	 */
	static requestJson(method: number, url: string, data: any, options?: any) {
		return Request.request(method, url, data, DataUpType.json, options);
	}

	/**
	 * 发送带文件上传的请求，该方法会完成js数据对象转换成FormData对象操作
	 * 请求方式以post方式发送
	 * @param url 请求地址
	 * @param data 包括file数据的js数据对象
	 * @param options [可选]其他配置选项
	 * @returns {Promise} 请求发送后的Promise对象
	 */
	static postFile(url: string, data: any, options?: any) {
		//将data转换成FormData对象
		const formData = new FormData();
		for (const key in data) {
			formData.append(key, data[key]);
		}
		//发送请求
		return Request.request(Request.POST, url, formData, DataUpType.file, options);
	}

	/**
	 * 以二进制的方式上传文件
	 * @param url 上传地址
	 * @param file 文件域选择的文件对象
	 * @param success 上传成功回调
	 * @param fail 上传失败回调
	 * @param options [可选]其他配置选项
	 */
	static postFileStream(url: string, file: any, success: RequestCallback, fail: RequestCallback, options?: any) {
		// 读取文件
		const reader = new FileReader();
		reader.readAsArrayBuffer(file);
		reader.onloadend = function () {
			// 读取文件失败
			if (reader.error) {
				fail("文件读取失败");
				return;
			}
			// 上传文件
			Request.request(Request.POST, url, reader.result, DataUpType.stream, options)
				.then((res) => {
					success(res);
				})
				.catch((err) => {
					fail(err);
				});
		};
	}
}
