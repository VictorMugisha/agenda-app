import useAuthContext from "../../hooks/useAuthContext";
export default function HomePage() {
  const { removeToken } = useAuthContext();
  return (
    <div>
      <p>HomePage</p>
      <button className="btn btn-primary" onClick={() => removeToken()}>Logout</button>
    </div>
  );
}
