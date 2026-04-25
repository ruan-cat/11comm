import url from "../../constant/url.js";

/**
 * 流转
 * @param {Object} _that 上下文对象
 * @param {Object} _data 请求报文
 */
export function UpdateInspectionTask(_that, _data) {
	return new Promise(function (reslove, reject) {
		_that.context.post({
			url: url.UpdateInspectionTask,
			data: _data,
			success: function (res) {
				reslove(res.data);
			},
			fail: function (e) {
				wx.showToast({
					title: "服务器异常了",
					icon: "none",
					duration: 2000,
				});
			},
		});
	});
}

/**
 * 查询字典表
 * @param {Object} _that 上下文对象
 * @param {Object} _data 请求报文
 */
export function queryDictInfo(_that, _data) {
	return new Promise(function (reslove, reject) {
		_that.context.get({
			url: url.queryDictInfo,
			data: _data,
			success: function (res) {
				reslove(res.data);
			},
			fail: function (e) {
				wx.showToast({
					title: "服务器异常了",
					icon: "none",
					duration: 2000,
				});
			},
		});
	});
}

/**
 * 投票问卷
 * @param {Object} _data 评价内容
 */
export function queryInspectionItemTitle(_that, _data) {
	return new Promise((resolve, reject) => {
		let moreRooms = [];
		_that.context.get({
			url: url.listInspectionItemTitle,
			data: _data, //动态数据
			success: function (res) {
				let _data = res.data;
				if (_data.code == 0) {
					resolve(_data);
					return;
				}
				reject(_data.msg);
			},
			fail: function (e) {
				reject(e);
			},
		});
	});
}

export function queryReportStaffInspection(_that, _data) {
	return new Promise((resolve, reject) => {
		let moreRooms = [];
		_that.context.get({
			url: url.queryReportStaffInspection,
			data: _data, //动态数据
			success: function (res) {
				let _data = res.data;
				if (_data.code == 0) {
					resolve(_data);
					return;
				}
				reject(_data.msg);
			},
			fail: function (e) {
				reject(e);
			},
		});
	});
}

/**
 * 查询巡检明细
 * @param {} _that
 * @param {*} _data
 */
export function listInspectionTaskDetails(_that, _data) {
	return new Promise((resolve, reject) => {
		let moreRooms = [];
		_that.context.get({
			url: url.listInspectionTaskDetails,
			data: _data, //动态数据
			success: function (res) {
				let _data = res.data;
				if (_data.code == 0) {
					resolve(_data);
					return;
				}
				reject(_data.msg);
			},
			fail: function (e) {
				reject(e);
			},
		});
	});
}
var x_PI = (3.14159265358979324 * 3000.0) / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;

function out_of_china(lng, lat) {
	var lat = +lat;
	var lng = +lng;
	// 纬度3.86~53.55,经度73.66~135.05
	return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
}
function transformlat(lng, lat) {
	var lat = +lat;
	var lng = +lng;
	var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
	ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
	ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0;
	ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0;
	return ret;
}
function transformlng(lng, lat) {
	var lat = +lat;
	var lng = +lng;
	var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
	ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
	ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0;
	ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0;
	return ret;
}
export function wgs84togcj02(lng, lat) {
	var lat = +lat;
	var lng = +lng;
	if (out_of_china(lng, lat)) {
		return [lng, lat];
	} else {
		var dlat = transformlat(lng - 105.0, lat - 35.0);
		var dlng = transformlng(lng - 105.0, lat - 35.0);
		var radlat = (lat / 180.0) * PI;
		var magic = Math.sin(radlat);
		magic = 1 - ee * magic * magic;
		var sqrtmagic = Math.sqrt(magic);
		dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
		dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
		var mglat = lat + dlat;
		var mglng = lng + dlng;
		return { lat: mglat, lng: mglng };
	}
}
