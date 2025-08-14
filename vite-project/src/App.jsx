import { LoginRegister } from "./pages/LoginRegister.jsx";
import { Mine } from "./pages/Mine.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<LoginRegister />} />
                <Route path="/Mine" element={<Mine />} />
            </Routes>
        </Router>
    );
}

export default App;