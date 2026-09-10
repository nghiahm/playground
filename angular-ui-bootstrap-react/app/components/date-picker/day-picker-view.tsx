import * as React from "react";
import {
  DayButton,
  DayPicker,
  useDayPicker,
  type DayButtonProps,
  type MonthCaptionProps,
  type MonthProps,
  type WeekNumberProps,
  type WeekdayProps,
  type WeekdaysProps,
} from "@daypicker/react";

import { cn } from "~/lib/utils";

import { DatePickerViewContext } from "./date-picker-view";

interface DayPickerViewProps {
  month: Date;
  selected: Date;
  onMonthChange: (month: Date) => void;
  onSelect: (date: Date | undefined) => void;
}

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

export function DayPickerView({
  month,
  selected,
  onMonthChange,
  onSelect,
}: DayPickerViewProps) {
  return (
    <DayPicker
      mode="single"
      showOutsideDays
      showWeekNumber
      hideNavigation
      fixedWeeks
      month={month}
      onMonthChange={onMonthChange}
      selected={selected}
      onSelect={onSelect}
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
  );
}