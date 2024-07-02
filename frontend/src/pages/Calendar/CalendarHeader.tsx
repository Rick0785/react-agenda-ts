import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  getNextMonth,
  getPrevMonth,
  getYearMonthISOFromDate,
} from '../../utils/date';
import { Link, useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';
import { DateTime } from 'luxon';
import DateCalendarMenu from './DateCalendarMenu';

interface ICalendarHeaderProps {
  date: DateTime;
}

const CalendarHeader = (props: ICalendarHeaderProps) => {
  const { date } = props;
  const navigate = useNavigate();

  const onMonthChange = (changedDate: DateTime | null) => {
    if (changedDate) {
      navigate(`/calendar/${getYearMonthISOFromDate(changedDate)}`);
    }
  };

  return (
    <Box display={'flex'} alignItems={'center'} padding="8px 16px">
      <Box>
        <IconButton
          aria-label="Mês Anterior"
          component={Link}
          to={`/calendar/${getYearMonthISOFromDate(getPrevMonth(date))}`}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          aria-label="Próximo mês"
          component={Link}
          to={`/calendar/${getYearMonthISOFromDate(getNextMonth(date))}`}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
      <Box
        component={'h3'}
        display="flex"
        alignItems="center"
        marginLeft={'16px'}
        flex={1}
      >
        <DateCalendarMenu {...{ date, onMonthChange }} />
      </Box>
      <UserMenu />
    </Box>
  );
};

export default React.memo(CalendarHeader);
