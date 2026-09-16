import type { User } from "firebase/auth";
import { useEffect, useState } from "react";
import type { Subject } from "@/types/subject.ts";
import { listOwned } from "@/services/subjectService.ts";
import { useNavigate } from "react-router-dom";
import type { Role } from "@/types/role.ts";
import { toast } from "@/components/handler/toastHandler.tsx";

export function useSubject(user: User | null, role: Role | undefined) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !role) return;

    if (role == "Student") {
      navigate("/403");
      return;
    }

    const loadSubjects = async () => {
      try {
        setIsLoading(true);
        const subjectList: Subject[] = await listOwned(user);
        setSubjects(subjectList);
      } catch {
        toast.error("No se pudieron cargar las materias");
      } finally {
        setIsLoading(false);
      }
    };

    loadSubjects();
  }, [user, navigate, role]);

  return { subjects, isLoading };
}
