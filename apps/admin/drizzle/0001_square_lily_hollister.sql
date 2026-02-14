CREATE TABLE "ex_expense_summary_tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"time" varchar(20) NOT NULL,
	"expense_item_id" varchar(50),
	"expense_item_name" varchar(100) NOT NULL,
	"receivable_amount" numeric(12, 2) NOT NULL,
	"actual_amount" numeric(12, 2) NOT NULL,
	"status" "status" DEFAULT 'enabled',
	"remark" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sm_change_password_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(100) NOT NULL,
	"real_name" varchar(100),
	"department" varchar(100),
	"change_time" varchar(50),
	"change_ip" varchar(50),
	"change_type" varchar(50),
	"operator" varchar(100),
	"status" varchar(50),
	"remark" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "ex_expense_summary_tables_time_idx" ON "ex_expense_summary_tables" USING btree ("time");--> statement-breakpoint
CREATE INDEX "ex_expense_summary_tables_expense_item_name_idx" ON "ex_expense_summary_tables" USING btree ("expense_item_name");--> statement-breakpoint
CREATE INDEX "ex_expense_summary_tables_status_idx" ON "ex_expense_summary_tables" USING btree ("status");--> statement-breakpoint
CREATE INDEX "sm_change_password_records_username_idx" ON "sm_change_password_records" USING btree ("username");--> statement-breakpoint
CREATE INDEX "sm_change_password_records_change_time_idx" ON "sm_change_password_records" USING btree ("change_time");