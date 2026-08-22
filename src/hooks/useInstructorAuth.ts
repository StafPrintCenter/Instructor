import { useEffect, useState, useCallback } from "react";
import { loginInstructor, fetchInstructorMe, logoutInstructor, verifyInstructorInvite, acceptInstructorInvite, registerInstructor, InstructorAuthApiError } from "@/stores/useAuthStore";
import type { APIInstructorCategory, InstructorInviteVerifyResponse, InstructorTrainingAssignment, InstructorRegisterPayload } from "@/data/auth";

export interface InstructorAuthUser {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  registrationSource: string | null;
  photo: string | null;
  bio: string | null;
  isActive: boolean;
  isBlocked: boolean;
  isPending: boolean;
  needsApproval: boolean;
  categories?: APIInstructorCategory[];
  blockedAt: string | null;
  blockedReason: string | null;
  invitedBy: string | null;
  invitedAt: string | null;
  acceptedAt: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  trainings?: InstructorTrainingAssignment[];
  createdAt: string;
}

function toInstructorAuthUser(rawInstructor: any): InstructorAuthUser {
  const instructor = rawInstructor?.data ?? rawInstructor?.instructor ?? rawInstructor ?? {};
  const firstName = instructor.firstName ?? instructor.first_name ?? "";
  const lastName = instructor.lastName ?? instructor.last_name ?? "";
  const fullName = instructor.name ?? instructor.fullname ?? (`${firstName} ${lastName}`.trim() || "Formateur");

  return {
    id: instructor.id ?? "",
    firstName: firstName,
    lastName: lastName,
    name: fullName,
    email: instructor.email ?? "",
    registrationSource: instructor.registrationSource ?? instructor.registration_source ?? null,
    photo: instructor.photo ?? null,
    bio: instructor.bio ?? null,
    isActive: instructor.isActive ?? instructor.is_active ?? true,
    isBlocked: instructor.isBlocked ?? instructor.is_blocked ?? false,
    isPending: instructor.isPending ?? instructor.is_pending ?? false,
    needsApproval: instructor.needsApproval ?? instructor.needs_approval ?? false,
    blockedAt: instructor.blockedAt ?? instructor.blocked_at ?? null,
    blockedReason: instructor.blockedReason ?? instructor.blocked_reason ?? null,
    invitedBy: instructor.invitedBy ?? instructor.invited_by ?? null,
    invitedAt: instructor.invitedAt ?? instructor.invited_at ?? null,
    acceptedAt: instructor.acceptedAt ?? instructor.accepted_at ?? null,
    approvedBy: instructor.approvedBy ?? instructor.approved_by ?? null,
    approvedAt: instructor.approvedAt ?? instructor.approved_at ?? null,
    trainings: instructor.trainings,
    createdAt: instructor.createdAt ?? instructor.created_at ?? "",
  };
}

// État partagé en dehors du hook
let sharedUser: InstructorAuthUser | null = null;
let sharedReady = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

async function bootstrap() {
  try {
    const instructor = await fetchInstructorMe();
    sharedUser = instructor ? toInstructorAuthUser(instructor) : null;
  } catch {
    sharedUser = null;
  } finally {
    sharedReady = true;
    notify();
  }
}

let bootstrapped = false;

export function useInstructorAuth() {
  const [, forceRender] = useState(0);

  useEffect(() => {
    const listener = () => forceRender((n) => n + 1);
    listeners.add(listener);

    if (!bootstrapped) {
      bootstrapped = true;
      bootstrap();
    }

    return () => {
      listeners.delete(listener);
    };
  }, []);

  const register = useCallback(
    async (payload: InstructorRegisterPayload): Promise<InstructorAuthUser> => {
      const instructor = await registerInstructor(payload);

      return toInstructorAuthUser(instructor);
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
    await loginInstructor(email, password);
    const instructor = await fetchInstructorMe();
    if (!instructor) {
      throw new InstructorAuthApiError("La session n'a pas pu être établie.");
    }
    sharedUser = toInstructorAuthUser(instructor);
    sharedReady = true;
    notify();
  }, []);

  const logout = useCallback(async () => {
    await logoutInstructor();
    sharedUser = null;
    notify();
  }, []);

  const verifyInvite = useCallback(
    async (params: {
      instructor: string;
      expires: string;
      signature: string;
    }): Promise<InstructorInviteVerifyResponse> => {
      return verifyInstructorInvite(params);
    },
    []
  );

  const acceptInvite = useCallback(
    async (params: {
      instructor: string;
      expires: string;
      signature: string;
      password: string;
    }): Promise<{ message: string }> => {
      return acceptInstructorInvite(params);
    },
    []
  );

  return {
    user: sharedUser,
    isAuthenticated: !!sharedUser,
    ready: sharedReady,
    register,
    login,
    logout,
    verifyInvite,
    acceptInvite,
  };
}
