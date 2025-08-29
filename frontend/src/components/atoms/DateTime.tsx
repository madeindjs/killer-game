export default function DateTime(props: { date: string | Date | number }) {
  const dateFormatted = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(props.date));

  return <>{dateFormatted}</>;
}
