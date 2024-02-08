import React, { useState } from 'react'
import { useStore } from '../../store';
import Canvas from '../Canvas';

const DrawingBoard = ({
    messages,
    pushMessage,
    channel,
    setCanvasCtx,
    loading
}) => {
    const [point, setPoint] = useState({});
    const {
      users: { user },
      rooms: { room },
    } = useStore();
    return (
    <div>
        <Canvas 
            width={700}
            height={500}
            pushMessage={pushMessage}
            channel={channel}
            setCanvasCtx={setCanvasCtx}
        />
    </div>
    )
}

export default DrawingBoard