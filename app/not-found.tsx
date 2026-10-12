import ConnectionError from "./connection-error";

export default function NotFound() {
  return <ConnectionError homeHref={`${process.env.PAGES_BASE_PATH ?? ""}/`} />;
}
