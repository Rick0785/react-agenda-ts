import { useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { getToday } from '../../utils/date';
import { useParams } from 'react-router-dom';
import CalendarsView from './CalendarsView';
import CalendarHeader from './CalendarHeader';
import CalendarTable from './CalendarTable';
import EventFormDialog from './EventFormDialog';
import { useCalendarState } from './_hooks';

const Calendar = () => {
  const { month } = useParams<{ month: string }>();
  const { calendars, calendarTable, dispatch, refreshEvents, editingEvent } =
    useCalendarState(month);

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
        <CalendarHeader date={calendarTable.date} />
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
