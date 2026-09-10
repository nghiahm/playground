import type { Route } from "./+types/home";
import { DatePicker } from "~/components/date-picker";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <DatePicker />
    </div>
  );
}
