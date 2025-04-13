import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    TextField,
    IconButton,
    Paper,
    Grid,
    Select,
    MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const PortSchedulePage = () => {
    const [ships, setShips] = useState([]);
    const [newShipName, setNewShipName] = useState('');
    const [newShipDate, setNewShipDate] = useState(null);
    const [newShipType, setNewShipType] = useState('');
    const [newArrivalPort, setNewArrivalPort] = useState('');
    const [newServiceTime, setNewServiceTime] = useState('');
    const [workingPorts, setWorkingPorts] = useState([]);

    useEffect(() => {
        const savedShips = JSON.parse(localStorage.getItem('ships')) || [];
        setShips(savedShips);

        const savedPorts = JSON.parse(localStorage.getItem('ports')) || [];
        const activePorts = savedPorts.filter(port => port.status === 'работает');
        setWorkingPorts(activePorts);
    }, []);

    const saveShipsToLocalStorage = (updatedShips) => {
        localStorage.setItem('ships', JSON.stringify(updatedShips));
    };

    const handleAddShip = () => {
        if (newShipName.trim() && newShipType && newArrivalPort.trim() && newServiceTime.trim() && newShipDate) {
            const newShip = {
                id: Date.now(),
                name: newShipName,
                date: newShipDate.format('DD.MM.YYYY HH:mm'),
                type: newShipType,
                arrivalPort: newArrivalPort,
                serviceTime: newServiceTime
            };
            const updatedShips = [...ships, newShip];
            setShips(updatedShips);
            saveShipsToLocalStorage(updatedShips);
            setNewShipName('');
            setNewShipDate(null);
            setNewShipType('');
            setNewArrivalPort('');
            setNewServiceTime('');
        }
    };

    const handleDeleteShip = (id) => {
        const updatedShips = ships.filter(ship => ship.id !== id);
        setShips(updatedShips);
        saveShipsToLocalStorage(updatedShips);
    };

    const groupedShips = ships.reduce((acc, ship) => {
        if (!acc[ship.arrivalPort]) {
            acc[ship.arrivalPort] = [];
        }
        acc[ship.arrivalPort].push(ship);
        return acc;
    }, {});

    return (
        <Box sx={{ width: 1280, margin: '0 auto', padding: 3, textAlign: 'center' }} >
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" component="h3" gutterBottom>
                Редактирование списка кораблей
            </Typography>
            <Grid container spacing={5} alignItems="flex-start" justifyContent="center">
                <Grid item xs={3}>
                    <Paper elevation={3} sx={{ padding: 2, mb: 5 }}>
                        <Typography variant="subtitle1">Название корабля</Typography>
                        <TextField
                            fullWidth
                            label="Название корабля"
                            size="small"
                            value={newShipName}
                            onChange={(e) => setNewShipName(e.target.value)}
                        />
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>Дата и время прибытия</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                value={newShipDate}
                                size="small"
                                fullWidth
                                onChange={(date) => setNewShipDate(date)}
                                renderInput={(params) => <TextField fullWidth {...params} />}
                            />
                        </LocalizationProvider>
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>Тип корабля</Typography>
                        <Select
                            fullWidth
                            label="Тип корабля"
                            size="small"
                            value={newShipType}
                            onChange={(e) => setNewShipType(e.target.value)}
                        >
                            <MenuItem value="Грузовой">Грузовой</MenuItem>
                            <MenuItem value="Пассажирский">Пассажирский</MenuItem>
                            <MenuItem value="Универсальный">Универсальный</MenuItem>
                            <MenuItem value="Танкер">Танкер</MenuItem>
                            <MenuItem value="Круизный">Круизный</MenuItem>
                        </Select>
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>Порт прибытия</Typography>
                        <Select
                            fullWidth
                            label="Порт прибытия"
                            size="small"
                            value={newArrivalPort}
                            onChange={(e) => setNewArrivalPort(e.target.value)}
                        >
                            {workingPorts.map((port) => (
                                <MenuItem key={port.id} value={port.name}>{port.name}</MenuItem>
                            ))}
                        </Select>
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>Время обслуживания (минуты)</Typography>
                        <TextField
                            fullWidth
                            label="Время обслуживания (минуты)"
                            size="small"
                            value={newServiceTime}
                            onChange={(e) => setNewServiceTime(e.target.value)}
                        />
                        <Button variant="contained" startIcon={<AddIcon />} fullWidth sx={{ mt: 2 }} onClick={handleAddShip}>
                            Добавить
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper elevation={3} sx={{ padding: 2, mb: 3 }}>
                        <Typography variant="subtitle1">Добавленные корабли</Typography>
                        {Object.entries(groupedShips).map(([port, ships]) => (
                            <Box key={port} sx={{ mt: 2 }}>
                                <Typography variant="h6">{port}</Typography>
                                <List>
                                    {ships.map((ship) => (
                                        <ListItem key={ship.id}>
                                            <ListItemText
                                                primary={`${ship.name}, ${ship.date}`}
                                                secondary={`Тип: ${ship.type}, Время обслуживания: ${ship.serviceTime}ч`}
                                            />
                                            <IconButton onClick={() => handleDeleteShip(ship.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        ))}
                    </Paper>
                </Grid>
                
            </Grid>
        </Box>
    );
};

export default PortSchedulePage;
