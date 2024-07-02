import React from 'react';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getMonthYearFormatted } from '../../utils/date';
import { DateCalendar } from '@mui/x-date-pickers';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DateTime } from 'luxon';
import { Tooltip } from '@mui/material';

interface IDateCalendarMenuProps {
  date: DateTime;
  onMonthChange: (changedDate: DateTime | null) => void;
}

const DateCalendarMenu = (props: IDateCalendarMenuProps) => {
  const { date, onMonthChange } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (changedDate: DateTime | null) => {
    setAnchorEl(null);
    onMonthChange(changedDate);
  };

  return (
    <React.Fragment>
      <Tooltip title="Ir para o intervalo de dada anterior ou posterior">
        <Box
          sx={{ cursor: 'pointer' }}
          display="flex"
          alignItems="center"
          onClick={handleClick}
        >
          {getMonthYearFormatted(date)}
          <ExpandMoreIcon />
        </Box>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose(null)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem>
          <DateCalendar
            defaultValue={date}
            views={['year', 'month']}
            openTo="month"
            onMonthChange={handleClose}
          />
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default DateCalendarMenu;
