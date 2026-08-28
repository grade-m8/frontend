import { toast as toastManager } from "@/components/ui/toast"

export const toast = Object.assign(
    (title: string, description?: string) =>
        toastManager.add({ title, description }),
    {
        success: (title: string, description?: string) =>
            toastManager.add({ title, description, type: "success" }),
        error: (title: string, description?: string) =>
            toastManager.add({ title, description, type: "error" }),
        promise: (...args: Parameters<typeof toastManager.promise>) =>
            toastManager.promise(...args),
        close: (id?: string) => toastManager.close(id),
    }
)