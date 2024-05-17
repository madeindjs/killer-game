export default function Details({ summary, content, open }) {
  return (
    <details className="group open:ring bg-base-200 rounded-md p-2" open={open}>
      <summary className=" group-open:font-semibold group-open:text-accent list-none cursor-pointer text-sm">
        {summary}
      </summary>
      <div className="mt-4">{content}</div>
    </details>
  );
}
