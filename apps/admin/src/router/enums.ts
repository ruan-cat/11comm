// 完整版菜单比较多，将 rank 抽离出来，在此方便维护

/**
 * 路由排序枚举
 * @description
 * 现在已经使用的自动导入插件 为了避免出现重名导入失败 这里改写变量存储方案
 * 改成导出一个变量的形式
 */
export enum RouterOrderEnums {
	home = 0, // 平台规定只有 home 路由的 rank 才能为 0 ，所以后端在返回 rank 的时候需要从非 0 开始
	chatai = 1,
	vueflow = 2,
	ganttastic = 3,
	components = 4,
	able = 5,
	table = 6,
	form = 7,
	list = 8,
	result = 9,
	error = 10,
	frame = 11,
	nested = 12,
	permission = 13,
	system = 14,
	monitor = 15,
	tabs = 16,
	about = 17,
	codemirror = 18,
	markdown = 19,
	editor = 20,
	flowchart = 21,
	formdesign = 22,
	board = 23,
	ppt = 24,
	mind = 25,
	guide = 26,
	menuoverflow = 27,
}
