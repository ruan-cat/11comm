## ADDED Requirements

### Requirement: 系统必须提供微信小程序开发期的 Nitro 串行引导命令

系统 SHALL 提供一个用于微信小程序开发的串行启动命令，先启动独立 Nitro，再启动 uni 编译链。

#### Scenario: 独立 Nitro 就绪后再启动小程序编译

- **WHEN** 开发者执行微信小程序 Nitro 开发命令
- **THEN** 系统 SHALL 先启动独立 Nitro 服务
- **THEN** 系统 SHALL 在健康检查通过后再启动 `uni -p mp-weixin`

### Requirement: 系统必须在 Nitro 未就绪时阻止小程序编译继续

系统 SHALL 在独立 Nitro 未通过健康检查时终止后续小程序编译启动，并给出可诊断的错误信息。

#### Scenario: 健康检查失败

- **WHEN** 启动脚本在限定时间内未收到 Nitro 健康检查成功响应
- **THEN** 系统 SHALL 终止本次小程序启动流程
- **THEN** 系统 SHALL 输出明确的超时或启动失败信息
