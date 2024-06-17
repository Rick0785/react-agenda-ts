import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonIcon from '@mui/icons-material/Person';
import Avatar from '@mui/material/Avatar';

const DAYS_OF_WEEK = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

const styles = {
  table: {
    borderTop: '1px solid rgb(224, 224, 244)',
    minHeight: '100%',
    minWidth: 650,
    '& td ~ td, th ~ th': {
      borderLeft: '1px solid rgb(224, 224, 244)',
    },
  },
};

const Calendar = () => {
  return (
    <Box display={'flex'} height={'100%'} alignItems={'stretch'}>
      <Box
        borderRight={'1px solid rgb(224, 224, 244)'}
        width={'16em'}
        padding={'8px 16px'}
      >
        <Box component={'h2'}>Agenda React</Box>
        <Button variant="contained" color="primary">
          Novo Evento
        </Button>
        <Box marginTop={'64px'}>
          <Box component={'h3'}>Agendas</Box>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Pessoal"
            />
            <FormControlLabel control={<Checkbox />} label="Trabalho" />
          </FormGroup>
        </Box>
      </Box>
      <TableContainer component={Box}>
        <Box display={'flex'} alignItems={'center'} padding="8px 16px">
          <Box>
            <IconButton aria-label="Mês Anterior">
              <ChevronLeftIcon />
            </IconButton>
            <IconButton aria-label="Próximo mês">
              <ChevronRightIcon />
            </IconButton>
          </Box>
          <Box component={'h3'} marginLeft={'16px'} flex={1}>
            Junho de 2024
          </Box>
          <IconButton aria-label="Usuáro">
            <Avatar>
              <PersonIcon />
            </Avatar>
          </IconButton>
        </Box>
        <Table sx={styles.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {DAYS_OF_WEEK.map(day => (
                <TableCell align="center" key={day}>
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {DAYS_OF_WEEK.map(day => (
                <TableCell align="center" key={day}>
                  X
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              {DAYS_OF_WEEK.map(day => (
                <TableCell align="center" key={day}>
                  X
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              {DAYS_OF_WEEK.map(day => (
                <TableCell align="center" key={day}>
                  X
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Calendar;
