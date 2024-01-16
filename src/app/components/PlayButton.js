// components/PlayButton.js
import React, { useState, useEffect } from 'react';
import styles from '@/app/styles/common.module.css'

const PlayButton = ({ audio, setPlaying }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audio.onEnded(() => {
      setIsPlaying(false);
    });
  }, [audio]);

  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
    setPlaying(!isPlaying);
  };

  return (
    <button onClick={togglePlay} className={styles.play_button}>
      {isPlaying ? 'Pause' : 'Play'}
    </button>
  );
};

export default PlayButton;