import {useState,useEffect} from 'react'
import React from 'react'

const useFetch = (url)=> {
    const [data,setData] = useState(null);
    const [loading,setLoding] = useState(true);
    const [error,setError] = useState(null);

    useEffect(()=>{
        if(!url) return;
        const fetchData = async ()=> {
            try{
                setLoding(true);
                setError(null);
                const res = await fetch(url);

                if(!res.ok){
                    throw new Error("error");
                }

                const result = await res.json();
                setData(result);

            }catch(error){
                setError(error.message);
            }finally{
                setLoding(false)
            }
        }
        if(url){
            fetchData()
        }
    },[url])

    return {data,loading,error}

}

export default useFetch