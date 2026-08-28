import {BrowserRouter, Route, Routes} from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import ExampleHomepage from "@/pages/ExampleHomepage.tsx";
import { Toaster } from "@/components/ui/toast";

function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/test" element={<ExampleHomepage/>}/>
        </Routes>
          <Toaster/>
      </BrowserRouter>
  )
}

export default App
