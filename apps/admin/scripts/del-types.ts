import { consola } from "consola";
import { deleteAsync } from "del";

/**
 * 需要清理的自动生成类型文件
 * @description
 * Vue Router v5 的文件路由类型已经迁移到 `src/route-map.d.ts`。
 */
const generatedTypeFiles = <const>[
	"./types/components*.d.ts",
	"./types/auto-imports.d.ts",
	"./types/typed-router.d.ts",
	"./src/route-map.d.ts",
];

generatedTypeFiles.forEach(async (typeFilePath) => {
	try {
		const resDeleteAsync = await deleteAsync(typeFilePath);
		// consola.info(" 查看删除文件的返回值路径： ", resDeleteAsync);
		consola.success(`删除类型文件 ${typeFilePath} 成功`);
	} catch (error) {
		consola.error(`删除类型文件 ${typeFilePath} 失败`);
	}
});
