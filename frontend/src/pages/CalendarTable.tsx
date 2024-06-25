import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { ICalendarScreen } from './Calendar';
import { DAYS_OF_WEEK } from '../utils/date';

const styles = {
  table: {
    borderTop: '1px solid rgb(224, 224, 244)',
    minHeight: '100%',
    minWidth: 650,
    tableLayout: 'fixed',
    '& td ~ td, th ~ th': {
      borderLeft: '1px solid rgb(224, 224, 244)',
    },
    '& td': {
      verticalAlign: 'top',
      overflow: 'hidden',
      padding: '8px 4px',
    },
  },
  dayOfWeek: {
    fontWeight: 500,
    marginBottom: '4px',
  },
  event: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAling: 'left',
    whiteSpace: 'nowrap',
    margin: '4px 0',
  },
  eventBackground: {
    display: 'inline-block',
    color: 'white',
    padding: '2px 4px',
    borderRadius: '4px',
  },
};

interface ICalendarScreenProps {
  calendarScreen: ICalendarScreen;
}

const CalendarTable = (props: ICalendarScreenProps) => {
  const { calendarScreen } = props;
  return (
    <TableContainer component={Box} flex={1}>
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
          {calendarScreen?.weeks.map((week, i) => (
            <TableRow key={i}>
              {week?.days.map(day => {
                return (
                  <TableCell align="center" key={day.date.toString()}>
                    <Box sx={styles.dayOfWeek}>{day.date.day}</Box>
                    {day.events?.map(event => {
                      const color = event.calendar?.color;
                      return (
                        <Box
                          key={event.id}
                          component={'button'}
                          sx={styles.event}
                        >
                          {event.time && (
                            <>
                              <WatchLaterIcon
                                style={{ color }}
                                fontSize="inherit"
                              />
                              <Box component="span" margin="0 4px">
                                {event.time}
                              </Box>
                            </>
                          )}
                          {event.time ? (
                            <Box component="span">{event.desc}</Box>
                          ) : (
                            <Box
                              component="span"
                              style={{
                                backgroundColor: color,
                              }}
                              sx={styles.eventBackground}
                            >
                              {event.desc}
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CalendarTable;
