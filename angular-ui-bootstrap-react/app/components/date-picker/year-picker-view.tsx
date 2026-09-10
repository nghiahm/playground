import { cn } from "~/lib/utils";

import type { CalendarViewProps } from "./date-picker-view";

export function YearPickerView({
  month,
  selected,
  onMonthChange,
  onViewChange,
}: CalendarViewProps) {
  const startYear = Math.floor((month.getFullYear() - 1) / 20) * 20 + 1;
  const years = Array.from(
    { length: 20 },
    (_, yearIndex) => startYear + yearIndex,
  );

  return (
    <div
      className="well well-sm uib-datepicker tw:inline-block"
      role="application"
    >
      <div className="uib-yearpicker" tabIndex={0}>
        <table role="grid" aria-label={`${startYear} to ${startYear + 19} years`}>
          <thead>
            <tr>
              <th>
                <button
                  type="button"
                  className="btn btn-default btn-sm pull-left uib-left"
                  onClick={() =>
                    onMonthChange(
                      new Date(month.getFullYear() - 20, month.getMonth(), 1),
                    )
                  }
                  aria-label="Previous years"
                >
                  <i
                    className="glyphicon glyphicon-chevron-left"
                    aria-hidden="true"
                  />
                  <span className="sr-only">previous</span>
                </button>
              </th>
              <th colSpan={3}>
                <button
                  type="button"
                  className="btn btn-default btn-sm uib-title"
                  role="heading"
                  aria-live="assertive"
                  aria-atomic="true"
                  disabled
                >
                  <strong>
                    {startYear} - {startYear + 19}
                  </strong>
                </button>
              </th>
              <th>
                <button
                  type="button"
                  className="btn btn-default btn-sm pull-right uib-right"
                  onClick={() =>
                    onMonthChange(
                      new Date(month.getFullYear() + 20, month.getMonth(), 1),
                    )
                  }
                  aria-label="Next years"
                >
                  <i
                    className="glyphicon glyphicon-chevron-right"
                    aria-hidden="true"
                  />
                  <span className="sr-only">next</span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }, (_, rowIndex) => (
              <tr className="uib-years" key={rowIndex} role="row">
                {years
                  .slice(rowIndex * 5, rowIndex * 5 + 5)
                  .map((year) => {
                    const isSelected = selected.getFullYear() === year;
                    const isActive = month.getFullYear() === year;
                    const isToday = new Date().getFullYear() === year;

                    return (
                      <td
                        className="uib-year text-center"
                        key={year}
                        role="gridcell"
                      >
                        <button
                          type="button"
                          className={cn(
                            "btn btn-default",
                            isSelected && "btn-info",
                            isActive && "active",
                          )}
                          onClick={() => {
                            onMonthChange(new Date(year, month.getMonth(), 1));
                            onViewChange("month");
                          }}
                        >
                          <span className={cn(isToday && "text-info")}>
                            {year}
                          </span>
                        </button>
                      </td>
                    );
                  })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}