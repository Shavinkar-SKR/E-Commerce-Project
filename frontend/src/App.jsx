import "./App.css";
import Home from "./components/Home";
import Footer from "./components/layouts/Footer";
import Header from "./components/layouts/Header";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <Router>
      <div className="App">
        <HelmetProvider>
          {/*Wrapped the components to dynamically change the title for different pages surfed*/}
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          <Footer />
        </HelmetProvider>
      </div>
    </Router>
  );
}

export default App;
