import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import PortSchedulePage from "./pages/MainPages/MainPages.jsx";
import SchedulePages from "./pages/SchedulePages/SchedulePages.jsx";
import { Box, Button } from "@mui/material";
import React from "react";

function NavigationButtons() {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
            <Button variant="contained">Редактирование списка кораблей</Button>
            <Button variant="contained">Редактирование списка портов</Button>
            <Button variant="contained">Редактирование списка терминалов</Button>
            <Button variant="contained" onClick={() => navigate('/schedule')}>Проектирование расписания</Button>
        </Box>
    );
}

function App() {
    return (
        <Router>
            <NavigationButtons />
            <Routes>
                <Route path="/" element={<PortSchedulePage />} />
                <Route path="/schedule" element={<SchedulePages />} />
            </Routes>
        </Router>
    );
}

export default App;
