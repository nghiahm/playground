import { createContext, type Dispatch, type SetStateAction } from "react";

export type DatePickerView = "day" | "month" | "year";

export interface CalendarViewProps {
  month: Date;
  selected: Date;
  onMonthChange: (month: Date) => void;
  onViewChange: (view: DatePickerView) => void;
}

export const DatePickerViewContext = createContext<{
  setView: Dispatch<SetStateAction<DatePickerView>>;
} | null>(null);