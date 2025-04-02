import { pgTable, serial, varchar, text, integer, bigint } from "drizzle-orm/pg-core";
import { uniqueIndex, index } from "drizzle-orm/pg-core";

// Table: users
export const users = pgTable(
	"users",
	{
		id: serial("id").primaryKey(),
		username: varchar("username", { length: 50 }).notNull(),
		password: varchar("password", { length: 255 }).notNull(),
	},
	(table) => {
		return {
			usernameIdx: uniqueIndex("idx_users_username").on(table.username),
		};
	}
);

// Table: vSwitch
export const vSwitch = pgTable("vSwitch", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	userId: integer("user_id").references(() => users.id),
});

// Table: vms
export const vms = pgTable("vms", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	ram: bigint("ram", { mode: "number" }).notNull(),
	vcpu: integer("vcpu").notNull(),
	storage: bigint("storage", { mode: "number" }).notNull().default(20),
	userId: integer("user_id").references(() => users.id),
	vswitchId: integer("vswitch_id").references(() => vSwitch.id),
});

// Table: services
export const services = pgTable("services", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
});

// Table: vm_services
export const vmServices = pgTable("vm_services", {
	id: serial("id").primaryKey(),
	userId: integer("user_id").references(() => users.id),
	serviceId: integer("service_id").references(() => services.id),
	vmId: integer("vm_id").references(() => vms.id),
});

// Table: vm_logs
export const vmLogs = pgTable("vm_logs", {
	id: serial("id").primaryKey(),
	message: text("message").notNull(),
	userId: integer("user_id").references(() => users.id),
	vmId: integer("vm_id").references(() => vms.id),
});
