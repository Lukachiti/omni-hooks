 import { useState, useRef } from "react";

export const useObject = (initObj) => {
  const [obj, setObj] = useState(initObj);
  const initRef = useRef(initObj);

  const setProp = (key, value) => {
    setObj((prev) => ({ ...prev, [key]: value }));
  };
  const setProps = (updates) => {
    setObj((prev) => ({ ...prev, ...updates }));
  };

  const deleteProp = (key) => {
    setObj((prev) => {
      const copy = { ...prev };
      delete [key];
      return copy;
    });
  };
  const reset = () => {
    setObj(initRef.current);
  };
  return { obj, setProp, setProps, deleteProp, reset };
};