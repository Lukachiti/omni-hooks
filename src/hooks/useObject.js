 import { useState, useRef, useEffect } from "react";

const useObject1 = (initial = {}) => {
      const [obj, setObj] = useState(initial);
      const initRef = useRef(initial);

      const set = (newObj) => {
        if(typeof newObj !== 'object' || newObj === null) return;
        setObj(newObj)
      }

      const addProp = (key, value) => {
        if (key == null) return;
        setObj((prev) => ({ ...prev, [key]: value }));
      };
    
      const merge = (updates) => {
        if (typeof updates !== "object" || updates === null) return;
        setObj((prev) => ({ ...prev, ...updates }));
      };
    
      const remove = (key) => {
        if (key == null) return;
        setObj((prev) => {
          const newObj = { ...prev };
          delete newObj[key];
          return newObj;
        });
      };
    
      const reset = () => {
        setObj(initRef.current);
      };

      useEffect(() => {
        initRef.current = initial
      }, [initial])
      
      return { obj, set, addProp, merge, remove, reset };
}

export default useObject1