import logo from './logo.svg';
import './App.css';
import React,{useEffect,useRef,useState} from 'react'
import { Mario } from './mario/Mario';

function App() {


  let [jump,setJump] = useState(false)
  let [direction,setDirection] = useState(null)
  let [ground,setGround] = useState(null)
  let [falling,setFalling] = useState(false);

  let fallRef = useRef(null);
  let directionRef = useRef(null);

  let downRef = useRef(null);
  useEffect(() => {
    downRef.current = document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    let temp = document.querySelectorAll(".ground")
    let temp1=[]
    for(var i=0;i<temp.length;i++){
      temp1.push(temp[i].getBoundingClientRect())
    }
    setGround(temp)
    return () => {
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
        <Mario direction={direction} falling={falling} startFall={startFall} endFall={endFall} jumpEnd={jumpEnd} jump={jump} colliders={ground}></Mario>
        <div className="world ground"></div>
    </div>
  );
}

export default App;
