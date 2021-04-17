import React, { useRef,useEffect, useState } from 'react'
import gsap from 'gsap/all'

export const Coin = (props) =>{

    let g = gsap.timeline({repeat:-1});
    let coinRef = useRef(null);
    
    let marioRef = useRef(null)
    let [coinRect,setCoinRect] = useState(null)

    useEffect(() => {
        marioRef.current = document.getElementById("mario");
        setCoinRect(coinRef.current.getBoundingClientRect());
      g
      .clear()
      .to(coinRef.current,{duration:0.5,transform:"translateY(-20%)"})
      .to(coinRef.current,{duration:0.5,transform:"translateY(0%)"})
      return () => {
          g.kill()
      }
    },[])

    useEffect(() => {
        if(marioRef.current){
            if(props.direction || props.jump || props.falling){	
                if(coinRect){
                    const rect1 = marioRef.current.getBoundingClientRect()?marioRef.current.getBoundingClientRect():{};
                    const rect2 = coinRect;
                    console.log(rect2)
                    const isInHoriztonalBounds =
                      rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
                    const isInVerticalBounds =
                      rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
                    const isOverlapping = isInHoriztonalBounds && isInVerticalBounds;
                    
                    if(isOverlapping){
                        props.setCoinNumber(props.number)
                    }

                }
            }
        }
      return () => {
      }
    },[props.delta])

    return(
        <div ref={coinRef} className="coin"></div>
    )
}