import React, { useEffect,useState,useRef } from 'react'
import "./Mario.css"
import idle from "./idle.png";

import runState1 from "./left/runstate1.png";
import runState2 from "./left/runstate2.png";


export const Mario = (props) =>{
    let mario = useRef();

    const [runState,setRunState] = useState(0);

    const [falling,setFalling] = useState(true)

    const [runArray,setRunArray] = useState('mario run')
    const [idleURL,setIdleURL] = useState(idle)
    const runHandle = useRef(null);
    const [currentSprite,setCurrentSprite] = useState('mario')
    let requestRef = useRef(null);
    let directionRef = useRef(null);
    let jumpRef = useRef(null);
    const [top,setTop] = useState(50);
    const [left,setLeft] = useState(50);

    useEffect(() => {
      return () => {
      }
    },[])

    useEffect(() => {
      requestRef.current = requestAnimationFrame(setGravity)
      if(props.direction!==null){
            directionRef.current = requestAnimationFrame(moveToDirection)
      }
      else{
        cancelAnimationFrame(directionRef.current);
      }
      return () => {
        cancelAnimationFrame(requestRef.current);
        cancelAnimationFrame(directionRef.current);
      }
    })

    useEffect(() => {
      if(props.direction!==null){
            getMarioLook(props.direction)
      }
      return () => {
      }
    },[props.direction])

    const moveToDirection = () =>{
        console.log("showd")
        if(props.direction==="ArrowLeft"){
            if(props.jump){
                setLeft(left-1);

            }
            else{
                setLeft(left-0.5);

            }
        }
        else{
            if(props.jump){
                setLeft(left+1);

            }
            else{
                setLeft(left+0.5);

            }
        }
        requestRef.current = requestAnimationFrame(moveToDirection);
    }

    const getMarioLook = (direction) =>{
        switch(direction){
          case "ArrowLeft":{
            moveLeft();
            return;
          }
          case "ArrowRight":{
            moveRight();
            return;
          }
        }
    }

    const moveLeft = () =>{
        setCurrentSprite(' run');
        setRunState(0)
    }

    const moveRight = () =>{
        setCurrentSprite(' run right');
        setRunState(1)
    }

    const moveUp = () =>{

    }

    const moveDown = () =>{

    }

    const setGravity = () =>{
        let marioRect = mario.current?mario.current.getBoundingClientRect():null;
        if(marioRect!=null){
            if(props.colliders){
                if(props.jump){
                    if(!props.falling){
                        setTop(top-1.5);
                    }
                    else{
                        setTop(top+0.7)
                    }
                    if(!jumpRef.current){
                        jumpRef.current = setTimeout(()=>{
                            props.startFall();
                            props.jumpEnd();
                            clearTimeout(jumpRef.current)
                            jumpRef.current = null;
                        },400)
                    }
                    return

                }
                for(var i=0;i<props.colliders.length;i++){
                    let temp = props.colliders[i].getBoundingClientRect();
                    if(temp.top <= marioRect.bottom){
                        if(!props.jump){
                            props.endFall();
                            props.jumpEnd()
                        }
                        return
                    }
                }
                setTop(top+0.7)
            }
        }
        else{
        }
        requestRef.current = requestAnimationFrame(setGravity);
    }

    const setCss = () =>{
        var cssString = 'mario';
        if(props.jump){
            cssString += ' jump'
        }
        else{
            if(props.falling){
                cssString += ' fall'
            }
            else{
                if(props.direction){
                    cssString +=currentSprite;
                }
                
            }
        }
        if(runState===0){
            cssString +='';
        }
        else{
            cssString +=' right';
        }
        return cssString
    }

    return (
        <div ref={mario} style={{backgroundImage:currentSprite,top:`${top}%`,left:`${left}%`}} className={setCss()}>

        </div>
    )
}