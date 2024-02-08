import React from 'react';
import { useOnDraw } from '../../hooks/useOnDraw';

const Canvas = ({
    width, 
    height, 
    pushMessage,
    channel,
    setCanvasCtx
    //p
  }) => {
    const {setCanvasRef, onMouseDown} = useOnDraw(
      pushMessage,
      channel,
      setCanvasCtx
      );
      
  return (
    <div>
        <canvas 
            width={width}
            height={height}
            style={canvasStyle}
            ref={setCanvasRef}
            onMouseDown={onMouseDown}
        />
    </div>
  )
}

export default Canvas

const canvasStyle={
    border: `1px solid black`,
    position: 'relative', 
    zIndex: 10
}