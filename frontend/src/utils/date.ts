import { DateTime, Settings } from 'luxon';

Settings.defaultLocale = 'pt-BR';

export const getDateTime = () => DateTime;

export const getToday = (): DateTime => {
  return DateTime.now();
};

export const getTodayISO = (): string => {
  return DateTime.now().toISO();
};

export const getYearMonthISO = (): string => {
  const now = DateTime.now();
  return now.toFormat('yyyy-MM');
};

export const getYearMonthISOFromDate = (date: DateTime): string => {
  return date.toFormat('yyyy-MM');
};

export const getFromYearMonthISO = (yearMonthISO: string): DateTime => {
  return DateTime.fromFormat(yearMonthISO, 'yyyy-MM');
};

export const getMonthYearFormatted = (date: DateTime): string => {
  return date.toLocaleString({ month: 'long', year: 'numeric' });
};

export const getNextMonth = (date: DateTime): DateTime => {
  return date.plus({ months: 1 });
};

export const getPrevMonth = (date: DateTime): DateTime => {
  return date.plus({ months: -1 });
};

export const getNextDay = (date: DateTime): DateTime => {
  return date.plus({ days: 1 });
};
