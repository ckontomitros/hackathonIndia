import { useEffect, useRef, useState } from "react";
import { postScreenshot } from "../api";
import Header from "../components/header";

const Root = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [actorNames, setActorNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePause = async () => {
    console.log("handlePause");
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext("2d").drawImage(video, 0, 0);
    const imageUrl = canvas.toDataURL();
    setIsLoading(true);

    try {
      const response = await postScreenshot(imageUrl);

      setActorNames(response.data);
    } catch (error) {
      console.error("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("isLoading", isLoading);
  }, [isLoading]);

  return (
    <>
      <Header />
      <main>
        <video ref={videoRef} src="video.mp4" onPause={handlePause} controls></video>
        <canvas ref={canvasRef} style={{ display: "" }}></canvas>
      </main>
    </>
  );
};

export default Root;
