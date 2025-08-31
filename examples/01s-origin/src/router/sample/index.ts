const routes = [
	{
		path: "/sample",
		name: "Sample",
		redirect: { path: "/sample/file" },
		component: () => import("@/views/sample/SampleView.vue"),
		children: [
			{
				name: "sfile",
				path: "/sample/file",
				component: () => import("@/views/sample/file/FileUpload.vue"),
			},
			{
				name: "sexcel",
				path: "/sample/excel",
				component: () => import("@/views/sample/excel/Excel.vue"),
			},
			{
				name: "sprint",
				path: "/sample/print",
				component: () => import("@/views/sample/print/Print.vue"),
			},
			{
				name: "seditor",
				path: "/sample/editor",
				component: () => import("@/views/sample/editor/Editor.vue"),
			},
			{
				name: "spdf",
				path: "/sample/pdfobject",
				component: () => import("@/views/sample/pdfobject/PdfObject.vue"),
			},
			{
				name: "secharts",
				path: "/sample/echarts",
				component: () => import("@/views/sample/echarts/Echarts.vue"),
			},
			{
				name: "sformcreate",
				path: "/sample/formcreate",
				component: () => import("@/views/sample/formcreate/FormCreate.vue"),
			},
			{
				name: "sflow",
				path: "/sample/flow",
				component: () => import("@/views/sample/flow/Flow.vue"),
			},
		],
	},
];

export default routes;
