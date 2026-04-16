import { localForage } from "@/utils/localforage";
import type { ProxyStorage } from "@/utils/localforage/types.d";
import type { ResumableUploadCache, ResumableUploadSessionSnapshot } from "./types";

/** 断点续传快照在本地存储中的固定键名 */
const STORAGE_KEY = "contract-manage:shared-upload:sessions";

type SnapshotStore = Record<string, ResumableUploadSessionSnapshot>;

/**
 * 统一不同存储实现的最小读写接口。
 * @description
 * localForage 在项目里通过代理层暴露，这里做一层薄适配，
 * 让缓存逻辑只依赖 get/set/remove/clear 这几个稳定能力。
 */
function createStorageFacade(storage: ProxyStorage) {
	return {
		async getItem<T>(key: string) {
			return (await storage.getItem<T | null>(key)) ?? null;
		},
		async setItem<T>(key: string, value: T) {
			return storage.setItem(key, value, 0);
		},
		async removeItem(key: string) {
			return storage.removeItem(key);
		},
		async clear() {
			return storage.clear();
		},
	};
}

/** 读取当前业务下全部断点续传快照 */
async function readSnapshotStore(storage: ReturnType<typeof createStorageFacade>) {
	return (await storage.getItem<SnapshotStore>(STORAGE_KEY)) ?? {};
}

/** 覆盖写入当前业务下全部断点续传快照 */
async function writeSnapshotStore(storage: ReturnType<typeof createStorageFacade>, store: SnapshotStore) {
	await storage.setItem(STORAGE_KEY, store);
}

/**
 * 创建断点续传本地缓存。
 * @description
 * 以 `fingerprint` 作为快照主键，负责保存、恢复、删除和枚举
 * 已存在的上传会话，供页面刷新或重新进入时继续上传。
 */
export function createResumableUploadCache(
	storage: ProxyStorage = localForage() as ProxyStorage,
): ResumableUploadCache {
	const facade = createStorageFacade(storage);

	return {
		async saveSession(snapshot) {
			const store = await readSnapshotStore(facade);
			store[snapshot.fingerprint] = snapshot;
			await writeSnapshotStore(facade, store);
		},
		async restoreSession(fingerprint) {
			const store = await readSnapshotStore(facade);
			return store[fingerprint] ?? null;
		},
		async removeSession(fingerprint) {
			const store = await readSnapshotStore(facade);
			if (fingerprint in store) {
				delete store[fingerprint];
				await writeSnapshotStore(facade, store);
			}
		},
		async clear() {
			await facade.removeItem(STORAGE_KEY);
		},
		async listSessions() {
			const store = await readSnapshotStore(facade);
			return Object.values(store).sort((left, right) => right.updatedAt - left.updatedAt);
		},
	};
}
