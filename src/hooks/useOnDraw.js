import { useEffect, useRef } from "react";
import { onDraw } from "../utils";

export function useOnDraw(
    pushMessage,
    channel,
    setCanvasCtx
    ){
    const canvasRef = useRef(null);
    const prevPointRef = useRef()
    const isDrawingRef = useRef(false);

    const mouseMoveListenerRef = useRef(null);
    const mouseUpListenerRef = useRef(null);

    useEffect(()=>{
        const ctx = canvasRef.current.getContext('2d');
        setCanvasCtx(ctx);
        function computePointInCanvas(clientX, clientY){
            if(canvasRef.current){
                const boundingRect = canvasRef.current.getBoundingClientRect();
                return {
                    x: clientX - boundingRect.left,
                    y: clientY - boundingRect.top
                }
            }else{
                return null;
            }
        }
        function initMouseMoveListener(){
            const mouseMoveListener = (e) => {
                if(isDrawingRef.current){
                    const point = computePointInCanvas(e.clientX, e.clientY);
                    let prevPoint = prevPointRef.current;
                    if(onDraw) onDraw({ctx, point, prevPoint});
                    pushMessage(JSON.stringify({ctx, point, prevPoint}), channel);
                    prevPointRef.current = point;
                }
            }
            mouseMoveListenerRef.current = mouseMoveListener;
            window.addEventListener("mousemove", mouseMoveListener);
        }
        function initMouseUpListener(){
            const mouseUpListener=()=>{
                isDrawingRef.current = false;
                prevPointRef.current = null;
            }
            mouseUpListenerRef.current = mouseUpListener;
            window.addEventListener('mouseup', mouseUpListener);
        }
        function removeMouseEventListeners(){
            if(mouseMoveListenerRef.current){
                window.removeEventListener('mousemove', mouseMoveListenerRef.current);
            }
            if(mouseUpListenerRef.current){
                window.removeEventListener('mouseup', mouseUpListenerRef.current);
            }
        }
        
        initMouseMoveListener();
        initMouseUpListener();
        return ()=>{
            removeMouseEventListeners();
        }
    },[
        onDraw, 
        channel
    ])

    function setCanvasRef(ref){
        if(!ref) return;
        canvasRef.current = ref;
    }
    
    function onMouseDown(){
        if(!canvasRef.current) return;
        isDrawingRef.current = true;
    }
    
    return {
        setCanvasRef,
        onMouseDown
    };
}