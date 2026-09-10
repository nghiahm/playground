import * as React from "react";
import {
  DayPicker,
  DayButton,
  useDayPicker,
  type DayButtonProps,
  type MonthCaptionProps,
  type MonthProps,
  type WeekNumberProps,
  type WeekdayProps,
  type WeekdaysProps,
} from "@daypicker/react";

import { cn } from "~/lib/utils";

type DatePickerView = "day" | "month" | "year";

const DatePickerViewContext = React.createContext<{
  setView: React.Dispatch<React.SetStateAction<DatePickerView>>;
} | null>(null);

function CustomDayButton({
  modifiers,
  day,
  onClick,
  ...props
}: DayButtonProps) {
  return (
    <DayButton
      {...props}
      day={day}
      modifiers={modifiers}
      onClick={(event) => {
        const monthGrid =
          event.currentTarget.closest<HTMLElement>(".uib-daypicker");

        onClick?.(event);
        window.requestAnimationFrame(() => monthGrid?.focus());
      }}
      className={cn(
        props.className,
        "btn btn-default btn-sm",
        modifiers.selected && "btn-info active",
      )}
    >
      <span
        className={cn(
          modifiers.outside && "text-muted",
          modifiers.today && "text-info",
        )}
      >
        {String(day.date.getDate()).padStart(2, "0")}
      </span>
    </DayButton>
  );
}

function HiddenMonthCaption(_: MonthCaptionProps) {
  return <></>;
}

function CustomWeekdays(props: WeekdaysProps) {
  return <tr {...props} />;
}

function CustomMonth({ calendarMonth, children, ...props }: MonthProps) {
  const { components, dayPickerProps, goToMonth, nextMonth, previousMonth } =
    useDayPicker();
  const viewContext = React.useContext(DatePickerViewContext);
  const monthGrid = React.Children.toArray(children).find(
    (child) =>
      React.isValidElement(child) && child.type === components.MonthGrid,
  ) as
    | React.ReactElement<React.TableHTMLAttributes<HTMLTableElement>>
    | undefined;

  if (!monthGrid) {
    return <div {...props} />;
  }

  const gridChildren = React.Children.toArray(monthGrid.props.children);
  const weekdays = gridChildren.find(
    (child) =>
      React.isValidElement(child) && child.type === components.Weekdays,
  );
  const weeks = gridChildren.find(
    (child) => React.isValidElement(child) && child.type === components.Weeks,
  );

  return (
    <div {...props}>
      {React.cloneElement(
        monthGrid,
        { tabIndex: -1 },
        <thead>
          <tr>
            <th>
              <button
                type="button"
                className="btn btn-default btn-sm pull-left uib-left"
                onClick={() => previousMonth && goToMonth(previousMonth)}
                disabled={!previousMonth}
                aria-label="Previous month"
              >
                <i
                  className="glyphicon glyphicon-chevron-left"
                  aria-hidden="true"
                />
                <span className="sr-only">previous</span>
              </button>
            </th>
            <th colSpan={dayPickerProps.showWeekNumber ? 6 : 5}>
              <button
                type="button"
                className="btn btn-default btn-sm uib-title"
                role="heading"
                aria-live="assertive"
                aria-atomic="true"
                onClick={() => viewContext?.setView("month")}
              >
                <strong>
                  {calendarMonth.date.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </button>
            </th>
            <th>
              <button
                type="button"
                className="btn btn-default btn-sm pull-right uib-right"
                onClick={() => nextMonth && goToMonth(nextMonth)}
                disabled={!nextMonth}
                aria-label="Next month"
              >
                <i
                  className="glyphicon glyphicon-chevron-right"
                  aria-hidden="true"
                />
                <span className="sr-only">next</span>
              </button>
            </th>
          </tr>
          {weekdays}
        </thead>,
        weeks,
      )}
    </div>
  );
}

function CustomWeekNumber({ children, ...props }: WeekNumberProps) {
  return (
    <th {...props} className={cn("text-center h6", props.className)}>
      <em>{children}</em>
    </th>
  );
}

function CustomWeekday({ children, ...props }: WeekdayProps) {
  return (
    <th {...props} className={cn("text-center", props.className)}>
      <small>{children}</small>
    </th>
  );
}

interface MonthPickerProps {
  month: Date;
  selected: Date;
  onMonthChange: (month: Date) => void;
  onViewChange: (view: DatePickerView) => void;
}

function MonthPicker({
  month,
  selected,
  onMonthChange,
  onViewChange,
}: MonthPickerProps) {
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

interface YearPickerProps {
  month: Date;
  selected: Date;
  onMonthChange: (month: Date) => void;
  onViewChange: (view: DatePickerView) => void;
}

function YearPicker({
  month,
  selected,
  onMonthChange,
  onViewChange,
}: YearPickerProps) {
  const startYear = Math.floor((month.getFullYear() - 1) / 20) * 20 + 1;
  const years = Array.from({ length: 20 }, (_, yearIndex) => startYear + yearIndex);

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
                      <td className="uib-year text-center" key={year} role="gridcell">
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
                          <span className={cn(isToday && "text-info")}>{year}</span>
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

export function DatePickerDayView() {
  const [month, setMonth] = React.useState(() => new Date());
  const [selected, setSelected] = React.useState<Date>(new Date());
  const [view, setView] = React.useState<DatePickerView>("day");

  if (view === "month") {
    return (
      <MonthPicker
        month={month}
        selected={selected}
        onMonthChange={setMonth}
        onViewChange={setView}
      />
    );
  }

  if (view === "year") {
    return (
      <YearPicker
        month={month}
        selected={selected}
        onMonthChange={setMonth}
        onViewChange={setView}
      />
    );
  }

  return (
    <DatePickerViewContext value={{ setView }}>
      <DayPicker
        mode="single"
        showOutsideDays
        showWeekNumber
        hideNavigation
        fixedWeeks
        month={month}
        onMonthChange={setMonth}
        selected={selected}
        onSelect={(date) => {
          if (!date) return;

          setSelected(date);
          setMonth(date);
        }}
        classNames={{
          root: "well well-sm uib-datepicker tw:inline-block",
          month: "",
          months: "",
          day: "uib-day text-center",
          weekday: "text-center",
          month_grid: "uib-daypicker",
        }}
        components={{
          DayButton: CustomDayButton,
          Month: CustomMonth,
          MonthCaption: HiddenMonthCaption,
          Weekday: CustomWeekday,
          WeekNumber: CustomWeekNumber,
          Weekdays: CustomWeekdays,
        }}
        formatters={{
          formatWeekdayName: (date) =>
            date.toLocaleDateString("en-US", { weekday: "short" }),
        }}
      />
    </DatePickerViewContext>
  );
}
