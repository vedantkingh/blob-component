'use client';
import {useState} from 'react';
import styles from '@/app/styles/common.module.css'

const Cursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        setPosition({ x: e.clientX, y: e.clientY });
    };
    return (
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
        onMouseMove={handleMouseMove}>
            <div className={styles.jiggle} style={{
            position: 'absolute',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'blue',
            transform: `translate(${position.x-29}px, ${position.y-27}px)`,
            animation: 'jiggle 0.5s ease-in-out infinite', 
            }}></div>
        </div>
    );
};

export default Cursor;