import type { EndpointDefinition } from "../../shared/runtime/endpoint-registry";
import { asRecord, mergeInput } from "../../shared/runtime/legacy-endpoint-input";
import { getFeeRuntime } from "./runtime";

export const feeLegacyEndpointDefinitions: EndpointDefinition[] = [
	{
		url: "/app/fee.listFee",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getFeeRuntime(event).legacyAdapter.listFee(mergeInput(query, body)),
	},
	{
		url: "/app/fee.queryFeeDetail",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getFeeRuntime(event).legacyAdapter.queryFeeDetail(mergeInput(query, body)),
	},
	{
		url: "/app/feeApi/listOweFees",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getFeeRuntime(event).legacyAdapter.listOweFees(mergeInput(query, body)),
	},
	{
		url: "/app/payment.nativeQrcodePayment",
		method: "POST",
		handler: ({ body, event }) => getFeeRuntime(event).legacyAdapter.nativeQrcodePayment(asRecord(body)),
	},
	{
		url: "/app/oweFeeCallable.listOweFeeCallable",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getFeeRuntime(event).legacyAdapter.listOweFeeCallable(mergeInput(query, body)),
	},
	{
		url: "/app/oweFeeCallable.writeOweFeeCallable",
		method: "POST",
		handler: ({ body, event }) => getFeeRuntime(event).legacyAdapter.writeOweFeeCallable(asRecord(body)),
	},
	{
		url: "/app/fee.saveRoomCreateFee",
		method: "POST",
		handler: ({ body, event }) => getFeeRuntime(event).legacyAdapter.saveRoomCreateFee(asRecord(body)),
	},
	{
		url: "/app/feeConfig.listFeeConfigs",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getFeeRuntime(event).legacyAdapter.listFeeConfigs(mergeInput(query, body)),
	},
	{
		url: "/app/reportFeeMonthStatistics.queryReportFeeSummary",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getFeeRuntime(event).legacyAdapter.getFeeSummaryReport(mergeInput(query, body)),
	},
	{
		url: "/app/reportFeeMonthStatistics/queryPayFeeDetail",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) =>
			getFeeRuntime(event).legacyAdapter.getPayFeeDetailReport(mergeInput(query, body)),
	},
	{
		url: "/app/reportFeeMonthStatistics.queryReportFeeDetailRoom",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getFeeRuntime(event).legacyAdapter.getRoomFeeReport(mergeInput(query, body)),
	},
	{
		url: "/app/dataReport.queryFeeDataReport",
		method: ["GET", "POST"],
		handler: ({ query, body, event }) => getFeeRuntime(event).legacyAdapter.getDataReport(mergeInput(query, body)),
	},
];
