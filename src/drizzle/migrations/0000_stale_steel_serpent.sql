CREATE TABLE "url" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"longUrl" varchar NOT NULL,
	"shortUrl" varchar(255) NOT NULL,
	CONSTRAINT "url_id_unique" UNIQUE("id"),
	CONSTRAINT "url_shortUrl_unique" UNIQUE("shortUrl")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "shortUrlIndex" ON "url" USING btree ("shortUrl");