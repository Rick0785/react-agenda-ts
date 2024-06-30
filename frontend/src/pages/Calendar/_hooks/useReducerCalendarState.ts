import { getISOFromDate } from '../../../utils/date';
import { DateTime } from 'luxon';
import { IEdittingEvent, IEvent } from '../../../api/event';
import { ICalendar } from '../../../api/calendar';
import { useReducer } from 'react';

interface ICalendarState {
  calendars: ICalendar[];
  events: IEvent[];
  editingEvent: IEdittingEvent | null;
}

const initialCalendarState: ICalendarState = {
  calendars: [],
  events: [],
  editingEvent: null,
};

export type CalendarAction =
  | {
      type: 'load';
      payload: { events: IEvent[]; calendars: ICalendar[] };
    }
  | {
      type: 'newEvent';
      payload: DateTime;
    }
  | {
      type: 'editEvent';
      payload: IEvent;
    }
  | {
      type: 'closeDialog';
    }
  | {
      type: 'toggleCalendar';
      payload: ICalendar;
    }
  | {
      type: 'refreshEvents';
      payload: IEvent[];
    };

const reducer = (
  state: ICalendarState = initialCalendarState,
  action: CalendarAction
): ICalendarState => {
  switch (action.type) {
    case 'load': {
      return {
        ...state,
        events: action.payload.events,
        calendars: action.payload.calendars.map(calendar => {
          return { ...calendar, selected: true };
        }),
      };
    }
    case 'newEvent': {
      return {
        ...state,
        editingEvent: {
          date: getISOFromDate(action.payload),
          desc: '',
          calendarId:
            state.calendars.filter(calendar => calendar.selected).at(0)?.id ??
            state.calendars[0].id,
        },
      };
    }
    case 'editEvent': {
      return {
        ...state,
        editingEvent: action.payload,
      };
    }
    case 'refreshEvents': {
      return {
        ...state,
        events: action.payload,
      };
    }
    case 'closeDialog': {
      return {
        ...state,
        editingEvent: null,
      };
    }
    case 'toggleCalendar': {
      return {
        ...state,
        calendars: state.calendars.map(prevCalendar =>
          prevCalendar.id === action.payload.id
            ? { ...prevCalendar, selected: !prevCalendar.selected }
            : prevCalendar
        ),
      };
    }
    default: {
      return state;
    }
  }
};

const useReducerCalendarState = (): [
  ICalendarState,
  React.Dispatch<CalendarAction>
] => useReducer(reducer, initialCalendarState);

export default useReducerCalendarState;
