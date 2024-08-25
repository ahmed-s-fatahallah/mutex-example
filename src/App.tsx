import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Mutex } from "async-mutex";

function App() {
  const [count, setCount] = useState(0);
  const [timeOutCount, setTimeoutCount] = useState(0);
  const [fetchCount, setFetchCount] = useState(0);

  const mutexRef = useRef<Mutex>();

  const getValue = (): Promise<number | undefined> => {
    return new Promise((resolve) => {
      const value = localStorage.getItem("count");
      if (value) {
        setTimeout(() => {
          resolve(+value);
        }, 500);
      } else {
        resolve(undefined);
      }
    });
  };

  const setValue = (value: number) => {
    return new Promise((resolve) => {
      localStorage.setItem("count", `${value}`);

      setTimeout(() => {
        resolve(undefined);
      }, 500);
    });
  };

  const incrementAsync = async () => {
    let value = await getValue();
    await setValue(value ? ++value : 1);
    setTimeoutCount(value || 1);
  };

  const fetchCounter = async () => {
    const res = await fetch("http://localhost:3000");
    const data = await res.json();
    setFetchCount(data.count);
  };

  useEffect(() => {
    localStorage.setItem("count", `0`);
    const mutex = new Mutex();
    mutexRef.current = mutex;
  }, []);

  return (
    <>
      <div>
        <button
          onClick={async () => {
            setCount((prev) => ++prev);
            await incrementAsync();
            await fetchCounter();
          }}
        >
          increment timeOut
        </button>
        <div>async Count: {timeOutCount}</div>
        <div>Fetch Count {fetchCount}</div>
        <div>Count {count}</div>
      </div>
    </>
  );
}

export default App;
