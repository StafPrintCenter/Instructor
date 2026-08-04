/**
 * Mocked, Promise-based API layer for the instructor workspace.
 * Every call mimics a Laravel REST endpoint with simulated latency.
 * Swap the bodies for `fetch()` calls later — signatures stay identical.
 */

import * as db from "./mock-data";
import { clone, computeProgress, delay, fail, nowIso, uid } from "./utils";
import type {
  ActivityItem,
  AppNotification,
  CommunityPost,
  ContentReview,
  ContentStatus,
  DashboardStats,
  Enrollment,
  ID,
  Instructor,
  InstructorAccountStatus,
  Lesson,
  LessonCompletion,
  LessonType,
  MessageThread,
  Module,
  NotificationPrefs,
  QuizAttempt,
  QuizConfig,
  Student,
  Submission,
  Training,
  TrainingSession,
  Availability,
} from "./types";

export * from "./types";
export * from "./utils";

/* --------------------------- mutable in-memory db -------------------------- */

const store = {
  instructors: clone(db.instructors),
  trainings: clone(db.trainings),
  modules: clone(db.modules),
  lessons: clone(db.lessons),
  students: clone(db.students),
  enrollments: clone(db.enrollments),
  completions: clone(db.completions),
  attempts: clone(db.quizAttempts),
  submissions: clone(db.submissions),
  sessions: clone(db.sessions),
  posts: clone(db.posts),
  threads: clone(db.threads),
  notifications: clone(db.notifications),
  reviews: clone(db.reviews),
};

export const CURRENT_INSTRUCTOR_ID = db.CURRENT_INSTRUCTOR_ID;

/** Règle métier : un instructeur ne voit que ses formations assignées. */
function assignedTrainings(instructorId: ID): Training[] {
  return store.trainings.filter((t) => t.instructor_ids.includes(instructorId));
}

function assertAssigned(instructorId: ID, trainingId: ID) {
  const training = assignedTrainings(instructorId).find((t) => t.id === trainingId);
  if (!training) return null;
  return training;
}

function publishedLessons(trainingId: ID) {
  return store.lessons.filter((l) => l.training_id === trainingId && l.status === "approved" && l.is_active);
}

function recomputeProgress(studentId: ID, trainingId: ID) {
  const enrollment = store.enrollments.find((e) => e.student_id === studentId && e.training_id === trainingId);
  if (!enrollment) return;
  enrollment.progress = computeProgress({
    publishedLessons: publishedLessons(trainingId),
    completedLessonIds: store.completions.filter((c) => c.student_id === studentId).map((c) => c.lesson_id),
    submittedLessonIds: store.submissions
      .filter((s) => s.student_id === studentId && s.status !== "returned")
      .map((s) => s.lesson_id),
    attempts: store.attempts.filter((a) => a.student_id === studentId),
  });
}

function pushReview(entity_type: "module" | "lesson", entity_id: ID, entity_title: string) {
  const review: ContentReview = {
    id: uid("rev"),
    entity_type,
    entity_id,
    entity_title,
    status: "submitted",
    admin_comment: null,
    submitted_at: nowIso(),
    reviewed_at: null,
  };
  store.reviews.unshift(review);
  return review;
}

/* ---------------------------------- auth ---------------------------------- */

export interface AuthResult {
  instructor: Instructor;
  token: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthResult> {
    const instructor = store.instructors.find((i) => i.email.toLowerCase() === email.trim().toLowerCase());
    if (!instructor || password.length < 4) {
      return fail("Identifiants invalides. Vérifiez votre e-mail et votre mot de passe.");
    }
    if (instructor.status === "pending_review") {
      return fail("Votre compte formateur est en attente de validation par l'administration.");
    }
    if (instructor.status === "rejected") {
      return fail("Votre demande de compte a été refusée. Contactez l'administration.");
    }
    return delay({ instructor: clone(instructor), token: uid("tok") });
  },

