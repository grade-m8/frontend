import {BrowserRouter, Route, Routes} from "react-router-dom";
import ExampleHomepage from "./pages/ExampleHomepage.tsx";
import AlternativePage from "./pages/AlternativePage.tsx";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ExampleHomepage/>}/>
          <Route path="/alternative" element={<AlternativePage/>}/>
        </Routes>
      </BrowserRouter>
  )
}

export default App
