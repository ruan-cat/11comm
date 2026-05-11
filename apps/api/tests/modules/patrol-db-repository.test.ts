import { describe, expect, test } from "vitest";
import { ptPatrolTaskDetails, ptPatrolTasks } from "@01s-11comm/type";

import { createDbPatrolRepository } from "../../server/modules/patrol/repository";

describe("patrol DB repository phase7 task detail batch", () => {
	test("maps patrol task list rows to admin compatibility items", async () => {
		const repository = createDbPatrolRepository(
			createFakeDb({
				taskRows: [
					{
						id: "TASK_001",
						planId: "PLAN_001",
						planName: "Daily patrol plan",
						taskCode: "PT-001",
						taskName: "Morning patrol",
						plannedPatroller: "Alice",
						patrolMethod: "walk",
						plannedStartTime: new Date("2026-05-11T08:00:00"),
						plannedEndTime: new Date("2026-05-11T09:00:00"),
						actualPatrolTime: new Date("2026-05-11T08:30:00"),
						status: "completed",
						currentPatrolPerson: "Bob",
						transferDescription: "handoff note",
						createTime: new Date("2026-05-10T10:00:00"),
						updateTime: new Date("2026-05-10T11:00:00"),
					},
				],
			}) as never,
		);

		const result = await repository.listPatrolTasks({ pageIndex: 1, pageSize: 10, patrolStatus: "completed" });

		expect(result.total).toBe(1);
		expect(result.list[0]).toMatchObject({
			id: "TASK_001",
			name: "Morning patrol",
			status: "completed",
			remark: "handoff note",
			taskCode: "PT-001",
			patrolPlan: "Daily patrol plan",
			patrolPersonTimeRange: "2026-05-11 08:00:00 ~ 2026-05-11 09:00:00",
			actualPatrolTime: "2026-05-11 08:30:00",
			plannedPatrolPerson: "Alice",
			currentPatrolPerson: "Bob",
			transferDescription: "handoff note",
			patrolMethod: "walk",
			patrolStatus: "completed",
			createTime: "2026-05-10 10:00:00",
			updateTime: "2026-05-10 11:00:00",
		});
	});

	test("maps patrol detail list rows with joined point path plan fields", async () => {
		const repository = createDbPatrolRepository(
			createFakeDb({
				detailRows: [
					{
						detailId: "DETAIL_001",
						taskId: "TASK_001",
						pointId: "POINT_001",
						checkInStatus: "abnormal",
						patrolSituation: "Door blocked",
						patrolPhotoUrl: "https://example.test/photo.jpg",
						checkInTime: new Date("2026-05-11T08:20:00"),
						gpsCoordinates: "31.1,121.2",
						detailCreatedAt: new Date("2026-05-10T10:00:00"),
						detailUpdatedAt: new Date("2026-05-10T11:00:00"),
						taskCode: "PT-001",
						taskName: "Morning patrol",
						taskStatus: "in_progress",
						patrolMethod: "walk",
						plannedStartTime: new Date("2026-05-11T08:00:00"),
						plannedEndTime: new Date("2026-05-11T09:00:00"),
						actualPatrolTime: new Date("2026-05-11T08:30:00"),
						plannedPatroller: "Alice",
						currentPatrolPerson: "Bob",
						pointName: "North gate",
						pathName: "Main route",
						planName: "Daily patrol plan",
					},
				],
			}) as never,
		);

		const result = await repository.listPatrolDetails({ pageIndex: 1, pageSize: 10, taskStatus: "in_progress" });

		expect(result.total).toBe(1);
		expect(result.list[0]).toMatchObject({
			id: "DETAIL_001",
			name: "Morning patrol",
			status: "in_progress",
			taskDetailId: "DETAIL_001",
			patrolPointName: "North gate",
			patrolPlanName: "Daily patrol plan",
			patrolRouteName: "Main route",
			patrolPersonStartEndTime: "2026-05-11 08:00:00 ~ 2026-05-11 09:00:00",
			patrolPointStartEndTime: "2026-05-11 08:20:00",
			actualPatrolTime: "2026-05-11 08:30:00",
			actualCheckInStatus: "abnormal",
			plannedPatrolPerson: "Alice",
			actualPatrolPerson: "Bob",
			patrolMethod: "walk",
			taskStatus: "in_progress",
			patrolPointStatus: "abnormal",
			patrolSituation: "Door blocked",
			patrolPhotos: "https://example.test/photo.jpg",
			locationInfo: "31.1,121.2",
			createTime: "2026-05-10 10:00:00",
			updateTime: "2026-05-10 11:00:00",
		});
	});
});

function createFakeDb(seed: { taskRows?: any[]; detailRows?: any[] }) {
	return {
		select(selection?: Record<string, unknown>) {
			const isCountQuery = Boolean(selection && "total" in selection);
			return {
				from(table: unknown) {
					if (isCountQuery) {
						const rows = table === ptPatrolTasks ? (seed.taskRows ?? []) : (seed.detailRows ?? []);
						return createFakeQuery([{ total: rows.length }]);
					}
					const rows = table === ptPatrolTaskDetails ? (seed.detailRows ?? []) : (seed.taskRows ?? []);
					return createFakeQuery(rows);
				},
			};
		},
	};
}

function createFakeQuery(rows: any[]) {
	let limitValue: number | undefined;

	const query = {
		leftJoin() {
			return query;
		},
		where() {
			return query;
		},
		orderBy() {
			return query;
		},
		limit(value: number) {
			limitValue = value;
			return query;
		},
		offset(value: number) {
			return Promise.resolve(rows.slice(value, limitValue === undefined ? undefined : value + limitValue));
		},
		then(resolve: (value: any[]) => unknown) {
			return Promise.resolve(resolve(rows));
		},
	};

	return query;
}
