import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getParkingRuntime } from "./runtime";

export const parkingLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/owner.queryOwnerCars",
		method: "GET",
		handler: ({ query, body, event }) => getParkingRuntime(event).legacyAdapter.queryOwnerCars(mergeInput(query, body)),
	},
	{
		url: "/app/parkingArea.listParkingAreas",
		method: "GET",
		handler: ({ query, body, event }) =>
			getParkingRuntime(event).legacyAdapter.listParkingAreas(mergeInput(query, body)),
	},
	{
		url: "/app/machine.listParkingAreaMachines",
		method: "GET",
		handler: ({ query, body, event }) =>
			getParkingRuntime(event).legacyAdapter.listParkingAreaMachines(mergeInput(query, body)),
	},
	{
		url: "/app/machine.getBarrierCloudVideo",
		method: "GET",
		handler: ({ query, body, event }) =>
			getParkingRuntime(event).legacyAdapter.getBarrierCloudVideo(mergeInput(query, body)),
	},
	{
		url: "/app/carInout.listCarInParkingAreaCmd",
		method: "GET",
		handler: ({ query, body, event }) =>
			getParkingRuntime(event).legacyAdapter.listCarInParkingArea(mergeInput(query, body)),
	},
	{
		url: "/app/parkingCoupon.listParkingCouponCar",
		method: "GET",
		handler: ({ query, body, event }) =>
			getParkingRuntime(event).legacyAdapter.listParkingCouponCar(mergeInput(query, body)),
	},
	{
		url: "/app/tempCarFee.getTempCarFeeOrder",
		method: "GET",
		handler: ({ query, body, event }) =>
			getParkingRuntime(event).legacyAdapter.getTempCarFeeOrder(mergeInput(query, body)),
	},
	{
		url: "/app/carInoutDetail.listCarInoutDetail",
		method: "GET",
		handler: ({ query, body, event }) =>
			getParkingRuntime(event).legacyAdapter.listCarInoutDetails(mergeInput(query, body)),
	},
	{
		url: "/app/carInoutPayment.listCarInoutPayment",
		method: "GET",
		handler: ({ query, body, event }) =>
			getParkingRuntime(event).legacyAdapter.listCarInoutPayments(mergeInput(query, body)),
	},
	{
		url: "/app/machine/openDoor",
		method: "POST",
		handler: ({ query, body, event }) =>
			getParkingRuntime(event).legacyAdapter.guardedWrite("/app/machine/openDoor", mergeInput(query, body)),
	},
	{
		url: "/app/machine/closeDoor",
		method: "POST",
		handler: ({ query, body, event }) =>
			getParkingRuntime(event).legacyAdapter.guardedWrite("/app/machine/closeDoor", mergeInput(query, body)),
	},
	{
		url: "/app/machine.customCarInOutCmd",
		method: "POST",
		handler: ({ query, body, event }) =>
			getParkingRuntime(event).legacyAdapter.guardedWrite("/app/machine.customCarInOutCmd", mergeInput(query, body)),
	},
];
