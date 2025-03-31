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

const PortEditPage = () => {
    const [ports, setPorts] = useState([]);
    const [newPortName, setNewPortName] = useState('');
    const [portStatus, setPortStatus] = useState('работает');

    useEffect(() => {
        const savedPorts = JSON.parse(localStorage.getItem('ports')) || [];
        setPorts(savedPorts);
    }, []);

    const savePortsToLocalStorage = (updatedPorts) => {
        localStorage.setItem('ports', JSON.stringify(updatedPorts));
    };

    const handleAddPort = () => {
        if (newPortName.trim()) {
            const newPort = {
                id: Date.now(),
                name: newPortName,
                status: portStatus
            };
            const updatedPorts = [...ports, newPort];
            setPorts(updatedPorts);
            savePortsToLocalStorage(updatedPorts);
            setNewPortName('');
        }
    };

    const handleDeletePort = (id) => {
        const updatedPorts = ports.filter(port => port.id !== id);
        setPorts(updatedPorts);
        savePortsToLocalStorage(updatedPorts);
    };

    const workingPorts = ports.filter(port => port.status === 'работает');
    const inactivePorts = ports.filter(port => port.status === 'не работает');

    return (
        <Box sx={{ width: 1280, margin: '0 auto', padding: 3, textAlign: 'center' }}>
            <Typography variant="h6" component="h3" gutterBottom>
                Редактирование списка портов
            </Typography>
            <Grid container spacing={1} alignItems="flex-start" justifyContent="center">
                <Grid item xs={4}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Добавить порт
                        </Typography>
                        <TextField
                            fullWidth
                            label="Название порта"
                            value={newPortName}
                            onChange={(e) => setNewPortName(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ mb: 2 }}
                        />
                        <Select
                            fullWidth
                            value={portStatus}
                            onChange={(e) => setPortStatus(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ mb: 2 }}
                        >
                            <MenuItem value="работает">Работает</MenuItem>
                            <MenuItem value="не работает">Не работает</MenuItem>
                        </Select>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAddPort}
                            fullWidth
                            sx={{ backgroundColor: '#2C2C2C', '&:hover': { backgroundColor: '#1E1E1E' } }}
                        >
                            Добавить порт
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={7}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Добавленные порты
                        </Typography>
                        <List>
                            {workingPorts.map((port) => (
                                <ListItem key={port.id} secondaryAction={
                                    <IconButton edge="end" onClick={() => handleDeletePort(port.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }>
                                    <ListItemText primary={port.name} secondary="Работает" />
                                </ListItem>
                            ))}
                            {inactivePorts.length > 0 && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                                        Терминалы не введенные в эксплуатацию
                                    </Typography>
                                    {inactivePorts.map((port) => (
                                        <ListItem key={port.id} secondaryAction={
                                            <IconButton edge="end" onClick={() => handleDeletePort(port.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        }>
                                            <ListItemText primary={port.name} secondary="Не работает" />
                                        </ListItem>
                                    ))}
                                </>
                            )}
                        </List>
                    </Paper>
                </Grid>
                <Button variant="contained" size="large" fullWidth
                sx={{ backgroundColor: '#2C2C2C', '&:hover': { backgroundColor: '#1E1E1E' } }}>
                    Сохранить изменения
                </Button>
            </Grid>
        </Box>
    );
};

export default PortEditPage;