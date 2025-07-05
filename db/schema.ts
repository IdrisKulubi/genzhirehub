import { 
  pgTable, 
  text, 
  timestamp, 
  integer, 
  uuid,
  boolean,
  pgEnum,
  primaryKey,
  index,
  jsonb
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { type AdapterAccount } from "next-auth/adapters";

// Enums
export const userRoleEnum = pgEnum('user_role', ['student', 'company', 'admin']);
export const jobTypeEnum = pgEnum('job_type', ['internship', 'part-time', 'full-time']);
export const applicationStatusEnum = pgEnum('application_status', [
  'pending', 'reviewed', 'interview', 'accepted', 'rejected'
]);

// Users table (NextAuth + custom fields)
export const users = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name"),
    email: text("email").notNull().unique(),
    role: userRoleEnum("role").default("student"),
    emailVerified: timestamp("emailVerified"),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("user_email_idx").on(table.email),
    roleIdx: index("user_role_idx").on(table.role),
    createdAtIdx: index("user_created_at_idx").on(table.createdAt),
  })
);

// Student profiles
export const students = pgTable(
  "student",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    fullName: text("full_name").notNull(),
    course: text("course").notNull(),
    university: text("university"),
    yearOfStudy: text("year_of_study").notNull(),
    skills: jsonb("skills").$type<string[]>().default([]),
    interests: jsonb("interests").$type<string[]>().default([]),
    linkedinUrl: text("linkedin_url"),
    cvUrl: text("cv_url"),
    bio: text("bio"),
    phone: text("phone"),
    location: text("location"),
    portfolioUrl: text("portfolio_url"),
    githubUrl: text("github_url"),
    profileCompleted: boolean("profile_completed").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("student_user_id_idx").on(table.userId),
    courseIdx: index("student_course_idx").on(table.course),
    yearIdx: index("student_year_idx").on(table.yearOfStudy),
    skillsIdx: index("student_skills_idx").on(table.skills),
  })
);

// Company profiles
export const companies = pgTable(
  "company",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    companyName: text("company_name").notNull(),
    logoUrl: text("logo_url"),
    website: text("website"),
    industry: text("industry").notNull(),
    description: text("description"),
    location: text("location"),
    size: text("size"), // "1-10", "11-50", "51-200", "201-500", "500+"
    founded: integer("founded"),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    profileCompleted: boolean("profile_completed").default(false),
    verified: boolean("verified").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("company_user_id_idx").on(table.userId),
    industryIdx: index("company_industry_idx").on(table.industry),
    verifiedIdx: index("company_verified_idx").on(table.verified),
  })
);

// Job postings
export const jobs = pgTable(
  "job",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    requirements: text("requirements"),
    location: text("location").notNull(),
    type: jobTypeEnum("type").notNull(),
    salaryMin: integer("salary_min"),
    salaryMax: integer("salary_max"),
    currency: text("currency").default("KES"),
    tags: jsonb("tags").$type<string[]>().default([]),
    skills: jsonb("skills").$type<string[]>().default([]),
    deadline: timestamp("deadline"),
    isActive: boolean("is_active").default(true),
    featured: boolean("featured").default(false),
    remote: boolean("remote").default(false),
    applicationUrl: text("application_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    companyIdIdx: index("job_company_id_idx").on(table.companyId),
    typeIdx: index("job_type_idx").on(table.type),
    locationIdx: index("job_location_idx").on(table.location),
    activeIdx: index("job_active_idx").on(table.isActive),
    featuredIdx: index("job_featured_idx").on(table.featured),
    deadlineIdx: index("job_deadline_idx").on(table.deadline),
    createdAtIdx: index("job_created_at_idx").on(table.createdAt),
    tagsIdx: index("job_tags_idx").on(table.tags),
    skillsIdx: index("job_skills_idx").on(table.skills),
  })
);

// Job applications
export const applications = pgTable(
  "application",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    coverLetter: text("cover_letter"),
    customCvUrl: text("custom_cv_url"), // Optional custom CV for this application
    status: applicationStatusEnum("status").default("pending"),
    notes: text("notes"), // Company notes about the application
    appliedAt: timestamp("applied_at").defaultNow().notNull(),
    reviewedAt: timestamp("reviewed_at"),
    interviewDate: timestamp("interview_date"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    jobIdIdx: index("application_job_id_idx").on(table.jobId),
    studentIdIdx: index("application_student_id_idx").on(table.studentId),
    statusIdx: index("application_status_idx").on(table.status),
    appliedAtIdx: index("application_applied_at_idx").on(table.appliedAt),
    // Unique constraint to prevent duplicate applications
    uniqueApplication: index("unique_application_idx").on(table.jobId, table.studentId),
  })
);

// Waitlist for pre-launch
export const waitlist = pgTable(
  "waitlist",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    role: userRoleEnum("role").default("student"),
    fullName: text("full_name"),
    course: text("course"), // For students
    companyName: text("company_name"), // For companies
    createdAt: timestamp("created_at").defaultNow().notNull(),
    invitedAt: timestamp("invited_at"),
    convertedAt: timestamp("converted_at"),
  },
  (table) => ({
    emailIdx: index("waitlist_email_idx").on(table.email),
    roleIdx: index("waitlist_role_idx").on(table.role),
    invitedIdx: index("waitlist_invited_idx").on(table.invitedAt),
  })
);

// Notifications system
export const notifications = pgTable(
  "notification",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // "job_match", "application_update", "new_job", etc.
    title: text("title").notNull(),
    message: text("message").notNull(),
    data: jsonb("data").$type<Record<string, any>>().default({}),
    read: boolean("read").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("notification_user_id_idx").on(table.userId),
    typeIdx: index("notification_type_idx").on(table.type),
    readIdx: index("notification_read_idx").on(table.read),
    createdAtIdx: index("notification_created_at_idx").on(table.createdAt),
  })
);

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  student: one(students, {
    fields: [users.id],
    references: [students.userId],
  }),
  company: one(companies, {
    fields: [users.id],
    references: [companies.userId],
  }),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  applications: many(applications),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  user: one(users, {
    fields: [companies.userId],
    references: [users.id],
  }),
  jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  company: one(companies, {
    fields: [jobs.companyId],
    references: [companies.id],
  }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  student: one(students, {
    fields: [applications.studentId],
    references: [students.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// NextAuth tables (keep existing)
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);
