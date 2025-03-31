import React, {useState, useEffect} from "react";
import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
    List,
    ListItem,
    ListItemText, MenuItem, Select
} from "@mui/material";
import {jsPDF} from "jspdf";  // Импортируем jsPDF
import dayjs from "dayjs";

const SchedulePages = () => {
    const [ships, setShips] = useState([]);
    const [terminals, setTerminals] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [errors, setErrors] = useState([]);
    const [selectedPort, setSelectedPort] = useState(''); // Храним выбранный порт
    const [ports, setPorts] = useState(JSON.parse(localStorage.getItem('ports')) || []);
    const [newShipName, setNewShipName] = useState("");
    const [newShipDate, setNewShipDate] = useState(null);
    const [newShipArrivalPort, setNewShipArrivalPort] = useState("");
    const [newShipServiceTime, setNewShipServiceTime] = useState("");
    const [newShipType, setNewShipType] = useState("");

    useEffect(() => {
        const storedShips = JSON.parse(localStorage.getItem("ships")) || [];
        const storedTerminals = JSON.parse(localStorage.getItem("terminals")) || [];
        setShips(storedShips);
        setTerminals(storedTerminals);
    }, []);

    // Function to check if a ship's time overlaps with another
    const isOverlapping = (ship1, ship2) => {
        const ship1Start = dayjs(ship1.date);
        const ship1End = dayjs(ship1.date).add(parseInt(ship1.serviceTime), "minutes");

        const ship2Start = dayjs(ship2.date);
        const ship2End = dayjs(ship2.date).add(parseInt(ship2.serviceTime), "minutes");

        return !(ship1End.isBefore(ship2Start) || ship1Start.isAfter(ship2End));
    };

    // Function to shift the ship's arrival time by 1 hour if there's a conflict
    const shiftArrivalTime = (ship) => {
        let newShipDate = dayjs(ship.date).add(1, "hour").format("DD.MM.YYYY HH:mm");
        ship.date = newShipDate;  // Обновляем дату корабля
        return ship;
    };

// Function to calculate and display the schedule
    const generateSchedule = () => {
        let updatedSchedule = [];
        let newErrors = [];
        let terminalAssignments = new Map();

        // Фильтруем корабли и терминалы по выбранному порту
        const filteredShips = selectedPort ? ships.filter((ship) => ship.arrivalPort === selectedPort) : ships;
        const filteredTerminals = terminals ? terminals.filter((terminal) => terminal.port === selectedPort) : terminals;

        filteredShips.forEach((ship) => {
            // Фильтруем терминалы, учитывая, что если терминал универсальный, то он подходит для всех типов кораблей
            let availableTerminal = filteredTerminals.find((terminal) => {
                // Проверяем, что терминал подходит по типу или он универсальный
                const isTerminalCompatible = terminal.type === "универсальный" || terminal.type === ship.type;
                // Проверяем, что терминал свободен
                const isTerminalFree = !terminalAssignments.has(terminal.name) ||
                    !terminalAssignments.get(terminal.name).some((scheduledShip) => isOverlapping(scheduledShip, ship));
                return isTerminalCompatible && isTerminalFree;
            });

            let shiftAttempts = 0; // Счётчик попыток сдвига

            // Если терминал не найден, начинаем сдвигать время
            while (!availableTerminal && shiftAttempts < 24) { // Ограничим сдвиги до 24 часов (или другого числа)
                ship = shiftArrivalTime(ship); // Сдвиг времени
                availableTerminal = filteredTerminals.find((terminal) => {
                    const isTerminalCompatible = terminal.type === "универсальный" || terminal.type === ship.type;
                    const isTerminalFree = !terminalAssignments.has(terminal.name) ||
                        !terminalAssignments.get(terminal.name).some((scheduledShip) => isOverlapping(scheduledShip, ship));
                    return isTerminalCompatible && isTerminalFree;
                });
                shiftAttempts++; // Увеличиваем количество попыток сдвига
            }

            if (availableTerminal) {
                // Если терминал найден, назначаем его
                terminalAssignments.set(availableTerminal.name, [
                    ...(terminalAssignments.get(availableTerminal.name) || []),
                    ship
                ]);
                ship.terminal = availableTerminal.name;
                newErrors.push(`Conflict: ${ship.name} at terminal unavailable. Arrival time shifted to ${ship.date}.`);
            } else {
                // Если не нашли терминал даже после 24 часов сдвига
                newErrors.push(`No terminal available for ${ship.name} even after shifting time.`);
            }

            // Рассчитываем время завершения обслуживания
            const serviceEndTime = dayjs(ship.date).add(parseInt(ship.serviceTime), "minutes").format("DD.MM.YYYY HH:mm");
            updatedSchedule.push({
                ...ship,
                serviceEndTime
            });
        });

        setSchedule(updatedSchedule);
        setErrors(newErrors);
    };


    // Group ships by the day of the week
    const groupByDayOfWeek = () => {
        return schedule.reduce((acc, ship) => {
            const dayOfWeek = dayjs(ship.date).format("dddd"); // Get day of the week
            if (!acc[dayOfWeek]) {
                acc[dayOfWeek] = [];
            }
            acc[dayOfWeek].push(ship);
            return acc;
        }, {});
    };

    const groupedSchedule = groupByDayOfWeek();

    // Function to generate PDF from the schedule
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Ship Schedule", 14, 16);

        let y = 24;

        // Create a table with headers
        const headers = ["Ship Name", "Type", "Arrival Port", "Terminal", "Date and Time", "Service Time (min)", "Service End Time"];
        const headerHeight = 10;
        const rowHeight = 8;
        const columnWidths = [40, 30, 40, 40, 50, 30, 40];

        // Draw table headers
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        headers.forEach((header, i) => {
            doc.rect(14 + i * columnWidths[i], y, columnWidths[i], headerHeight);  // Draw header cells
            doc.text(header, 14 + i * columnWidths[i] + 2, y + 6);  // Add header text
        });
        y += headerHeight;

        // Reset font for content rows
        doc.setFont("helvetica", "normal");

        Object.keys(groupedSchedule).forEach((day) => {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(day, 14, y);
            y += 8;

            groupedSchedule[day].forEach((ship) => {
                // Draw each row with ship details
                const rowData = [
                    ship.name,
                    ship.type,
                    ship.arrivalPort,
                    ship.terminal,
                    ship.date,
                    ship.serviceTime,
                    ship.serviceEndTime
                ];

                rowData.forEach((data, i) => {
                    doc.rect(14 + i * columnWidths[i], y, columnWidths[i], rowHeight);  // Draw cells
                    doc.text(data, 14 + i * columnWidths[i] + 2, y + 5);  // Add text to cells
                });
                y += rowHeight;
            });

            y += 6; // Add space between days
        });

        // Save PDF
        doc.save("schedule.pdf");
    };


    return (
        <Box sx={{width: 1280, margin: "0 auto", padding: 3, textAlign: "center"}}>
            <Divider sx={{my: 3}}/>
            <Typography variant="h6" component="h3" gutterBottom>
                Редактирование расписания
            </Typography>
            <Select
                value={selectedPort}
                onChange={(e) => setSelectedPort(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                sx={{mb: 2}}
            >
                <MenuItem value="">
                    <em>Выберите порт</em>
                </MenuItem>
                {ports.map((port) => (
                    <MenuItem key={port.id} value={port.name}>{port.name}</MenuItem>
                ))}
            </Select>

            <Button variant="contained" size="large" fullWidth onClick={generateSchedule}
                    sx={{backgroundColor: '#2C2C2C', '&:hover': {backgroundColor: '#1E1E1E'}}}>
                Сгенерировать расписание
            </Button>

            <Typography variant="h6" component="h3" gutterBottom>
                Составленное расписание
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>День</TableCell>
                            <TableCell>Название корабля</TableCell>
                            <TableCell>Тип</TableCell>
                            <TableCell>Порт</TableCell>
                            <TableCell>Терминал</TableCell>
                            <TableCell>Дата и время</TableCell>
                            <TableCell>Время обслуживания</TableCell>
                            <TableCell>Завершение обслуживания</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(groupedSchedule).map((day) => (
                            <React.Fragment key={day}>
                                <TableRow>
                                    <TableCell colSpan={8} sx={{fontWeight: "bold"}}>
                                        {day}
                                    </TableCell>
                                </TableRow>
                                {groupedSchedule[day].map((ship) => (
                                    <TableRow key={ship.id}>
                                        <TableCell>{day}</TableCell>
                                        <TableCell>{ship.name}</TableCell>
                                        <TableCell>{ship.type}</TableCell>
                                        <TableCell>{ship.arrivalPort}</TableCell>
                                        <TableCell>{ship.terminal || "Нет терминала"}</TableCell>
                                        <TableCell>{ship.date}</TableCell>
                                        <TableCell>{ship.serviceTime} мин</TableCell>
                                        <TableCell>{ship.serviceEndTime}</TableCell>
                                    </TableRow>
                                ))}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Divider sx={{my: 3}}/>

            {errors.length > 0 && (
                <Paper elevation={3} sx={{padding: 2}}>
                    <Typography variant="subtitle1" color="error" gutterBottom>
                        Ошибки:
                    </Typography>
                    <List>
                        {errors.map((error, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={error}/>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}

            <Button variant="contained" onClick={generatePDF} sx={{mt: 3}}>
                Сохранить расписание в PDF
            </Button>
        </Box>
    );
};

export default SchedulePages;
