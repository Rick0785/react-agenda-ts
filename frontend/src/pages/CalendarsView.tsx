import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ICalendar } from '../api/calendar';

interface ICalendarsViewProps {
  calendars: ICalendar[];
  toggleCalendar: (calendar: ICalendar) => void;
}

const CalendarsView = (props: ICalendarsViewProps) => {
  const { calendars, toggleCalendar } = props;
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
                onChange={() => toggleCalendar(calendar)}
              />
            }
            label={calendar.name}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default CalendarsView;
