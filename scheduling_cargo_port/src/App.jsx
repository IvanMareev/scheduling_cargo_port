import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import PortSchedulePage from "./pages/EteringParametersPages/ShipPages.jsx";
import SchedulePages from "./pages/SchedulePages/SchedulePages.jsx";
import {Box, Button, Typography} from "@mui/material";
import React from "react";
import ShipPages from "./pages/EteringParametersPages/ShipPages.jsx";
import TerminalInputPage from "./pages/EteringParametersPages/TerminalInputPage.jsx";

function NavigationButtons() {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
            <Button variant="contained" onClick={() => navigate('/ship')}>Редактирование списка кораблей</Button>
            <Button variant="contained" onClick={() => navigate('/port')}>Редактирование списка портов</Button>
            <Button variant="contained" onClick={() => navigate('/terminals')}>Редактирование списка терминалов</Button>
            <Button variant="contained" onClick={() => navigate('/schedule')}>Проектирование расписания</Button>
        </Box>
    );
}

function App() {
    return (
        <Router>
            <Typography variant="h4" component="h1" gutterBottom>
                Создание расписания порта
            </Typography>
            <NavigationButtons />
            <Routes>
                <Route path="/port" element={<TerminalInputPage />} />
                <Route path="/ship" element={<ShipPages />} />
                <Route path="/schedule" element={<SchedulePages />} />

            </Routes>
        </Router>
    );
}

export default App;
