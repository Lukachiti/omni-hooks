import {useState, useEffect} from 'react'

// iwyebs taimers
// acherebs taimers tu momxarebeli modzraobs
// tu taimeri tavis danishnul dros miaxwevs isIdle=true
// tu ara isIdle = false



export function useIdle(timeout = 0) {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let time;

    const resettt = () => {
      clearTimeout(time);
      setIdle(false);

      time = setTimeout(() => {
        setIdle(true);
      }, timeout);
    };

    resettt();

    const events = ["mousemove", "keydown", "scroll", "touchstart"];

    events.forEach((event) =>
      window.addEventListener(event, resettt)
    );

    return () => {
      clearTimeout(time);
      events.forEach((event) =>
        window.removeEventListener(event, resettt) 
      );
    };
  }, [timeout]);

  return idle;
}