import { UseQueryResult, useQuery } from '@tanstack/react-query';
import api from './index';

export interface IEvent {
  id: number;
  date: string;
  time?: string;
  desc: string;
  calendarId: number;
}

const eventQueryKey: string = 'events';

const getEvents = (): Promise<IEvent[]> =>
  api.get(`/${eventQueryKey}`).then(resp => resp.data);

export const useGetEventsQuery = (): UseQueryResult<IEvent[], Error> => {
  return useQuery<IEvent[], Error>({
    queryKey: [eventQueryKey],
    queryFn: getEvents,
  });
};
