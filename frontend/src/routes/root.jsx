import { useEffect, useRef, useState, useMemo } from "react";
import { postScreenshot } from "../api";
import Header from "../components/header";

const Root = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [actorNames, setActorNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setSidebarVisible(false);
  };

  const handlePause = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext("2d").drawImage(video, 0, 0);
    const imageUrl = canvas.toDataURL();
    setIsLoading(true);
    setSidebarVisible(true);

    try {
      const response = await postScreenshot(imageUrl);

      setActorNames(response.data);
    } catch (error) {
      console.error("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const mainClassnames = useMemo(
    () => (sidebarVisible ? "my-2 px-2 w-full overflow-hidden xl:w-2/3 " : "my-2 px-2 w-full overflow-hidden"),
    [sidebarVisible]
  );

  return (
    <>
      <Header />
      <div className="container mx-auto">
        <div className="flex flex-col flex-wrap  overflow-hidden xl:flex-row">
          <main className={mainClassnames}>
            <video ref={videoRef} src="video.mp4" onPause={handlePause} onPlay={handleStart} controls></video>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          </main>
          {sidebarVisible && (
            <aside className="my-2 px-2 w-full overflow-hidden xl:w-1/3 text-gray-900">
              <h5 className="mb-2 text-lg font-semibold">Actors</h5>
              {isLoading ? (
                <div>Searching...</div>
              ) : !actorNames.length ? (
                <div>No actors identified.</div>
              ) : (
                <ul className="max-w-xl space-y-1 list-none">
                  {actorNames.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              )}
            </aside>
          )}
        </div>
      </div>
    </>
  );
};

export default Root;
