"use client"

import {useState,useEffect,useRef} from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

export default function Home() {

  const videoRef = useRef(null);

  const runDetection = () => {
    console.log("Mounted on Client Side");

    const doesExist = navigator.mediaDevices.getUserMedia({video:true}) instanceof Promise;
    if (!doesExist) return alert("Camera is not found");
    console.log("Does Exist",doesExist) 

    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
      const webCamPromise = navigator.mediaDevices.getUserMedia({audio:false,video:{
        facingMode:"user",
      }}).then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        return new Promise((resolve,reject) => {
          videoRef.current.onloadedmetadata = () => {
            resolve();
          }
        })
      });

      const modelPromise = cocoSsd.load();

      Promise.all([webCamPromise,modelPromise]).then(values => console.log(values[0],values[1]))
    }

    
  }

  useEffect(()=>{
    runDetection();
  },[])


  return (
   <div className="">
       <h1>Hello World</h1>
       <video ref={videoRef}/>
   </div>
  );
}
