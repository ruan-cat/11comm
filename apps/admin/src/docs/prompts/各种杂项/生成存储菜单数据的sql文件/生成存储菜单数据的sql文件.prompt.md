# 生成存储菜单数据的 sql 文件

根据我提供的路由菜单 json 数据，和指定格式的 sql 查询语句，为我生成 sql 查询文件。

## 数据准备计划表

1. 完成 rank 排序。（√ 已完成）
2. 实现菜单路由的重定向配置。（√ 已完成）
3. 完成角色权限的配置。（√ 已完成）
4. 编写提示词。
5. 开始生成 SQL，交付给后端。

## 数据源

`.github\prompts\生成存储菜单数据的sql文件\menu-routes.json`

其中，数据源会变化。我会要求你重新根据数据源，来生成 sql 文件的。

全部的数据源都是 vue-router 的路由对象。

### 用语说明

我会用以下名称来称呼这些路由：

- `详情页路由`
- `一级路由`
- `二级路由`
- `三级路由`

### 不需要处理的路由

`详情页路由`，是不需要被处理的。如果你发现路由的标题写了 `"title": "详情页-不显示-默认的占位符页面"` 的标题。那么连同本路由以及相关的子路由，都不需要做处理。

此外，详情页路由的 name 字段一定是包含子串 `-detail-page` 的，只要发现有任何一个路由的名称包含 `-detail-page` 子串，就可以认定为是详情页路由。

详情页路由，不需要参与下面的 sql 语句生成。

### 需要处理的路由

出来详情页路由，其他的一级、二级和三级路由都需要被处理，作为生成 sql 语句的数据源。

## sql 查询语句模板

`.github\prompts\生成存储菜单数据的sql文件\zo_community_init_menu.sql`

请不要覆盖覆写 sql 文件。

## sql 文件生成位置

生成在 `.github\prompts\生成存储菜单数据的sql文件\sql` 内。

## 角色信息

经过和后端团队的协商，前端页面需要写死角色信息，用于生成带有角色信息的菜单信息。

固定写死的角色信息如下：

- 开发团队
- 物业团队
- 运营团队
- 组织员工

角色信息即 store_type 字段。其对应关系如下：

| 角色名称 | 数据库存储的 id 值 |
| :------: | :----------------: |
| 开发团队 |    800900000001    |
| 物业团队 |    800900000002    |
| 运营团队 |    800900000003    |
| 组织员工 |    800900000004    |

这些数据来自于 `meta.roles` 数组。

### 多角色的路由生成多条数据库记录

如果有一个路由，其 meta.roles 配置了多个角色数据，那么就生成多条数据库记录。

## m_menu_catalog (菜单目录)

菜单目录，就是一级路由。

按照以下要求，对应各个表字段。

- ca_id 使用 uuid 生成
- name 即 meta.title
- icon 即 meta.icon
- seq 即 meta.rank
- store_type 即角色信息 meta.roles。请根据上述的角色信息表做对应的翻译转换。
- url 即路由的 path
- is_show 默认为写死的 Y
- create_time 默认为现在。每一个 create_time 之间都间隔一秒。
- status_cd 默认为**数值**的 0。
- priv_id 默认为 NULL

## m_menu_group (菜单组)

- g_id 使用 uuid 生成
- name 即 meta.title
- icon 即 meta.icon
- label 即 meta.title
- seq 即 meta.rank
- description 即 meta.title
- create_time 默认为现在。每一个 create_time 之间都间隔一秒。
- status_cd 默认为**字符串**的 0。
- group_type 默认写死为 P_WEB
- store_type 即角色信息 meta.roles。请根据上述的角色信息表做对应的翻译转换。

## m_menu (菜单项)

- m_id 使用 uuid 生成
- name 即 meta.title
- g_id 即 对应父级路由的 g_id。
- url 即路由的 path
- seq 即 meta.rank
- p_id 使用 uuid 生成
- description 即 meta.title
- create_time 默认为现在。每一个 create_time 之间都间隔一秒。
- status_cd 默认为**字符串**的 0。
- is_show 默认为写死的 Y

## p_privilege (权限)

不予生成。

## m_menu_group_catalog (菜单组目录关联)

不予生成。
