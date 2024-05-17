import Loader from "../atoms/Loader";
import AlertError from "./AlertError";

export default function Fetching({ loading, error, loader = <Loader />, children }) {
  if (error) return <AlertError>Error: {error.toString()}</AlertError>;
  if (loading) return loader;
  return children;
}
