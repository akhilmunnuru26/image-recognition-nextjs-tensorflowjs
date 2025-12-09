"use client"

import {useState,useEffect,useRef} from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

export default function Home() {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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

      Promise.all([webCamPromise,modelPromise]).then(values => {
        detectFrame(videoRef.current,values[1]);
      } ).catch(err => console.log(err) );
    }

    
  }

  const detectFrame = (video,model) => {
    model.detect(video).then(predictions => {
      renderPredictions(predictions);

      requestAnimationFrame(() => {
        detectFrame(video,model);
      })
    })
  }

  const renderPredictions = (predictions) => {
    console.log("predictions",predictions)
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";

    predictions.forEach(prediction => {
      const [x,y,width,height] = prediction['bbox'];
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 4;
      ctx.strokeRect(x,y,width,height);

      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction['class']).width;
      const textHeight = parseInt(font,10);
      ctx.fillRect(x,y,textWidth + 7,textHeight + 4);

      ctx.fillStyle = "#000000";
      ctx.fillText(prediction['class'],x,y);
    });
  }

  useEffect(()=>{
    runDetection();
  },[])


  return (
   <div className="relative h-screen flex justify-center items-center bg-indigo-200">
       <video className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-dashed border-8"  height={350} width={500} autoPlay ref={videoRef}/>
       <canvas className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" height={340} width={490} ref={canvasRef}/>
   </div>
  );
}
