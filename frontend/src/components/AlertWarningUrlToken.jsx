import AlertWarning from "./AlertWarning";

export default function AlertWarningUrlToken({ children }) {
  return (
    <AlertWarning>
      Don&apos;t share this URL, it contains your private token and give access to your profile.
    </AlertWarning>
  );
}
