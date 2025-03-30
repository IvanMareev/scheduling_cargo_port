import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import PortSchedulePage from "./pages/EteringParametersPages/ShipPages.jsx";
import SchedulePages from "./pages/SchedulePages/SchedulePages.jsx";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import ShipPages from "./pages/EteringParametersPages/ShipPages.jsx";
import TerminalInputPage from "./pages/EteringParametersPages/TerminalInputPage.jsx";
import PortEditPage from "./pages/EteringParametersPages/PortEditPage.jsx";

function NavigationButtons() {
    const navigate = useNavigate();
    const location = useLocation();

    const buttons = [
        { path: "/ship", label: "Редактирование списка кораблей" },
        { path: "/port", label: "Редактирование списка портов" },
        { path: "/terminals", label: "Редактирование списка терминалов" },
        { path: "/schedule", label: "Проектирование расписания" }
    ];

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
            {buttons.map(({ path, label }) => (
                <Button
                    key={path}
                    variant="contained"
                    onClick={() => navigate(path)}
                    sx={{
                        backgroundColor: '#2C2C2C',
                        '&:hover': { backgroundColor: '#1E1E1E' },
                        opacity: location.pathname === path ? 0.5 : 1,
                    }}
                >
                    {label}
                </Button>
            ))}
        </Box>
    );
}

function App() {
    return (
        <Router>
            <Typography variant="h4" component="h1" gutterBottom textAlign={'center'}>
                <br/>
                Создание расписания порта
            </Typography>
            <NavigationButtons />
            <Routes>
                <Route path="/terminals" element={<TerminalInputPage />} />
                <Route path="/ship" element={<ShipPages />} />
                <Route path="/schedule" element={<SchedulePages />} />
                <Route path="/port" element={<PortEditPage />} />
            </Routes>
        </Router>
    );
}

export default App;
