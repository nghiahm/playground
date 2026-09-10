import * as React from "react";

import { DayPickerView } from "./day-picker-view";
import { DatePickerViewContext, type DatePickerView } from "./date-picker-view";
import { MonthPickerView } from "./month-picker-view";
import { YearPickerView } from "./year-picker-view";

export function DatePicker() {
  const [month, setMonth] = React.useState(() => new Date());
  const [selected, setSelected] = React.useState<Date>(new Date());
  const [view, setView] = React.useState<DatePickerView>("day");

  if (view === "month") {
    return (
      <MonthPickerView
        month={month}
        selected={selected}
        onMonthChange={setMonth}
        onViewChange={setView}
      />
    );
  }

  if (view === "year") {
    return (
      <YearPickerView
        month={month}
        selected={selected}
        onMonthChange={setMonth}
        onViewChange={setView}
      />
    );
  }

  return (
    <DatePickerViewContext value={{ setView }}>
      <DayPickerView
        month={month}
        selected={selected}
        onMonthChange={setMonth}
        onSelect={(date) => {
          if (!date) return;

          setSelected(date);
          setMonth(date);
        }}
      />
    </DatePickerViewContext>
  );
}
