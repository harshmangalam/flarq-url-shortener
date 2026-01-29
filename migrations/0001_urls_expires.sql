ALTER TABLE `urls` ADD `expires_at` integer;--> statement-breakpoint
ALTER TABLE `urls` ADD `is_active` integer DEFAULT true NOT NULL;