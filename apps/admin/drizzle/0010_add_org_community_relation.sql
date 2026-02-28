/**
 * RLS 策略与组织小区关联迁移
 *
 * 本迁移文件用于：
 * 1. 添加组织与小区的关联字段
 * 2. 添加员工表的小区ID字段
 * 3. 配置数据隔离策略
 */

import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, integer } from "drizzle-orm/pg-core";

/**
 * 迁移说明：
 *
 * 本迁移执行以下变更：
 *
 * 1. sm_organizations 表变更：
 *    - 添加 community_id 字段（关联小区）
 *    - 添加 level 字段（组织层级）
 *    - 添加 org_path 字段（组织路径）
 *
 * 2. sm_staff 表变更：
 *    - 添加 community_id 字段（员工所属小区）
 *
 * 3. cm_communities 表变更：
 *    - 添加 organization_id 字段（所属组织）
 *
 * 注意：外键约束需要在实际迁移时根据具体情况添加
 */

export const up = sql`
-- 1. 为 sm_organizations 表添加关联字段
ALTER TABLE sm_organizations
ADD COLUMN IF NOT EXISTS community_id UUID,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS org_path VARCHAR(500);

-- 创建索引
CREATE INDEX IF NOT EXISTS sm_organizations_community_id_idx ON sm_organizations(community_id);
CREATE INDEX IF NOT EXISTS sm_organizations_org_path_idx ON sm_organizations(org_path);

-- 2. 为 sm_staff 表添加 community_id 字段
ALTER TABLE sm_staff
ADD COLUMN IF NOT EXISTS community_id UUID;

-- 创建索引
CREATE INDEX IF NOT EXISTS sm_staff_community_id_idx ON sm_staff(community_id);

-- 3. 为 cm_communities 表添加 organization_id 字段
ALTER TABLE cm_communities
ADD COLUMN IF NOT EXISTS organization_id UUID;

-- 创建索引
CREATE INDEX IF NOT EXISTS cm_communities_organization_id_idx ON cm_communities(organization_id);

-- 4. 添加注释
COMMENT ON COLUMN sm_organizations.community_id IS '关联小区ID（一个组织可以管理多个小区）';
COMMENT ON COLUMN sm_organizations.level IS '组织层级（用于多级组织）';
COMMENT ON COLUMN sm_organizations.org_path IS '组织路径（如：/org1/org2 用于快速查询子组织）';
COMMENT ON COLUMN sm_staff.community_id IS '员工所属小区ID（用于数据隔离）';
COMMENT ON COLUMN cm_communities.organization_id IS '所属组织ID（小区所属的物业公司/组织）';
`;

export const down = sql`
-- 回滚操作
ALTER TABLE sm_organizations DROP COLUMN IF EXISTS community_id;
ALTER TABLE sm_organizations DROP COLUMN IF EXISTS level;
ALTER TABLE sm_organizations DROP COLUMN IF EXISTS org_path;
ALTER TABLE sm_staff DROP COLUMN IF EXISTS community_id;
ALTER TABLE cm_communities DROP COLUMN IF EXISTS organization_id;

DROP INDEX IF EXISTS sm_organizations_community_id_idx;
DROP INDEX IF EXISTS sm_organizations_org_path_idx;
DROP INDEX IF EXISTS sm_staff_community_id_idx;
DROP INDEX IF EXISTS cm_communities_organization_id_idx;
`;
