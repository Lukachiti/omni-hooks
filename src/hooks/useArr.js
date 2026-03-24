import {useState} from 'react'

const useArray = (initialValue = []) => {
  const [array, setArray] = useState(initialValue)

  const set = (newArr) => {
    setArray(newArr)
  }
  const reset = () => {
    setArray(initialValue)
  }



  const push = (item) => {
    setArray(prev => [...prev, item])
  }
  const unshift = (item) => {
    setArray(prev => [item, ...prev])
  }



  const remove = (index) => {
    setArray(prev => prev.filter((_, i) => i !== index))
  }
  const removeByCondition = (condition) => {
    setArray(prev => prev.filter(item => !condition(item)))
  }



  const update = (index, newItem) => {
    setArray(prev => prev.map((item, i) => (
        i === index ? newItem : item
    )))
  }
  const updateByCondition = (condition, newItem) => {
    setArray(prev => prev.map((item) => condition(item) ? newItem : item))
  }



  const clear = () => {
    setArray([])
  }

  const filter = (callback) => {
    setArray(prev => prev.filter(callback))
  } 

  return[array, set, reset, push, unshift, remove, removeByCondition, update, updateByCondition, clear, filter]
}
export default useArray