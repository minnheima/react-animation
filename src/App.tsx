import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
import Header from "./Components/Header";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/movies/:category/:id" element={<Home />}></Route>
        </Route>
        <Route path="/tv" element={<Tv />}>
          <Route path=":category/:id" element={<Tv />}></Route>
        </Route>
        <Route path="/search/" element={<Search />}>
          <Route path=":id" element={<Search />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
