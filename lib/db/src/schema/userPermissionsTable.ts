import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const userPermissionsTable = pgTable(
  "user_permissions",
  {
    id: serial("id").primaryKey(),

    userId: text("user_id").notNull(),

    moduleName: text("module_name").notNull(),

    canView: boolean("can_view").default(false),

    canAdd: boolean("can_add").default(false),

    canEdit: boolean("can_edit").default(false),

    canDelete: boolean("can_delete").default(false),

    createdAt: timestamp("created_at").defaultNow(),
  }
);