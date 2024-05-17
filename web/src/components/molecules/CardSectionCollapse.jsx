import CardSection from "../atoms/CardSection";

export default function CardSectionCollapse({ title, open, children }) {
  return (
    <CardSection>
      <details open={open} className="group">
        <summary className="card-title cursor-pointer flex">
          <span className="flex-grow">{title}</span>
          <span className="group-open:hidden">▼</span>
          <span className="hidden group-open:block">▲</span>
        </summary>
        {children}
      </details>
    </CardSection>
  );
}
