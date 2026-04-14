import { useRef, useState, useEffect, useCallback } from 'react';

const useArray = <T>(initial: T[] = []) => {
  const [array, setArray] = useState<T[]>(initial);
  const initRef = useRef<T[]>(initial);

  const set = useCallback((newArr: T[] = []) => {
    if (!Array.isArray(newArr)) return;
    setArray(newArr);
  }, []);

  const reset = useCallback(() => {
    setArray(initRef.current);
  }, []);

  const push = useCallback((items: T | T[]) => {
    const toAdd = Array.isArray(items) ? items : [items];
    setArray((prev) => [...prev, ...toAdd]);
  }, []);

  const unshift = useCallback((items: T | T[]) => {
    const toAdd = Array.isArray(items) ? items : [items];
    setArray((prev) => [...toAdd, ...prev]);
  }, []);

  const pop = useCallback(() => {
    setArray((prev) => prev.slice(0, -1));
  }, []);

  const shift = useCallback(() => {
    setArray((prev) => prev.slice(1));
  }, []);

  const remove = useCallback((index: number) => {
    setArray((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const removeByCondition = useCallback((condition: (item: T) => boolean) => {
    setArray((prev) => prev.filter((item) => !condition(item)));
  }, []);

  const update = useCallback((index: number, newItem: T) => {
    setArray((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      return prev.map((item, i) => (i === index ? newItem : item));
    });
  }, []);

  const updateByCondition = useCallback((condition: (item: T) => boolean, newItem: T) => {
    setArray((prev) => prev.map((item) => (condition(item) ? newItem : item)));
  }, []);

  const clear = useCallback(() => {
    setArray([]);
  }, []);

  const filter = useCallback((callback: (item: T, index: number, array: T[]) => boolean) => {
    setArray((prev) => prev.filter(callback));
  }, []);

  const map = useCallback((callback: (item: T, index: number, array: T[]) => T) => {
    setArray((prev) => prev.map(callback));
  }, []);

  const insert = useCallback((index: number, item: T) => {
    setArray((prev) => [
      ...prev.slice(0, index),
      item,
      ...prev.slice(index),
    ]);
  }, []);

  const sort = useCallback((callback: (a: T, b: T) => number) => {
    setArray((prev) => [...prev].sort(callback));
  }, []);

  const reverse = useCallback(() => {
    setArray((prev) => [...prev].reverse());
  }, []);

  useEffect(() => {
    if (Array.isArray(initial)) {
      initRef.current = initial;
    } else {
      initRef.current = [];
    }
  }, [initial]);

  return {
    array,
    set,
    reset,
    push,
    unshift,
    remove,
    removeByCondition,
    update,
    updateByCondition,
    clear,
    filter,
    map,
    insert,
    sort,
    reverse,
    pop,
    shift,
  };
};

export default useArray;