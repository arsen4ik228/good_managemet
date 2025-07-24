import { useEffect } from "react";

function A({ children }) {
  useEffect(() => {
    console.log("useEffect A ");
    return () => console.log("cleanUp A ");
  }, []);
  return children;
}

function B({ children }) {
  useEffect(() => {
    console.log("useEffect B ");
    return () => console.log("cleanUp B ");
  }, []);
  return children;
}

function C() {
  useEffect(() => {
    console.log("useEffect C ");
    return () => console.log("cleanUp C");
  }, []);
  return undefined;
}

export default function Effect() {
  return (
    <A>
      <B>
        <C></C>
      </B>
    </A>
  );
}
