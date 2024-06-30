import React from 'react';
import { getCalendars } from '../../../api/calendar';
import { getEvents } from '../../../api/event';
import { useReducerCalendarState, useMemoGenerateCalendarTable } from './index';

const useCalendarState = (month: string | undefined) => {
  const [state, dispatch] = useReducerCalendarState();
  const { calendars, events, editingEvent } = state;
  const calendarTable = useMemoGenerateCalendarTable(month, calendars, events);
  const firstDate = calendarTable.firstDate.startOf('day').toISO();
  const lastDate = calendarTable.lastDate.startOf('day').toISO();

  React.useEffect(() => {
    if (firstDate && lastDate) {
      Promise.all([getCalendars(), getEvents(firstDate, lastDate)]).then(
        ([calendars, events]) => {
          dispatch({ type: 'load', payload: { calendars, events } });
        }
      );
    }
  }, [dispatch, firstDate, lastDate]);

  const refreshEvents = () => {
    if (firstDate && lastDate) {
      getEvents(firstDate, lastDate).then(events =>
        dispatch({ type: 'refreshEvents', payload: events })
      );
    }
  };

  return {
    calendars,
    calendarTable,
    dispatch,
    refreshEvents,
    editingEvent,
  };
};

export default useCalendarState;
