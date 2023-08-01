import "./App.css";
import Header from "./components/Header";
import AllPolls from "./pages/AllPolls";
import Home from "./pages/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Poll from "./pages/Poll";
import PollResult from "./pages/PollResult";
import PollEdit from "./pages/PollEdit";

function App() {
  return (
    <>
      <div className="main_container">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/allpolls" element={<AllPolls />} />
            <Route path="/poll/:id" element={<Poll />} />
            <Route path="/poll-result/:id" element={<PollResult />} />
            <Route path="/poll-edit/:id" element={<PollEdit />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
