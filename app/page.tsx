import { logout } from "./auth/actions";

export default function Home() {
  return (
    <div>
      <form action={logout} id="logout-form">
        <button>Logout</button>
      </form>
    </div>
  );
}
