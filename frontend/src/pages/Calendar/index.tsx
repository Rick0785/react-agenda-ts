import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  DAYS_OF_WEEK,
  getFromYearMonthISO,
  getISOFromDate,
  getMonthYearFormatted,
  getNextDay,
  getToday,
} from '../../utils/date';
import { DateTime } from 'luxon';
import { getEvents, IEdittingEvent, IEvent } from '../../api/event';
import { getCalendars, ICalendar } from '../../api/calendar';
import { useParams } from 'react-router-dom';
import CalendarsView from './CalendarsView';
import CalendarHeader from './CalendarHeader';
import CalendarTable from './CalendarTable';
import EventFormDialog from './EventFormDialog';

export interface ICalendarTableCell {
  dayOfWeek: string;
  date: DateTime;
  events: (IEvent & { calendar: ICalendar | undefined })[] | undefined;
}

export interface ICalendarTableWeek {
  firstDate: DateTime;
  lastDate: DateTime;
  days: ICalendarTableCell[];
}

export interface ICalendarTable {
  date: DateTime;
  monthFormatted: string;
  firstDate: DateTime;
  lastDate: DateTime;
  weeks: ICalendarTableWeek[];
}

const generateCalendarTable = (
  month: string | undefined,
  calendars: ICalendar[] | undefined,
  events: IEvent[] | undefined
): ICalendarTable => {
  const date = month ? getFromYearMonthISO(month) : getToday();
  const firstDayOfMonth = date.startOf('month');
  const firstDayOfCalendar = firstDayOfMonth.startOf('week', {
    useLocaleWeeks: true,
  });
  const lastDayOfMonth = date.endOf('month');
  const lastDayOfCalendar = lastDayOfMonth.endOf('week', {
    useLocaleWeeks: true,
  });
  const calendarScreen: ICalendarTable = {
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
    const daysOfWeek: ICalendarTableCell[] = [];
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
  const [editingEvent, setEditingEvent] = useState<IEdittingEvent | null>(null);
  const calendarTable = generateCalendarTable(month, calendars, events);
  const firstDate = calendarTable.firstDate.startOf('day').toISO();
  const lastDate = calendarTable.lastDate.startOf('day').toISO();

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

  const refreshEvents = () => {
    if (firstDate && lastDate) {
      getEvents(firstDate, lastDate).then(setEvents);
    }
  };

  const toggleCalendar = (calendar: ICalendar) => {
    setCalendars(prevCalendars =>
      prevCalendars.map(prevCalendar =>
        prevCalendar.id === calendar.id
          ? { ...prevCalendar, selected: !prevCalendar.selected }
          : prevCalendar
      )
    );
  };

  const openNewEvent = (day: DateTime) => {
    setEditingEvent({
      date: getISOFromDate(day),
      desc: '',
      calendarId:
        calendars.filter(calendar => calendar.selected).at(0)?.id ??
        calendars[0].id,
    });
  };

  const updateEvent = (event: IEvent) => {
    setEditingEvent({
      ...event,
    });
  };

  return (
    <Box display={'flex'} height={'100%'} alignItems={'stretch'}>
      <Box
        borderRight={'1px solid rgb(224, 224, 244)'}
        width={'14em'}
        padding={'8px 16px'}
      >
        <Box component={'h2'}>Agenda React</Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => openNewEvent(getToday())}
        >
          Novo Evento
        </Button>
        <CalendarsView {...{ calendars, toggleCalendar }} />
      </Box>
      <Box display={'flex'} flexDirection={'column'} flex={1}>
        <CalendarHeader {...{ calendarTable }} />
        <CalendarTable
          {...{ calendarTable }}
          onClickDay={openNewEvent}
          onClickEvent={updateEvent}
        />
        <EventFormDialog
          event={editingEvent}
          calendars={calendars}
          onCancel={() => setEditingEvent(null)}
          onSave={() => {
            setEditingEvent(null);
            refreshEvents();
          }}
        />
      </Box>
    </Box>
  );
};

export default Calendar;
