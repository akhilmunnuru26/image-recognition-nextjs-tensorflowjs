"use client"

import React,{useState} from 'react';
import '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

function Recognize() {

const [imageUrl, setImageUrl] = useState(null);
const [loading, setLoading] = useState(false);
const [predictions, setPredictions] = useState([]);

const handleImageChange = async (event) => {
    setPredictions([])
    const file = event.target.files[0];
    console.log("file",file)
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
        console.log("Predictions: ",predictions);
        setPredictions(predictions);
        

        
    }catch(err){
        console.log("Error in classification",err);
    }finally{
        setLoading(false);
    }
}

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-indigo-100 gap-6">
    
    {imageUrl &&<>
        <img id="uploaded-image" src={imageUrl} className="w-[300px] rounded-xl"/>
        <label className="">
            <span className="border-2 border-gray-950 border-dashed w-40 rounded p-3">Upload here</span>
            <input type="file" accept="image/*" hidden  onChange={handleImageChange}/>
        </label>
        {loading ? <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Loading.....</button>: <button onClick={handleClassify} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Classify Image</button>} 
    </>}
    
       {predictions.length > 0 && 
        predictions?.map((prediction) => <div key={prediction.className}>{prediction.className}</div>)
       } 
    </div>
  )
}

export default Recognize