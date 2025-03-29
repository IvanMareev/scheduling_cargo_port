import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import PortSchedulePage from "./pages/MainPages/MainPages.jsx";
import SchedulePages from "./pages/SchedulePages/SchedulePages.jsx";

function App() {
    return (<>
            <Router>
                <Routes>
                    <Route path="/" element={<PortSchedulePage/>}/>
                    <Route path="/schedule" element={<SchedulePages/>}/>
                </Routes>
            </Router>
        </>

    );
}

export default App;
