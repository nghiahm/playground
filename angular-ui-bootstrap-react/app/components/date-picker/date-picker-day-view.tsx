import * as React from "react";
import {
  DayPicker,
  DayButton,
  useDayPicker,
  type DayButtonProps,
  type MonthCaptionProps,
} from "@daypicker/react";

import { cn } from "~/lib/utils";

function CustomDayButton({ modifiers, day, ...props }: DayButtonProps) {
  return (
    <DayButton
      {...props}
      day={day}
      modifiers={modifiers}
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

function CustomMonthCaption({ calendarMonth, ...props }: MonthCaptionProps) {
  const { goToMonth, nextMonth, previousMonth } = useDayPicker();

  return (
    <div
      {...props}
      className={cn("tw:grid tw:grid-cols-8 tw:items-center", props.className)}
    >
      <button
        type="button"
        className="btn btn-default btn-sm uib-left"
        onClick={() => previousMonth && goToMonth(previousMonth)}
        disabled={!previousMonth}
        aria-label="Previous month"
      >
        <i className="glyphicon glyphicon-chevron-left" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="btn btn-default btn-sm uib-title tw:col-span-6"
        aria-live="assertive"
      >
        <strong>
          {calendarMonth.date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </strong>
      </button>
      <button
        type="button"
        className="btn btn-default btn-sm uib-right"
        onClick={() => nextMonth && goToMonth(nextMonth)}
        disabled={!nextMonth}
        aria-label="Next month"
      >
        <i className="glyphicon glyphicon-chevron-right" aria-hidden="true" />
      </button>
    </div>
  );
}

export function DatePickerDayView() {
  const [month, setMonth] = React.useState<Date>();
  const [selected, setSelected] = React.useState<Date>(new Date());

  return (
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
        root: "uib-datepicker tw:inline-block",
        day: "uib-day text-center",
        weekday: "text-center",
        month_grid: "uib-daypicker",
      }}
      components={{
        DayButton: CustomDayButton,
        MonthCaption: CustomMonthCaption,
      }}
      formatters={{
        formatWeekdayName: (date) =>
          date.toLocaleDateString("en-US", { weekday: "short" }),
      }}
    />
  );
}
