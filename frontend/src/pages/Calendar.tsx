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
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import Avatar from '@mui/material/Avatar';
import {
  getFromYearMonthISO,
  getMonthYearFormatted,
  getNextDay,
  getNextMonth,
  getPrevMonth,
  getToday,
  getYearMonthISOFromDate,
} from '../utils/date';
import { DateTime } from 'luxon';
import { getEvents, IEvent } from '../api/event';
import { getCalendars, ICalendar } from '../api/calendar';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const DAYS_OF_WEEK = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

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

const Calendar = () => {
  const { month } = useParams<{ month: string }>();

  const [calendars, setCalendars] = useState<ICalendar[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const calendarScreen = generateCalendarScreen(month, calendars, events);
  const firstDate = calendarScreen.firstDate.startOf('day').toISO();
  const lastDate = calendarScreen.lastDate.startOf('day').toISO();

  console.log({ calendarScreen });

  React.useEffect(() => {
    if (firstDate && lastDate) {
      Promise.all([getCalendars(), getEvents(firstDate, lastDate)]).then(
        ([calendars, events]) => {
          setCalendars(
            calendars.map(calendar => {
              return { ...calendar, selected: true };
            })
          );
          setEvents(events);
        }
      );
    }
  }, [firstDate, lastDate]);

  const toggleCalendar = (calendar: ICalendar) => {
    setCalendars(prevCalendars =>
      prevCalendars.map(prevCalendar =>
        prevCalendar.id === calendar.id
          ? { ...prevCalendar, selected: !prevCalendar.selected }
          : prevCalendar
      )
    );
  };

  return (
    <Box display={'flex'} height={'100%'} alignItems={'stretch'}>
      <Box
        borderRight={'1px solid rgb(224, 224, 244)'}
        width={'14em'}
        padding={'8px 16px'}
      >
        <Box component={'h2'}>Agenda React</Box>
        <Button variant="contained" color="primary">
          Novo Evento
        </Button>
        <Box marginTop={'64px'}>
          <Box component={'h3'}>Agendas</Box>
          <FormGroup>
            {calendars?.map(calendar => (
              <FormControlLabel
                key={calendar.id}
                control={
                  <Checkbox
                    style={{ color: calendar.color }}
                    checked={calendar.selected}
                    onChange={() => toggleCalendar(calendar)}
                  />
                }
                label={calendar.name}
              />
            ))}
          </FormGroup>
        </Box>
      </Box>
      <Box display={'flex'} flexDirection={'column'} flex={1}>
        <Box display={'flex'} alignItems={'center'} padding="8px 16px">
          <Box>
            <IconButton
              aria-label="Mês Anterior"
              component={Link}
              to={`/calendar/${getYearMonthISOFromDate(
                getPrevMonth(calendarScreen.date)
              )}`}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              aria-label="Próximo mês"
              component={Link}
              to={`/calendar/${getYearMonthISOFromDate(
                getNextMonth(calendarScreen.date)
              )}`}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
          <Box component={'h3'} marginLeft={'16px'} flex={1}>
            {calendarScreen.monthFormatted}
          </Box>
          <IconButton aria-label="Usuáro">
            <Avatar>
              <PersonIcon />
            </Avatar>
          </IconButton>
        </Box>
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
      </Box>
    </Box>
  );
};

interface ICalendarScreenCell {
  dayOfWeek: string;
  date: DateTime;
  events: (IEvent & { calendar: ICalendar | undefined })[] | undefined;
}

interface ICalendarScreenWeek {
  firstDate: DateTime;
  lastDate: DateTime;
  days: ICalendarScreenCell[];
}

interface ICalendarScreen {
  date: DateTime;
  monthFormatted: string;
  firstDate: DateTime;
  lastDate: DateTime;
  weeks: ICalendarScreenWeek[];
}

const generateCalendarScreen = (
  month: string | undefined,
  calendars: ICalendar[] | undefined,
  events: IEvent[] | undefined
): ICalendarScreen => {
  console.log({ month });
  const date = month ? getFromYearMonthISO(month) : getToday();
  console.log({ date });
  const firstDayOfMonth = date.startOf('month');
  const firstDayOfCalendar = firstDayOfMonth.startOf('week', {
    useLocaleWeeks: true,
  });
  const lastDayOfMonth = date.endOf('month');
  const lastDayOfCalendar = lastDayOfMonth.endOf('week', {
    useLocaleWeeks: true,
  });
  const calendarScreen: ICalendarScreen = {
    date,
    monthFormatted: getMonthYearFormatted(date),
    firstDate: firstDayOfCalendar,
    lastDate: lastDayOfCalendar,
    weeks: [],
  };
  const selectedCalendars = calendars
    ?.filter(calendar => calendar.selected)
    .map(calendar => calendar.id);

  let currentDay = firstDayOfCalendar;
  do {
    const daysOfWeek: ICalendarScreenCell[] = [];
    for (const dayOfWeek of DAYS_OF_WEEK) {
      const day = currentDay;
      const dayEvents = events
        ?.filter(
          event =>
            event.date === day.toISODate() &&
            selectedCalendars?.includes(event.calendarId)
        )
        .map(event => {
          const calendar = calendars?.find(
            calendar => calendar.id === event.calendarId
          );
          return { ...event, calendar };
        });
      daysOfWeek.push({ dayOfWeek, date: currentDay, events: dayEvents });
      currentDay = getNextDay(currentDay);
    }
    calendarScreen.weeks.push({
      firstDate: daysOfWeek.at(0)?.date!,
      lastDate: daysOfWeek.at(-1)?.date!,
      days: daysOfWeek,
    });
  } while (currentDay < lastDayOfCalendar);
  return calendarScreen;
};

export default Calendar;
