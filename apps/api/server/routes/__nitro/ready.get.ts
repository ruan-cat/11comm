import { defineHandler, setResponseStatus } from "nitro/h3";
import { hasDatabaseUrl, useDb } from "../../db";
import { probeDatabaseReadiness, type DatabaseReadinessProbeResult } from "../../db/readiness";
import { getPublicRuntimeConfig } from "../../shared/runtime/env";
import { probeR2EnvReadiness, type R2EnvReadinessResult } from "../../shared/runtime/r2-env";
import { getApiRequestContext } from "../../shared/runtime/request-context";

export default defineHandler(async (event) => {
	const requestContext = getApiRequestContext(event);
	const publicConfig = getPublicRuntimeConfig();
	const configured = hasDatabaseUrl(event);
	const phase7DbReadinessCheckEnabled = isPhase7DbReadinessCheckEnabled();

	if (!configured) {
		setResponseStatus(event, 503);
		return buildReadyResponse({
			success: false,
			ready: false,
			code: "DATABASE_CONFIG_MISSING",
			message: "Database URL is not configured.",
			requestId: requestContext.requestId,
			service: publicConfig.serviceName,
			phase: publicConfig.phase,
			configured: false,
			connected: false,
			probeEnabled: phase7DbReadinessCheckEnabled,
		});
	}

	if (phase7DbReadinessCheckEnabled) {
		try {
			const probe = await probeDatabaseReadiness(useDb(event));
			const r2 = probeR2EnvReadiness(event);
			const ready = probe.connected && probe.schema.requiredTablesPresent && probe.migrations.upToDate && r2.configured;

			if (!ready) {
				setResponseStatus(event, 503);
				return buildReadyResponse({
					success: false,
					ready: false,
					code: resolvePhase7ReadinessFailureCode(probe, r2),
					message: resolvePhase7ReadinessFailureMessage(probe, r2),
					requestId: requestContext.requestId,
					service: publicConfig.serviceName,
					phase: publicConfig.phase,
					configured: true,
					connected: probe.connected,
					probeEnabled: true,
					probe,
					r2,
				});
			}

			setResponseStatus(event, 200);
			return buildReadyResponse({
				success: true,
				ready: true,
				code: "DB_READY",
				message: "Ready; database connection, required tables, and Drizzle migrations are verified.",
				requestId: requestContext.requestId,
				service: publicConfig.serviceName,
				phase: publicConfig.phase,
				configured: true,
				connected: true,
				probeEnabled: true,
				probe,
				r2,
			});
		} catch (error) {
			setResponseStatus(event, 503);
			return buildReadyResponse({
				success: false,
				ready: false,
				code: "DATABASE_CONNECTION_FAILED",
				message: "Database readiness probe failed.",
				requestId: requestContext.requestId,
				service: publicConfig.serviceName,
				phase: publicConfig.phase,
				configured: true,
				connected: false,
				probeEnabled: true,
				error: error instanceof Error ? error.message : String(error),
			});
		}
	}

	setResponseStatus(event, 200);
	return buildReadyResponse({
		success: true,
		ready: true,
		code: "READY_CONFIGURED",
		message: "Ready; database URL is configured.",
		requestId: requestContext.requestId,
		service: publicConfig.serviceName,
		phase: publicConfig.phase,
		configured: true,
		connected: null,
		probeEnabled: false,
	});
});

function buildReadyResponse(input: {
	success: boolean;
	ready: boolean;
	code: string;
	message: string;
	requestId: string;
	service: string;
	phase: string;
	configured: boolean;
	connected: boolean | null;
	probeEnabled: boolean;
	probe?: DatabaseReadinessProbeResult;
	r2?: R2EnvReadinessResult;
	error?: string;
}) {
	return {
		success: input.success,
		ready: input.ready,
		code: input.code,
		message: input.message,
		service: input.service,
		phase: input.phase,
		requestId: input.requestId,
		timestamp: new Date().toISOString(),
		checks: {
			database: {
				configured: input.configured,
				connected: input.connected,
				probeEnabled: input.probeEnabled,
				...(input.probe
					? {
							schema: input.probe.schema,
							migrations: input.probe.migrations,
						}
					: {}),
				...(input.error ? { error: input.error } : {}),
			},
			...(input.r2
				? {
						r2: input.r2,
					}
				: {}),
		},
	};
}

function resolvePhase7ReadinessFailureCode(probe: DatabaseReadinessProbeResult, r2: R2EnvReadinessResult): string {
	if (!probe.schema.requiredTablesPresent) {
		return "DATABASE_SCHEMA_MISSING";
	}
	if (!probe.migrations.upToDate) {
		return "DATABASE_MIGRATIONS_NOT_READY";
	}
	if (!r2.configured) {
		return "R2_ENV_MISSING";
	}
	return "PHASE7_READINESS_NOT_READY";
}

function resolvePhase7ReadinessFailureMessage(probe: DatabaseReadinessProbeResult, r2: R2EnvReadinessResult): string {
	if (!probe.schema.requiredTablesPresent) {
		return "Database is reachable, but required Phase7 tables are missing.";
	}
	if (!probe.migrations.upToDate) {
		return "Database is reachable, but Drizzle migrations are not ready.";
	}
	if (!r2.configured) {
		return "R2 environment variables are not fully configured.";
	}
	return "Phase7 readiness checks are not ready.";
}

function isPhase7DbReadinessCheckEnabled(): boolean {
	return process.env.RUN_PHASE7_DB_READINESS_CHECK === "1";
}
