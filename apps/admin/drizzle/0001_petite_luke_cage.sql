CREATE TABLE "pk_parking_structures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parking_lot_id" uuid NOT NULL,
	"region_name" varchar(50) NOT NULL,
	"structure_data" text,
	"sort_order" integer DEFAULT 0,
	"remark" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pk_parking_structures" ADD CONSTRAINT "pk_parking_structures_parking_lot_id_pk_parking_lots_id_fk" FOREIGN KEY ("parking_lot_id") REFERENCES "public"."pk_parking_lots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pk_parking_structures_parking_lot_id_idx" ON "pk_parking_structures" USING btree ("parking_lot_id");