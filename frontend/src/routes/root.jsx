import { useRef, useState, useMemo } from "react";
import { getActors, getLabels } from "../api";
import Header from "../components/header";
import { getCurrencyFormat, getFullDate } from "../helpers";

const Root = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [actors, setActors] = useState([]);
  const [labels, setLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setSidebarVisible(false);
    setActors([]);
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

      setActors(actorsResponse.data);
      setLabels(labelsResponse.data);
    } catch (error) {
      console.error("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const mainClassnames = useMemo(
    () =>
      sidebarVisible
        ? "my-2 px-2 w-full overflow-hidden flex flex-col xl:w-2/3 transition-all duration-1000"
        : "my-2 px-2 w-full overflow-hidden flex flex-col transition-all duration-1000",
    [sidebarVisible]
  );

  return (
    <>
      <Header />
      <div className="container mx-auto">
        <div className="flex flex-col overflow-hidden xl:flex-row">
          <main className={mainClassnames}>
            <div className="relative mx-auto">
              <video
                className="w-full"
                ref={videoRef}
                src="video.mp4"
                onPause={handlePause}
                onPlay={handleStart}
                controls
              ></video>
              <div className="absolute top-2 left-2 w-40 h-24 bg-blue-200 border-2 border-black p-2 shadow-lg">
                This is a small box at the top left.
              </div>
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            <button onClick={handlePause}></button>
          </main>
          {sidebarVisible && (
            <aside className="my-2 px-2 w-full overflow-hidden xl:w-1/3 text-gray-900">
              <div className="mb-6">
                <h5 className="mb-2 text-lg font-semibold flex gap-2">
                  <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H6Zm7.25-2.095c.478-.86.75-1.85.75-2.905a5.973 5.973 0 0 0-.75-2.906 4 4 0 1 1 0 5.811ZM15.466 20c.34-.588.535-1.271.535-2v-1a5.978 5.978 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-4.535Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Actors</span>
                </h5>
                {isLoading ? (
                  <div>Searching...</div>
                ) : !actors.length ? (
                  <div>No actors identified.</div>
                ) : (
                  actors.map((actor, index) => {
                    console.log("actor", actor);
                    return (
                      <div key={index} className="p-4 mw-full mx-auto bg-white rounded-xl shadow-lg flex items-center">
                        <div>
                          <div className="text-2xl font-medium mb-2">
                            {`${actor.actorDetails.name}`}
                            <span className={"ms-1 font-thin text-xs"}>{`(${actor.actorDetails.gender})`}</span>
                          </div>
                          <dl>
                            <dt className="text-gray-500">Information:</dt>
                            <dd>
                              <div>{`Birthday: ${getFullDate(actor.actorDetails.birthday)} (${
                                actor.actorDetails.age
                              } years old)`}</div>
                              <div>{`Nationality: ${actor.actorDetails.nationality}`}</div>
                              <div>{`Height: ${actor.actorDetails.height}m`}</div>
                              <div>{`Net Worth: ${getCurrencyFormat(actor.actorDetails.net_worth)}`}</div>
                            </dd>

                            <dt className="text-gray-500 mt-1">Links:</dt>
                            {actor.urls.map((link, index) => (
                              <dd key={index}>
                                <a href={link} target="_blank" rel="noreferrer">
                                  {link}
                                </a>
                              </dd>
                            ))}
                          </dl>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
};

export default Root;
