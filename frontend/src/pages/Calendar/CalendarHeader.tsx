import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  getNextMonth,
  getPrevMonth,
  getYearMonthISOFromDate,
} from '../../utils/date';
import { Link } from 'react-router-dom';
import { ICalendarTable } from '.';
import UserMenu from './UserMenu';
import { IUser } from '../../api/user';

interface ICalendarHeaderProps {
  calendarTable: ICalendarTable;
  onSingOut: () => void;
  user: IUser;
}

const CalendarHeader = (props: ICalendarHeaderProps) => {
  const { calendarTable } = props;
  return (
    <Box display={'flex'} alignItems={'center'} padding="8px 16px">
      <Box>
        <IconButton
          aria-label="Mês Anterior"
          component={Link}
          to={`/calendar/${getYearMonthISOFromDate(
            getPrevMonth(calendarTable.date)
          )}`}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          aria-label="Próximo mês"
          component={Link}
          to={`/calendar/${getYearMonthISOFromDate(
            getNextMonth(calendarTable.date)
          )}`}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
      <Box component={'h3'} marginLeft={'16px'} flex={1}>
        {/* <Input type="month" defaultValue={calendarTable.date} /> */}
        {calendarTable.monthFormatted}
      </Box>
      <UserMenu onSingOut={props.onSingOut} user={props.user} />
    </Box>
  );
};
export default CalendarHeader;
