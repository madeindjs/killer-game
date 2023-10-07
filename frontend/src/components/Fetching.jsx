import AlertError from "./AlertError";
import Loader from "./Loader";

export default function Fetching({ loading, error, loader = <Loader />, children }) {
  if (error) return <AlertError>Error: {error}</AlertError>;
  if (loading) return loader;
  return children;
}
