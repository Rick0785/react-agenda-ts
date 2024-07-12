import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InsertInvitationOutlinedIcon from '@mui/icons-material/InsertInvitationOutlined';
import {
  getMonthYearFormatted,
  getNextMonth,
  getPrevMonth,
  getToday,
  getTodayFormatted,
  getYearMonthISOFromDate,
} from '../../utils/date';
import { Link, useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';
import { DateTime } from 'luxon';
import DateCalendarMenu from './DateCalendarMenu';
import { Tooltip } from '@mui/material';

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
        <Tooltip title={`Ir para hoje: ${getTodayFormatted()}`}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<InsertInvitationOutlinedIcon />}
            onClick={mouseEvent => {
              mouseEvent.preventDefault();
              onMonthChange(getToday());
            }}
          >
            Hoje
          </Button>
        </Tooltip>
        <Tooltip
          title={`Ir para hoje mês anterior: ${getMonthYearFormatted(
            getPrevMonth(date)
          )}`}
        >
          <IconButton
            aria-label="Mês Anterior"
            component={Link}
            to={`/calendar/${getYearMonthISOFromDate(getPrevMonth(date))}`}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={`Ir para hoje mês seguinte: ${getMonthYearFormatted(
            getNextMonth(date)
          )}`}
        >
          <IconButton
            aria-label="Próximo mês"
            component={Link}
            to={`/calendar/${getYearMonthISOFromDate(getNextMonth(date))}`}
          >
            <ChevronRightIcon />
          </IconButton>
        </Tooltip>
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
