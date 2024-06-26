import { UseQueryResult, useQuery } from '@tanstack/react-query';
import api from './index';

export interface IEdittingEvent {
  id?: number;
  date: string;
  time?: string;
  desc: string;
  calendarId: number;
}

export interface IEvent extends IEdittingEvent {
  id: number;
}

export const eventQueryKey = (from: string, to: string) => [
  'events',
  { from: `${from}`, to: `${to}` },
];

export const getEvents = (from: string, to: string): Promise<IEvent[]> =>
  api
    .get(`/events?date_gte=${from}&date_lte=${to}&_sort=date,time`)
    .then(resp => resp.data);

export const useGetEventsQuery = (
  from: string,
  to: string
): UseQueryResult<IEvent[], Error> => {
  return useQuery<IEvent[], Error>({
    queryKey: eventQueryKey(from, to),
    queryFn: () => getEvents(from, to),
    enabled: !!from && !!to,
  });
};

export const postEvent = (event: IEdittingEvent): Promise<IEvent[]> =>
  api.post(`/events`, event).then(resp => resp.data);

export const putEvent = (event: IEdittingEvent): Promise<IEvent[]> =>
  api.put(`/events/${event.id}`, event).then(resp => resp.data);

export const deleteEvent = (event: IEdittingEvent): Promise<void> =>
  api.delete(`/events/${event.id}`).then(resp => resp.data);
