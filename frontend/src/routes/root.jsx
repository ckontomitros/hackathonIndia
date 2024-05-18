import { useRef, useState, useMemo } from "react";
import { getActors, getLabels } from "../api";
import Header from "../components/header";
import { getCurrencyFormat, getFullDate } from "../helpers";
import { Link } from "react-router-dom";
import BoundingBox from "./boundingbox";

const Root = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [actors, setActors] = useState([]);
  const [labels, setLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [box, setBox] = useState([]);

  const handleStart = () => {
    setSidebarVisible(false);
    setActors([]);
    setBox([]);
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

      setActors(actorsResponse.data);
      setBox(actorsResponse.data.map((c) => c.boundingBox));

      const labelsResponse = await getLabels(imageUrl);
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
              {box.map((b) => (
                <BoundingBox top={b.top} left={b.left} height={b.height} key={b.top} width={b.width}></BoundingBox>
              ))}
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            <button
              type="button"
              onClick={handlePause}
              className="text-white w-48 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xl mx-auto mb-4 px-5 py-6 mt-4 focus:outline-none dark:focus:ring-blue-800"
            >
              Pick!
            </button>
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
                  <span>Celebrities</span>
                </h5>
                {isLoading ? (
                  <div>Searching...</div>
                ) : !actors.length ? (
                  <div>No actors identified.</div>
                ) : (
                  actors.map((actor, index) => {
                    return (
                      <div key={index} className="p-4 mw-full mx-auto bg-white rounded-xl shadow-md flex items-center">
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
                                <Link
                                  to={`https://${link}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={"text-blue-600 dark:text-blue-500 hover:underline"}
                                >
                                  {link}
                                </Link>
                              </dd>
                            ))}
                          </dl>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div>
                <h5 className="mb-2 text-lg font-semibold flex gap-2">
                  <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m17 21-5-4-5 4V3.889a.92.92 0 0 1 .244-.629.808.808 0 0 1 .59-.26h8.333a.81.81 0 0 1 .589.26.92.92 0 0 1 .244.63V21Z"
                    />
                  </svg>
                  <span>Points of interest</span>
                </h5>
                {isLoading ? (
                  <div>Searching...</div>
                ) : !labels.length ? (
                  <div>No actors identified.</div>
                ) : (
                  <ul className="max-w-xl space-y-1 list-none">
                    {labels.map((label, index) => (
                      <li key={index}>{label.name}</li>
                    ))}
                  </ul>
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
