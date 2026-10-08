import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div>
      <Navbar username="chiru" />

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
