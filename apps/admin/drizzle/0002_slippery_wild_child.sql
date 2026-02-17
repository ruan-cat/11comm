CREATE TABLE "sm_community_configurations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cs_id" varchar(50) NOT NULL,
	"community_id" varchar(50) NOT NULL,
	"community_name" varchar(100) NOT NULL,
	"setting_name" varchar(100) NOT NULL,
	"setting_value" text,
	"setting_type" varchar(50) NOT NULL,
	"status_cd" varchar(10) NOT NULL,
	"remark" text,
	"create_time" varchar(50),
	"update_time" varchar(50),
	"operator" varchar(100)
);
--> statement-breakpoint
CREATE INDEX "sm_community_configurations_cs_id_idx" ON "sm_community_configurations" USING btree ("cs_id");--> statement-breakpoint
CREATE INDEX "sm_community_configurations_community_id_idx" ON "sm_community_configurations" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "sm_community_configurations_setting_name_idx" ON "sm_community_configurations" USING btree ("setting_name");