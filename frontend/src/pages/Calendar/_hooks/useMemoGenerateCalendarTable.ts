import React from 'react';
import {
  DAYS_OF_WEEK,
  getFromYearMonthISO,
  getMonthYearFormatted,
  getNextDay,
  getToday,
} from '../../../utils/date';
import { DateTime } from 'luxon';
import { IEvent } from '../../../api/event';
import { ICalendar } from '../../../api/calendar';

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

const useMemoGenerateCalendarTable = (
  month: string | undefined,
  calendars: ICalendar[] | undefined,
  events: IEvent[] | undefined
) =>
  React.useMemo(() => {
    return generateCalendarTable(month, calendars, events);
  }, [month, calendars, events]);

export default useMemoGenerateCalendarTable;
