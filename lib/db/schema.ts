import type { InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  primaryKey,
  foreignKey,
  boolean,
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }).notNull(),
  password: varchar('password', { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable('chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  created_at: timestamp('created_at').notNull(),
  title: text('title').notNull(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => user.id),
  visibility: varchar('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private'),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable('message', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chat_id: uuid('chat_id')
    .notNull()
    .references(() => chat.id),
  role: varchar('role').notNull(),
  parts: json('parts').notNull(),
  attachments: json('attachments').notNull(),
  created_at: timestamp('created_at').notNull(),
});

export type Message = InferSelectModel<typeof message>;

export const vote = pgTable(
  'vote',
  {
    chat_id: uuid('chat_id')
      .notNull()
      .references(() => chat.id),
    message_id: uuid('message_id')
      .notNull()
      .references(() => message.id),
    is_upvoted: boolean('is_upvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chat_id, table.message_id] }),
    };
  },
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  'document',
  {
    id: uuid('id').notNull().defaultRandom(),
    created_at: timestamp('created_at').notNull(),
    title: text('title').notNull(),
    content: text('content'),
    kind: varchar('kind', { enum: ['text', 'code', 'image', 'sheet'] })
      .notNull()
      .default('text'),
    user_id: uuid('user_id')
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.created_at] }),
    };
  },
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  'suggestion',
  {
    id: uuid('id').notNull().defaultRandom(),
    document_id: uuid('document_id').notNull(),
    document_created_at: timestamp('document_created_at').notNull(),
    original_text: text('original_text').notNull(),
    suggested_text: text('suggested_text').notNull(),
    description: text('description'),
    is_resolved: boolean('is_resolved').notNull().default(false),
    user_id: uuid('user_id')
      .notNull()
      .references(() => user.id),
    created_at: timestamp('created_at').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.document_id, table.document_created_at],
      foreignColumns: [document.id, document.created_at],
    }),
  }),
);

export type Suggestion = InferSelectModel<typeof suggestion>;

export const stream = pgTable(
  'stream',
  {
    id: uuid('id').notNull().defaultRandom(),
    chat_id: uuid('chat_id').notNull(),
    created_at: timestamp('created_at').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    chatRef: foreignKey({
      columns: [table.chat_id],
      foreignColumns: [chat.id],
    }),
  }),
);

export type Stream = InferSelectModel<typeof stream>;
