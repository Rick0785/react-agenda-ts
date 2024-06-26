import { DateTime, Settings } from 'luxon';

Settings.defaultLocale = 'pt-BR';

export const DAYS_OF_WEEK = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

export const getDateTime = () => DateTime;

export const getToday = (): DateTime => {
  return DateTime.now();
};

export const getTodayISO = (): string => {
  return DateTime.now().toFormat('yyyy-MM-dd');
};

export const getISOFromDate = (date: DateTime): string => {
  return date.toFormat('yyyy-MM-dd');
};

export const getYearMonthISO = (): string => {
  return DateTime.now().toFormat('yyyy-MM');
};

export const getYearMonthISOFromDate = (date: DateTime): string => {
  return date.toFormat('yyyy-MM');
};

export const getFromYearMonthISO = (yearMonthISO: string): DateTime => {
  return DateTime.fromFormat(yearMonthISO, 'yyyy-MM');
};

const upperFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getMonthYearFormatted = (date: DateTime): string => {
  return upperFirstLetter(
    date.toLocaleString({ month: 'long', year: 'numeric' })
  );
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
