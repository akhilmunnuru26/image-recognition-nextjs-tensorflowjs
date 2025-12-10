"use client"

import React,{useState} from 'react';
import Link from 'next/link';
import '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

function Recognize() {

const [imageUrl, setImageUrl] = useState(null);
const [loading, setLoading] = useState(false);
const [predictions, setPredictions] = useState([]);

const handleImageChange = async (event) => {
    setPredictions([])
    const file = event.target.files[0];
    if (file){
        const url = URL.createObjectURL(file);
        setImageUrl(url);
    }
}

const handleClassify =  async() => {
    try{
        setLoading(true);
        const img = document.querySelector('#uploaded-image');
        const model = await mobilenet.load();
        const predictions = await model.classify(img);
        setPredictions(predictions);
    }catch(err){
        console.log("Error in classification",err);
    }finally{
        setLoading(false);
    }
}

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4
    bg-gradient-to-br from-black via-indigo-900 to-slate-900 text-white">

      
      <h1 className="text-4xl font-bold tracking-wide mb-6 drop-shadow-lg">
        AI Image Classifier
      </h1>

      
      <div className="p-6 rounded-xl shadow-[0_0_25px_rgba(0,255,255,0.4)]
      border border-cyan-300/40 backdrop-blur-xl flex flex-col items-center gap-4 max-w-md w-full">

        {imageUrl ? (
          <>
            <img 
              id="uploaded-image" 
              src={imageUrl} 
              className="w-[280px] rounded-xl shadow-xl hover:scale-105 duration-300"
            />

            <label className="cursor-pointer">
              <span className="px-4 py-2 border border-cyan-400/70 rounded-md bg-cyan-400/10 hover:bg-cyan-400/20 transition font-semibold">
                Upload Another
              </span>
              <input type="file" accept="image/*" hidden onChange={handleImageChange}/>
            </label>

            {/* Classify Button */}
            {loading ? 
              <button className="mt-2 px-5 py-2 rounded-md bg-cyan-400 animate-pulse text-black font-semibold">
                Processing...
              </button>
              :
              <button 
                onClick={handleClassify} 
                className="mt-2 px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-md font-semibold shadow-md transition"
              >
                🔍 Classify Image
              </button>
            }
          </>
        ) : (
          <label className="border-2 border-dashed border-cyan-400/60 rounded-lg px-10 py-10 text-center cursor-pointer hover:bg-cyan-400/10 transition">
            <p className="text-cyan-200 mb-2 text-lg">Click to Upload Image</p>
            <span className="opacity-70 text-sm">JPG • PNG • JPEG</span>
            <input type="file" accept="image/*" hidden onChange={handleImageChange}/>
          </label>
        )}

      </div>


      {predictions.length>0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-3 max-w-md">
          {predictions.map((prediction,i)=>(
            <span 
              key={i} 
              className="px-3 py-1 rounded-full border border-cyan-400 text-cyan-300 bg-cyan-400/10 text-sm tracking-wide shadow"
            >
              {prediction.className} • {(prediction.probability*100).toFixed(1)}%
            </span>
          ))}
        </div>
      )}

      <Link href="/">
        <button className="mt-8 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-lg shadow">
          OBJECT DETECTOR
        </button>
      </Link>

      <p className="mt-8 text-xs text-cyan-300/60 tracking-wide">
        Powered by MobileNet + TensorFlowJS ⚡
      </p>
    </div>
  )
}

export default Recognize;
