CREATE TYPE "public"."audit_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."charge_status" AS ENUM('unpaid', 'paid', 'partial', 'overdue');--> statement-breakpoint
CREATE TYPE "public"."check_in_status" AS ENUM('not_checked', 'checked', 'abnormal');--> statement-breakpoint
CREATE TYPE "public"."contract_status" AS ENUM('draft', 'pending_review', 'effective', 'expired', 'terminated');--> statement-breakpoint
CREATE TYPE "public"."discount_type" AS ENUM('percentage', 'fixed', 'period');--> statement-breakpoint
CREATE TYPE "public"."dispatch_method" AS ENUM('grab', 'assign', 'rotation');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."mandatory_return_status" AS ENUM('pending_return', 'returned', 'forced_returned');--> statement-breakpoint
CREATE TYPE "public"."patrol_task_status" AS ENUM('pending', 'in_progress', 'completed', 'overdue');--> statement-breakpoint
CREATE TYPE "public"."refund_status" AS ENUM('pending', 'approved', 'rejected', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."repair_order_status" AS ENUM('pending', 'processing', 'completed', 'cancelled', 'paused');--> statement-breakpoint
CREATE TYPE "public"."repair_setting_type" AS ENUM('cleaning', 'maintenance');--> statement-breakpoint
CREATE TYPE "public"."return_visit_status" AS ENUM('not_visited', 'visited', 'satisfied', 'unsatisfied');--> statement-breakpoint
CREATE TYPE "public"."rounding_mode" AS ENUM('round', 'ceil', 'floor');--> statement-breakpoint
CREATE TYPE "public"."service_area" AS ENUM('house', 'public_area', 'garage', 'non_house');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('enabled', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."template_status" AS ENUM('draft', 'published', 'disabled');--> statement-breakpoint
CREATE TABLE "op_community_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"community_id" uuid NOT NULL,
	"config_type" varchar(50),
	"config_key" varchar(100) NOT NULL,
	"config_value" text,
	"config_group" varchar(50),
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "op_community_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"community_id" uuid NOT NULL,
	"operation_status" varchar(50),
	"administrator" varchar(50),
	"operation_config" jsonb,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "op_merchant_admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"merchant_id" uuid NOT NULL,
	"admin_name" varchar(50) NOT NULL,
	"phone" varchar(20),
	"email" varchar(100),
	"account" varchar(50),
	"role" varchar(50),
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "op_merchants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"merchant_name" varchar(100) NOT NULL,
	"merchant_code" varchar(50) NOT NULL,
	"merchant_type" varchar(50),
	"contact_person" varchar(50),
	"contact_phone" varchar(20),
	"business_license" varchar(100),
	"legal_representative" varchar(50),
	"registered_address" text,
	"registered_capital" numeric(14, 2),
	"established_date" date,
	"business_address" text,
	"business_scope" text,
	"business_hours" varchar(100),
	"business_area" numeric(10, 2),
	"service_communities" text,
	"contract_start_date" date,
	"contract_end_date" date,
	"bank_name" varchar(100),
	"bank_account" varchar(50),
	"status" "status" DEFAULT 'enabled',
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "op_property_companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" varchar(100) NOT NULL,
	"company_code" varchar(50),
	"contact_person" varchar(50),
	"contact_phone" varchar(20),
	"address" text,
	"qualification_level" varchar(50),
	"qualification_cert_no" varchar(100),
	"qualification_valid_until" date,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "op_register_protocols" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"protocol_type" varchar(50),
	"protocol_title" varchar(200) NOT NULL,
	"protocol_content" text,
	"is_required" boolean DEFAULT true,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "op_report_components" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"component_name" varchar(100) NOT NULL,
	"component_type" varchar(50),
	"component_config" jsonb,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "op_report_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_name" varchar(100) NOT NULL,
	"group_code" varchar(50),
	"group_description" text,
	"sort_order" integer DEFAULT 0,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "op_report_infos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid,
	"report_name" varchar(100) NOT NULL,
	"report_code" varchar(50),
	"report_type" varchar(50),
	"data_source_config" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cm_building_structures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"community_id" uuid,
	"building_no" varchar(20) NOT NULL,
	"floor_count" integer,
	"unit_count" integer,
	"room_layout" text,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "cm_communities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(50) NOT NULL,
	"address" text,
	"phone" varchar(20),
	"status" "status" DEFAULT 'enabled',
	"land_area" numeric(12, 2),
	"building_area" numeric(12, 2),
	"building_count" integer,
	"unit_count" integer,
	"household_count" integer,
	"parking_count" integer,
	"green_rate" numeric(5, 2),
	"plot_ratio" numeric(5, 2),
	"developer" varchar(100),
	"property_company" varchar(100),
	"established_date" date,
	"province" varchar(50),
	"city" varchar(50),
	"district" varchar(50),
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "cm_handing_business" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_type" varchar(50) NOT NULL,
	"applicant" varchar(50) NOT NULL,
	"contact_phone" varchar(20),
	"status" varchar(20) DEFAULT '待缴费',
	"handle_time" timestamp,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "cm_house_decorations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"house_number" varchar(50) NOT NULL,
	"owner_info" varchar(100),
	"decoration_company" varchar(100),
	"planned_start_time" date,
	"planned_end_time" date,
	"audit_status" "audit_status" DEFAULT 'pending',
	"auditor" varchar(50),
	"audit_time" timestamp,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "cm_notices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"community_id" uuid,
	"title" varchar(200) NOT NULL,
	"content" text,
	"publish_time" timestamp,
	"publisher" varchar(50),
	"status" "status" DEFAULT 'enabled',
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "cm_property_registers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"community_name" varchar(100),
	"building_no" varchar(20),
	"unit_no" varchar(20),
	"room_no" varchar(20),
	"owner_name" varchar(50),
	"contact_phone" varchar(20),
	"area" numeric(10, 2),
	"property_type" varchar(50),
	"register_date" date,
	"status" "status" DEFAULT 'enabled',
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "ct_archives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"archive_no" varchar(100),
	"archive_date" date,
	"archive_location" varchar(200),
	"archiver" varchar(50),
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ct_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"attachment_name" varchar(200) NOT NULL,
	"attachment_type" varchar(50),
	"file_path" text,
	"file_size" integer,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ct_changes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"change_type" varchar(50),
	"change_reason" text,
	"change_content" text,
	"change_date" date,
	"approval_status" "audit_status" DEFAULT 'pending',
	"approver" varchar(50),
	"approval_time" timestamp,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ct_clauses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"clause_name" varchar(200) NOT NULL,
	"clause_content" text,
	"clause_type" varchar(50),
	"sort_order" integer DEFAULT 0,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ct_contracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_name" varchar(200) NOT NULL,
	"contract_number" varchar(100) NOT NULL,
	"contract_type" varchar(50),
	"amount" numeric(12, 2),
	"first_party_id" uuid,
	"second_party_id" uuid,
	"start_time" timestamp,
	"end_time" timestamp,
	"sign_date" date,
	"status" "contract_status" DEFAULT 'draft',
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "ct_first_parties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"contact_person" varchar(50),
	"contact_phone" varchar(20),
	"address" text,
	"credit_code" varchar(50),
	"established_date" date,
	"legal_representative" varchar(50),
	"business_scope" text,
	"status" "status" DEFAULT 'enabled',
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ct_prints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"printer" varchar(50),
	"print_time" timestamp,
	"print_count" integer DEFAULT 1,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ct_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"reviewer" varchar(50),
	"review_opinion" text,
	"review_result" "audit_status",
	"review_time" timestamp,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ct_second_parties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"party_type" varchar(50),
	"contact_person" varchar(50),
	"contact_phone" varchar(20),
	"address" text,
	"owner_id" uuid,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ct_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_name" varchar(200) NOT NULL,
	"template_type" varchar(50),
	"template_content" text,
	"version" varchar(20),
	"status" "template_status" DEFAULT 'draft',
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ct_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type_name" varchar(100) NOT NULL,
	"type_code" varchar(50),
	"type_description" text,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ex_cancel_fees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"charge_id" uuid NOT NULL,
	"charge_type" varchar(20),
	"cancel_amount" numeric(12, 2) NOT NULL,
	"cancel_reason" text,
	"cancel_date" date,
	"operator" varchar(50),
	"audit_status" "audit_status" DEFAULT 'pending',
	"auditor" varchar(50),
	"audit_time" timestamp,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ex_contract_charges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"contract_number" varchar(50),
	"expense_item" varchar(100) NOT NULL,
	"receivable_amount" numeric(12, 2) NOT NULL,
	"received_amount" numeric(12, 2) DEFAULT '0',
	"charge_cycle" varchar(50),
	"status" charge_status DEFAULT 'unpaid',
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ex_discount_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"discount_setting_id" uuid,
	"applicant" varchar(50),
	"application_type" varchar(50),
	"application_reason" text,
	"application_amount" numeric(12, 2),
	"audit_status" "audit_status" DEFAULT 'pending',
	"auditor" varchar(50),
	"audit_time" timestamp,
	"audit_opinion" text,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ex_discount_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"discount_type_id" uuid,
	"applicable_item" varchar(100),
	"discount_type" varchar(50),
	"validity_start" date,
	"validity_end" date,
	"validity_period" varchar(100),
	"conditions" text,
	"status" "status" DEFAULT 'enabled',
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ex_discount_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"discount_name" varchar(100) NOT NULL,
	"discount_type" "discount_type" NOT NULL,
	"discount_value" numeric(10, 2),
	"status" "status" DEFAULT 'enabled',
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ex_expense_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expense_type" varchar(50) NOT NULL,
	"item_name" varchar(100) NOT NULL,
	"expense_code" varchar(50),
	"payment_type" varchar(50),
	"unit_price" numeric(12, 4),
	"fixed_fee" numeric(12, 2),
	"formula" text,
	"billing_cycle" varchar(50),
	"account_deduction" boolean DEFAULT false,
	"mobile_payment" boolean DEFAULT true,
	"rounding_mode" "rounding_mode" DEFAULT 'round',
	"decimal_places" integer DEFAULT 2,
	"status" "status" DEFAULT 'enabled',
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ex_expense_summary_tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"time" varchar(20) NOT NULL,
	"expense_item_id" varchar(50),
	"expense_item_name" varchar(100) NOT NULL,
	"receivable_amount" numeric(12, 2) NOT NULL,
	"actual_amount" numeric(12, 2) NOT NULL,
	"status" "status" DEFAULT 'enabled',
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ex_house_charges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"house_id" uuid NOT NULL,
	"expense_item" varchar(100) NOT NULL,
	"receivable_amount" numeric(12, 2) NOT NULL,
	"received_amount" numeric(12, 2) DEFAULT '0',
	"billing_period" varchar(50),
	"status" charge_status DEFAULT 'unpaid',
	"bill_date" date,
	"due_date" date,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ex_meter_reading_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type_name" varchar(50) NOT NULL,
	"type_code" varchar(50),
	"unit_price" numeric(10, 4),
	"billing_method" varchar(50),
	"status" "status" DEFAULT 'enabled',
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ex_meter_readings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"house_id" uuid NOT NULL,
	"meter_type_id" uuid,
	"meter_no" varchar(50) NOT NULL,
	"current_reading" numeric(12, 2),
	"previous_reading" numeric(12, 2),
	"usage" numeric(12, 2),
	"reading_date" date,
	"reader" varchar(50),
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ex_overdue_reminders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"charge_id" uuid NOT NULL,
	"charge_type" varchar(20),
	"reminder_method" varchar(50),
	"reminder_time" timestamp,
	"reminder_result" varchar(100),
	"reminder_id" uuid,
	"reminder_name" varchar(50),
	"contact_phone" varchar(20),
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ex_payment_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" uuid NOT NULL,
	"reviewer" varchar(50),
	"review_opinion" text,
	"review_result" "audit_status" DEFAULT 'pending',
	"review_time" timestamp,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ex_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"charge_id" uuid NOT NULL,
	"charge_type" varchar(20),
	"payment_amount" numeric(12, 2) NOT NULL,
	"payment_method" varchar(50),
	"payment_time" timestamp,
	"transaction_no" varchar(100),
	"payer" varchar(50),
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "ex_refund_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"charge_id" uuid NOT NULL,
	"charge_type" varchar(20),
	"refund_reason" text,
	"refund_amount" numeric(12, 2) NOT NULL,
	"apply_time" timestamp,
	"applicant" varchar(50),
	"status" "refund_status" DEFAULT 'pending',
	"reviewer" varchar(50),
	"review_time" timestamp,
	"review_opinion" text,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ex_reprint_vouchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" uuid,
	"original_voucher_no" varchar(100) NOT NULL,
	"new_voucher_no" varchar(100),
	"reprint_reason" text,
	"reprint_time" timestamp,
	"operator" varchar(50),
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ex_vehicle_charges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"license_plate" varchar(20) NOT NULL,
	"carport_number" varchar(50),
	"expense_type" varchar(50),
	"receivable_amount" numeric(12, 2) NOT NULL,
	"received_amount" numeric(12, 2) DEFAULT '0',
	"billing_period" varchar(50),
	"status" charge_status DEFAULT 'unpaid',
	"remark" text,
	"owner_name" varchar(50),
	"parking_space_status" varchar(50),
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hp_invoice_titles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"title_name" varchar(200) NOT NULL,
	"taxpayer_no" varchar(50),
	"address_phone" text,
	"bank_account" text,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hp_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_no" varchar(50) NOT NULL,
	"invoice_type" varchar(50),
	"amount" numeric(12, 2),
	"invoice_date" date,
	"payment_id" uuid,
	"code" varchar(50),
	"owner_name" varchar(50),
	"applicant" varchar(50),
	"invoice_title" varchar(200),
	"taxpayer_id" varchar(50),
	"audit_status" varchar(20) DEFAULT 'pending',
	"application_time" timestamp,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hp_houses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"community_id" uuid,
	"building_no" varchar(20),
	"unit_no" varchar(20),
	"floor" integer,
	"room_no" varchar(20),
	"house_number" varchar(50) NOT NULL,
	"building_area" numeric(10, 2),
	"usable_area" numeric(10, 2),
	"house_type" varchar(50),
	"status" "status" DEFAULT 'enabled',
	"remark" text,
	"rent" numeric(12, 2),
	"valid_until" date,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hp_owner_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"account_no" varchar(50) NOT NULL,
	"account_name" varchar(100),
	"account_type" varchar(50),
	"balance" numeric(12, 2) DEFAULT '0',
	"deduction_house" varchar(50),
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hp_owner_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"gender" "gender",
	"member_type" varchar(20),
	"id_card" varchar(18),
	"phone" varchar(20),
	"home_address" text,
	"face_photo_url" text,
	"access_key" varchar(100),
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hp_owners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"id_card" varchar(18),
	"phone" varchar(20),
	"gender" "gender",
	"email" varchar(100),
	"address" text,
	"emergency_contact" varchar(100),
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "hp_owners_committees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"committee_name" varchar(100) NOT NULL,
	"established_date" date,
	"term" varchar(20),
	"chairman" varchar(50),
	"contact_phone" varchar(20),
	"member_list" text,
	"position" varchar(50),
	"tenure" varchar(50),
	"remark" text,
	"full_name" varchar(50),
	"gender" "gender",
	"id_number" varchar(18),
	"address" text,
	"post" varchar(50),
	"status" varchar(20),
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hp_reserve_venue_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"venue_id" uuid NOT NULL,
	"booker" varchar(50) NOT NULL,
	"contact_phone" varchar(20),
	"time_slot" varchar(100),
	"status" varchar(20),
	"remark" text,
	"reservation_time" timestamp,
	"start_time" timestamp,
	"end_time" timestamp,
	"number_of_users" integer,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hp_reserve_venues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"venue_name" varchar(100) NOT NULL,
	"venue_type" varchar(50),
	"capacity" integer,
	"open_time" varchar(100),
	"charge_standard" varchar(200),
	"status" "status" DEFAULT 'enabled',
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hp_site_managements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_name" varchar(100) NOT NULL,
	"location" text,
	"manager" varchar(50),
	"maintenance_record" text,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pk_carport_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicant" varchar(50) NOT NULL,
	"carport_type" varchar(50),
	"apply_time" timestamp DEFAULT now(),
	"expected_price_range" varchar(100),
	"status" varchar(20) DEFAULT '待审核',
	"approver" varchar(50),
	"approval_time" timestamp,
	"approval_opinion" text,
	"allocated_carport" varchar(50),
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pk_carports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parking_lot_id" uuid,
	"carport_number" varchar(50) NOT NULL,
	"carport_type" varchar(50),
	"area" numeric(8, 2),
	"status" varchar(20),
	"owner_id" uuid,
	"owner_name" varchar(50),
	"contact_phone" varchar(20),
	"bound_vehicle" varchar(20),
	"monthly_rent" numeric(10, 2),
	"purchase_date" date,
	"expiry_date" date,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pk_owner_vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid,
	"carport_id" uuid,
	"license_plate" varchar(20) NOT NULL,
	"plate_type" varchar(20),
	"vehicle_type" varchar(50),
	"vehicle_color" varchar(20),
	"brand" varchar(50),
	"related_house" varchar(100),
	"validity_start" date,
	"validity_end" date,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "pk_parking_lots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"community_id" uuid,
	"lot_name" varchar(100) NOT NULL,
	"lot_type" varchar(50),
	"total_spaces" integer,
	"available_spaces" integer,
	"floor_area" numeric(10, 2),
	"location_description" text,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pk_parking_structures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parking_lot_id" uuid NOT NULL,
	"region_name" varchar(50) NOT NULL,
	"structure_data" text,
	"sort_order" integer DEFAULT 0,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pt_patrol_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"point_id" uuid NOT NULL,
	"item_name" varchar(100) NOT NULL,
	"check_standard" text,
	"check_method" varchar(100),
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pt_patrol_paths" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"path_name" varchar(100) NOT NULL,
	"path_description" text,
	"estimated_duration" integer,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pt_patrol_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"community_id" uuid,
	"plan_name" varchar(100) NOT NULL,
	"patrol_type" varchar(50),
	"patrol_level" varchar(50),
	"plan_description" text,
	"frequency" varchar(50),
	"start_date" date,
	"end_date" date,
	"execution_time_slot" varchar(100),
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pt_patrol_points" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"path_id" uuid NOT NULL,
	"point_name" varchar(100) NOT NULL,
	"location" text,
	"qr_code_or_nfc" varchar(200),
	"sort_order" integer DEFAULT 0,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pt_patrol_task_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"point_id" uuid NOT NULL,
	"check_in_status" "check_in_status" DEFAULT 'not_checked',
	"patrol_situation" text,
	"patrol_photo_url" text,
	"check_in_time" timestamp,
	"gps_coordinates" varchar(100),
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pt_patrol_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"task_code" varchar(50) NOT NULL,
	"task_name" varchar(100) NOT NULL,
	"planned_patroller" varchar(50),
	"planned_patroller_id" uuid,
	"patrol_method" varchar(50),
	"planned_start_time" timestamp,
	"planned_end_time" timestamp,
	"actual_patrol_time" timestamp,
	"status" "patrol_task_status" DEFAULT 'pending',
	"current_patrol_person" varchar(50),
	"current_patrol_person_id" uuid,
	"transfer_description" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rp_mandatory_return_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"work_order_number" varchar(50) NOT NULL,
	"mandatory_reason" text,
	"mandatory_time" timestamp,
	"return_status" "mandatory_return_status" DEFAULT 'pending_return',
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rp_phone_repair_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid,
	"caller_phone" varchar(20) NOT NULL,
	"call_time" timestamp DEFAULT now() NOT NULL,
	"receiver" varchar(50),
	"repair_summary" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rp_repair_order_histories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"operation_type" varchar(50) NOT NULL,
	"operator" varchar(50),
	"operation_time" timestamp DEFAULT now() NOT NULL,
	"operation_description" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rp_repair_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"work_order_number" varchar(50) NOT NULL,
	"repair_type" varchar(50),
	"maintenance_type" varchar(50),
	"repair_source" varchar(50),
	"reporter_name" varchar(50),
	"contact_phone" varchar(20),
	"repair_location" text,
	"problem_description" text,
	"repair_photo_url" text,
	"appointment_time" timestamp,
	"status" "repair_order_status" DEFAULT 'pending',
	"assigner" varchar(50),
	"assigner_id" uuid,
	"assign_time" timestamp,
	"repair_person" varchar(50),
	"repair_person_id" uuid,
	"planned_completion_time" timestamp,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "rp_repair_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"setting_type" "repair_setting_type",
	"dispatch_method" "dispatch_method",
	"service_area" "service_area",
	"processing_time_limit" integer,
	"return_visit_time_limit" integer,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rp_repair_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type_name" varchar(50) NOT NULL,
	"type_description" text,
	"sort_order" integer DEFAULT 0,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rp_return_visits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"visitor" varchar(50),
	"visitor_id" uuid,
	"visit_time" timestamp,
	"visit_method" varchar(50),
	"satisfaction_rating" integer,
	"visit_status" "return_visit_status" DEFAULT 'not_visited',
	"visit_note" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rpt_data_statistics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"statistic_indicator" varchar(100),
	"statistic_value" numeric(18, 4),
	"statistic_time" timestamp,
	"comparison_baseline" numeric(18, 4),
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rpt_deposit_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deposit_type" varchar(50),
	"collected_total" numeric(14, 2),
	"returned_total" numeric(14, 2),
	"holding_total" numeric(14, 2),
	"period_start" date,
	"period_end" date,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rpt_expense_summaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"community_id" uuid,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"expense_type" varchar(50),
	"receivable_total" numeric(14, 2),
	"received_total" numeric(14, 2),
	"outstanding_total" numeric(14, 2),
	"building" varchar(50),
	"expense_item" varchar(100),
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rpt_fee_reminders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_info" varchar(200),
	"outstanding_amount" numeric(12, 2),
	"reminder_method" varchar(50),
	"reminder_time" timestamp,
	"is_delivered" boolean DEFAULT false,
	"owner_feedback" text,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rpt_no_charge_houses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"house_number" varchar(50),
	"owner_info" varchar(200),
	"no_charge_reason" varchar(200),
	"last_charge_date" date,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rpt_outstanding_fees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"aging_bucket" varchar(50),
	"outstanding_amount" numeric(14, 2),
	"household_count" integer,
	"community" varchar(100),
	"building" varchar(50),
	"expense_item" varchar(100),
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rpt_owner_payment_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid,
	"owner_name" varchar(50),
	"total_receivable" numeric(14, 2),
	"total_paid" numeric(14, 2),
	"total_outstanding" numeric(14, 2),
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rpt_patrol_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"planned_tasks" integer,
	"completed_tasks" integer,
	"abnormal_tasks" integer,
	"on_time_completion_rate" numeric(5, 2),
	"period" varchar(50),
	"dimension" varchar(50),
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rpt_payment_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_name" varchar(50),
	"house_number" varchar(50),
	"expense_item" varchar(100),
	"payment_amount" numeric(12, 2),
	"payment_time" timestamp,
	"payment_method" varchar(50),
	"transaction_no" varchar(100),
	"collector" varchar(50),
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rpt_repair_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"total_repairs" integer,
	"completed_count" integer,
	"pending_count" integer,
	"avg_processing_time" numeric(10, 2),
	"satisfaction_rate" numeric(5, 2),
	"dissatisfaction_reasons" jsonb,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rpt_repair_summaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"repair_type_distribution" jsonb,
	"worker_workload" jsonb,
	"repair_cost_statistics" jsonb,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rpt_statement_expenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_type" varchar(50),
	"report_period" varchar(50),
	"data_snapshot" jsonb,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dt_cache_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cache_code" text NOT NULL,
	"cache_name" text NOT NULL,
	"cache_key" text NOT NULL,
	"cache_type" text,
	"cache_group" text,
	"expire_time" integer,
	"description" text,
	"refresh_strategy" text,
	"status" text DEFAULT 'enabled',
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dt_config_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type_id" uuid NOT NULL,
	"item_name" text NOT NULL,
	"item_key" text NOT NULL,
	"data_type" text,
	"validation_rule" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dt_config_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type_name" text NOT NULL,
	"type_code" text NOT NULL,
	"type_description" text,
	"sort_order" integer DEFAULT 0,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dt_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"config_name" text NOT NULL,
	"config_type" text,
	"config_key" text NOT NULL,
	"config_value" text,
	"default_value" text,
	"config_description" text,
	"sort_order" integer DEFAULT 0,
	"created_by" text,
	"updated_by" text,
	"status" "status" DEFAULT 'enabled',
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dt_dictionaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dictionary_name" text NOT NULL,
	"dictionary_code" text NOT NULL,
	"dictionary_type" text,
	"dictionary_description" text,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dt_dictionary_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dictionary_id" uuid NOT NULL,
	"item_label" text NOT NULL,
	"item_value" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"is_default" boolean DEFAULT false,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dt_menu_catalogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"group_id" uuid,
	"catalog_name" text NOT NULL,
	"catalog_path" text,
	"catalog_icon" text,
	"sort_order" integer DEFAULT 0,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dt_menu_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_name" text NOT NULL,
	"group_code" text NOT NULL,
	"group_icon" text,
	"sort_order" integer DEFAULT 0,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dt_menu_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"catalog_id" uuid,
	"menu_name" text NOT NULL,
	"path" text NOT NULL,
	"component_path" text,
	"menu_icon" text,
	"sort_order" integer DEFAULT 0,
	"is_visible" boolean DEFAULT true,
	"is_cache" boolean DEFAULT false,
	"is_external" boolean DEFAULT false,
	"redirect_path" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sm_organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_name" varchar(100) NOT NULL,
	"org_code" varchar(50) NOT NULL,
	"org_type" varchar(50),
	"sort_order" integer DEFAULT 0,
	"parent_id" uuid,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sm_scheduling_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scheduling_mode" varchar(50),
	"applicable_position" varchar(100),
	"rotation_cycle" varchar(50),
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sm_shifts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shift_name" varchar(100) NOT NULL,
	"start_time" time,
	"end_time" time,
	"work_duration" integer,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sm_working_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"staff_id" uuid NOT NULL,
	"shift_id" uuid NOT NULL,
	"schedule_date" date NOT NULL,
	"name" varchar(100),
	"type" varchar(50),
	"start_time" time,
	"end_time" time,
	"weekday" integer,
	"manager_name" varchar(50),
	"phone" varchar(20),
	"enabled" boolean DEFAULT true,
	"description" text,
	"work_date" date,
	"status" varchar(50),
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sm_data_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_id" uuid NOT NULL,
	"permission_rule" text,
	"scope" varchar(50),
	"data_filter" jsonb,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sm_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"permission_name" varchar(100) NOT NULL,
	"permission_code" varchar(100) NOT NULL,
	"permission_type" varchar(50),
	"resource_path" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sm_role_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sm_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_name" varchar(100) NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text,
	"is_enabled" boolean DEFAULT true,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sm_staff_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"staff_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
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
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "sm_initialize_cells" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"init_item" varchar(100) NOT NULL,
	"init_status" varchar(50),
	"config_params" jsonb,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sm_register_protocols" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"protocol_type" varchar(50),
	"protocol_title" varchar(200) NOT NULL,
	"protocol_content" text,
	"version" varchar(20),
	"status" "status" DEFAULT 'enabled',
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sm_system_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"config_key" varchar(100) NOT NULL,
	"config_value" text,
	"config_type" varchar(50),
	"config_description" text,
	"status" "status" DEFAULT 'enabled',
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sm_staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"employee_number" varchar(50) NOT NULL,
	"name" varchar(50) NOT NULL,
	"gender" "gender",
	"position" varchar(50),
	"email" varchar(100),
	"phone" varchar(20),
	"home_address" text,
	"avatar_url" text,
	"remark" text,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "op_community_configs" ADD CONSTRAINT "op_community_configs_community_id_cm_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."cm_communities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "op_community_info" ADD CONSTRAINT "op_community_info_community_id_cm_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."cm_communities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "op_merchant_admins" ADD CONSTRAINT "op_merchant_admins_merchant_id_op_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."op_merchants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "op_report_components" ADD CONSTRAINT "op_report_components_report_id_op_report_infos_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."op_report_infos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "op_report_infos" ADD CONSTRAINT "op_report_infos_group_id_op_report_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."op_report_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cm_building_structures" ADD CONSTRAINT "cm_building_structures_community_id_cm_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."cm_communities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cm_notices" ADD CONSTRAINT "cm_notices_community_id_cm_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."cm_communities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ct_archives" ADD CONSTRAINT "ct_archives_contract_id_ct_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."ct_contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ct_attachments" ADD CONSTRAINT "ct_attachments_contract_id_ct_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."ct_contracts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ct_changes" ADD CONSTRAINT "ct_changes_contract_id_ct_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."ct_contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ct_clauses" ADD CONSTRAINT "ct_clauses_template_id_ct_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."ct_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ct_contracts" ADD CONSTRAINT "ct_contracts_first_party_id_ct_first_parties_id_fk" FOREIGN KEY ("first_party_id") REFERENCES "public"."ct_first_parties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ct_contracts" ADD CONSTRAINT "ct_contracts_second_party_id_ct_second_parties_id_fk" FOREIGN KEY ("second_party_id") REFERENCES "public"."ct_second_parties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ct_prints" ADD CONSTRAINT "ct_prints_contract_id_ct_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."ct_contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ct_reviews" ADD CONSTRAINT "ct_reviews_contract_id_ct_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."ct_contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ct_second_parties" ADD CONSTRAINT "ct_second_parties_owner_id_hp_owners_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."hp_owners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ex_contract_charges" ADD CONSTRAINT "ex_contract_charges_contract_id_ct_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."ct_contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ex_discount_applications" ADD CONSTRAINT "ex_discount_applications_discount_setting_id_ex_discount_settings_id_fk" FOREIGN KEY ("discount_setting_id") REFERENCES "public"."ex_discount_settings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ex_discount_settings" ADD CONSTRAINT "ex_discount_settings_discount_type_id_ex_discount_types_id_fk" FOREIGN KEY ("discount_type_id") REFERENCES "public"."ex_discount_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ex_house_charges" ADD CONSTRAINT "ex_house_charges_house_id_hp_houses_id_fk" FOREIGN KEY ("house_id") REFERENCES "public"."hp_houses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ex_meter_readings" ADD CONSTRAINT "ex_meter_readings_house_id_hp_houses_id_fk" FOREIGN KEY ("house_id") REFERENCES "public"."hp_houses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ex_meter_readings" ADD CONSTRAINT "ex_meter_readings_meter_type_id_ex_meter_reading_types_id_fk" FOREIGN KEY ("meter_type_id") REFERENCES "public"."ex_meter_reading_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ex_payment_reviews" ADD CONSTRAINT "ex_payment_reviews_payment_id_ex_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."ex_payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ex_reprint_vouchers" ADD CONSTRAINT "ex_reprint_vouchers_payment_id_ex_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."ex_payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ex_vehicle_charges" ADD CONSTRAINT "ex_vehicle_charges_vehicle_id_pk_owner_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."pk_owner_vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hp_invoice_titles" ADD CONSTRAINT "hp_invoice_titles_owner_id_hp_owners_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."hp_owners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hp_invoices" ADD CONSTRAINT "hp_invoices_payment_id_ex_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."ex_payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hp_houses" ADD CONSTRAINT "hp_houses_community_id_cm_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."cm_communities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hp_owner_accounts" ADD CONSTRAINT "hp_owner_accounts_owner_id_hp_owners_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."hp_owners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hp_owner_members" ADD CONSTRAINT "hp_owner_members_owner_id_hp_owners_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."hp_owners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hp_reserve_venue_orders" ADD CONSTRAINT "hp_reserve_venue_orders_venue_id_hp_reserve_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."hp_reserve_venues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pk_carports" ADD CONSTRAINT "pk_carports_parking_lot_id_pk_parking_lots_id_fk" FOREIGN KEY ("parking_lot_id") REFERENCES "public"."pk_parking_lots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pk_carports" ADD CONSTRAINT "pk_carports_owner_id_hp_owners_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."hp_owners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pk_owner_vehicles" ADD CONSTRAINT "pk_owner_vehicles_owner_id_hp_owners_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."hp_owners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pk_owner_vehicles" ADD CONSTRAINT "pk_owner_vehicles_carport_id_pk_carports_id_fk" FOREIGN KEY ("carport_id") REFERENCES "public"."pk_carports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pk_parking_lots" ADD CONSTRAINT "pk_parking_lots_community_id_cm_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."cm_communities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pk_parking_structures" ADD CONSTRAINT "pk_parking_structures_parking_lot_id_pk_parking_lots_id_fk" FOREIGN KEY ("parking_lot_id") REFERENCES "public"."pk_parking_lots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pt_patrol_items" ADD CONSTRAINT "pt_patrol_items_point_id_pt_patrol_points_id_fk" FOREIGN KEY ("point_id") REFERENCES "public"."pt_patrol_points"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pt_patrol_paths" ADD CONSTRAINT "pt_patrol_paths_plan_id_pt_patrol_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."pt_patrol_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pt_patrol_plans" ADD CONSTRAINT "pt_patrol_plans_community_id_cm_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."cm_communities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pt_patrol_points" ADD CONSTRAINT "pt_patrol_points_path_id_pt_patrol_paths_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."pt_patrol_paths"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pt_patrol_task_details" ADD CONSTRAINT "pt_patrol_task_details_task_id_pt_patrol_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."pt_patrol_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pt_patrol_task_details" ADD CONSTRAINT "pt_patrol_task_details_point_id_pt_patrol_points_id_fk" FOREIGN KEY ("point_id") REFERENCES "public"."pt_patrol_points"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pt_patrol_tasks" ADD CONSTRAINT "pt_patrol_tasks_plan_id_pt_patrol_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."pt_patrol_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pt_patrol_tasks" ADD CONSTRAINT "pt_patrol_tasks_planned_patroller_id_sm_staff_id_fk" FOREIGN KEY ("planned_patroller_id") REFERENCES "public"."sm_staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pt_patrol_tasks" ADD CONSTRAINT "pt_patrol_tasks_current_patrol_person_id_sm_staff_id_fk" FOREIGN KEY ("current_patrol_person_id") REFERENCES "public"."sm_staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rp_phone_repair_reports" ADD CONSTRAINT "rp_phone_repair_reports_order_id_rp_repair_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."rp_repair_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rp_repair_order_histories" ADD CONSTRAINT "rp_repair_order_histories_order_id_rp_repair_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."rp_repair_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rp_repair_orders" ADD CONSTRAINT "rp_repair_orders_assigner_id_sm_staff_id_fk" FOREIGN KEY ("assigner_id") REFERENCES "public"."sm_staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rp_repair_orders" ADD CONSTRAINT "rp_repair_orders_repair_person_id_sm_staff_id_fk" FOREIGN KEY ("repair_person_id") REFERENCES "public"."sm_staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rp_return_visits" ADD CONSTRAINT "rp_return_visits_order_id_rp_repair_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."rp_repair_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rp_return_visits" ADD CONSTRAINT "rp_return_visits_visitor_id_sm_staff_id_fk" FOREIGN KEY ("visitor_id") REFERENCES "public"."sm_staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rpt_expense_summaries" ADD CONSTRAINT "rpt_expense_summaries_community_id_cm_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."cm_communities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rpt_owner_payment_details" ADD CONSTRAINT "rpt_owner_payment_details_owner_id_hp_owners_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."hp_owners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dt_config_items" ADD CONSTRAINT "dt_config_items_type_id_dt_config_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."dt_config_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dt_dictionary_items" ADD CONSTRAINT "dt_dictionary_items_dictionary_id_dt_dictionaries_id_fk" FOREIGN KEY ("dictionary_id") REFERENCES "public"."dt_dictionaries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dt_menu_catalogs" ADD CONSTRAINT "dt_menu_catalogs_parent_id_dt_menu_catalogs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."dt_menu_catalogs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dt_menu_catalogs" ADD CONSTRAINT "dt_menu_catalogs_group_id_dt_menu_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."dt_menu_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dt_menu_items" ADD CONSTRAINT "dt_menu_items_catalog_id_dt_menu_catalogs_id_fk" FOREIGN KEY ("catalog_id") REFERENCES "public"."dt_menu_catalogs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sm_working_schedules" ADD CONSTRAINT "sm_working_schedules_staff_id_sm_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."sm_staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sm_working_schedules" ADD CONSTRAINT "sm_working_schedules_shift_id_sm_shifts_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."sm_shifts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sm_data_permissions" ADD CONSTRAINT "sm_data_permissions_role_id_sm_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."sm_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sm_role_permissions" ADD CONSTRAINT "sm_role_permissions_role_id_sm_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."sm_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sm_role_permissions" ADD CONSTRAINT "sm_role_permissions_permission_id_sm_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."sm_permissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sm_staff_roles" ADD CONSTRAINT "sm_staff_roles_staff_id_sm_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."sm_staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sm_staff_roles" ADD CONSTRAINT "sm_staff_roles_role_id_sm_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."sm_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sm_staff" ADD CONSTRAINT "sm_staff_org_id_sm_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."sm_organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "op_merchants_name_idx" ON "op_merchants" USING btree ("merchant_name");--> statement-breakpoint
CREATE INDEX "op_merchants_code_idx" ON "op_merchants" USING btree ("merchant_code");--> statement-breakpoint
CREATE INDEX "op_property_companies_name_idx" ON "op_property_companies" USING btree ("company_name");--> statement-breakpoint
CREATE INDEX "cm_building_structures_community_id_idx" ON "cm_building_structures" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "cm_communities_name_idx" ON "cm_communities" USING btree ("name");--> statement-breakpoint
CREATE INDEX "cm_communities_code_idx" ON "cm_communities" USING btree ("code");--> statement-breakpoint
CREATE INDEX "cm_communities_status_idx" ON "cm_communities" USING btree ("status");--> statement-breakpoint
CREATE INDEX "cm_handing_business_status_idx" ON "cm_handing_business" USING btree ("status");--> statement-breakpoint
CREATE INDEX "cm_house_decorations_audit_status_idx" ON "cm_house_decorations" USING btree ("audit_status");--> statement-breakpoint
CREATE INDEX "cm_notices_community_id_idx" ON "cm_notices" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "cm_notices_status_idx" ON "cm_notices" USING btree ("status");--> statement-breakpoint
CREATE INDEX "cm_property_registers_status_idx" ON "cm_property_registers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ct_archives_contract_id_idx" ON "ct_archives" USING btree ("contract_id");--> statement-breakpoint
CREATE INDEX "ct_attachments_contract_id_idx" ON "ct_attachments" USING btree ("contract_id");--> statement-breakpoint
CREATE INDEX "ct_changes_contract_id_idx" ON "ct_changes" USING btree ("contract_id");--> statement-breakpoint
CREATE INDEX "ct_changes_approval_status_idx" ON "ct_changes" USING btree ("approval_status");--> statement-breakpoint
CREATE INDEX "ct_clauses_template_id_idx" ON "ct_clauses" USING btree ("template_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ct_contracts_contract_number_idx" ON "ct_contracts" USING btree ("contract_number") WHERE "ct_contracts"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX "ct_contracts_status_idx" ON "ct_contracts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ct_contracts_first_party_id_idx" ON "ct_contracts" USING btree ("first_party_id");--> statement-breakpoint
CREATE INDEX "ct_contracts_second_party_id_idx" ON "ct_contracts" USING btree ("second_party_id");--> statement-breakpoint
CREATE INDEX "ct_first_parties_status_idx" ON "ct_first_parties" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ct_prints_contract_id_idx" ON "ct_prints" USING btree ("contract_id");--> statement-breakpoint
CREATE INDEX "ct_reviews_contract_id_idx" ON "ct_reviews" USING btree ("contract_id");--> statement-breakpoint
CREATE INDEX "ct_second_parties_owner_id_idx" ON "ct_second_parties" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "ct_templates_status_idx" ON "ct_templates" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ex_cancel_fees_charge_id_idx" ON "ex_cancel_fees" USING btree ("charge_id");--> statement-breakpoint
CREATE INDEX "ex_cancel_fees_audit_status_idx" ON "ex_cancel_fees" USING btree ("audit_status");--> statement-breakpoint
CREATE INDEX "ex_contract_charges_contract_id_idx" ON "ex_contract_charges" USING btree ("contract_id");--> statement-breakpoint
CREATE INDEX "ex_contract_charges_status_idx" ON "ex_contract_charges" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ex_discount_applications_audit_status_idx" ON "ex_discount_applications" USING btree ("audit_status");--> statement-breakpoint
CREATE INDEX "ex_discount_settings_status_idx" ON "ex_discount_settings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ex_expense_items_expense_type_idx" ON "ex_expense_items" USING btree ("expense_type");--> statement-breakpoint
CREATE INDEX "ex_expense_items_status_idx" ON "ex_expense_items" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ex_expense_summary_tables_time_idx" ON "ex_expense_summary_tables" USING btree ("time");--> statement-breakpoint
CREATE INDEX "ex_expense_summary_tables_expense_item_name_idx" ON "ex_expense_summary_tables" USING btree ("expense_item_name");--> statement-breakpoint
CREATE INDEX "ex_expense_summary_tables_status_idx" ON "ex_expense_summary_tables" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ex_house_charges_house_id_billing_period_idx" ON "ex_house_charges" USING btree ("house_id","billing_period");--> statement-breakpoint
CREATE INDEX "ex_house_charges_status_idx" ON "ex_house_charges" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ex_meter_readings_house_id_idx" ON "ex_meter_readings" USING btree ("house_id");--> statement-breakpoint
CREATE INDEX "ex_meter_readings_meter_no_idx" ON "ex_meter_readings" USING btree ("meter_no");--> statement-breakpoint
CREATE INDEX "ex_meter_readings_reading_date_idx" ON "ex_meter_readings" USING btree ("reading_date");--> statement-breakpoint
CREATE INDEX "ex_overdue_reminders_charge_id_idx" ON "ex_overdue_reminders" USING btree ("charge_id");--> statement-breakpoint
CREATE INDEX "ex_overdue_reminders_reminder_time_idx" ON "ex_overdue_reminders" USING btree ("reminder_time");--> statement-breakpoint
CREATE INDEX "ex_payment_reviews_payment_id_idx" ON "ex_payment_reviews" USING btree ("payment_id");--> statement-breakpoint
CREATE INDEX "ex_payment_reviews_result_idx" ON "ex_payment_reviews" USING btree ("review_result");--> statement-breakpoint
CREATE INDEX "ex_payments_charge_id_idx" ON "ex_payments" USING btree ("charge_id");--> statement-breakpoint
CREATE INDEX "ex_payments_transaction_no_idx" ON "ex_payments" USING btree ("transaction_no");--> statement-breakpoint
CREATE INDEX "ex_refund_reviews_charge_id_idx" ON "ex_refund_reviews" USING btree ("charge_id");--> statement-breakpoint
CREATE INDEX "ex_refund_reviews_status_idx" ON "ex_refund_reviews" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ex_reprint_vouchers_payment_id_idx" ON "ex_reprint_vouchers" USING btree ("payment_id");--> statement-breakpoint
CREATE INDEX "ex_reprint_vouchers_original_voucher_no_idx" ON "ex_reprint_vouchers" USING btree ("original_voucher_no");--> statement-breakpoint
CREATE INDEX "ex_vehicle_charges_vehicle_id_idx" ON "ex_vehicle_charges" USING btree ("vehicle_id");--> statement-breakpoint
CREATE INDEX "ex_vehicle_charges_license_plate_idx" ON "ex_vehicle_charges" USING btree ("license_plate");--> statement-breakpoint
CREATE INDEX "ex_vehicle_charges_status_idx" ON "ex_vehicle_charges" USING btree ("status");--> statement-breakpoint
CREATE INDEX "hp_invoice_titles_owner_id_idx" ON "hp_invoice_titles" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "hp_invoices_payment_id_idx" ON "hp_invoices" USING btree ("payment_id");--> statement-breakpoint
CREATE INDEX "hp_houses_house_number_idx" ON "hp_houses" USING btree ("house_number");--> statement-breakpoint
CREATE INDEX "hp_houses_community_id_idx" ON "hp_houses" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "hp_owners_name_idx" ON "hp_owners" USING btree ("name");--> statement-breakpoint
CREATE INDEX "hp_owners_phone_idx" ON "hp_owners" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "pk_carport_applications_status_idx" ON "pk_carport_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "pk_carport_applications_applicant_idx" ON "pk_carport_applications" USING btree ("applicant");--> statement-breakpoint
CREATE INDEX "pk_carports_carport_number_idx" ON "pk_carports" USING btree ("carport_number");--> statement-breakpoint
CREATE INDEX "pk_carports_status_idx" ON "pk_carports" USING btree ("status");--> statement-breakpoint
CREATE INDEX "pk_carports_parking_lot_id_idx" ON "pk_carports" USING btree ("parking_lot_id");--> statement-breakpoint
CREATE UNIQUE INDEX "pk_owner_vehicles_license_plate_idx" ON "pk_owner_vehicles" USING btree ("license_plate") WHERE "pk_owner_vehicles"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX "pk_owner_vehicles_owner_id_idx" ON "pk_owner_vehicles" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "pk_owner_vehicles_carport_id_idx" ON "pk_owner_vehicles" USING btree ("carport_id");--> statement-breakpoint
CREATE INDEX "pk_parking_lots_community_id_idx" ON "pk_parking_lots" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "pk_parking_lots_lot_name_idx" ON "pk_parking_lots" USING btree ("lot_name");--> statement-breakpoint
CREATE INDEX "pk_parking_structures_parking_lot_id_idx" ON "pk_parking_structures" USING btree ("parking_lot_id");--> statement-breakpoint
CREATE INDEX "pt_patrol_items_point_id_idx" ON "pt_patrol_items" USING btree ("point_id");--> statement-breakpoint
CREATE INDEX "pt_patrol_paths_plan_id_idx" ON "pt_patrol_paths" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "pt_patrol_plans_community_id_idx" ON "pt_patrol_plans" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "pt_patrol_plans_patrol_type_idx" ON "pt_patrol_plans" USING btree ("patrol_type");--> statement-breakpoint
CREATE INDEX "pt_patrol_points_path_id_idx" ON "pt_patrol_points" USING btree ("path_id");--> statement-breakpoint
CREATE INDEX "pt_patrol_points_sort_order_idx" ON "pt_patrol_points" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "pt_patrol_task_details_task_id_idx" ON "pt_patrol_task_details" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "pt_patrol_task_details_point_id_idx" ON "pt_patrol_task_details" USING btree ("point_id");--> statement-breakpoint
CREATE INDEX "pt_patrol_task_details_check_in_status_idx" ON "pt_patrol_task_details" USING btree ("check_in_status");--> statement-breakpoint
CREATE UNIQUE INDEX "pt_patrol_tasks_task_code_idx" ON "pt_patrol_tasks" USING btree ("task_code");--> statement-breakpoint
CREATE INDEX "pt_patrol_tasks_status_start_time_idx" ON "pt_patrol_tasks" USING btree ("status","planned_start_time");--> statement-breakpoint
CREATE INDEX "pt_patrol_tasks_current_patrol_person_idx" ON "pt_patrol_tasks" USING btree ("current_patrol_person");--> statement-breakpoint
CREATE INDEX "pt_patrol_tasks_planned_patroller_id_idx" ON "pt_patrol_tasks" USING btree ("planned_patroller_id");--> statement-breakpoint
CREATE INDEX "pt_patrol_tasks_current_patrol_person_id_idx" ON "pt_patrol_tasks" USING btree ("current_patrol_person_id");--> statement-breakpoint
CREATE INDEX "pt_patrol_tasks_plan_id_idx" ON "pt_patrol_tasks" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "rp_phone_repair_reports_order_id_idx" ON "rp_phone_repair_reports" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "rp_repair_order_histories_order_id_idx" ON "rp_repair_order_histories" USING btree ("order_id");--> statement-breakpoint
CREATE UNIQUE INDEX "rp_repair_orders_work_order_number_idx" ON "rp_repair_orders" USING btree ("work_order_number") WHERE "rp_repair_orders"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX "rp_repair_orders_status_idx" ON "rp_repair_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "rp_repair_orders_created_at_idx" ON "rp_repair_orders" USING btree ("create_time");--> statement-breakpoint
CREATE INDEX "rp_return_visits_order_id_idx" ON "rp_return_visits" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "rpt_data_statistics_statistic_time_idx" ON "rpt_data_statistics" USING btree ("statistic_time");--> statement-breakpoint
CREATE INDEX "rpt_deposit_reports_period_start_idx" ON "rpt_deposit_reports" USING btree ("period_start");--> statement-breakpoint
CREATE INDEX "rpt_deposit_reports_period_end_idx" ON "rpt_deposit_reports" USING btree ("period_end");--> statement-breakpoint
CREATE INDEX "rpt_expense_summaries_period_start_idx" ON "rpt_expense_summaries" USING btree ("period_start");--> statement-breakpoint
CREATE INDEX "rpt_expense_summaries_period_end_idx" ON "rpt_expense_summaries" USING btree ("period_end");--> statement-breakpoint
CREATE INDEX "rpt_expense_summaries_community_id_idx" ON "rpt_expense_summaries" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "rpt_fee_reminders_reminder_time_idx" ON "rpt_fee_reminders" USING btree ("reminder_time");--> statement-breakpoint
CREATE INDEX "rpt_outstanding_fees_aging_bucket_idx" ON "rpt_outstanding_fees" USING btree ("aging_bucket");--> statement-breakpoint
CREATE INDEX "rpt_owner_payment_details_owner_id_idx" ON "rpt_owner_payment_details" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "rpt_patrol_reports_period_idx" ON "rpt_patrol_reports" USING btree ("period");--> statement-breakpoint
CREATE INDEX "rpt_payment_details_payment_time_idx" ON "rpt_payment_details" USING btree ("payment_time");--> statement-breakpoint
CREATE UNIQUE INDEX "dt_configs_config_key_idx" ON "dt_configs" USING btree ("config_key");--> statement-breakpoint
CREATE UNIQUE INDEX "dt_dictionaries_dictionary_code_idx" ON "dt_dictionaries" USING btree ("dictionary_code");--> statement-breakpoint
CREATE INDEX "dt_menu_items_path_idx" ON "dt_menu_items" USING btree ("path");--> statement-breakpoint
CREATE INDEX "sm_organizations_org_name_idx" ON "sm_organizations" USING btree ("org_name");--> statement-breakpoint
CREATE INDEX "sm_organizations_org_code_idx" ON "sm_organizations" USING btree ("org_code");--> statement-breakpoint
CREATE INDEX "sm_organizations_parent_id_idx" ON "sm_organizations" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "sm_working_schedules_staff_id_idx" ON "sm_working_schedules" USING btree ("staff_id");--> statement-breakpoint
CREATE INDEX "sm_working_schedules_shift_id_idx" ON "sm_working_schedules" USING btree ("shift_id");--> statement-breakpoint
CREATE INDEX "sm_working_schedules_schedule_date_idx" ON "sm_working_schedules" USING btree ("schedule_date");--> statement-breakpoint
CREATE INDEX "sm_data_permissions_role_id_idx" ON "sm_data_permissions" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "sm_permissions_permission_code_idx" ON "sm_permissions" USING btree ("permission_code");--> statement-breakpoint
CREATE INDEX "sm_permissions_permission_type_idx" ON "sm_permissions" USING btree ("permission_type");--> statement-breakpoint
CREATE INDEX "sm_role_permissions_role_id_idx" ON "sm_role_permissions" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "sm_role_permissions_permission_id_idx" ON "sm_role_permissions" USING btree ("permission_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sm_roles_code_idx" ON "sm_roles" USING btree ("code");--> statement-breakpoint
CREATE INDEX "sm_roles_role_name_idx" ON "sm_roles" USING btree ("role_name");--> statement-breakpoint
CREATE INDEX "sm_staff_roles_staff_id_idx" ON "sm_staff_roles" USING btree ("staff_id");--> statement-breakpoint
CREATE INDEX "sm_staff_roles_role_id_idx" ON "sm_staff_roles" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "sm_change_password_records_username_idx" ON "sm_change_password_records" USING btree ("username");--> statement-breakpoint
CREATE INDEX "sm_change_password_records_change_time_idx" ON "sm_change_password_records" USING btree ("change_time");--> statement-breakpoint
CREATE INDEX "sm_community_configurations_cs_id_idx" ON "sm_community_configurations" USING btree ("cs_id");--> statement-breakpoint
CREATE INDEX "sm_community_configurations_community_id_idx" ON "sm_community_configurations" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "sm_community_configurations_setting_name_idx" ON "sm_community_configurations" USING btree ("setting_name");--> statement-breakpoint
CREATE INDEX "sm_initialize_cells_init_item_idx" ON "sm_initialize_cells" USING btree ("init_item");--> statement-breakpoint
CREATE INDEX "sm_initialize_cells_init_status_idx" ON "sm_initialize_cells" USING btree ("init_status");--> statement-breakpoint
CREATE INDEX "sm_register_protocols_protocol_type_idx" ON "sm_register_protocols" USING btree ("protocol_type");--> statement-breakpoint
CREATE INDEX "sm_register_protocols_status_idx" ON "sm_register_protocols" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "sm_system_configs_config_key_idx" ON "sm_system_configs" USING btree ("config_key");--> statement-breakpoint
CREATE INDEX "sm_system_configs_config_type_idx" ON "sm_system_configs" USING btree ("config_type");--> statement-breakpoint
CREATE INDEX "sm_staff_employee_number_idx" ON "sm_staff" USING btree ("employee_number");--> statement-breakpoint
CREATE INDEX "sm_staff_name_idx" ON "sm_staff" USING btree ("name");--> statement-breakpoint
CREATE INDEX "sm_staff_org_id_idx" ON "sm_staff" USING btree ("org_id");