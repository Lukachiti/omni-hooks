import { useRef, useState, useEffect } from 'react'

const useArray = (initial = []) => {
  const [array, setArray] = useState(initial)
  const initRef = useRef(initial)

  const set = (newArr = []) => {
    if(!Array.isArray(newArr)) return;
    setArray(newArr)
  }
  const reset = () => {
    setArray(initRef.current)
  }

  const push = (items) => {
    if (!Array.isArray(items)) return;
    setArray(prev => [...prev, ...items])
  }
  const unshift = (items) => {
    if (!Array.isArray(items)) return;
    setArray(prev => [...items, ...prev])
  }

  const pop = () => {
    setArray(prev => prev.slice(0, -1))
  }
  const shift = () => {
    setArray(prev => prev.slice(1))
  }

  const remove = (index) => {
    if(typeof index !== 'number') return
    setArray(prev => prev.filter((_, i) => i !== index))
  }
  const removeByCondition = (condition) => {
    if (typeof condition !== 'function') return
    setArray(prev => prev.filter(item => !condition(item)))
  }

  const update = (index, newItem) => {
    if(typeof index !== 'number') return
    setArray(prev => {
      if(index < 0 || index >= prev.length) return prev
      return prev.map((item, i) => (
        i === index ? newItem : item
      ))
    })
  }
  const updateByCondition = (condition, newItem) => {
    if(typeof condition !== 'function') return
    setArray(prev => prev.map((item) => condition(item) ? newItem : item))
  }

  const clear = () => {
    setArray([])
  }

  const filter = (callback) => {
    if(typeof callback !== 'function') return
    setArray(prev => prev.filter(callback))
  } 
  const map = (callback) => {
    if (typeof callback !== 'function') return;
    setArray(prev => prev.map(callback));
  };

  const insert = (index, item) => {
    if(typeof index !== 'number') return
    setArray(prev => [
      ...prev.slice(0, index),
      item,
      ...prev.slice(index)
    ]);
  }

  const sort = (callback) => {
    if(typeof callback !== 'function') return
    setArray(prev => [...prev].sort(callback))
  }
  const reverse = () => {
    setArray(prev => [...prev].reverse())
  }

  useEffect(() => {
    if(Array.isArray(initial)){
      initRef.current = initial
    }else{
      console.error(`initial value must be an array ==> ${initial}`)
      initRef.current = []
    }
  }, [initial])

  return{ array, set, reset, push, unshift, remove, removeByCondition, update, updateByCondition, clear, filter, map, insert, sort, reverse, pop, shift }
}
export default useArray