import type { User } from "firebase/auth";
import { useEffect, useState } from "react";
import type { Subject } from "@/types/subject.ts";
import { listOwned } from "@/services/subjectService.ts";
import { useNavigate } from "react-router-dom";

export function useSubject(user: User | null) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSubjects = async () => {
      if (!user) {
        navigate("/403");
        return;
      }
      try {
        const subjectList: Subject[] = await listOwned(user);
        console.log("subject list: " + subjectList);
        setSubjects(subjectList);
      } catch {
        navigate("/403");
      } finally {
        setIsLoading(false);
      }
    };

    loadSubjects();
  }, [user, navigate]);

  return { subjects, isLoading };
}
