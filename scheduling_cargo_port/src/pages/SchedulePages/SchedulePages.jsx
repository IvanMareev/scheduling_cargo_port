import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Select,
  MenuItem,
  Paper,
  Grid, TextField
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";

const SchedulePages = () => {
  const [ships, setShips] = useState([]);
  const [terminals, setTerminals] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [errors, setErrors] = useState([]);

  const [newShipName, setNewShipName] = useState("");
  const [newShipDate, setNewShipDate] = useState(null);
  const [newShipArrivalPort, setNewShipArrivalPort] = useState("");
  const [newShipServiceTime, setNewShipServiceTime] = useState("");
  const [newShipType, setNewShipType] = useState("");

  // Fetch ships and terminals from localStorage on initial render
  useEffect(() => {
    const storedShips = JSON.parse(localStorage.getItem("ships")) || [];
    const storedTerminals = JSON.parse(localStorage.getItem("terminals")) || [];
    setShips(storedShips);
    setTerminals(storedTerminals);
  }, []);

  // Function to handle adding a new ship to the schedule
  const handleAddShip = () => {
    if (newShipName.trim() && newShipDate && newShipServiceTime) {
      const newShip = {
        id: Date.now(),
        name: newShipName,
        date: newShipDate.format("DD.MM.YYYY HH:mm"),
        type: newShipType,
        arrivalPort: newShipArrivalPort,
        serviceTime: newShipServiceTime
      };

      // Check if there is a terminal available based on the type of ship
      const availableTerminals = terminals.filter(
          (terminal) => terminal.type === newShipType || terminal.type === "универсальный"
      );

      if (availableTerminals.length > 0) {
        // Assign terminal to the ship
        const assignedTerminal = availableTerminals[0];
        newShip.terminal = assignedTerminal.name;

        setShips([...ships, newShip]);

        // Add new ship to localStorage
        localStorage.setItem("ships", JSON.stringify([...ships, newShip]));
      } else {
        setErrors([...errors, `No available terminal for ship type: ${newShipType}`]);
      }

      // Reset form fields
      setNewShipName("");
      setNewShipArrivalPort("");
      setNewShipServiceTime("");
      setNewShipType("");
      setNewShipDate(null);
    }
  };

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
    ship.date = newShipDate;
    return ship;
  };

  // Function to calculate and display the schedule
  const generateSchedule = () => {
    let updatedSchedule = [];
    let newErrors = [];

    ships.forEach((ship) => {
      // Check for conflicts in the terminal schedule
      const terminalShips = updatedSchedule.filter((scheduledShip) => scheduledShip.terminal === ship.terminal);

      const conflict = terminalShips.some((scheduledShip) => isOverlapping(scheduledShip, ship));

      if (conflict) {
        // Conflict detected, attempt to shift the ship's arrival time by 1 hour
        ship = shiftArrivalTime(ship);
        newErrors.push(`Conflict: ${ship.name} at terminal ${ship.terminal} overlaps with another ship. Arrival time shifted to ${ship.date}.`);
      }

      // Format the service end time based on service time
      const serviceEndTime = dayjs(ship.date).add(parseInt(ship.serviceTime), "minutes").format("DD.MM.YYYY HH:mm");
      updatedSchedule.push({
        ...ship,
        serviceEndTime
      });
    });

    setSchedule(updatedSchedule);
    setErrors(newErrors);
  };

  return (
      <Box sx={{ width: 1280, margin: "0 auto", padding: 3, textAlign: "center" }}>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" component="h3" gutterBottom>
          Редактирование расписания
        </Typography>
        <Grid container spacing={5} alignItems="flex-start">
          <Grid item xs={2}>
            <Paper
                elevation={3}
                sx={{
                  padding: 2,
                  mb: 5,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", mb: 6 }}>
                <TextField
                    label="Название корабля"
                    value={newShipName}
                    onChange={(e) => setNewShipName(e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                      label="Дата и время"
                      value={newShipDate}
                      onChange={(date) => setNewShipDate(date)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
                <TextField
                    label="Порт прибытия"
                    value={newShipArrivalPort}
                    onChange={(e) => setNewShipArrivalPort(e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                />
                <TextField
                    label="Время обслуживания (мин)"
                    value={newShipServiceTime}
                    onChange={(e) => setNewShipServiceTime(e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                />
                <Select
                    label="Тип корабля"
                    value={newShipType}
                    onChange={(e) => setNewShipType(e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                >
                  <MenuItem value="Пассажирский">Пассажирский</MenuItem>
                  <MenuItem value="Грузовой">Грузовой</MenuItem>
                </Select>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddShip}
                    fullWidth
                >
                  Добавить корабль
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />
            </Paper>
          </Grid>

          <Grid item xs={2}>
            <Paper elevation={3} sx={{ padding: 2, mb: 3, height: "100%" }}>
              <Typography variant="subtitle1" gutterBottom>
                Добавленные корабли
              </Typography>
              <List>
                {ships.map((ship) => (
                    <ListItem key={ship.id}>
                      <ListItemText
                          primary={`${ship.name} (${ship.date})`}
                          secondary={`Тип: ${ship.type}, Порт: ${ship.arrivalPort}, Время обслуживания: ${ship.serviceTime} мин`}
                      />
                    </ListItem>
                ))}
              </List>
              <Button variant="contained" size="large" fullWidth onClick={generateSchedule}>
                Сгенерировать расписание
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="h6" component="h3" gutterBottom>
          Составленное расписание
        </Typography>
        <List>
          {schedule.map((ship) => (
              <ListItem key={ship.id}>
                <ListItemText
                    primary={`${ship.name} (${ship.date})`}
                    secondary={`Тип: ${ship.type}, Порт: ${ship.arrivalPort}, Время обслуживания: ${ship.serviceTime} мин, Завершение обслуживания: ${ship.serviceEndTime}`}
                />
              </ListItem>
          ))}
        </List>

        <Typography variant="h6" component="h3" gutterBottom>
          Ошибки
        </Typography>
        <List>
          {errors.map((error, index) => (
              <ListItem key={index}>
                <ListItemText primary={`Ошибка: ${error}`} />
              </ListItem>
          ))}
        </List>
      </Box>
  );
};

export default SchedulePages;
