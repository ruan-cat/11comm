ALTER TABLE "dt_cache_configs" ADD COLUMN "cache_code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "dt_cache_configs" ADD COLUMN "cache_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "dt_cache_configs" ADD COLUMN "cache_group" text;--> statement-breakpoint
ALTER TABLE "dt_cache_configs" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "dt_cache_configs" ADD COLUMN "status" text DEFAULT 'enabled';