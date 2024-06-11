import api from './index';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export interface ICalendar {
  id: number;
  name: string;
  color: string;
}

const calendarsQueryKey: string = 'calendars';

const getCalendars = (): Promise<ICalendar[]> =>
  api.get(`/${calendarsQueryKey}`).then(resp => resp.data);

export const useGetCalendarsQuery = (): UseQueryResult<ICalendar[], Error> => {
  return useQuery<ICalendar[], Error>({
    queryKey: [calendarsQueryKey],
    queryFn: getCalendars,
  });
};
