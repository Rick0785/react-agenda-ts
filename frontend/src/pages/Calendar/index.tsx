import React, { useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { getToday } from '../../utils/date';
import { getEvents } from '../../api/event';
import { getCalendars } from '../../api/calendar';
import { useParams } from 'react-router-dom';
import CalendarsView from './CalendarsView';
import CalendarHeader from './CalendarHeader';
import CalendarTable from './CalendarTable';
import EventFormDialog from './EventFormDialog';
import {
  useMemoGenerateCalendarTable,
  useReducerCalendarState,
} from './_hooks';

const Calendar = () => {
  console.log('Componente Calendar foi chamado!');
  const { month } = useParams<{ month: string }>();
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

  const closeDialog = useCallback(() => {
    dispatch({ type: 'closeDialog' });
  }, [dispatch]);

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
          onClick={() => dispatch({ type: 'newEvent', payload: getToday() })}
        >
          Novo Evento
        </Button>
        <CalendarsView {...{ calendars, dispatch }} />
      </Box>
      <Box display={'flex'} flexDirection={'column'} flex={1}>
        <CalendarHeader {...{ calendarTable }} />
        <CalendarTable {...{ calendarTable, dispatch }} />
        <EventFormDialog
          event={editingEvent}
          calendars={calendars}
          onCancel={closeDialog}
          onSave={() => {
            closeDialog();
            refreshEvents();
          }}
        />
      </Box>
    </Box>
  );
};

export default Calendar;
