import type { SettingRepository } from "./repository";

export interface SettingService {
	// organize-manage
	listDataPermission: SettingRepository["listDataPermission"];
	listOrgInfo: SettingRepository["listOrgInfo"];
	getOrgInfoTree: SettingRepository["getOrgInfoTree"];
	listRolePermission: SettingRepository["listRolePermission"];
	listSchedulingSetting: SettingRepository["listSchedulingSetting"];
	listShiftSetting: SettingRepository["listShiftSetting"];
	listStaffInfo: SettingRepository["listStaffInfo"];
	listWorkingSchedule: SettingRepository["listWorkingSchedule"];
	// system-manage
	listChangePassword: SettingRepository["listChangePassword"];
	listCommunityConfiguration: SettingRepository["listCommunityConfiguration"];
	listInitializeCell: SettingRepository["listInitializeCell"];
	listRegisterProtocol: SettingRepository["listRegisterProtocol"];
	listSystemConfig: SettingRepository["listSystemConfig"];
	// system-manage CUD
	createChangePassword: SettingRepository["createChangePassword"];
	updateChangePassword: SettingRepository["updateChangePassword"];
	deleteChangePassword: SettingRepository["deleteChangePassword"];
	createCommunityConfiguration: SettingRepository["createCommunityConfiguration"];
	updateCommunityConfiguration: SettingRepository["updateCommunityConfiguration"];
	deleteCommunityConfiguration: SettingRepository["deleteCommunityConfiguration"];
	createInitializeCell: SettingRepository["createInitializeCell"];
	updateInitializeCell: SettingRepository["updateInitializeCell"];
	deleteInitializeCell: SettingRepository["deleteInitializeCell"];
	createRegisterProtocol: SettingRepository["createRegisterProtocol"];
	updateRegisterProtocol: SettingRepository["updateRegisterProtocol"];
	deleteRegisterProtocol: SettingRepository["deleteRegisterProtocol"];
	createSystemConfig: SettingRepository["createSystemConfig"];
	updateSystemConfig: SettingRepository["updateSystemConfig"];
	deleteSystemConfig: SettingRepository["deleteSystemConfig"];
}

export function createSettingService(repository: SettingRepository): SettingService {
	return {
		listDataPermission: repository.listDataPermission.bind(repository),
		listOrgInfo: repository.listOrgInfo.bind(repository),
		getOrgInfoTree: repository.getOrgInfoTree.bind(repository),
		listRolePermission: repository.listRolePermission.bind(repository),
		listSchedulingSetting: repository.listSchedulingSetting.bind(repository),
		listShiftSetting: repository.listShiftSetting.bind(repository),
		listStaffInfo: repository.listStaffInfo.bind(repository),
		listWorkingSchedule: repository.listWorkingSchedule.bind(repository),
		listChangePassword: repository.listChangePassword.bind(repository),
		listCommunityConfiguration: repository.listCommunityConfiguration.bind(repository),
		listInitializeCell: repository.listInitializeCell.bind(repository),
		listRegisterProtocol: repository.listRegisterProtocol.bind(repository),
		listSystemConfig: repository.listSystemConfig.bind(repository),
		createChangePassword: repository.createChangePassword.bind(repository),
		updateChangePassword: repository.updateChangePassword.bind(repository),
		deleteChangePassword: repository.deleteChangePassword.bind(repository),
		createCommunityConfiguration: repository.createCommunityConfiguration.bind(repository),
		updateCommunityConfiguration: repository.updateCommunityConfiguration.bind(repository),
		deleteCommunityConfiguration: repository.deleteCommunityConfiguration.bind(repository),
		createInitializeCell: repository.createInitializeCell.bind(repository),
		updateInitializeCell: repository.updateInitializeCell.bind(repository),
		deleteInitializeCell: repository.deleteInitializeCell.bind(repository),
		createRegisterProtocol: repository.createRegisterProtocol.bind(repository),
		updateRegisterProtocol: repository.updateRegisterProtocol.bind(repository),
		deleteRegisterProtocol: repository.deleteRegisterProtocol.bind(repository),
		createSystemConfig: repository.createSystemConfig.bind(repository),
		updateSystemConfig: repository.updateSystemConfig.bind(repository),
		deleteSystemConfig: repository.deleteSystemConfig.bind(repository),
	};
}
