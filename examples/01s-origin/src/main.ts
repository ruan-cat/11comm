import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "element-plus/es/components/message/style/css";
import "./assets/main.css";

// 使用ElementPlus和FcDesigner
import FcDesigner from "@form-create/designer";
import ElementPlus from "element-plus";

const app = createApp(App);

app.use(createPinia());
app.use(router);

// 使用ElementPlus和FcDesigner
app.use(ElementPlus);
app.use(FcDesigner);

app.mount("#app");

// 安装HTTP中间件
import installHttp from "./plugins/http";
installHttp(router);

// 安装ElIcon
import installElIcon from "./plugins/el-icon";
installElIcon(app);
