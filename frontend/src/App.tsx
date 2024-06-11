import { useGetCalendarsQuery } from './api/calendar';
import { useGetEventsQuery } from './api/event';

function App() {
  const { data: calendars } = useGetCalendarsQuery();
  const { data: events } = useGetEventsQuery();

  console.log({ calendars });
  console.log({ events });

  return <div>Olá</div>;
}

export default App;
