CREATE TABLE IF NOT EXISTS "user" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" varchar(64) NOT NULL,
  "password" varchar(64)
);

CREATE TABLE IF NOT EXISTS "chat" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "created_at" timestamp NOT NULL,
  "title" text NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "user"("id"),
  "visibility" varchar NOT NULL DEFAULT 'private'
);

CREATE TABLE IF NOT EXISTS "message" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "chat_id" uuid NOT NULL REFERENCES "chat"("id"),
  "role" varchar NOT NULL,
  "parts" json NOT NULL,
  "attachments" json NOT NULL,
  "created_at" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "vote" (
  "chat_id" uuid NOT NULL REFERENCES "chat"("id"),
  "message_id" uuid NOT NULL REFERENCES "message"("id"),
  "is_upvoted" boolean NOT NULL,
  PRIMARY KEY ("chat_id", "message_id")
);

CREATE TABLE IF NOT EXISTS "document" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp NOT NULL,
  "title" text NOT NULL,
  "content" text,
  "kind" varchar NOT NULL DEFAULT 'text',
  "user_id" uuid NOT NULL REFERENCES "user"("id"),
  PRIMARY KEY ("id", "created_at")
);

CREATE TABLE IF NOT EXISTS "suggestion" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "document_id" uuid NOT NULL,
  "document_created_at" timestamp NOT NULL,
  "original_text" text NOT NULL,
  "suggested_text" text NOT NULL,
  "description" text,
  "is_resolved" boolean NOT NULL DEFAULT false,
  "user_id" uuid NOT NULL REFERENCES "user"("id"),
  "created_at" timestamp NOT NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("document_id", "document_created_at") REFERENCES "document"("id", "created_at")
);

CREATE TABLE IF NOT EXISTS "stream" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "chat_id" uuid NOT NULL,
  "created_at" timestamp NOT NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("chat_id") REFERENCES "chat"("id")
);
