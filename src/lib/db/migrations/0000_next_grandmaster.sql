CREATE TABLE "event_data" (
	"event_data_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"website_id" uuid NOT NULL,
	"website_event_id" uuid NOT NULL,
	"data_key" varchar(500) NOT NULL,
	"string_value" varchar(500),
	"number_value" numeric(19, 4),
	"date_value" timestamp with time zone,
	"data_type" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "report" (
	"report_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"website_id" uuid NOT NULL,
	"type" varchar(200) NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" varchar(500) NOT NULL,
	"parameters" varchar(6000) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "session_data" (
	"session_data_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"website_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"data_key" varchar(500) NOT NULL,
	"string_value" varchar(500),
	"number_value" numeric(19, 4),
	"date_value" timestamp with time zone,
	"data_type" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "session" (
	"session_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"website_id" uuid NOT NULL,
	"hostname" varchar(100),
	"browser" varchar(20),
	"os" varchar(20),
	"device" varchar(20),
	"screen" varchar(11),
	"language" varchar(35),
	"country" char(2),
	"subdivision1" varchar(20),
	"subdivision2" varchar(50),
	"city" varchar(50),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "team_user" (
	"team_user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "team" (
	"team_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"access_code" varchar(50),
	"logo_url" varchar(2183),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	CONSTRAINT "team_access_code_unique" UNIQUE("access_code")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(60) NOT NULL,
	"role" varchar(50) NOT NULL,
	"logo_url" varchar(2183),
	"display_name" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "website_event" (
	"event_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"website_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"visit_id" uuid NOT NULL,
	"url_path" varchar(500) NOT NULL,
	"url_query" varchar(500),
	"referrer_path" varchar(500),
	"referrer_query" varchar(500),
	"referrer_domain" varchar(500),
	"page_title" varchar(500),
	"event_type" integer DEFAULT 1,
	"event_name" varchar(50),
	"tag" varchar(50),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "website" (
	"website_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"domain" varchar(500),
	"share_id" varchar(50),
	"reset_at" timestamp with time zone,
	"user_id" uuid,
	"team_id" uuid,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	CONSTRAINT "website_share_id_unique" UNIQUE("share_id")
);
--> statement-breakpoint
ALTER TABLE "event_data" ADD CONSTRAINT "event_data_website_id_website_website_id_fk" FOREIGN KEY ("website_id") REFERENCES "public"."website"("website_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_data" ADD CONSTRAINT "event_data_website_event_id_website_event_event_id_fk" FOREIGN KEY ("website_event_id") REFERENCES "public"."website_event"("event_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_website_id_website_website_id_fk" FOREIGN KEY ("website_id") REFERENCES "public"."website"("website_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_data" ADD CONSTRAINT "session_data_website_id_website_website_id_fk" FOREIGN KEY ("website_id") REFERENCES "public"."website"("website_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_data" ADD CONSTRAINT "session_data_session_id_session_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("session_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_website_id_website_website_id_fk" FOREIGN KEY ("website_id") REFERENCES "public"."website"("website_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_user" ADD CONSTRAINT "team_user_team_id_team_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("team_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_user" ADD CONSTRAINT "team_user_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "website_event" ADD CONSTRAINT "website_event_website_id_website_website_id_fk" FOREIGN KEY ("website_id") REFERENCES "public"."website"("website_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "website_event" ADD CONSTRAINT "website_event_session_id_session_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("session_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "website" ADD CONSTRAINT "website_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "website" ADD CONSTRAINT "website_team_id_team_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("team_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "website" ADD CONSTRAINT "website_created_by_user_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_data_created_at_idx" ON "event_data" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "event_data_website_id_idx" ON "event_data" USING btree ("website_id");--> statement-breakpoint
CREATE INDEX "event_data_website_event_id_idx" ON "event_data" USING btree ("website_event_id");--> statement-breakpoint
CREATE INDEX "report_user_id_idx" ON "report" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "report_website_id_idx" ON "report" USING btree ("website_id");--> statement-breakpoint
CREATE INDEX "report_type_idx" ON "report" USING btree ("type");--> statement-breakpoint
CREATE INDEX "report_name_idx" ON "report" USING btree ("name");--> statement-breakpoint
CREATE INDEX "session_data_created_at_idx" ON "session_data" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "session_data_website_id_idx" ON "session_data" USING btree ("website_id");--> statement-breakpoint
CREATE INDEX "session_data_session_id_idx" ON "session_data" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "session_created_at_idx" ON "session" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "session_website_id_idx" ON "session" USING btree ("website_id");--> statement-breakpoint
CREATE INDEX "session_website_created_idx" ON "session" USING btree ("website_id","created_at");--> statement-breakpoint
CREATE INDEX "team_user_team_id_idx" ON "team_user" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "team_user_user_id_idx" ON "team_user" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "team_access_code_idx" ON "team" USING btree ("access_code");--> statement-breakpoint
CREATE INDEX "user_username_idx" ON "user" USING btree ("username");--> statement-breakpoint
CREATE INDEX "user_created_at_idx" ON "user" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "website_event_created_at_idx" ON "website_event" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "website_event_session_id_idx" ON "website_event" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "website_event_website_id_idx" ON "website_event" USING btree ("website_id");--> statement-breakpoint
CREATE INDEX "website_event_visit_id_idx" ON "website_event" USING btree ("visit_id");--> statement-breakpoint
CREATE INDEX "website_event_website_created_idx" ON "website_event" USING btree ("website_id","created_at");--> statement-breakpoint
CREATE INDEX "website_event_url_path_idx" ON "website_event" USING btree ("website_id","created_at","url_path");--> statement-breakpoint
CREATE INDEX "website_event_event_name_idx" ON "website_event" USING btree ("website_id","created_at","event_name");--> statement-breakpoint
CREATE INDEX "website_event_tag_idx" ON "website_event" USING btree ("website_id","created_at","tag");--> statement-breakpoint
CREATE INDEX "website_user_id_idx" ON "website" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "website_team_id_idx" ON "website" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "website_created_at_idx" ON "website" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "website_share_id_idx" ON "website" USING btree ("share_id");--> statement-breakpoint
CREATE INDEX "website_created_by_idx" ON "website" USING btree ("created_by");