  async register(input: {
    full_name: string;
    email: string;
    phone: string;
    title: string;
    specialties: string[];
    bio: string;
  }): Promise<{ status: InstructorAccountStatus }> {
    if (store.instructors.some((i) => i.email.toLowerCase() === input.email.toLowerCase())) {
      return fail("Un compte existe déjà avec cet e-mail.");
    }
    store.instructors.push({
      id: uid("usr"),
      full_name: input.full_name,
      email: input.email,
      title: input.title,
      bio: input.bio,
      specialties: input.specialties,
      avatar_url: null,
      phone: input.phone,
      status: "pending_review",
      rejection_reason: null,
      availability: [],
      notification_prefs: {
        submissions_email: true,
        session_reminders: true,
        community_mentions: true,
        admin_reviews: true,
      },
      created_at: nowIso(),
    });
    return delay({ status: "pending_review" as InstructorAccountStatus });
  },

  async requestPasswordReset(email: string): Promise<{ sent: true }> {
    if (!email.includes("@")) return fail("Adresse e-mail invalide.");
    return delay({ sent: true } as const);
  },

  async resetPassword(token: string, password: string): Promise<{ ok: true }> {
    if (!token) return fail("Lien de réinitialisation invalide ou expiré.");
    if (password.length < 8) return fail("Le mot de passe doit contenir au moins 8 caractères.");
    return delay({ ok: true } as const);
  },

  async activateAccount(code: string): Promise<{ ok: true }> {
    if (code.trim().length < 6) return fail("Code d'activation incomplet.");
    return delay({ ok: true } as const);
  },

  async me(instructorId: ID): Promise<Instructor> {
    const found = store.instructors.find((i) => i.id === instructorId);
    if (!found) return fail("Session expirée.");
    return delay(clone(found));
  },
};

/* -------------------------------- dashboard ------------------------------- */

export const dashboardApi = {
  async stats(instructorId: ID): Promise<DashboardStats> {
    const mine = assignedTrainings(instructorId);
    const ids = mine.map((t) => t.id);
    const enrolled = store.enrollments.filter((e) => ids.includes(e.training_id));
    const pending = store.submissions.filter((s) => ids.includes(s.training_id) && s.status === "pending");
    const avg = enrolled.length
      ? Math.round(enrolled.reduce((sum, e) => sum + e.progress, 0) / enrolled.length)
      : 0;
    return delay({
      assigned_trainings: mine.length,
      active_students: new Set(enrolled.map((e) => e.student_id)).size,
      pending_submissions: pending.length,
      average_completion: avg,
      upcoming_sessions: store.sessions.filter(
        (s) => ids.includes(s.training_id) && new Date(s.starts_at) > new Date(),
      ).length,
      overdue_gradings: pending.filter(
        (s) => Date.now() - new Date(s.submitted_at).getTime() > 5 * 86_400_000,
      ).length,
    });
  },

  async activity(instructorId: ID): Promise<ActivityItem[]> {
    const ids = assignedTrainings(instructorId).map((t) => t.id);
    const studentName = (id: ID) => store.students.find((s) => s.id === id)?.full_name ?? "Apprenant";
    const items: ActivityItem[] = [
      ...store.submissions
        .filter((s) => ids.includes(s.training_id))
        .map<ActivityItem>((s) => ({
          id: `act_sub_${s.id}`,
          kind: "submission",
          label: `${studentName(s.student_id)} a rendu « ${s.lesson_title} »`,
          meta: s.status === "pending" ? "En attente de correction" : "Corrigé",
          created_at: s.submitted_at,
        })),
      ...store.attempts.map<ActivityItem>((a) => ({
        id: `act_att_${a.id}`,
        kind: "quiz",
        label: `${studentName(a.student_id)} — tentative ${a.attempt_number} sur « ${a.lesson_title} »`,
        meta: `${a.score}/100 ${a.passed ? "· réussi" : "· échoué"}`,
        created_at: a.taken_at,
      })),
      ...store.reviews.map<ActivityItem>((r) => ({
        id: `act_rev_${r.id}`,
        kind: "review",
        label: `« ${r.entity_title} » ${r.status === "rejected" ? "refusé" : "en validation"}`,
        meta: r.admin_comment ?? "Validation administrateur",
        created_at: r.reviewed_at ?? r.submitted_at,
      })),
    ];
    return delay(
      items.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 12),
    );
  },

  async overdueGradings(instructorId: ID): Promise<Submission[]> {
    const ids = assignedTrainings(instructorId).map((t) => t.id);
    return delay(
      clone(
        store.submissions.filter(
          (s) =>
            ids.includes(s.training_id) &&
            s.status === "pending" &&
            Date.now() - new Date(s.submitted_at).getTime() > 5 * 86_400_000,
        ),
      ),
    );
  },
};

