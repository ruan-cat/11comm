DROP INDEX "ct_contracts_contract_number_idx";--> statement-breakpoint
DROP INDEX "pk_owner_vehicles_license_plate_idx";--> statement-breakpoint
DROP INDEX "rp_repair_orders_work_order_number_idx";--> statement-breakpoint
ALTER TABLE "pk_carports" ADD COLUMN "owner_id" uuid;--> statement-breakpoint
ALTER TABLE "pk_owner_vehicles" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "pt_patrol_tasks" ADD COLUMN "planned_patroller_id" uuid;--> statement-breakpoint
ALTER TABLE "pt_patrol_tasks" ADD COLUMN "current_patrol_person_id" uuid;--> statement-breakpoint
ALTER TABLE "rp_repair_orders" ADD COLUMN "assigner_id" uuid;--> statement-breakpoint
ALTER TABLE "rp_repair_orders" ADD COLUMN "repair_person_id" uuid;--> statement-breakpoint
ALTER TABLE "rp_return_visits" ADD COLUMN "visitor_id" uuid;--> statement-breakpoint
ALTER TABLE "hp_invoices" ADD CONSTRAINT "hp_invoices_payment_id_ex_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."ex_payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ex_contract_charges" ADD CONSTRAINT "ex_contract_charges_contract_id_ct_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."ct_contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ex_vehicle_charges" ADD CONSTRAINT "ex_vehicle_charges_vehicle_id_pk_owner_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."pk_owner_vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pk_carports" ADD CONSTRAINT "pk_carports_owner_id_hp_owners_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."hp_owners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pt_patrol_tasks" ADD CONSTRAINT "pt_patrol_tasks_planned_patroller_id_sm_staff_id_fk" FOREIGN KEY ("planned_patroller_id") REFERENCES "public"."sm_staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pt_patrol_tasks" ADD CONSTRAINT "pt_patrol_tasks_current_patrol_person_id_sm_staff_id_fk" FOREIGN KEY ("current_patrol_person_id") REFERENCES "public"."sm_staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rp_repair_orders" ADD CONSTRAINT "rp_repair_orders_assigner_id_sm_staff_id_fk" FOREIGN KEY ("assigner_id") REFERENCES "public"."sm_staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rp_repair_orders" ADD CONSTRAINT "rp_repair_orders_repair_person_id_sm_staff_id_fk" FOREIGN KEY ("repair_person_id") REFERENCES "public"."sm_staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rp_return_visits" ADD CONSTRAINT "rp_return_visits_visitor_id_sm_staff_id_fk" FOREIGN KEY ("visitor_id") REFERENCES "public"."sm_staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "hp_invoice_titles_owner_id_idx" ON "hp_invoice_titles" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "hp_invoices_payment_id_idx" ON "hp_invoices" USING btree ("payment_id");--> statement-breakpoint
CREATE INDEX "pt_patrol_tasks_planned_patroller_id_idx" ON "pt_patrol_tasks" USING btree ("planned_patroller_id");--> statement-breakpoint
CREATE INDEX "pt_patrol_tasks_current_patrol_person_id_idx" ON "pt_patrol_tasks" USING btree ("current_patrol_person_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ct_contracts_contract_number_idx" ON "ct_contracts" USING btree ("contract_number") WHERE "ct_contracts"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "pk_owner_vehicles_license_plate_idx" ON "pk_owner_vehicles" USING btree ("license_plate") WHERE "pk_owner_vehicles"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "rp_repair_orders_work_order_number_idx" ON "rp_repair_orders" USING btree ("work_order_number") WHERE "rp_repair_orders"."deleted_at" is null;--> statement-breakpoint
ALTER TABLE "hp_owner_members" DROP COLUMN "creator";--> statement-breakpoint
ALTER TABLE "hp_owners" DROP COLUMN "emergency_contact_phone";--> statement-breakpoint
ALTER TABLE "hp_owners" DROP COLUMN "access_key";--> statement-breakpoint
ALTER TABLE "ct_changes" DROP COLUMN "contract_name";--> statement-breakpoint
ALTER TABLE "ct_changes" DROP COLUMN "contract_number";--> statement-breakpoint
ALTER TABLE "ct_changes" DROP COLUMN "contract_type";--> statement-breakpoint
ALTER TABLE "ct_changes" DROP COLUMN "party_a";--> statement-breakpoint
ALTER TABLE "ct_changes" DROP COLUMN "party_b";--> statement-breakpoint
ALTER TABLE "ct_changes" DROP COLUMN "changer";--> statement-breakpoint
ALTER TABLE "ct_changes" DROP COLUMN "apply_time";--> statement-breakpoint
ALTER TABLE "ct_changes" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "ct_changes" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "ex_expense_items" DROP COLUMN "expense_identifier";--> statement-breakpoint
ALTER TABLE "ex_expense_items" DROP COLUMN "prepayment_period";--> statement-breakpoint
ALTER TABLE "ex_expense_items" DROP COLUMN "unit";--> statement-breakpoint
ALTER TABLE "ex_meter_reading_types" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "sm_data_permissions" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "sm_data_permissions" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "sm_data_permissions" DROP COLUMN "level";--> statement-breakpoint
ALTER TABLE "sm_data_permissions" DROP COLUMN "enabled";--> statement-breakpoint
ALTER TABLE "sm_data_permissions" DROP COLUMN "resource_type";--> statement-breakpoint
ALTER TABLE "sm_data_permissions" DROP COLUMN "custom_range";--> statement-breakpoint
ALTER TABLE "sm_initialize_cells" DROP COLUMN "community_id";--> statement-breakpoint
ALTER TABLE "sm_initialize_cells" DROP COLUMN "community_name";--> statement-breakpoint
ALTER TABLE "sm_initialize_cells" DROP COLUMN "nearby_landmark";--> statement-breakpoint
ALTER TABLE "sm_initialize_cells" DROP COLUMN "city_code";--> statement-breakpoint
ALTER TABLE "sm_initialize_cells" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "sm_initialize_cells" DROP COLUMN "cell_name";--> statement-breakpoint
ALTER TABLE "sm_initialize_cells" DROP COLUMN "code";--> statement-breakpoint
ALTER TABLE "sm_scheduling_settings" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "sm_scheduling_settings" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "sm_scheduling_settings" DROP COLUMN "cycle";--> statement-breakpoint
ALTER TABLE "sm_scheduling_settings" DROP COLUMN "effective_time";--> statement-breakpoint
ALTER TABLE "sm_scheduling_settings" DROP COLUMN "staff";--> statement-breakpoint
ALTER TABLE "sm_scheduling_settings" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "sm_scheduling_settings" DROP COLUMN "org_id";--> statement-breakpoint
ALTER TABLE "sm_scheduling_settings" DROP COLUMN "rule_name";--> statement-breakpoint
ALTER TABLE "sm_scheduling_settings" DROP COLUMN "cycle_type";--> statement-breakpoint
ALTER TABLE "sm_scheduling_settings" DROP COLUMN "shift_ids";--> statement-breakpoint
ALTER TABLE "sm_shifts" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "sm_shifts" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "sm_shifts" DROP COLUMN "enabled";--> statement-breakpoint
ALTER TABLE "sm_system_configs" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "sm_system_configs" DROP COLUMN "subtitle";--> statement-breakpoint
ALTER TABLE "sm_system_configs" DROP COLUMN "short_name";--> statement-breakpoint
ALTER TABLE "sm_system_configs" DROP COLUMN "company_name";--> statement-breakpoint
ALTER TABLE "sm_system_configs" DROP COLUMN "logo_url";--> statement-breakpoint
ALTER TABLE "sm_system_configs" DROP COLUMN "static_url";--> statement-breakpoint
ALTER TABLE "sm_system_configs" DROP COLUMN "default_community_code";--> statement-breakpoint
ALTER TABLE "sm_system_configs" DROP COLUMN "owner_title";--> statement-breakpoint
ALTER TABLE "sm_system_configs" DROP COLUMN "property_mobile_title";--> statement-breakpoint
ALTER TABLE "sm_system_configs" DROP COLUMN "qq_map_key";--> statement-breakpoint
ALTER TABLE "sm_system_configs" DROP COLUMN "mall_url";