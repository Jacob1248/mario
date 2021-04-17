import logo from './logo.svg';
import './App.css';
import React,{useEffect,useRef,useState} from 'react'
import { Mario } from './mario/Mario';

function App() {


  let [jump,setJump] = useState(false)
  let [direction,setDirection] = useState(null)
  let [ground,setGround] = useState(null)
  let [falling,setFalling] = useState(true);

  let [delta,setDelta] = useState(0);

  let fallRef = useRef(null);
  let directionRef = useRef(null);
  let lastTick = useRef(0)

  let requestRef = useRef(null);

  let deltaRef = useRef(null)
  function tick(timestamp) {
      let delta = (timestamp - lastTick.current) / (1000 / 60);
      lastTick.current = timestamp
      requestRef.current = requestAnimationFrame(tick)
      setDelta(delta)
    }

  let downRef = useRef(null);
  useEffect(() => {
    requestAnimationFrame(tick)
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    let temp = document.querySelectorAll(".ground")
    let temp1=[]
    for(var i=0;i<temp.length;i++){
      temp1.push(temp[i].getBoundingClientRect())
    }
    console.log(temp1)
    setGround(temp1)
    return () => {
      document.removeEventListener("keydown",handleKeyDown);
      document.removeEventListener("keyup",handleKeyUp)
    }
  },[])

  const handleKeyDown = (e) =>{
    if (e.repeat) { return }
    switch(e.code){
      case "ArrowLeft":
      case "ArrowRight":{
        if(e.code!==directionRef.current){
          directionRef.current = e.code;
          setDirection(e.code);
        }
        break;
      }
      case "ArrowUp":{
        if(!jump && !fallRef.current){
          setJump(true);
        }
        break;
      }
    }
  }
  const handleKeyUp = (e) =>{
    if (e.repeat) { return }
    switch(e.code){
      case "ArrowLeft":
      case "ArrowRight":{
            directionRef.current =null; 
            setDirection(null)
      }
    }
  }

  const jumpEnd = () =>{
    setJump(false);
  }

  const startFall = () =>{
    fallRef.current = true;
    setFalling(true);
  }

  const endFall = () =>{
    fallRef.current = false;
    setFalling(false);
  }

  return (
    <div className="App">
        <Mario direction={direction} delta={delta} falling={falling} startFall={startFall} endFall={endFall} jumpEnd={jumpEnd} jump={jump} colliders={ground}></Mario>
        <div className="world ground"></div>
    </div>
  );
}

export default App;