/* -------------------------------- trainings ------------------------------- */

export const trainingsApi = {
  async listAssigned(instructorId: ID): Promise<Training[]> {
    return delay(clone(assignedTrainings(instructorId)));
  },

  async get(instructorId: ID, trainingId: ID): Promise<Training> {
    const training = assertAssigned(instructorId, trainingId);
    if (!training) return fail("Formation introuvable ou non assignée à votre compte.");
    return delay(clone(training));
  },

  async overview(
    instructorId: ID,
    trainingId: ID,
  ): Promise<{ training: Training; enrollments: (Enrollment & { student: Student })[]; averageProgress: number }> {
    const training = assertAssigned(instructorId, trainingId);
    if (!training) return fail("Formation introuvable ou non assignée à votre compte.");
    const rows = store.enrollments
      .filter((e) => e.training_id === trainingId)
      .map((e) => ({ ...e, student: store.students.find((s) => s.id === e.student_id)! }));
    const averageProgress = rows.length
      ? Math.round(rows.reduce((sum, r) => sum + r.progress, 0) / rows.length)
      : 0;
    return delay(clone({ training, enrollments: rows, averageProgress }));
  },
};

/* ---------------------------- modules & lessons --------------------------- */

export const contentApi = {
  async modules(instructorId: ID, trainingId: ID): Promise<Module[]> {
    if (!assertAssigned(instructorId, trainingId)) return fail("Accès refusé à cette formation.");
    return delay(
      clone(store.modules.filter((m) => m.training_id === trainingId).sort((a, b) => a.position - b.position)),
    );
  },

  async lessons(instructorId: ID, trainingId: ID): Promise<Lesson[]> {
    if (!assertAssigned(instructorId, trainingId)) return fail("Accès refusé à cette formation.");
    return delay(
      clone(store.lessons.filter((l) => l.training_id === trainingId).sort((a, b) => a.position - b.position)),
    );
  },

  async lesson(instructorId: ID, lessonId: ID): Promise<Lesson> {
    const lesson = store.lessons.find((l) => l.id === lessonId);
    if (!lesson || !assertAssigned(instructorId, lesson.training_id)) return fail("Leçon introuvable.");
    return delay(clone(lesson));
  },

  async createModule(trainingId: ID, title: string, description: string): Promise<Module> {
    const position = store.modules.filter((m) => m.training_id === trainingId).length + 1;
    const module: Module = {
      id: uid("mod"),
      training_id: trainingId,
      title,
      description,
      position,
      is_active: true,
      status: "draft",
    };
    store.modules.push(module);
    return delay(clone(module));
  },

  async updateModule(moduleId: ID, patch: Partial<Pick<Module, "title" | "description" | "is_active">>): Promise<Module> {
    const module = store.modules.find((m) => m.id === moduleId);
    if (!module) return fail("Module introuvable.");
    Object.assign(module, patch);
    if (module.status === "approved") module.status = "draft";
    return delay(clone(module));
  },

  async deleteModule(moduleId: ID): Promise<{ ok: true }> {
    store.modules = store.modules.filter((m) => m.id !== moduleId);
    store.lessons = store.lessons.filter((l) => l.module_id !== moduleId);
    return delay({ ok: true } as const);
  },

  async moveModule(moduleId: ID, direction: -1 | 1): Promise<Module[]> {
    const module = store.modules.find((m) => m.id === moduleId);
    if (!module) return fail("Module introuvable.");
    const siblings = store.modules
      .filter((m) => m.training_id === module.training_id)
      .sort((a, b) => a.position - b.position);
    const index = siblings.findIndex((m) => m.id === moduleId);
    const target = index + direction;
    if (target < 0 || target >= siblings.length) return delay(clone(siblings));
    const swap = siblings[target];
    [module.position, swap.position] = [swap.position, module.position];
    return delay(clone(siblings.sort((a, b) => a.position - b.position)));
  },

  async createLesson(input: {
    training_id: ID;
    module_id: ID;
    title: string;
    type: LessonType;
    duration_minutes: number;
    video_url?: string;
    content?: string;
    brief?: string;
  }): Promise<Lesson> {
    const position = store.lessons.filter((l) => l.module_id === input.module_id).length + 1;
    const lesson: Lesson = {
      id: uid("les"),
      module_id: input.module_id,
      training_id: input.training_id,
      title: input.title,
      type: input.type,
      position,
      duration_minutes: input.duration_minutes,
      status: "draft",
      is_active: true,
      video_url: input.video_url,
      chapters: input.type === "video" ? [] : undefined,
      content: input.content,
      brief: input.brief,
      quiz:
        input.type === "quiz" || input.type === "exercise"
          ? {
              time_limit_minutes: input.type === "quiz" ? 15 : null,
              pass_threshold: 70,
              max_attempts: 3,
              manual_grading: input.type === "exercise",
              questions: [],
            }
          : undefined,
      updated_at: nowIso(),
    };
    store.lessons.push(lesson);
    return delay(clone(lesson));
  },

  async updateLesson(lessonId: ID, patch: Partial<Lesson>): Promise<Lesson> {
    const lesson = store.lessons.find((l) => l.id === lessonId);
    if (!lesson) return fail("Leçon introuvable.");
    Object.assign(lesson, patch, { updated_at: nowIso() });
    if (lesson.status === "approved") lesson.status = "draft";
    return delay(clone(lesson));
  },

  async deleteLesson(lessonId: ID): Promise<{ ok: true }> {
    store.lessons = store.lessons.filter((l) => l.id !== lessonId);
    return delay({ ok: true } as const);
  },

  async moveLesson(lessonId: ID, direction: -1 | 1): Promise<Lesson[]> {
    const lesson = store.lessons.find((l) => l.id === lessonId);
    if (!lesson) return fail("Leçon introuvable.");
    const siblings = store.lessons
      .filter((l) => l.module_id === lesson.module_id)
      .sort((a, b) => a.position - b.position);
    const index = siblings.findIndex((l) => l.id === lessonId);
    const target = index + direction;
    if (target < 0 || target >= siblings.length) return delay(clone(siblings));
    const swap = siblings[target];
    [lesson.position, swap.position] = [swap.position, lesson.position];
    return delay(clone(siblings.sort((a, b) => a.position - b.position)));
  },

  async saveQuiz(lessonId: ID, quiz: QuizConfig): Promise<Lesson> {
    const lesson = store.lessons.find((l) => l.id === lessonId);
    if (!lesson) return fail("Leçon introuvable.");
    lesson.quiz = clone(quiz);
    lesson.updated_at = nowIso();
    if (lesson.status === "approved") lesson.status = "draft";
    return delay(clone(lesson));
  },

  /** Workflow : toute publication passe par une validation administrateur. */
  async submitForReview(entity_type: "module" | "lesson", entityId: ID): Promise<ContentReview> {
    const entity =
      entity_type === "module"
        ? store.modules.find((m) => m.id === entityId)
        : store.lessons.find((l) => l.id === entityId);
    if (!entity) return fail("Contenu introuvable.");
    if (entity.status === "submitted") return fail("Ce contenu est déjà en cours de validation.");
    entity.status = "submitted" as ContentStatus;
    return delay(pushReview(entity_type, entityId, entity.title));
  },

  async reviews(instructorId: ID): Promise<ContentReview[]> {
    const ids = assignedTrainings(instructorId).map((t) => t.id);
    const owned = new Set([
      ...store.modules.filter((m) => ids.includes(m.training_id)).map((m) => m.id),
      ...store.lessons.filter((l) => ids.includes(l.training_id)).map((l) => l.id),
    ]);
    return delay(clone(store.reviews.filter((r) => owned.has(r.entity_id))));
  },
};

