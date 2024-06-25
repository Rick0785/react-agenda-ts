import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  DAYS_OF_WEEK,
  getFromYearMonthISO,
  getMonthYearFormatted,
  getNextDay,
  getToday,
} from '../utils/date';
import { DateTime } from 'luxon';
import { getEvents, IEvent } from '../api/event';
import { getCalendars, ICalendar } from '../api/calendar';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import CalendarsView from './CalendarsView';
import CalendarHeader from './CalendarHeader';
import CalendarTable from './CalendarTable';

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

export interface ICalendarScreen {
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

const Calendar = () => {
  const { month } = useParams<{ month: string }>();
  const [calendars, setCalendars] = useState<ICalendar[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const calendarScreen = generateCalendarScreen(month, calendars, events);
  const firstDate = calendarScreen.firstDate.startOf('day').toISO();
  const lastDate = calendarScreen.lastDate.startOf('day').toISO();

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
        <CalendarsView {...{ calendars, toggleCalendar }} />
      </Box>
      <Box display={'flex'} flexDirection={'column'} flex={1}>
        <CalendarHeader {...{ calendarScreen }} />
        <CalendarTable {...{ calendarScreen }} />
      </Box>
    </Box>
  );
};

export default Calendar;
