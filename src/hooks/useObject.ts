import { useState, useRef, useEffect } from "react";

const useObject = <T extends Record<string, any>>(initialValue: T) => {
  const [obj, setObj] = useState<T>(initialValue);
  const initialRef = useRef<T>(initialValue);

  useEffect(() => {
    initialRef.current = initialValue;
  }, [initialValue]);

  const set = (newObj: T) => {
    if (typeof newObj !== "object" || newObj === null) return;
    setObj(newObj);
  };

  const addProp = (key: keyof T | string, value: any) => {
    setObj((prev: T) => ({ ...prev, [key]: value }) as T);
  };

  const merge = (updates: Partial<T>) => {
    if (typeof updates !== "object" || updates === null) return;
    setObj((prev: T) => ({ ...prev, ...updates }));
  };

  const remove = (key: keyof T | string) => {
    setObj((prev: T) => {
      const { [key as keyof T]: _, ...rest } = prev;
      return rest as T;
    });
  };

  const reset = () => {
    setObj(initialRef.current);
  };

  return { obj, set, addProp, merge, remove, reset };
};

export default useObject;