/* --------------------------------- students ------------------------------- */

export interface StudentRow extends Enrollment {
  student: Student;
  training_title: string;
}

export const studentsApi = {
  async list(instructorId: ID, trainingId?: ID): Promise<StudentRow[]> {
    const mine = assignedTrainings(instructorId);
    const ids = mine.map((t) => t.id);
    const rows = store.enrollments
      .filter((e) => ids.includes(e.training_id) && (!trainingId || e.training_id === trainingId))
      .map((e) => ({
        ...e,
        student: store.students.find((s) => s.id === e.student_id)!,
        training_title: mine.find((t) => t.id === e.training_id)!.title,
      }));
    return delay(clone(rows));
  },

  async detail(
    instructorId: ID,
    studentId: ID,
  ): Promise<{
    student: Student;
    enrollments: (Enrollment & { training_title: string })[];
    completions: LessonCompletion[];
    attempts: QuizAttempt[];
    submissions: Submission[];
    totalLessons: number;
  }> {
    const student = store.students.find((s) => s.id === studentId);
    const ids = assignedTrainings(instructorId).map((t) => t.id);
    const enrollments = store.enrollments
      .filter((e) => e.student_id === studentId && ids.includes(e.training_id))
      .map((e) => ({ ...e, training_title: store.trainings.find((t) => t.id === e.training_id)!.title }));
    if (!student || !enrollments.length) return fail("Apprenant introuvable dans vos formations.");
    const enrolledIds = enrollments.map((e) => e.training_id);
    return delay(
      clone({
        student,
        enrollments,
        totalLessons: store.lessons.filter((l) => enrolledIds.includes(l.training_id) && l.is_active).length,
        completions: store.completions
          .filter((c) => c.student_id === studentId)
          .sort((a, b) => +new Date(b.completed_at) - +new Date(a.completed_at)),
        attempts: store.attempts
          .filter((a) => a.student_id === studentId)
          .sort((a, b) => +new Date(b.taken_at) - +new Date(a.taken_at)),
        submissions: store.submissions.filter((s) => s.student_id === studentId && ids.includes(s.training_id)),
      }),
    );

  },
};

