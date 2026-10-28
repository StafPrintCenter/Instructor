

import * as db from "./mock-data";
import { clone, delay, fail, nowIso, uid } from "./utils";
import type {
  AppNotification,
  CommunityPost,
  ID,
  Instructor,
  MessageThread,
  NotificationPrefs,
  Student,
  Training,
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

/** Règle métier : un instructeur ne voit que ses formations assignées. */
function assignedTrainings(instructorId: ID): Training[] {
  return store.trainings.filter((t) => t.instructor_ids.includes(instructorId));
}

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
