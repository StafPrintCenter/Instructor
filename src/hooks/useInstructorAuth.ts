import { useEffect, useState, useCallback } from "react";
import { loginInstructor, fetchInstructorMe, logoutInstructor, verifyInstructorInvite, acceptInstructorInvite, registerInstructor, InstructorAuthApiError } from "@/stores/useAuthStore";
import type { APIInstructorUser, InstructorInviteVerifyResponse, InstructorTrainingAssignment, InstructorRegisterPayload } from "@/data/auth";

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

function toInstructorAuthUser(instructor: APIInstructorUser): InstructorAuthUser {
  return {
    id: instructor.id,
    firstName: instructor.firstName,
    lastName: instructor.lastName,
    name: instructor.name || `${instructor.firstName} ${instructor.lastName}`.trim(),
    email: instructor.email,
    registrationSource: instructor.registrationSource,
    photo: instructor.photo,
    bio: instructor.bio,
    isActive: instructor.isActive,
    isBlocked: instructor.isBlocked,
    isPending: instructor.isPending,
    needsApproval: instructor.needsApproval,
    blockedAt: instructor.blockedAt,
    blockedReason: instructor.blockedReason,
    invitedBy: instructor.invitedBy,
    invitedAt: instructor.invitedAt,
    acceptedAt: instructor.acceptedAt,
    approvedBy: instructor.approvedBy,
    approvedAt: instructor.approvedAt,
    trainings: instructor.trainings,
    createdAt: instructor.createdAt,
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
    login,
    logout,
    verifyInvite,
    acceptInvite,
  };
}
