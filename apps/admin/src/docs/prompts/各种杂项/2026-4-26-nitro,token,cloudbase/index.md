<!-- TODO: 长期任务 未开始 -->

# 实现接口服务对接 cloudbase，实现微信小程序的登录业务

目前先编写清楚各种技术实现边界，和各种可能的肯定，划定清楚各个技术栈工具的功能职责。

---

CloudBase：
只放 login 云函数 / 微信身份桥
只负责小程序云开发环境关联
只负责小程序部署相关能力
不放业务数据库
不放文件服务
不放主要业务 API

Vercel Nitro：
放全部业务 API
放 admin API
放小程序 API
放 Neon 数据访问
放 Cloudflare 文件签名和文件元数据管理

Cloudflare：
放文件对象
放 CDN
放图片处理

Neon：
放业务数据源
tenant / mini_app / user / order / file metadata 全部在这里
