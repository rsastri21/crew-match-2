ALTER TABLE "configs" ALTER COLUMN "session" SET DEFAULT '{"candidate":"","production":""}'::jsonb;--> statement-breakpoint
ALTER TABLE "configs" ALTER COLUMN "session" SET NOT NULL;