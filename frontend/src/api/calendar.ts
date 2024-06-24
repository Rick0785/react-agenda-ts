import api from './index';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export interface ICalendar {
  id: number;
  name: string;
  color: string;
  selected: boolean;
}

export const calendarsQueryKey: string = 'calendars';

export const getCalendars = (): Promise<ICalendar[]> =>
  api.get(`/${calendarsQueryKey}`).then(resp => resp.data);

export const useGetCalendarsQuery = (): UseQueryResult<ICalendar[], Error> => {
  return useQuery<ICalendar[], Error>({
    queryKey: [calendarsQueryKey],
    queryFn: getCalendars,
  });
};
