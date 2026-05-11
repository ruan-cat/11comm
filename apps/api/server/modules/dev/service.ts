import type { DevRepository } from "./repository";

export interface DevService {
	listRefreshCache: DevRepository["listRefreshCache"];
	listConfigCenter: DevRepository["listConfigCenter"];
	listDictionary: DevRepository["listDictionary"];
	listDictionaryItem: DevRepository["listDictionaryItem"];
	listDictionaryType: DevRepository["listDictionaryType"];
	listMenuCatalog: DevRepository["listMenuCatalog"];
	listMenuGroup: DevRepository["listMenuGroup"];
	listMenuItem: DevRepository["listMenuItem"];
}

export function createDevService(repository: DevRepository): DevService {
	return {
		listRefreshCache: repository.listRefreshCache.bind(repository),
		listConfigCenter: repository.listConfigCenter.bind(repository),
		listDictionary: repository.listDictionary.bind(repository),
		listDictionaryItem: repository.listDictionaryItem.bind(repository),
		listDictionaryType: repository.listDictionaryType.bind(repository),
		listMenuCatalog: repository.listMenuCatalog.bind(repository),
		listMenuGroup: repository.listMenuGroup.bind(repository),
		listMenuItem: repository.listMenuItem.bind(repository),
	};
}
