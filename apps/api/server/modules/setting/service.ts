import type { SettingRepository } from "./repository";

export interface SettingService {
	// organize-manage
	listDataPermission: SettingRepository["listDataPermission"];
	listOrgInfo: SettingRepository["listOrgInfo"];
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
}

export function createSettingService(repository: SettingRepository): SettingService {
	return {
		listDataPermission: repository.listDataPermission.bind(repository),
		listOrgInfo: repository.listOrgInfo.bind(repository),
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
	};
}
