// 使用ElementPlus和FcDesigner
import FcDesigner from "@form-create/designer";
import ElementPlus from "element-plus";

import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { createPinia } from "pinia";
// 使用持久化插件
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import App from "./App.vue";
// 安装ElIcon
import installElIcon from "./plugins/el-icon";

// 安装HTTP中间件
import installHttp from "./plugins/http";

import router from "./routers";
import i18n from "./views/i18n"; // 引入 i18n 配置
import "element-plus/es/components/message/style/css";

import "./assets/main.css";

import "./assets/iconfont/iconfont.css";

const app = createApp(App);
app.use(createPinia().use(piniaPluginPersistedstate));
app.use(router);

// 使用ElementPlus和FcDesigner
app.use(ElementPlus, { locale: zhCn });
app.use(FcDesigner);
app.use(i18n); // 使用 i18n
app.mount("#app");
installHttp(router);

// 安装 vueuse 版本的接口请求工具
installAxiosWithVueUse(router, axiosInstance);

installElIcon(app);
