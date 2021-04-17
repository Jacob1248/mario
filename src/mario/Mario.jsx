import React, { useEffect,useState,useRef } from 'react'
import "./Mario.css"

export const Mario = (props) =>{
    let mario = useRef();

    const [runState,setRunState] = useState(0);
    let requestRef = useRef(null);
    let directionRef = useRef(null);
    let jumpRef = useRef(null);
    const [top,setTop] = useState(-50);
    const [left,setLeft] = useState(-50);
  
    let deathSoundRef = useRef(null)
    useEffect(() => {
        setTop(-50)
        setLeft(-50)
      return () => {
      }
    },[])
    useEffect(() => {
        if(!props.dead){
            setGravity()
            if(props.direction){
                moveToDirection()
            }
        }
      return () => {
        cancelAnimationFrame(directionRef.current);
        cancelAnimationFrame(requestRef.current);
      }
    },[props.delta])

    useEffect(() => {
    if(!props.dead){

        if(props.direction!==null){
            getMarioLook()
        }
    }
      return () => {
      }
    },[props.direction])

    useEffect(() => {
    if(props.dead){
        setTop(top-100);
        deathSoundRef.current.play()
        setTimeout(()=>{
            setTop(-50);
            setLeft(-50);
          props.setAlive();
          props.startFall(true);
          props.jumpEnd();
        },3000)
    }
      return () => {
      }
    },[props.dead])

    const moveToDirection = () =>{
        let marioRect = mario.current?mario.current.getBoundingClientRect():{};
        if(props.direction==="ArrowLeft"){
            if(props.box.left> marioRect.left){
                return
            }
                setLeft(left-(15*props.delta));
        }
        else{
            if(props.box.right< marioRect.right){
                return
            }
                setLeft(left+(15*props.delta));
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
        setRunState(0)
    }

    const moveRight = () =>{
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
                    else if(props.falling){
                        let marioRect = mario.current?mario.current.getBoundingClientRect():null;
                        for(var i=0;i<props.colliders.length;i++){
                            let temp = props.colliders[i]
                            if(temp.top < marioRect.bottom && temp.left <= marioRect.left + (marioRect.width/2) && temp.right + (marioRect.width/2)> marioRect.right && marioRect.top < temp.top){
                                if(!props.jump){
                                    //setTop(temp.height-marioRect.height + 7)
                                    props.endFall();
                                    props.jumpEnd()
                                }
                                return
                            }
                        }
                        setTop(top+(12*props.delta))
                    }
                    else{
                        let marioRect = mario.current?mario.current.getBoundingClientRect():null;
                        var flag=0;
                        for(var i=0;i<props.colliders.length;i++){
                            let temp = props.colliders[i]
                            if(temp.top < marioRect.bottom && temp.left <= marioRect.left + (marioRect.width/2) && temp.right + (marioRect.width/2)> marioRect.right && marioRect.top < temp.top){
                                flag=1
                            }
                        }
                        if(flag===0){
                            props.startFall();
                        }

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
        if(props.dead){
            return 'mario dead'
        }
        if(props.jump){
            cssString += ' jump'
        }
        else{
            if(props.falling){
                cssString += ' fall'
            }
            else{
                if(props.direction){
                    cssString +=' run';
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
        <div id="mario" ref={mario} style={{transform:returnTransformString()}} className={setCss()}>
        <audio ref={deathSoundRef} src="http://soundfxcenter.com/video-games/super-mario-world/8d82b5_SMW_Mario_Death_Sound_Effect.mp3" style={{display:"none"}}>

        </audio>

        </div>
    )
}