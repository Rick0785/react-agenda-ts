import { DateTime, Settings } from 'luxon';

Settings.defaultLocale = 'pt-BR';

export const getDateTime = () => DateTime;

export const getToday = (): DateTime => {
  return DateTime.now();
};

export const getTodayISO = (): string => {
  return DateTime.now().toISO();
};
