import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonIcon from '@mui/icons-material/Person';
import Avatar from '@mui/material/Avatar';
import {
  getNextMonth,
  getPrevMonth,
  getYearMonthISOFromDate,
} from '../utils/date';
import { Link } from 'react-router-dom';
import { ICalendarScreen } from './Calendar';

interface ICalendarHeaderProps {
  calendarScreen: ICalendarScreen;
}

const CalendarHeader = (props: ICalendarHeaderProps) => {
  const { calendarScreen } = props;
  return (
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
  );
};
export default CalendarHeader;
