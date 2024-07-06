ALTER TABLE "accounts" ADD COLUMN "slack_id" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_slack_id_unique" UNIQUE("slack_id");