/* ------------------------------- corrections ------------------------------ */

export interface SubmissionRow extends Submission {
  student: Student;
  training_title: string;
}

export const gradingApi = {
  async queue(
    instructorId: ID,
    filters?: { trainingId?: ID; type?: string; status?: string },
  ): Promise<SubmissionRow[]> {
    const mine = assignedTrainings(instructorId);
    const ids = mine.map((t) => t.id);
    const rows = store.submissions
      .filter((s) => ids.includes(s.training_id))
      .filter((s) => (filters?.trainingId ? s.training_id === filters.trainingId : true))
      .filter((s) => (filters?.type && filters.type !== "all" ? s.type === filters.type : true))
      .filter((s) => (filters?.status && filters.status !== "all" ? s.status === filters.status : true))
      .map((s) => ({
        ...s,
        student: store.students.find((x) => x.id === s.student_id)!,
        training_title: mine.find((t) => t.id === s.training_id)!.title,
      }))
      .sort((a, b) => +new Date(a.submitted_at) - +new Date(b.submitted_at));
    return delay(clone(rows));
  },

  async grade(input: {
    instructorId: ID;
    submissionId: ID;
    grade: number;
    comment: string;
    decision: "validated" | "returned";
  }): Promise<Submission> {
    const submission = store.submissions.find((s) => s.id === input.submissionId);
    if (!submission) return fail("Soumission introuvable.");
    if (input.grade < 0 || input.grade > 100) return fail("La note doit être comprise entre 0 et 100.");
    submission.grade = input.grade;
    submission.feedback = input.comment;
    submission.graded_at = nowIso();
    submission.status = input.decision === "validated" ? "graded" : "returned";
    recomputeProgress(submission.student_id, submission.training_id);
    return delay(clone(submission));
  },

  async gradeBulk(input: {
    instructorId: ID;
    submissionIds: ID[];
    grade: number;
    comment: string;
    decision: "validated" | "returned";
  }): Promise<{ updated: number }> {
    for (const id of input.submissionIds) {
      const submission = store.submissions.find((s) => s.id === id);
      if (!submission) continue;
      submission.grade = input.grade;
      submission.feedback = input.comment;
      submission.graded_at = nowIso();
      submission.status = input.decision === "validated" ? "graded" : "returned";
      recomputeProgress(submission.student_id, submission.training_id);
    }
    return delay({ updated: input.submissionIds.length });
  },
};

