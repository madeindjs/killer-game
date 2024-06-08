export default function DateTime({ date }) {
  const dateFormatted = new Intl.DateTimeFormat(undefined, { dateStyle: "short", timeStyle: "short" }).format(
    new Date(date)
  );

  return <>{dateFormatted}</>;
}
