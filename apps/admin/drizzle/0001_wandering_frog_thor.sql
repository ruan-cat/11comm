CREATE TABLE "auth_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_name" varchar(50) NOT NULL,
	"role_code" varchar(50) NOT NULL,
	"description" text,
	"permissions" text DEFAULT '[]',
	"is_system" boolean DEFAULT false,
	"enabled" boolean DEFAULT true,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "auth_roles_role_code_unique" UNIQUE("role_code")
);
--> statement-breakpoint
CREATE TABLE "auth_user_mapping" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"neon_auth_id" uuid NOT NULL,
	"staff_id" uuid,
	"owner_id" uuid,
	"user_type" varchar(20) NOT NULL,
	"migrated" boolean DEFAULT false,
	"migrated_at" timestamp,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "auth_user_mapping_neon_auth_id_unique" UNIQUE("neon_auth_id")
);
--> statement-breakpoint
CREATE TABLE "auth_user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_mapping_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hp_owners" ADD COLUMN "neon_auth_id" uuid;--> statement-breakpoint
ALTER TABLE "sm_staff" ADD COLUMN "neon_auth_id" uuid;--> statement-breakpoint
ALTER TABLE "auth_user_roles" ADD CONSTRAINT "auth_user_roles_user_mapping_id_auth_user_mapping_id_fk" FOREIGN KEY ("user_mapping_id") REFERENCES "public"."auth_user_mapping"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_user_roles" ADD CONSTRAINT "auth_user_roles_role_id_auth_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."auth_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "auth_roles_role_code_idx" ON "auth_roles" USING btree ("role_code");--> statement-breakpoint
CREATE INDEX "auth_user_mapping_neon_auth_id_idx" ON "auth_user_mapping" USING btree ("neon_auth_id");--> statement-breakpoint
CREATE INDEX "auth_user_mapping_staff_id_idx" ON "auth_user_mapping" USING btree ("staff_id");--> statement-breakpoint
CREATE INDEX "auth_user_mapping_owner_id_idx" ON "auth_user_mapping" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "auth_user_roles_user_mapping_id_idx" ON "auth_user_roles" USING btree ("user_mapping_id");--> statement-breakpoint
CREATE INDEX "auth_user_roles_role_id_idx" ON "auth_user_roles" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "hp_owners_neon_auth_id_idx" ON "hp_owners" USING btree ("neon_auth_id");--> statement-breakpoint
CREATE INDEX "sm_staff_neon_auth_id_idx" ON "sm_staff" USING btree ("neon_auth_id");