/* --------------------------------- sessions ------------------------------- */

export interface SessionRow extends TrainingSession {
  training_title: string;
}

export const sessionsApi = {
  async list(instructorId: ID): Promise<SessionRow[]> {
    const mine = assignedTrainings(instructorId);
    const ids = mine.map((t) => t.id);
    return delay(
      clone(
        store.sessions
          .filter((s) => ids.includes(s.training_id))
          .map((s) => ({ ...s, training_title: mine.find((t) => t.id === s.training_id)!.title }))
          .sort((a, b) => +new Date(a.starts_at) - +new Date(b.starts_at)),
      ),
    );
  },

  async create(input: Omit<TrainingSession, "id" | "attendance">): Promise<TrainingSession> {
    const session: TrainingSession = { ...input, id: uid("ses"), attendance: [] };
    store.sessions.push(session);
    return delay(clone(session));
  },

  async setAttendance(sessionId: ID, studentId: ID, present: boolean): Promise<TrainingSession> {
    const session = store.sessions.find((s) => s.id === sessionId);
    if (!session) return fail("Session introuvable.");
    const record = session.attendance.find((a) => a.student_id === studentId);
    if (record) record.present = present;
    else session.attendance.push({ student_id: studentId, present });
    const enrollment = store.enrollments.find(
      (e) => e.student_id === studentId && e.training_id === session.training_id,
    );
    if (enrollment) {
      const trainingSessions = store.sessions.filter((s) => s.training_id === session.training_id);
      const marks = trainingSessions.flatMap((s) => s.attendance.filter((a) => a.student_id === studentId));
      enrollment.attendance_rate = marks.length
        ? Math.round((marks.filter((m) => m.present).length / marks.length) * 100)
        : enrollment.attendance_rate;
    }
    return delay(clone(session));
  },

  async roster(trainingId: ID): Promise<Student[]> {
    const ids = store.enrollments.filter((e) => e.training_id === trainingId).map((e) => e.student_id);
    return delay(clone(store.students.filter((s) => ids.includes(s.id))));
  },
};

/* -------------------------------- community ------------------------------- */

