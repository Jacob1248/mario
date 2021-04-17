import logo from './logo.svg';
import './App.css';
import React,{useEffect,useRef,useState} from 'react'
import { Mario } from './mario/Mario';
import { Coin } from './coin/Coin';

function App() {


  let [jump,setJump] = useState(false)
  let [direction,setDirection] = useState(null)
  let [ground,setGround] = useState(null)
  let [falling,setFalling] = useState(true);

  let [delta,setDelta] = useState(0);
  let [windowDim,setWindowDim] = useState(null);
  let fallRef = useRef(null);
  let directionRef = useRef(null);
  let lastTick = useRef(0)


  const [collectedCoins,setCollectedCoins] = useState({});
  let [dead,setDead] = useState(false);

  let requestRef = useRef(null);

  let jumpSoundRef = useRef(null);
  let coinSoundRef = useRef(null);

  let deathRef = useRef(null);
  let marioRef = useRef(null);

  function tick(timestamp) {
      let delta = (timestamp - lastTick.current) / (1000 / 60);
      lastTick.current = timestamp
      requestRef.current = requestAnimationFrame(tick)
      if(falling){
        checkDeath()
      }
      setDelta(delta)
  }

  const checkDeath = () =>{
      if(marioRef.current && deathRef.current){
        let temp = marioRef.current.getBoundingClientRect();
        let temp1 = deathRef.current.getBoundingClientRect();
        if(temp1.top < temp.top){
          setDead(true);
        }

      }
  }

  const setAlive = () =>{
    setCollectedCoins({})
    setDead(false);
  }

  let appRef = useRef(null);
  let downRef = useRef(null);
  useEffect(() => {
    marioRef.current = document.getElementById('mario');
    requestAnimationFrame(tick)
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    calculateGround()
    document.addEventListener("resize",calculateGround)
    setWindowDim(appRef.current.getBoundingClientRect())
    return () => {
      document.removeEventListener("keydown",handleKeyDown);
      document.removeEventListener("keyup",handleKeyUp)
    }
  },[])


  const calculateGround = () =>{
    let temp = document.querySelectorAll(".grass")
    let temp1=[]
    for(var i=0;i<temp.length;i++){
      temp1.push(temp[i].getBoundingClientRect())
    }
    setGround(temp1)

  }

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
          console.log(jumpSoundRef.current)
          jumpSoundRef.current.currentTime = 0;
          jumpSoundRef.current.play()
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

  const setCoinNumber = (num) =>{
    let temp = {...collectedCoins};
    temp[`${num}`] = true;
    coinSoundRef.current.currentTime = 0;
    coinSoundRef.current.play();
    setCollectedCoins(temp)
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
    <div ref={appRef} className="App">
        <Mario setAlive={setAlive} box={windowDim} dead={dead} direction={direction} delta={delta} falling={falling} startFall={startFall} endFall={endFall} jumpEnd={jumpEnd} jump={jump} colliders={ground}></Mario>
        <div className="world1 ground"></div>
        <div className="world2 ground"></div>
        <div className="world3 ground"></div>
        <div className="grass grass1"></div>
        <div className="grass grass2"></div>
        <div className="grass grass3"></div>
        {
          !collectedCoins['1']&&
          <div className="firstcoin">
            <Coin number={1} setCoinNumber={setCoinNumber} delta={delta} direction={direction} jump={jump} falling={falling}></Coin>
          </div>
        }
        {
          !collectedCoins['2']&&
          <div className="secondcoin">
            <Coin number={2} setCoinNumber={setCoinNumber} delta={delta} direction={direction} jump={jump} falling={falling}></Coin>
          </div>
        }
        {
          !collectedCoins['3']&&
          <div className="thirdcoin">
            <Coin number={3} setCoinNumber={setCoinNumber} delta={delta} direction={direction} jump={jump} falling={falling}></Coin>
          </div>
        }
        <audio ref={coinSoundRef} src="https://www.myinstants.com/media/sounds/mario-coin-sound-effect.mp3" style={{display:"none"}}>
        </audio>
        <audio style={{display:"none"}}  src="http://soundfxcenter.com/video-games/super-mario-world/8d82b5_SMW_Spring_Jump_Sound_Effect.mp3"  ref={jumpSoundRef}  controls>
        </audio>
        <div ref={deathRef} className="death-trigger"></div>
    </div>
  );
}

export default App;
