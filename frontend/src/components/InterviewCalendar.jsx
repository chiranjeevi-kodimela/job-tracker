import { formatTime, toISODate } from "../utils/dates";
import { buildCalendarCells, getInterviewsForDay } from "../utils/interviews";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function InterviewCalendar({
  interviews,
  applications,
  month,
  onMonthChange,
  onDelete,
}) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const todayISO = toISODate();

  const monthName = month.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const changeMonth = (offset) =>
    onMonthChange(new Date(year, monthIndex + offset, 1));

  return (
    <section className="card" aria-label="Interview calendar">
      <div className="calendar-header">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => changeMonth(-1)}
        >
          Previous
        </button>

        <h2 className="card-title calendar-title">{monthName}</h2>

        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => changeMonth(1)}
        >
          Next
        </button>
      </div>

      <div className="calendar-scroll">
        <div className="calendar-grid calendar-weekdays">
          {WEEKDAYS.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {buildCalendarCells(year, monthIndex).map((day, index) => {
            if (day === null) return <div key={`empty-${index}`} />;

            const dayInterviews = getInterviewsForDay(
              interviews,
              year,
              monthIndex,
              day,
            );
            const dayISO = toISODate(new Date(year, monthIndex, day));

            return (
              <div
                key={day}
                data-testid={`day-${day}`}
                className={[
                  "calendar-day",
                  dayInterviews.length > 0 ? "has-events" : "",
                  dayISO === todayISO ? "today" : "",
                ].join(" ")}
              >
                <strong className="calendar-day-number">{day}</strong>

                {dayInterviews.map((interview) => {
                  const application = applications.find(
                    (item) =>
                      String(item.id) === String(interview.application_id),
                  );

                  return (
                    <div key={interview.id} className="calendar-event">
                      <div className="calendar-event-title">
                        {application?.job_title ||
                          interview.job_title ||
                          "Interview"}
                      </div>
                      <div>{interview.interview_type}</div>
                      <div>{formatTime(interview.interview_time)}</div>

                      {interview.meeting_link && (
                        <a
                          href={interview.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Meeting link
                        </a>
                      )}

                      <button
                        type="button"
                        className="link-danger"
                        onClick={() => onDelete(interview.id)}
                        aria-label={`Delete ${interview.interview_type} on ${day}`}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default InterviewCalendar;