export const communityApi = {
  async posts(instructorId: ID, trainingId?: ID): Promise<CommunityPost[]> {
    const ids = assignedTrainings(instructorId).map((t) => t.id);
    return delay(
      clone(
        store.posts
          .filter((p) => p.training_id === null || ids.includes(p.training_id))
          .filter((p) => (trainingId ? p.training_id === trainingId : true))
          .sort((a, b) => Number(b.pinned) - Number(a.pinned) || +new Date(b.created_at) - +new Date(a.created_at)),
      ),
    );
  },

  async publish(input: { instructorId: ID; trainingId: ID; body: string; pinned: boolean }): Promise<CommunityPost> {
    const instructor = store.instructors.find((i) => i.id === input.instructorId);
    if (!instructor) return fail("Session expirée.");
    if (!input.body.trim()) return fail("Le message ne peut pas être vide.");
    const post: CommunityPost = {
      id: uid("pst"),
      training_id: input.trainingId,
      author_id: instructor.id,
      author_name: instructor.full_name,
      author_role: "instructor",
      body: input.body,
      pinned: input.pinned,
      created_at: nowIso(),
      replies_count: 0,
    };
    store.posts.unshift(post);
    return delay(clone(post));
  },

  async togglePin(postId: ID): Promise<CommunityPost> {
    const post = store.posts.find((p) => p.id === postId);
    if (!post) return fail("Publication introuvable.");
    post.pinned = !post.pinned;
    return delay(clone(post));
  },

  async threads(instructorId: ID): Promise<(MessageThread & { student: Student })[]> {
    const ids = assignedTrainings(instructorId).map((t) => t.id);
    return delay(
      clone(
        store.threads
          .filter((t) => ids.includes(t.training_id))
          .map((t) => ({ ...t, student: store.students.find((s) => s.id === t.student_id)! }))
          .sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at)),
      ),
    );
  },

  async reply(threadId: ID, body: string): Promise<MessageThread> {
    const thread = store.threads.find((t) => t.id === threadId);
    if (!thread) return fail("Conversation introuvable.");
    if (!body.trim()) return fail("Le message ne peut pas être vide.");
    thread.messages.push({ id: uid("msg"), author: "instructor", body, sent_at: nowIso() });
    thread.updated_at = nowIso();
    thread.unread = false;
    return delay(clone(thread));
  },

  async notifications(): Promise<AppNotification[]> {
    return delay(clone(store.notifications));
  },

  async markNotificationRead(id: ID): Promise<{ ok: true }> {
    const notification = store.notifications.find((n) => n.id === id);
    if (notification) notification.read = true;
    return delay({ ok: true } as const);
  },
};

/* --------------------------------- profile -------------------------------- */

export const profileApi = {
  async update(
    instructorId: ID,
    patch: Partial<Pick<Instructor, "full_name" | "title" | "bio" | "specialties" | "phone" | "avatar_url">>,
  ): Promise<Instructor> {
    const instructor = store.instructors.find((i) => i.id === instructorId);
    if (!instructor) return fail("Profil introuvable.");
    Object.assign(instructor, patch);
    return delay(clone(instructor));
  },

  async updateAvailability(instructorId: ID, availability: Availability[]): Promise<Instructor> {
    const instructor = store.instructors.find((i) => i.id === instructorId);
    if (!instructor) return fail("Profil introuvable.");
    instructor.availability = clone(availability);
    return delay(clone(instructor));
  },

  async updateNotifications(instructorId: ID, prefs: NotificationPrefs): Promise<Instructor> {
    const instructor = store.instructors.find((i) => i.id === instructorId);
    if (!instructor) return fail("Profil introuvable.");
    instructor.notification_prefs = { ...prefs };
    return delay(clone(instructor));
  },
};

/* --------------------------------- search --------------------------------- */

export interface SearchHit {
  id: string;
  label: string;
  group: "Formations" | "Apprenants" | "Leçons" | "Corrections";
  to: string;
  params?: Record<string, string>;
}

export const searchApi = {
  async global(instructorId: ID, term: string): Promise<SearchHit[]> {
    const q = term.trim().toLowerCase();
    const mine = assignedTrainings(instructorId);
    const ids = mine.map((t) => t.id);
    const hits: SearchHit[] = [
      ...mine.map<SearchHit>((t) => ({
        id: t.id,
        label: t.title,
        group: "Formations",
        to: "/formations/$trainingId",
        params: { trainingId: t.id },
      })),
      ...store.enrollments
        .filter((e) => ids.includes(e.training_id))
        .map((e) => store.students.find((s) => s.id === e.student_id)!)
        .map<SearchHit>((s) => ({
          id: s.id,
          label: s.full_name,
          group: "Apprenants",
          to: "/apprenants/$studentId",
          params: { studentId: s.id },
        })),
      ...store.lessons
        .filter((l) => ids.includes(l.training_id))
        .map<SearchHit>((l) => ({
          id: l.id,
          label: l.title,
          group: "Leçons",
          to: "/formations/$trainingId/contenu",
          params: { trainingId: l.training_id },
        })),
    ];
    const unique = hits.filter((h, i, arr) => arr.findIndex((x) => x.id === h.id && x.group === h.group) === i);
    return delay(q ? unique.filter((h) => h.label.toLowerCase().includes(q)).slice(0, 12) : unique.slice(0, 8), 120);
  },
};
