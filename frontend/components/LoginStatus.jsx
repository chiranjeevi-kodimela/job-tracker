import { useState } from "react";

function LoginStatus() {
  const [isLoggedIn, setisLoggedIn] = useState(false);

  return (
    <div>
      <h2>Account Status</h2>

      {isLoggedIn ? <p>Welcome back, chiru!</p> : <p>Please log in.</p>}

      <button onClick={() => setisLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? "Logout" : "Login"}
      </button>
    </div>
  );
}

export default LoginStatus;
