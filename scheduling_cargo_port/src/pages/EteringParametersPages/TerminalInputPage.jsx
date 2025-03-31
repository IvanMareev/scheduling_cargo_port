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

const TerminalInputPage = () => {
    const [terminals, setTerminals] = useState([]);
    const [ports, setPorts] = useState([]); // Добавляем состояние для портов
    const [newTerminalName, setNewTerminalName] = useState('');
    const [newTerminalType, setNewTerminalType] = useState('');
    const [selectedPort, setSelectedPort] = useState(''); // Храним выбранный порт

    const terminalTypes = [
        'грузовой',
        'пассажирский',
        'универсальный',
        'нефтеналивной',
        'контейнерный'
    ];

    useEffect(() => {
        const savedTerminals = JSON.parse(localStorage.getItem('terminals')) || [];
        setTerminals(savedTerminals);

        const savedPorts = JSON.parse(localStorage.getItem('ports')) || [];
        setPorts(savedPorts);
    }, []);

    const saveTerminalsToLocalStorage = (updatedTerminals) => {
        localStorage.setItem('terminals', JSON.stringify(updatedTerminals));
    };

    const handleAddTerminal = () => {
        if (newTerminalName.trim() && newTerminalType && selectedPort) {
            const newTerminal = {
                id: Date.now(),
                name: newTerminalName,
                type: newTerminalType,
                port: selectedPort // Сохраняем привязку к порту
            };
            const updatedTerminals = [...terminals, newTerminal];
            setTerminals(updatedTerminals);
            saveTerminalsToLocalStorage(updatedTerminals);
            setNewTerminalName('');
            setNewTerminalType('');
            setSelectedPort('');
        }
    };

    const handleDeleteTerminal = (id) => {
        const updatedTerminals = terminals.filter(terminal => terminal.id !== id);
        setTerminals(updatedTerminals);
        saveTerminalsToLocalStorage(updatedTerminals);
    };

    return (
        <Box sx={{ width: 1280, margin: '0 auto', padding: 3, textAlign: 'center' }}>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" component="h3" gutterBottom>
                Редактирование списка терминалов
            </Typography>
            <Grid container spacing={5} alignItems="flex-start" justifyContent="center">
                <Grid item xs={3}>
                    <Paper elevation={3} sx={{ padding: 2, mb: 5 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Добавить терминал
                        </Typography>
                        <TextField
                            label="Название терминала"
                            value={newTerminalName}
                            onChange={(e) => setNewTerminalName(e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <Select
                            value={newTerminalType}
                            onChange={(e) => setNewTerminalType(e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            <MenuItem value="">
                                <em>Выберите тип</em>
                            </MenuItem>
                            {terminalTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                        <Select
                            value={selectedPort}
                            onChange={(e) => setSelectedPort(e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            <MenuItem value="">
                                <em>Выберите порт</em>
                            </MenuItem>
                            {ports.map((port) => (
                                <MenuItem key={port.id} value={port.name}>{port.name}</MenuItem>
                            ))}
                        </Select>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAddTerminal}
                            fullWidth
                            sx={{ backgroundColor: '#2C2C2C', '&:hover': { backgroundColor: '#1E1E1E' } }}
                        >
                            Добавить терминал
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={5}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Список терминалов
                        </Typography>
                        <List>
                            {terminals.map((terminal) => (
                                <ListItem
                                    key={terminal.id}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => handleDeleteTerminal(terminal.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={terminal.name}
                                        secondary={`Тип: ${terminal.type} | Порт: ${terminal.port}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
            <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ backgroundColor: '#2C2C2C', '&:hover': { backgroundColor: '#1E1E1E' } }}
            >
                Сохранить изменения
            </Button>
        </Box>
    );
};

export default TerminalInputPage;
