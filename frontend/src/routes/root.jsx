import { useEffect, useRef, useState, useMemo } from "react";
import { getActors, getLabels } from "../api";
import Header from "../components/header";

const Root = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [actorNames, setActorNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setSidebarVisible(false);
    setActorNames([]);
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
      const actorsResponse = await getActors(imageUrl);
      const labelsResponse = await getLabels(imageUrl);

      setActorNames(actorsResponse.data.map(c => c.name));
    } catch (error) {
      console.error("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const mainClassnames = useMemo(
    () =>
      sidebarVisible
        ? "my-2 px-2 w-full overflow-hidden xl:w-2/3 transition-all duration-1000"
        : "my-2 px-2 w-full overflow-hidden transition-all duration-1000",
    [sidebarVisible]
  );

  return (
    <>
      <Header />
      <div className="container mx-auto">
        <div className="flex flex-col flex-wrap  overflow-hidden xl:flex-row">
          <main className={mainClassnames}>
            <div class="relative">
            <video ref={videoRef} src="video.mp4" onPause={handlePause} onPlay={handleStart} controls class="relative">

            </video>
            <div class="absolute top-2 left-2 w-40 h-24 bg-blue-200 border-2 border-black p-2 shadow-lg">
        This is a small box at the top left.
    </div>
            </div>
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
