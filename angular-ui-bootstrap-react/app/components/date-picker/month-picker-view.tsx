import { cn } from "~/lib/utils";

import type { CalendarViewProps } from "./date-picker-view";

export function MonthPickerView({
  month,
  selected,
  onMonthChange,
  onViewChange,
}: CalendarViewProps) {
  const months = Array.from(
    { length: 12 },
    (_, monthIndex) => new Date(month.getFullYear(), monthIndex, 1),
  );

  return (
    <div
      className="well well-sm uib-datepicker tw:inline-block"
      role="application"
    >
      <div className="uib-monthpicker" tabIndex={0}>
        <table role="grid" aria-label={`${month.getFullYear()} months`}>
          <thead>
            <tr>
              <th>
                <button
                  type="button"
                  className="btn btn-default btn-sm pull-left uib-left"
                  onClick={() =>
                    onMonthChange(
                      new Date(month.getFullYear() - 1, month.getMonth(), 1),
                    )
                  }
                  aria-label="Previous year"
                >
                  <i
                    className="glyphicon glyphicon-chevron-left"
                    aria-hidden="true"
                  />
                  <span className="sr-only">previous</span>
                </button>
              </th>
              <th colSpan={1}>
                <button
                  type="button"
                  className="btn btn-default btn-sm uib-title"
                  role="heading"
                  aria-live="assertive"
                  aria-atomic="true"
                  onClick={() => onViewChange("year")}
                >
                  <strong>{month.getFullYear()}</strong>
                </button>
              </th>
              <th>
                <button
                  type="button"
                  className="btn btn-default btn-sm pull-right uib-right"
                  onClick={() =>
                    onMonthChange(
                      new Date(month.getFullYear() + 1, month.getMonth(), 1),
                    )
                  }
                  aria-label="Next year"
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
              <tr className="uib-months" key={rowIndex} role="row">
                {months
                  .slice(rowIndex * 3, rowIndex * 3 + 3)
                  .map((monthDate) => {
                    const isSelected =
                      selected.getFullYear() === monthDate.getFullYear() &&
                      selected.getMonth() === monthDate.getMonth();
                    const isActive =
                      month.getFullYear() === monthDate.getFullYear() &&
                      month.getMonth() === monthDate.getMonth();
                    const today = new Date();
                    const isToday =
                      today.getFullYear() === monthDate.getFullYear() &&
                      today.getMonth() === monthDate.getMonth();

                    return (
                      <td
                        className="uib-month text-center"
                        key={monthDate.getMonth()}
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
                            onMonthChange(monthDate);
                            onViewChange("day");
                          }}
                        >
                          <span className={cn(isToday && "text-info")}>
                            {monthDate.toLocaleDateString("en-US", {
                              month: "long",
                            })}
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