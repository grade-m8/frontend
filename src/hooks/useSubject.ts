import type { User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import type { Subject } from "@/types/subject.ts";
import { listEnrolled, listOwned } from "@/services/subjectService.ts";
import { useNavigate } from "react-router-dom";
import type { Role } from "@/types/role.ts";

export function useSubject(user: User | null, role: Role | undefined) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const loadSubjects = useCallback(async () => {
    if (!user || !role) {
      return;
    }
    try {
      let subjectList: Subject[] = [];
      if (role === "Student") {
        subjectList = await listEnrolled(user);
      } else if (role === "Professor" || role === "Admin") {
        subjectList = await listOwned(user);
      }
      setSubjects(subjectList ?? []);
    } catch (error) {
      console.error("Failed to load subjects:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, role]);

  useEffect(() => {
    if (!user || !role) {
      navigate("/403");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSubjects();
  }, [user, role, navigate, loadSubjects]);

  const reloadSubjects = useCallback(async () => {
    setIsLoading(true);
    await loadSubjects();
  }, [loadSubjects]);

  return { subjects, isLoading, reloadSubjects };
}
