declare module "vue-plugin-hiprint" {
	import { Plugin } from "vue";
	const disAutoConnect: () => void;
	const hiprint: any;

	export { disAutoConnect, hiprint };
	const VueHiPrint: Plugin;
	export default VueHiPrint;
}
