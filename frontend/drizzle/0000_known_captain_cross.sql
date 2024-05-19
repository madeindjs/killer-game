CREATE TABLE `game_actions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`game_id` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `games` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
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
	`action_id` text NOT NULL,
	`game_id` text NOT NULL,
	`avatar` text,
	`created_at` integer,
	FOREIGN KEY (`action_id`) REFERENCES `game_actions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade
);
