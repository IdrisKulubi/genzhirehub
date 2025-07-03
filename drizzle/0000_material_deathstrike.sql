CREATE TYPE "public"."application_status" AS ENUM('pending', 'reviewed', 'interview', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('internship', 'part-time', 'full-time');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('student', 'company', 'admin');--> statement-breakpoint
CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "application" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"cover_letter" text,
	"custom_cv_url" text,
	"status" "application_status" DEFAULT 'pending',
	"notes" text,
	"applied_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp,
	"interview_date" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"company_name" text NOT NULL,
	"logo_url" text,
	"website" text,
	"industry" text NOT NULL,
	"description" text,
	"location" text,
	"size" text,
	"founded" integer,
	"contact_email" text,
	"contact_phone" text,
	"profile_completed" boolean DEFAULT false,
	"verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "company_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "job" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"requirements" text,
	"location" text NOT NULL,
	"type" "job_type" NOT NULL,
	"salary_min" integer,
	"salary_max" integer,
	"currency" text DEFAULT 'KES',
	"tags" jsonb DEFAULT '[]'::jsonb,
	"skills" jsonb DEFAULT '[]'::jsonb,
	"deadline" timestamp,
	"is_active" boolean DEFAULT true,
	"featured" boolean DEFAULT false,
	"remote" boolean DEFAULT false,
	"application_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb,
	"read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"full_name" text NOT NULL,
	"course" text NOT NULL,
	"year_of_study" text NOT NULL,
	"skills" jsonb DEFAULT '[]'::jsonb,
	"interests" jsonb DEFAULT '[]'::jsonb,
	"linkedin_url" text,
	"cv_url" text,
	"bio" text,
	"phone" text,
	"location" text,
	"portfolio_url" text,
	"github_url" text,
	"profile_completed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "student_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"role" "user_role" DEFAULT 'student',
	"emailVerified" timestamp,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"role" "user_role" DEFAULT 'student',
	"full_name" text,
	"course" text,
	"company_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"invited_at" timestamp,
	"converted_at" timestamp,
	CONSTRAINT "waitlist_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_job_id_job_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."job"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company" ADD CONSTRAINT "company_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job" ADD CONSTRAINT "job_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "application_job_id_idx" ON "application" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "application_student_id_idx" ON "application" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "application_status_idx" ON "application" USING btree ("status");--> statement-breakpoint
CREATE INDEX "application_applied_at_idx" ON "application" USING btree ("applied_at");--> statement-breakpoint
CREATE INDEX "unique_application_idx" ON "application" USING btree ("job_id","student_id");--> statement-breakpoint
CREATE INDEX "company_user_id_idx" ON "company" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "company_industry_idx" ON "company" USING btree ("industry");--> statement-breakpoint
CREATE INDEX "company_verified_idx" ON "company" USING btree ("verified");--> statement-breakpoint
CREATE INDEX "job_company_id_idx" ON "job" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "job_type_idx" ON "job" USING btree ("type");--> statement-breakpoint
CREATE INDEX "job_location_idx" ON "job" USING btree ("location");--> statement-breakpoint
CREATE INDEX "job_active_idx" ON "job" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "job_featured_idx" ON "job" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "job_deadline_idx" ON "job" USING btree ("deadline");--> statement-breakpoint
CREATE INDEX "job_created_at_idx" ON "job" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "job_tags_idx" ON "job" USING btree ("tags");--> statement-breakpoint
CREATE INDEX "job_skills_idx" ON "job" USING btree ("skills");--> statement-breakpoint
CREATE INDEX "notification_user_id_idx" ON "notification" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_type_idx" ON "notification" USING btree ("type");--> statement-breakpoint
CREATE INDEX "notification_read_idx" ON "notification" USING btree ("read");--> statement-breakpoint
CREATE INDEX "notification_created_at_idx" ON "notification" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "student_user_id_idx" ON "student" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "student_course_idx" ON "student" USING btree ("course");--> statement-breakpoint
CREATE INDEX "student_year_idx" ON "student" USING btree ("year_of_study");--> statement-breakpoint
CREATE INDEX "student_skills_idx" ON "student" USING btree ("skills");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_role_idx" ON "user" USING btree ("role");--> statement-breakpoint
CREATE INDEX "user_created_at_idx" ON "user" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "waitlist_email_idx" ON "waitlist" USING btree ("email");--> statement-breakpoint
CREATE INDEX "waitlist_role_idx" ON "waitlist" USING btree ("role");--> statement-breakpoint
CREATE INDEX "waitlist_invited_idx" ON "waitlist" USING btree ("invited_at");