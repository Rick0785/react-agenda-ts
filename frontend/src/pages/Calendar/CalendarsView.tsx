import React from 'react';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ICalendar } from '../../api/calendar';
import { CalendarAction } from './_hooks/useReducerCalendarState';

interface ICalendarsViewProps {
  calendars: ICalendar[];
  dispatch: React.Dispatch<CalendarAction>;
}

const CalendarsView = (props: ICalendarsViewProps) => {
  const { calendars, dispatch } = props;
  return (
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
                onChange={() =>
                  dispatch({ type: 'toggleCalendar', payload: calendar })
                }
              />
            }
            label={calendar.name}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default React.memo(CalendarsView);
