import { $t } from "@/plugins/i18n";
import { RouterOrderEnums } from "@/router/enums";

export default {
	path: "/able",
	redirect: "/able/watermark",
	meta: {
		icon: "ri/ubuntu-fill",
		title: $t("common.menus.pureAble"),
		rank: RouterOrderEnums.able,
	},
	children: [
		{
			path: "/able/mqtt-client",
			name: "MqttClient",
			component: () => import("@/views/able/mqtt-client.vue"),
			meta: {
				title: $t("common.menus.pureMqtt"),
			},
		},
		{
			path: "/able/verify",
			name: "Verify",
			component: () => import("@/views/able/verify.vue"),
			meta: {
				title: $t("common.menus.pureVerify"),
			},
		},
		{
			path: "/able/watermark",
			name: "WaterMark",
			component: () => import("@/views/able/watermark.vue"),
			meta: {
				title: $t("common.menus.pureWatermark"),
			},
		},
		{
			path: "/able/print",
			name: "Print",
			component: () => import("@/views/able/print/index.vue"),
			meta: {
				title: $t("common.menus.purePrint"),
			},
		},
		{
			path: "/able/download",
			name: "Download",
			component: () => import("@/views/able/download.vue"),
			meta: {
				title: $t("common.menus.pureDownload"),
			},
		},
		{
			path: "/able/excel",
			name: "Excel",
			component: () => import("@/views/able/excel.vue"),
			meta: {
				title: $t("common.menus.pureExcel"),
			},
		},
		{
			path: "/components/ripple",
			name: "Ripple",
			component: () => import("@/views/able/ripple.vue"),
			meta: {
				title: $t("common.menus.pureRipple"),
			},
		},
		{
			path: "/able/debounce",
			name: "Debounce",
			component: () => import("@/views/able/debounce.vue"),
			meta: {
				title: $t("common.menus.pureDebounce"),
			},
		},
		{
			path: "/able/directives",
			name: "Directives",
			component: () => import("@/views/able/directives.vue"),
			meta: {
				title: $t("common.menus.pureOptimize"),
			},
		},
		{
			path: "/able/draggable",
			name: "Draggable",
			component: () => import("@/views/able/draggable.vue"),
			meta: {
				title: $t("common.menus.pureDraggable"),
				transition: {
					enterTransition: "animate__zoomIn",
					leaveTransition: "animate__zoomOut",
				},
			},
		},
		{
			path: "/able/pdf",
			name: "Pdf",
			component: () => import("@/views/able/pdf.vue"),
			meta: {
				title: $t("common.menus.purePdf"),
			},
		},
		{
			path: "/able/barcode",
			name: "BarCode",
			component: () => import("@/views/able/barcode.vue"),
			meta: {
				title: $t("common.menus.pureBarcode"),
			},
		},
		{
			path: "/able/qrcode",
			name: "QrCode",
			component: () => import("@/views/able/qrcode.vue"),
			meta: {
				title: $t("common.menus.pureQrcode"),
			},
		},
		{
			path: "/able/map",
			name: "MapPage",
			component: () => import("@/views/able/map.vue"),
			meta: {
				title: $t("common.menus.pureMap"),
				keepAlive: true,
				transition: {
					name: "fade",
				},
			},
		},
		{
			path: "/able/wavesurfer",
			name: "Wavesurfer",
			component: () => import("@/views/able/wavesurfer/index.vue"),
			meta: {
				title: $t("common.menus.pureWavesurfer"),
			},
		},
		{
			path: "/able/video",
			name: "VideoPage",
			component: () => import("@/views/able/video.vue"),
			meta: {
				title: $t("common.menus.pureVideo"),
			},
		},
		{
			path: "/able/video-frame",
			name: "VideoFrame",
			component: () => import("@/views/able/video-frame/index.vue"),
			meta: {
				title: $t("common.menus.pureVideoFrame"),
			},
		},
		{
			path: "/able/danmaku",
			name: "Danmaku",
			component: () => import("@/views/able/danmaku/index.vue"),
			meta: {
				title: $t("common.menus.pureDanmaku"),
			},
		},
		{
			path: "/able/infinite-scroll",
			name: "InfiniteScroll",
			component: () => import("@/views/able/infinite-scroll.vue"),
			meta: {
				title: $t("common.menus.pureInfiniteScroll"),
			},
		},
		{
			path: "/able/menu-tree",
			name: "MenuTree",
			component: () => import("@/views/able/menu-tree.vue"),
			meta: {
				title: $t("common.menus.pureMenuTree"),
			},
		},
		{
			path: "/able/line-tree",
			name: "LineTree",
			component: () => import("@/views/able/line-tree.vue"),
			meta: {
				title: $t("common.menus.pureLineTree"),
			},
		},
		{
			path: "/able/typeit",
			name: "Typeit",
			component: () => import("@/views/able/typeit.vue"),
			meta: {
				title: $t("common.menus.pureTypeit"),
			},
		},
		{
			path: "/able/sensitive",
			name: "Sensitive",
			component: () => import("@/views/able/sensitive.vue"),
			meta: {
				title: $t("common.menus.pureSensitive"),
			},
		},
		{
			path: "/able/pinyin",
			name: "Pinyin",
			component: () => import("@/views/able/pinyin.vue"),
			meta: {
				title: $t("common.menus.purePinyin"),
			},
		},
	],
} satisfies RouteConfigsTable;
