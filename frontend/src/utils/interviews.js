import { toISODate } from "./dates";

export const getUpcomingInterviews = (interviews, today = toISODate()) =>
  interviews
    .filter((interview) => String(interview.interview_date).slice(0, 10) >= today)
    .sort((a, b) => {
      const dateA = `${String(a.interview_date).slice(0, 10)} ${a.interview_time || ""}`;
      const dateB = `${String(b.interview_date).slice(0, 10)} ${b.interview_time || ""}`;
      return dateA.localeCompare(dateB);
    });

// Leading `null`s pad the grid so day 1 falls under the right weekday column.
export const buildCalendarCells = (year, month) => {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
};

export const getInterviewsForDay = (interviews, year, month, day) => {
  const date = [
    year,
    String(month + 1).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-");

  return interviews.filter(
    (interview) => String(interview.interview_date).slice(0, 10) === date,
  );
};
