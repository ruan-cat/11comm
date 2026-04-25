import conf from "@/conf/config.js";
/**
 * 压缩
 *
 * @param {Object} imgSrc 图片url
 * @param {Object} callback 回调设置返回值
 */

export function translate(that, imgSrc, callback) {
	// #ifndef H5
	imageToBease64(that, imgSrc, callback);
	// #endif

	// #ifdef H5
	translateH5(imgSrc, callback);
	// #endif
}
/**
 * 加水印
 * 小区名称
 * 员工
 * 精度维度
 * 地址
 * 时间
 * 日期
 *
 * @param {Object} ctx
 */
export function addWaterMark(ctx, width, height) {
	let _date = new Date();
	let time = _date.getHours() + ":" + _date.getMinutes();
	let today = _date.getFullYear() + "-" + (_date.getMonth() + 1) + "-" + _date.getDate();

	ctx.font = "60px Arial";
	ctx.fillStyle = "rgba(255, 255, 255, 1)";
	ctx.fillText(time, 10, height - 150);
	ctx.font = "20px Arial";
	ctx.fillText(today, 20, height - 120);

	let _waterMark = uni.getStorageSync("IMG_WATER_MARK");
	if (!_waterMark) {
		return;
	}
	let _communityName = _waterMark.communityName;
	let _staffName = _waterMark.staffName;
	let _latitude = _waterMark.latitude;
	let _longitude = _waterMark.longitude;
	let _address = _waterMark.address;

	ctx.fillText(_communityName, 20, height - 95);
	ctx.fillText(_staffName, 20, height - 70);
	if (_latitude) {
		ctx.fillText("经度:" + _latitude + ",维度:" + _longitude, 20, height - 45);
	}
	if (_address && _address != "正在获取...") {
		ctx.fillText(_address, 20, height - 20);
	}

	//uni.removeStorageSync("IMG_WATER_MARK")
}

/**
 * 图片转base64
 *
 * @param imageUrl 图片地址
 * @param callback 回调
 */
function imageToBease64(that, imageUrl, callback) {
	// #ifdef MP-WEIXIN
	wx.getImageInfo({
		src: imageUrl,
		success(imgData) {
			const query = that.createSelectorQuery();
			query
				.select("#materCanvas")
				.fields({
					node: true,
					size: true,
				})
				.exec((res) => {
					const canvas = res[0].node;
					const ctx = canvas.getContext("2d");
					const image = canvas.createImage();
					image.src = imgData.path;
					image.onload = function () {
						let h = imgData.height;
						// 默认按比例压缩
						let w = imgData.width;
						if (h > 1080 || w > 1080) {
							let _rate = 0;
							if (h > w) {
								_rate = h / 1080;
								h = 1080;
								w = Math.floor(w / _rate);
							} else {
								_rate = w / 1080;
								w = 1080;
								h = Math.floor(h / _rate);
							}
						}
						canvas.width = w;
						canvas.height = h;
						ctx.drawImage(image, 0, 0, w, h); // 绘制图片

						// 设置水印样式
						addWaterMark(ctx, w, h);

						//压缩比例
						let quality = 0.3;
						let base64 = canvas.toDataURL("image/jpeg", quality);
						callback(base64);
					};
				});
		},
	});
	// #endif

	// #ifndef MP-WEIXIN
	uni.request({
		url: imageUrl,
		method: "GET",
		responseType: "arraybuffer",
		success: (ress) => {
			let base64 = wx.arrayBufferToBase64(ress.data);
			base64 = "data:image/jpeg;base64," + base64;
			callback(base64);
		},
		fail: (e) => {
			console.log("图片转换失败");
		},
	});
	// #endif
}

/**
 * base转Blob对象
 *
 * @param {Object} base64 base64地址
 */
export function base64ToBlob(base64) {
	var arr = base64.split(","),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new Blob([u8arr], {
		type: mime,
	});
}

export function translateH5(imgSrc, callback) {
	let img = new Image();
	img.src = imgSrc;
	img.onload = function () {
		let that = this;
		let h = that.height;
		// 默认按比例压缩
		let w = that.width;
		let canvas = document.createElement("canvas");
		let ctx = canvas.getContext("2d");
		let anw = document.createAttribute("width");
		anw.nodeValue = w;
		let anh = document.createAttribute("height");
		anh.nodeValue = h;
		canvas.setAttributeNode(anw);
		canvas.setAttributeNode(anh);
		ctx.drawImage(that, 0, 0, w, h);
		addWaterMark(ctx, w, h);

		//压缩比例
		let quality = 0.3;
		let base64 = canvas.toDataURL("image/jpeg", quality);
		canvas = null;
		callback(base64);
	};
}
