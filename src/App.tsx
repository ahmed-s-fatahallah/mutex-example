import { Mutex } from "async-mutex";
import { useEffect, useRef, useState } from "react";
import "./App.css";

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

  const postCounter = async (counter: number) => {
    const res = await fetch("http://localhost:3000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ counter }),
    });
    const data = await res.json();
    return data.counter;
  };

  const fetchCounter = async () => {
    const res = await fetch("http://localhost:3000");
    const data = await res.json();
    return data.counter;
  };

  const fetchIncrementCounter = async () => {
    let counter = await fetchCounter();
    const newCounter = await postCounter(++counter);
    setFetchCount(newCounter);
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
            await fetchIncrementCounter();
          }}
        >
          increment timeOut
        </button>
        <div>TimeOut Count: {timeOutCount}</div>
        <div>Fetch Count {fetchCount}</div>
        <div>Count {count}</div>
      </div>
    </>
  );
}

export default App;
