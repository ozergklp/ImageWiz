import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import React from "react";

import { FaHatWizard, FaPaintbrush } from "react-icons/fa6";
import Loading from "./components/Loading";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({ prediction });
      setPrediction(prediction);
    }
  };

  return (
    <div className="container mt-5  mx-auto flex flex-col items-center p-5">
      <Head>
        <title>AI Image Generator</title>
      </Head>


      <header className="flex text-4xl  justify-center">
        <FaHatWizard />
        <h1 className="ml-1 pt-1">
          ImageWiz
        </h1>
      </header>

    

      <form className=" bg-white flex mt-7 p-2 rounded-xl shadow-md w-11/12 justify-center sm:w-[500px] shadow-slate-400" onSubmit={handleSubmit}>
        <input
          type="text"
          className="flex-grow ml-1 bg-white outline-none pl-2 p-1 rounded-xl"
          name="prompt"
          placeholder="Imagine..."
          autoComplete="off"
        />
        <button  className=" ml-2 hover:shadow-sm rounded-xl  hover:shadow-slate-400 text-xl p-1 px-2  cursor-pointer" type="submit">
          <FaPaintbrush />
        </button>
      </form>

      {error && <div>{error}</div>}

      {prediction && (
        <>

          {prediction.output && (
            <div className="image-wrapper mt-5 rounded-xl">
              <Image
                className="rounded-xl w-[420px] sm:w-[500px]"
                src={prediction.output[prediction.output.length - 1]}
                alt="output"
                height={1000}
                width={500}
              />
             </div>
          )}      
        </>
      )}
      {(prediction && prediction.status === 'processing' ) && <Loading />}
      {(prediction && prediction.status === 'starting' ) && <Loading />}
      
    </div>
  );
}

//<p className="py-3 text-sm opacity-50">status: {prediction.status}</p>