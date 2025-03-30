import React, {useState} from 'react';
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
    const [terminals, setTerminals] = useState([
        {id: 1, name: 'Терминал А', type: 'грузовой'},
        {id: 2, name: 'Терминал B', type: 'пассажирский'},
    ]);

    const [newTerminalName, setNewTerminalName] = useState('');
    const [newTerminalType, setNewTerminalType] = useState('');

    const terminalTypes = [
        'грузовой',
        'пассажирский',
        'универсальный',
        'нефтеналивной',
        'контейнерный'
    ];

    const handleAddTerminal = () => {
        if (newTerminalName.trim() && newTerminalType) {
            const newTerminal = {
                id: Date.now(),
                name: newTerminalName,
                type: newTerminalType
            };
            setTerminals([...terminals, newTerminal]);
            setNewTerminalName('');
            setNewTerminalType('');
        }
    };

    const handleDeleteTerminal = (id) => {
        setTerminals(terminals.filter(terminal => terminal.id !== id));
    };

    return (
        <Box sx={{margin: '0 auto', padding: 3}}>
            <Divider sx={{my: 3}}/>
            <Typography variant="h6" component="h3" gutterBottom>
                Редактирование списка терминалов
            </Typography>
            <Grid container spacing={5} alignItems="flex-start">
                <Grid item xs={2}>
                    <Paper elevation={3} sx={{ padding: 2, mb: 5, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', flexDirection:"column", gap: 2, alignItems: 'center', mb: 6 }}>
                            <TextField
                                label="Название терминала"
                                value={newTerminalName}
                                onChange={(e) => setNewTerminalName(e.target.value)}
                                variant="outlined"
                                size="small"
                                fullWidth
                            />
                            <Select
                                label="Тип терминала"
                                value={newTerminalType}
                                onChange={(e) => setNewTerminalType(e.target.value)}
                                variant="outlined"
                                size="small"
                                fullWidth
                            >
                                <MenuItem value="">
                                    <em>Выберите тип</em>
                                </MenuItem>
                                {terminalTypes.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddTerminal}
                                fullWidth
                            >
                                Добавить терминал
                            </Button>
                        </Box>

                        <Divider sx={{ my: 3 }} />
                    </Paper>
                </Grid>
                <Grid item xs={2}>
                    <Paper elevation={3} sx={{ padding: 2, mb: 3, height: '100%'}}>
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
                                        primary={`${terminal.name}`}
                                        secondary={`Тип: ${terminal.type}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
            <Button variant="contained" size="large" fullWidth>
                Сохранить изменения
            </Button>
        </Box>
    );
};

export default TerminalInputPage;