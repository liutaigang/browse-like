import "./App.css";
import { useState } from "react";
import { useHandlers } from "./hooks/use-handlers";

function App() {
  const [url, setUrl] = useState<string>("");
  const handlers = useHandlers();

  const onOpenBroswer = (url: string) => {
    handlers.openBroswer({ url });
  };

  return (
    <>
      <div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={() => onOpenBroswer(url)}>打开网页</button>
      </div>
      <h1>Vite + React</h1>
    </>
  );
}

export default App;
