export default function Alert({ children, className }) {
  return <div className={"alert " + className}>{children}</div>;
}
