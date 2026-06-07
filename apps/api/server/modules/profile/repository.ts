import type {
	AttendanceDayRecord,
	CommunityInfo,
	ProfileAttendanceQuery,
	ProfileCommunityQuery,
	ProfileInfo,
	ProfileWriteGuardDecision,
} from "./types";

export interface ProfileRepository {
	getUserProfile(): Promise<ProfileInfo>;
	listCommunities(query: ProfileCommunityQuery): Promise<CommunityInfo[]>;
	listAttendanceRecords(query: ProfileAttendanceQuery): Promise<AttendanceDayRecord[]>;
	getWriteGuardDecision(endpoint: string, input: Record<string, unknown>): Promise<ProfileWriteGuardDecision>;
}

const profile: ProfileInfo = {
	userId: "STAFF_001",
	userName: "Wang Xiaoming",
	storeId: "STORE_001",
	storeName: "Sunshine Property Service Center",
	avatar: "https://picsum.photos/seed/profile-avatar/240/240",
	currentCommunityId: "COMM_001",
	currentCommunityName: "Sunshine Garden",
	version: "V1.6",
};

const communities: CommunityInfo[] = [
	{ communityId: "COMM_001", name: "Sunshine Garden", address: "88 Xingfu Road, Futian" },
	{ communityId: "COMM_002", name: "Harbor Bay Community", address: "66 Haibin Street, Nanshan" },
	{ communityId: "COMM_003", name: "Cloud Green Residence", address: "18 Qingyun Avenue, Longgang" },
	{ communityId: "COMM_004", name: "Jinrui Garden", address: "108 Jinrui Road, Baoan" },
	{ communityId: "COMM_005", name: "Harmony Home", address: "38 Heping Road, Longhua" },
];

export function createProfileRepository(): ProfileRepository {
	return {
		async getUserProfile() {
			return cloneValue(profile);
		},

		async listCommunities(query) {
			const filtered = query.keyword
				? communities.filter((item) => item.name.includes(query.keyword ?? ""))
				: communities;
			return cloneValue(filtered);
		},

		async listAttendanceRecords(query) {
			return createAttendanceRecords(query.month);
		},

		async getWriteGuardDecision(endpoint, input) {
			void input;
			return {
				code: 409,
				message: `Phase7 mutation guard blocked ${endpoint}; no profile write read-back rollback evidence exists, so this endpoint stays guarded until the controlled write window is designed.`,
				errorCode: "PHASE7_MUTATION_GUARDED",
			};
		},
	};
}

function createAttendanceRecords(month: string): AttendanceDayRecord[] {
	const { year, monthIndex } = parseYearMonth(month);
	const days = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();
	const records: AttendanceDayRecord[] = [];

	for (let day = 1; day <= days; day += 1) {
		const week = new Date(Date.UTC(year, monthIndex - 1, day)).getUTCDay();
		if (week === 0 || week === 6) {
			continue;
		}

		records.push({
			taskDay: day,
			attendanceClassesTaskDetails: [
				{
					specCd: "1001",
					checkTime: Date.UTC(year, monthIndex - 1, day, 8, 57 + (day % 3), 0),
					state: "1200",
					stateName: "Normal",
				},
				{
					specCd: "2002",
					checkTime: Date.UTC(year, monthIndex - 1, day, 18, 2 + (day % 4), 0),
					state: "1200",
					stateName: "Normal",
				},
			],
		});
	}

	return records;
}

function parseYearMonth(month: string): { year: number; monthIndex: number } {
	const [yearText, monthText] = month.split("-");
	return {
		year: Number(yearText),
		monthIndex: Number(monthText),
	};
}

function cloneValue<T>(value: T): T {
	return structuredClone(value);
}
