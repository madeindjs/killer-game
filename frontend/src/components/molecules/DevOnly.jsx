import AlertWarning from "./AlertWarning";

export default function DevOnly(props) {
  const isDev = process.env.NODE_ENV;

  if (!isDev) return <></>;

  return (
    <AlertWarning>
      <p>DEV ONLY</p>
      {props.children}
    </AlertWarning>
  );
}
