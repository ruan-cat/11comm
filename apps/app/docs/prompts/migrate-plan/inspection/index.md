# 巡检管理模块 提示词

## 001 开始大批量的完成巡检模块的初步迁移

1. 阅读 `docs\vue2-route-navigation-map.md` 的 `巡检管理流程模块` 部分，了解清楚该模块有那些页面需要迁移，以及各个页面的关系。
2. 阅读 `docs\prompts\route-migration-map.yml` 的 `inspection_modules` 部分，明确清楚新页面和旧页面之间的映射关系。
3. 适当的阅读 `.claude\skills` 技能文件，在迁移时，务必遵守这些技能文件的要求。
4. 新建任务清单：
   - 为了避免你丢失任务信息和上下文，我要求你在 `docs\prompts\migrate-plan\inspection` 目录内，新建一个迁移目标，迁移任务清单的文件。避免你因为上下文合并或者是其他意外情况，导致丢失任务进度信息。
   - 请你先完成这样的清单文件新建。然后再开始下一步的迁移任务。

## 002 初始化强类型路由

你的路由跳转实现 `uni-mini-router` ，完全错了，本项目跳转路由时，用的不是这个方案。实现迁移时，请认真阅读 `.claude\skills\route-migration` 的路由跳转方案。

1. 阅读清楚正确的 `route-migration` 路由迁移技能。
2. 按照技能，初始化强类型的路由
3. 去更改 `src\pages-sub\inspection` 目录内全部的页面，使用正确的写法。避免使用不存在的 `uni-mini-router` 。

## 003 补全旧代码说明入口

1. 阅读 `docs\prompts\route-migration-map.yml` 的 `inspection_modules` 部分。
2. 阅读全部的 `src\pages-sub\inspection` vue 组件代码，确保这部分的页面都补全和其他模块代码一样的 `旧代码` 注释。便于我追踪旧代码。

## 004 移动 `src\pages-sub\inspection\types.ts` 类型文件到正确的位置

1. 按照 `.claude\skills\api-migration\类型定义规范.md` ，移动该类型文件到正确的位置。

## 005 初始化业务类型、mock 接口、与 api

1. 阅读 `docs\prompts\route-migration-map.yml` 的 `inspection_modules` 部分。
2. 阅读全部的 `src\pages-sub\inspection` vue 组件代码，反向追踪旧代码。
3. 按照 `api-migration` api 迁移技能，完整地迁移 inspection 巡检业务的业务类型、mock 接口、和使用的 api 接口函数。

### 01 处理类型错误

1. 阅读全部的 `.claude\skills\api-migration` 迁移技能。
2. 修复 `src\api\mock\inspection.mock.ts` 出现的类型报错。
3. 注意阅读其他的 xxx.mock.ts 接口，模仿其他 mock 接口的实现方式。

### 02 继续处理修复 `src\api\mock\inspection.mock.ts` 出现的类型报错

## 006 处理错误的组件使用类型错误

1. 阅读全部的 `src\pages-sub\inspection` vue 组件代码，阅读其出现的类型报错。
2. 使用 `.claude\skills\component-migration` 的要求，处理代码出现的组件 props 类型使用错误。

### 01

为什么你在迁移代码的时候，还是会反反复复的出现 `wot-design-uni` 组件库文档使用错误的情况？很多组件的参数都填写错误了。

我在 `CLAUDE.md` 内有说明，你为什么没有遵守要求呢？请给出解决方案，使得你完成修改时，能够准确的遵守上下文。

### 02

我需要你提出一个长期解决方案，为什么你在使用技能文件来完成迁移任务时，会经常性的出现上下文缺失的情况？是技能文件太长？触发词汇没写好？还是你没有认真落实渐进式揭露的原则？

我需要你从本次的错误内，找到通用的解决方案。下次迁移别的模块时，不要出现类似的错误。

## 007 优化并解决 `src\pages-sub\inspection\execute-single.vue` 执行单项巡检页面，出现选择项问题

### 你之前向我询问过以下组件使用问题

❓ 请教一个问题

关于动态表单项部分（第 325-381 行），目前使用了 wd-radio-group 和 wd-checkbox-group：

```vue
<template>
	<!-- 单选 -->
	<view v-if="item.titleType === '1001'" class="p-3">
		<wd-radio-group>...</wd-radio-group>
	</view>

	<!-- 多选 -->
	<view v-else-if="item.titleType === '2002'" class="p-3">
		<wd-checkbox-group>...</wd-checkbox-group>
	</view>
</template>
```

这部分是根据后端返回的数据动态生成的，选项数量不固定。请问：

1. 是否也应该改为 wd-picker？
2. 还是动态场景可以使用 wd-radio-group？

我需要您的指导来决定如何处理这部分代码。

### 具体解答与指示如下

1. 对于动态返回的数据，仍旧使用 `wd-picker` 组件。
2. 对于 `执行单项巡检页面` 出现的单选和多选情况。按照这样的原则处置：
   - 单选时，一律用 `wd-picker` 组件。
   - 多选时，一律用 `wd-checkbox` 组件。

### 你要执行的步骤

1. 去修改 `执行单项巡检页面` 。使用正确的组件。
2. 阅读 `https://github.com/Moonofweisheng/wot-design-uni/blob/master/docs/component/checkbox.md` 文档，使用正确的 `wd-checkbox` 组件用法。
3. 更新迭代 `.claude\skills\component-migration\SKILL.md` 技能，说明清楚在多选情况下，使用 `wd-checkbox` 组件。
4. 更新迭代 `.claude\skills\use-wd-form\SKILL.md` 技能，补充说明上述的组件选用原则，并补充多选业务下使用的 `wd-checkbox` 组件细则。

## 008 `src\pages-sub\inspection\execute-single.vue` 执行单项巡检页面

### 01 优化 icon 设置；补全设置 definePage 宏

针对 `src\pages-sub\inspection\execute-single.vue` 执行单项巡检页面。

1. 我不喜欢表单项的标题使用相同的 icon，发挥你的探索能力，选用美观的，特别的 icon 做出区分。
2. 为什么这个页面的标题不统一？其他页面都有配置 definePage 宏的。为什么你当初在完成迁移时，没有及时使用 definePage 宏配置，并完成最基础的页面标题配置？请补全配置。
3. `route-migration` 路由迁移技能 和 `code-migration` 代码写法迁移技能 ，都有说明如何使用 definePage ，为什么你没有及时设置好？是这些 claude code 技能文件的触发词没有说明清楚什么时候要补全 definePage 宏么？请你更新迭代这两个技能，确保以后在全局注入提示词时，能够主动使用关于 definePage 的使用知识点。

### 009 统一补全 definePage 宏设置

1. 阅读 `docs\vue2-route-navigation-map.md` 的 `巡检管理流程模块` 。
2. 阅读 `docs\prompts\route-migration-map.yml` 巡检管理模块 inspection_modules 的路径。
3. 反向阅读旧代码。读取旧代码内这些巡检模块页面正确的标题。
4. 按照 `.claude\skills\route-migration\SKILL.md` 技能要求，去补全全部 `src\pages-sub\inspection` 目录内的 vue 页面，补全 definePage 的使用。
