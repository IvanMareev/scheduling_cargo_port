import React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container, Box, Typography } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[700], // Заголовок таблицы, цвет можно изменить
    color: theme.palette.common.white,
    fontWeight: 'bold', // Делаем текст заголовка жирным
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover, // Чередование строк для лучшей читаемости
  },
  // Скрыть границу последней строки
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// Функция для создания данных (замените на ваши реальные данные)
function createData(vesselName, vesselType, arrivalDate, terminalName, terminalType, portName, departureDate) {
  return {
    id: Math.random(), // Генерируем случайный id, замените на ваш реальный id
    vesselName: vesselName,
    vesselType: vesselType,
    arrivalDate: arrivalDate,
    terminalName: terminalName,
    terminalType: terminalType,
    portName: portName,
    departureDate: departureDate,
  };
}

// Пример данных (замените на ваши реальные данные)
const rows = [
  createData(
    'Судно 1',
    'Танкер',
    '2023-11-15',
    'Терминал A',
    'Нефтяной',
    'Порт X',
    '2023-11-18'
  ),
  createData(
    'Судно 2',
    'Контейнеровоз',
    '2023-11-16',
    'Терминал B',
    'Контейнерный',
    'Порт Y',
    '2023-11-19'
  ),
  createData(
    'Судно 3',
    'Сухогруз',
    '2023-11-17',
    'Терминал C',
    'Угольный',
    'Порт Z',
    '2023-11-20'
  ),
];

const SchedulePages = () => {
  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Данные о судах
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Название судна</StyledTableCell>
                <StyledTableCell align="left">Тип судна</StyledTableCell>
                <StyledTableCell align="left">Дата прибытия</StyledTableCell>
                <StyledTableCell align="left">Название терминала</StyledTableCell>
                <StyledTableCell align="left">Тип терминала</StyledTableCell>
                <StyledTableCell align="left">Название порта</StyledTableCell>
                <StyledTableCell align="left">Дата отправки</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.vesselName}
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.vesselType}</StyledTableCell>
                  <StyledTableCell align="left">{row.arrivalDate}</StyledTableCell>
                  <StyledTableCell align="left">{row.terminalName}</StyledTableCell>
                  <StyledTableCell align="left">{row.terminalType}</StyledTableCell>
                  <StyledTableCell align="left">{row.portName}</StyledTableCell>
                  <StyledTableCell align="left">{row.departureDate}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default SchedulePages;