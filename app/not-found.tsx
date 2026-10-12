import LostSignal from "./lost-signal";

export default function NotFound() {
  return <LostSignal homeHref={`${process.env.PAGES_BASE_PATH ?? ""}/`} />;
}
