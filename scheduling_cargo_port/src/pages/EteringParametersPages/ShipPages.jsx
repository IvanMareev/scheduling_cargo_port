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
    Paper, Grid, Select, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router";

const PortSchedulePage = () => {
    const [ships, setShips] = useState([]);
    const [newShipName, setNewShipName] = useState('');
    const [newShipDate, setNewShipDate] = useState('');
    const [age, setAge] = React.useState('');

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

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const handleAddShip = () => {
        if (newShipName.trim()) {
            const newShip = {
                id: Date.now(),
                name: newShipName,
                date: newShipDate
            };
            const updatedShips = [...ships, newShip];
            setShips(updatedShips);
            saveShipsToLocalStorage(updatedShips);
            setNewShipName('');
            setNewShipDate('');
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
                            <TextField
                                label="Дата (дд.мм.гг)"
                                value={newShipDate}
                                onChange={(e) => setNewShipDate(e.target.value)}
                                variant="outlined"
                                size="small"
                            />
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={age}
                                label="Age"
                                onChange={handleChange}
                            >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddShip}
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
