import { defineComponent, Fragment } from "vue";
import { hasAuth } from "@/router/utils";

export default defineComponent({
	// name: "Auth",
	name: "ReAuth",
	props: {
		value: {
			type: undefined,
			default: [],
		},
	},
	setup(props, { slots }) {
		return () => {
			if (!slots) return null;
			return hasAuth(props.value) ? <Fragment>{slots.default?.()}</Fragment> : null;
		};
	},
});
