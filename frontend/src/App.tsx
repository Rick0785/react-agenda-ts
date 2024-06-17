import { useGetCalendarsQuery } from './api/calendar';
import { useGetEventsQuery } from './api/event';
import Calendar from './pages/Calendar';

function App() {
  const { data: calendars } = useGetCalendarsQuery();
  const { data: events } = useGetEventsQuery();

  console.log({ calendars });
  console.log({ events });

  return <Calendar></Calendar>;
}

export default App;
