import {BrowserRouter, Route, Routes} from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import {auth} from "@/services/firebase.ts"; //este es un import para que al correr npm run dev, se ejecute @/services/firebase.ts

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
        </Routes>
      </BrowserRouter>
  )
}

export default App
