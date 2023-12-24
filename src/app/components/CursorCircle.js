// components/JigglyCursor.js
import React, { useEffect, useRef } from 'react';
import AudioPlayer from 'react-audio-player';
import p5 from 'p5';

const CursorCircle = ({ audioSrc }) => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const sketch = (p) => {
      let jiggle = 0;

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.position(0, 0);
        canvas.style('pointer-events', 'none');
        cursorRef.current = p.createDiv('');
        cursorRef.current.style('position', 'absolute');
      };

      p.draw = () => {
        p.background(255);
        cursorRef.current.style('left', p.mouseX + 'px');
        cursorRef.current.style('top', p.mouseY + 'px');
        cursorRef.current.style('transform', `rotate(${jiggle}deg)`);
        jiggle += p.random(-1, 1);
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };

      p.playJiggle = () => {
        jiggle = 20; // Adjust the initial jiggle amount based on your preference
      };
    };

    new p5(sketch, cursorRef.current);

    return () => {
      // Cleanup function
      cursorRef.current.remove();
    };
  }, []);

  return (
    <div>
      <AudioPlayer
        src={audioSrc}
        autoPlay={false}
        controls
        onPlay={() => cursorRef.current.playJiggle()}
      />
    </div>
  );
};

export default CursorCircle;






// // JigglyCursor.js
// "use client";
// import React, { useState, useEffect } from 'react';
// import { Howl } from 'react-howler';
// import { Analyser } from 'react-audio-analyser';
// import styles from './CursorCircle.module.css';

// const CursorCircle = () => {
//   const [isPlaying, setIsPlaying] = useState(false);

//   const handleTogglePlay = () => {
//     setIsPlaying(!isPlaying);
//   };

//   return (
//     <div className={styles.container}>
//       <Analyser
//         player={<Howl src="/music.mp3" playing={isPlaying} />}
//         fftSize={256}
//         barStyle={{ width: '2px', backgroundColor: '#ec4e39' }}
//       />
//       <div
//         className={`${styles.cursor} ${isPlaying ? styles.jiggly : ''}`}
//       ></div>
//       <button onClick={handleTogglePlay} className={styles.playButton}>
//         {isPlaying ? 'Pause' : 'Play'}
//       </button>
//     </div>
//   );
// };

// export default CursorCircle;
