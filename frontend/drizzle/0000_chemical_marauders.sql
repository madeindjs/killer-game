CREATE TABLE `games` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`password` text NOT NULL,
	`private_token` text NOT NULL,
	`started_at` integer,
	`finished_at` integer,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`private_token` text NOT NULL,
	`order` integer NOT NULL,
	`killed_at` integer,
	`kill_token` integer,
	`killed_by` text,
	`action` text,
	`game_id` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade
);
