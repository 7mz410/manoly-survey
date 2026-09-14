import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const rooms=sqliteTable('rooms',{id:text('id').primaryKey(),host:text('host').notNull(),revealed:integer('revealed').notNull().default(0),created:text('created').notNull()});
export const members=sqliteTable('members',{id:text('id').primaryKey(),room:text('room').notNull().references(()=>rooms.id),name:text('name').notNull(),answers:text('answers').notNull().default('{}'),done:integer('done').notNull().default(0),created:text('created').notNull()},t=>[index('members_room_idx').on(t.room)]);
export const resultAttempts=sqliteTable('result_attempts',{key:text('key').primaryKey(),count:integer('count').notNull(),expires:integer('expires').notNull()});
