import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { DAYS_OF_WEEK, getToday } from '../../utils/date';
import { DateTime } from 'luxon';
import { IEvent } from '../../api/event';
import { ICalendarTable } from './_hooks/useMemoGenerateCalendarTable';
import { CalendarAction } from './_hooks/useReducerCalendarState';

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
  dayOfMonth: {
    display: 'inline-block',
    fontWeight: 500,
    width: '26px',
    padding: '2px',
    lineHeigth: '24px',
    marginBottom: '4px',
    borderRadius: '50%',
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
  calendarTable: ICalendarTable;
  dispatch: React.Dispatch<CalendarAction>;
}

const CalendarTable = (props: ICalendarScreenProps) => {
  console.log('Componente CalendarTable foi chamado!');
  const { calendarTable, dispatch } = props;

  const handleClickDay = (mouseEvent: React.MouseEvent, day: DateTime) => {
    if (mouseEvent.target === mouseEvent.currentTarget) {
      dispatch({ type: 'newEvent', payload: day });
    }
  };

  const handleClickEvent = (event: IEvent) => {
    dispatch({ type: 'editEvent', payload: event });
  };

  return (
    <TableContainer component={Box} flex={1}>
      <Table sx={styles.table} aria-label="calendário">
        <TableHead>
          <TableRow>
            {DAYS_OF_WEEK.map(day => (
              <TableCell sx={{ fontWeight: 'bold' }} align="center" key={day}>
                {day}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {calendarTable?.weeks.map((week, i) => (
            <TableRow key={i}>
              {week?.days.map(day => {
                return (
                  <TableCell
                    align="center"
                    key={day.date.toString()}
                    onClick={mouseEvent => handleClickDay(mouseEvent, day.date)}
                  >
                    <Box
                      style={
                        day.date.hasSame(getToday(), 'day')
                          ? {
                              backgroundColor: '#1976d2',
                              color: 'white',
                            }
                          : {}
                      }
                      sx={styles.dayOfMonth}
                    >
                      {day.date.day}
                    </Box>
                    {day.events?.map(event => {
                      const color = event.calendar?.color;
                      return (
                        <Box
                          key={event.id}
                          component={'button'}
                          sx={styles.event}
                          onClick={() => handleClickEvent(event)}
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

export default React.memo(CalendarTable);
