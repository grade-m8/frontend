import { Toaster } from "@/components/ui/toast.tsx";
import { AuthProvider } from "@/context/AuthProvider.tsx";
import AppRouter from "@/routes/AppRouter.tsx";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
