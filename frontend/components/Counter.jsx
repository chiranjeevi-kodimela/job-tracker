import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Application Count: {count}</h2>

      <button onClick={() => setCount(count + 1)}>Add Application</button>
    </div>
  );
}

export default Counter;
