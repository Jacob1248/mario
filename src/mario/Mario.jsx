import React, { useEffect,useState,useRef } from 'react'
import "./Mario.css"


export const Mario = (props) =>{
    let mario = useRef();

    const [runState,setRunState] = useState(0);
    const [currentSprite,setCurrentSprite] = useState('mario')
    let requestRef = useRef(null);
    let directionRef = useRef(null);
    let jumpRef = useRef(null);
    const [top,setTop] = useState(-50);
    const [left,setLeft] = useState(-50);
    useEffect(() => {
        //tick()
      return () => {
      }
    },[])

    useEffect(() => {
        if(props.jump || props.falling)
            setGravity()
        if(props.direction){
            moveToDirection()
        }
      return () => {
        cancelAnimationFrame(directionRef.current);
        cancelAnimationFrame(requestRef.current);
      }
    },[props.delta])

    useEffect(() => {
      if(props.direction!==null){
          getMarioLook()
      }
      return () => {
      }
    },[props.direction])

    const moveToDirection = () =>{
        if(props.direction==="ArrowLeft"){
            if(props.jump){
                setLeft(left-(15*props.delta));

            }
            else{
                setLeft(left-(15*props.delta));

            }
        }
        else{
            if(props.jump){
                setLeft(left+(15*props.delta));

            }
            else{
                setLeft(left+(15*props.delta));

            }
        }
    }

    const getMarioLook = () =>{
        switch(props.direction){
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

    const setGravity = () =>{
        if(props.delta){
            if(mario.current!=null){
                if(props.colliders){
                    if(props.jump){
                        if(!props.falling){
                            setTop(top-(10*props.delta));
                        }
                        else{
                            setTop(top+(12*props.delta))
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
                    if(props.falling){
                        let marioRect = mario.current?mario.current.getBoundingClientRect():null;
                        for(var i=0;i<props.colliders.length;i++){
                            let temp = props.colliders[i]
                            console.log(temp)
                            if(temp.top <= marioRect.bottom){
                                if(!props.jump){
                                    setTop(temp.height-marioRect.height + 2)
                                    console.log("triggered!")
                                    props.endFall();
                                    props.jumpEnd()
                                }
                                return
                            }
                        }
                        setTop(top+(12*props.delta))
                    }
                }
            }
            else{
            }

        }
        //requestRef.current = requestAnimationFrame(setGravity);
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

    const returnTransformString = () =>{
        if(runState===0){
            return `translate(${left}%,${top}%)`
        }
        else{
            return `translate(${left}%,${top}%) scaleX(-1)`
        }
    }

    return (
        <div ref={mario} style={{backgroundImage:currentSprite,transform:returnTransformString()}} className={setCss()}>

        </div>
    )
}