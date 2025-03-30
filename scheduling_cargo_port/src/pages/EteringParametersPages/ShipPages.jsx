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
    const [newShipDate, setNewShipDate] = useState(null); // Изменили на null для работы с DateTimePicker
    const [newShipType, setNewShipType] = useState('');
    const [newArrivalPort, setNewArrivalPort] = useState('');
    const [newServiceTime, setNewServiceTime] = useState('');

    // Типы кораблей
    const shipTypes = ['Грузовой', 'Пассажирский', 'Универсальный', 'Танкер', 'Круизный'];

    // Загрузка данных из localStorage при монтировании компонента
    useEffect(() => {
        const savedShips = JSON.parse(localStorage.getItem('ships'));
        if (savedShips) {
            setShips(savedShips);
        }
    }, []);

    // Сохранение данных в localStorage
    const saveShipsToLocalStorage = (updatedShips) => {
        localStorage.setItem('ships', JSON.stringify(updatedShips));
    };

    const handleAddShip = () => {
        if (newShipName.trim() && newShipType && newArrivalPort.trim() && newServiceTime.trim() && newShipDate) {
            const newShip = {
                id: Date.now(),
                name: newShipName,
                date: newShipDate.format('DD.MM.YYYY HH:mm'), // Форматирование даты
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

    return (
        <Box sx={{ width: 1280, margin: '0 auto', padding: 3, textAlign: 'center' }}>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" component="h3" gutterBottom>
                Редактирование списка кораблей
            </Typography>
            <Grid container spacing={5} alignItems="flex-start" justifyContent="center">
                <Grid item xs={2}>
                    <Paper elevation={3} sx={{ padding: 2, mb: 5, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', flexDirection: "column", gap: 2, alignItems: 'center', mb: 6 }}>
                            <TextField
                                label="Название корабля"
                                value={newShipName}
                                onChange={(e) => setNewShipName(e.target.value)}
                                variant="outlined"
                                size="small"
                            />
                            {/* Используем DateTimePicker вместо обычного текстового поля для даты */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="Дата и время прибытия"
                                    value={newShipDate}
                                    onChange={(date) => setNewShipDate(date)}
                                    renderInput={(params) => <TextField {...params} />}
                                    inputFormat="DD.MM.YYYY HH:mm"
                                    disableFuture
                                    showTodayButton
                                    size="small"
                                />
                            </LocalizationProvider>
                            <Select
                                label="Тип корабля"
                                value={newShipType}
                                onChange={(e) => setNewShipType(e.target.value)}
                                variant="outlined"
                                size="small"
                                fullWidth
                            >
                                <MenuItem value="">
                                    <em>Выберите тип</em>
                                </MenuItem>
                                {shipTypes.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                            <TextField
                                label="Порт прибытия"
                                value={newArrivalPort}
                                onChange={(e) => setNewArrivalPort(e.target.value)}
                                variant="outlined"
                                size="small"
                                fullWidth
                            />
                            <TextField
                                label="Время обслуживания"
                                value={newServiceTime}
                                onChange={(e) => setNewServiceTime(e.target.value)}
                                variant="outlined"
                                size="small"
                                fullWidth
                            />
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddShip}
                                fullWidth
                            >
                                Добавить
                            </Button>
                        </Box>
                        <Divider sx={{ my: 3 }} />
                    </Paper>
                </Grid>
                <Grid item xs={2}>
                    <Paper elevation={3} sx={{ padding: 2, mb: 3, height: '100%' }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Добавленные корабли
                        </Typography>
                        <List>
                            {ships.map((ship) => (
                                <ListItem
                                    key={ship.id}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => handleDeleteShip(ship.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={`${ship.name}${ship.date ? ', ' + ship.date : ''}`}
                                        secondary={`Тип: ${ship.type}, Порт прибытия: ${ship.arrivalPort}, Время обслуживания: ${ship.serviceTime}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Button variant="contained" size="large" fullWidth>
                    Сохранить изменения
                </Button>
            </Grid>
        </Box>
    );
};

export default PortSchedulePage;
