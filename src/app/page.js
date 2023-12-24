"use client";
import Image from 'next/image'
import styles from './page.module.css'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import common from './styles/common.module.css'
// import CursorCircle from '@/app/components/CursorCircle';
import useMousePosition from '@/app/components/useMousePosition';
import CursorCircle from './components/CursorCircle';
// import AudioAnalyser from 'react-audio-analyser';

export default function Home() {
  // const [isHovered, setIsHovered] = useState(false);
  // const { x, y } = useMousePosition();

  return (
    <main className={styles.main}>
      {/* <motion.div 
        className={common.mask}
        animate={{
          x: x - 45, // Adjust the values as needed
          y: y - 145, // Adjust the values as needed
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
      ></motion.div> */}
      <h1>Your Next.js App</h1>
      <CursorCircle audioSrc="/music.mp3" />
    </main>
  )
}
