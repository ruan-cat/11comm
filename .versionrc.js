const { commitTypes } = require("@ruan-cat/commitlint-config");

/** @see https://juejin.cn/post/7145412114532794382 */
module.exports = {
	// 跳过
	skip: {
		// 取得当前版本（比如package.json里面的version字段，这里我们定义了packageFiles，所以会从packageFiles.filename取），
		// 升版本：1.0.0 => 1.1.0 或者 1.0.0 => 2.0.0等（如何升级可以由参数控制）
		bump: false,
		// 自动产出changelog文档
		changelog: true,
		// 提交变动
		commit: true,
		// 在git中增加tag标识
		tag: true,
	},
	types: commitTypes.map((commitType) => {
		const { type, description, emoji } = commitType;
		return {
			type,
			section: description,
			hidden: false,
		};
	}),
};
