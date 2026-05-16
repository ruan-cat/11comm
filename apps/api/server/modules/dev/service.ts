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
	createConfigCenter: DevRepository["createConfigCenter"];
	getConfigCenterDetail: DevRepository["getConfigCenterDetail"];
	updateConfigCenter: DevRepository["updateConfigCenter"];
	deleteConfigCenter: DevRepository["deleteConfigCenter"];
	createDictionary: DevRepository["createDictionary"];
	getDictionaryDetail: DevRepository["getDictionaryDetail"];
	updateDictionary: DevRepository["updateDictionary"];
	deleteDictionary: DevRepository["deleteDictionary"];
	createDictionaryItem: DevRepository["createDictionaryItem"];
	getDictionaryItemDetail: DevRepository["getDictionaryItemDetail"];
	updateDictionaryItem: DevRepository["updateDictionaryItem"];
	deleteDictionaryItem: DevRepository["deleteDictionaryItem"];
	createDictionaryType: DevRepository["createDictionaryType"];
	getDictionaryTypeDetail: DevRepository["getDictionaryTypeDetail"];
	updateDictionaryType: DevRepository["updateDictionaryType"];
	deleteDictionaryType: DevRepository["deleteDictionaryType"];
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
		createConfigCenter: repository.createConfigCenter.bind(repository),
		getConfigCenterDetail: repository.getConfigCenterDetail.bind(repository),
		updateConfigCenter: repository.updateConfigCenter.bind(repository),
		deleteConfigCenter: repository.deleteConfigCenter.bind(repository),
		createDictionary: repository.createDictionary.bind(repository),
		getDictionaryDetail: repository.getDictionaryDetail.bind(repository),
		updateDictionary: repository.updateDictionary.bind(repository),
		deleteDictionary: repository.deleteDictionary.bind(repository),
		createDictionaryItem: repository.createDictionaryItem.bind(repository),
		getDictionaryItemDetail: repository.getDictionaryItemDetail.bind(repository),
		updateDictionaryItem: repository.updateDictionaryItem.bind(repository),
		deleteDictionaryItem: repository.deleteDictionaryItem.bind(repository),
		createDictionaryType: repository.createDictionaryType.bind(repository),
		getDictionaryTypeDetail: repository.getDictionaryTypeDetail.bind(repository),
		updateDictionaryType: repository.updateDictionaryType.bind(repository),
		deleteDictionaryType: repository.deleteDictionaryType.bind(repository),
	};
}
