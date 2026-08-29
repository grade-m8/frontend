import { toast as toastManager } from "@/components/ui/toast";

export const toast = Object.assign(
  (title?: string, timeout?: number) => toastManager.add({ title, timeout }),
  {
    success: (title?: string, timeout?: number) =>
      toastManager.add({
        title: title ? title : "Operación exitosa",
        timeout: timeout ? timeout : 5000,
        type: "success",
      }),
    error: (title?: string, timeout?: number) =>
      toastManager.add({
        title: title ? title : "Ocurrió un error",
        timeout: timeout ? timeout : 5000,
        type: "error",
      }),
  },
);
