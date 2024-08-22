import { useEffect, useState, useRef } from "react";
import "./App.css";

import logo from "../public/logo-white.png";

function App() {
  const [demos, setDemos] = useState();
  const [currentDemo, setCurrentDemo] = useState(null);
  const [frameList, setFrameList] = useState(null);
  const [currentFrame, setCurrentFrame] = useState();
  const [editedHTML, setEditedHTML] = useState();
  const [isSentSuccessfully, setIsSentSuccessfully] = useState(false);

  const iframeRef = useRef(null);

  const fetchFramesByDemoId = async (demoId) => {
    const response = await fetch(
      `http://localhost:3001/frames?demoId=${demoId}`,
      {
        method: "GET",
      }
    );
    setFrameList(await response.json());
  };

  const saveHTML = async () => {
    await fetch(`http://localhost:3001/frames/${currentFrame.id}`, {
      method: "PUT",
      body: editedHTML,
    }).then(function (response) {
      if (response.ok) setIsSentSuccessfully(true);
    });
  };

  useEffect(() => {
    if (currentFrame && iframeRef.current) {
      const iframe = iframeRef.current;

      iframe.onload = () => {
        const iframeDocument =
          iframe.contentDocument || iframe.contentWindow.document;

        if (iframeDocument) {
          iframeDocument.body.ondblclick = () => {
            iframeDocument.body.contentEditable = "true";
            iframeDocument.body.focus();
          };

          const handleHTMLChange = () => {
            setEditedHTML(iframeDocument.body.innerHTML);
          };

          iframeDocument.body.addEventListener("input", handleHTMLChange);
        }
      };
    }
  }, [currentFrame]);

  useEffect(() => {
    fetchFramesByDemoId(currentDemo);
  }, [currentDemo]);

  useEffect(() => {
    if (isSentSuccessfully) {
      setTimeout(function () {
        setIsSentSuccessfully(!isSentSuccessfully);
      }, 1000);
    }
  }, [isSentSuccessfully]);

  useEffect(() => {
    if (isSentSuccessfully) {
      setTimeout(function () {
        setIsSentSuccessfully(!isSentSuccessfully);
      }, 1000);
    }
  }, [isSentSuccessfully]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3001/demos", {
        method: "GET",
      });
      setDemos(await response.json());
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-full px-4 md:px-32 py-10 box-border flex flex-col gap-8 relative">
      <img src={logo} className="max-w-48"></img>

      <h1 class="text-3xl font-medium">Demos disponíveis</h1>
      <div class="flex gap-4 h-full flex-col md:flex-row">
        <div class="md:w-2/12 md:h-full flex-col gap-4">
          {demos &&
            demos.map((demo) => (
              <div
                key={demo.id}
                className="p-4 rounded-lg border border-primary w-full flex flex-col justify-center items-center gap-4"
              >
                <h2 className="font-medium text-xl">{demo.name}</h2>
                <button
                  onClick={() => setCurrentDemo(demo.id)}
                  className={`${
                    currentDemo === demo.id ? "bg-primary" : ""
                  } transition ease-in-out delay-75`}
                >
                  Visualizar
                </button>
              </div>
            ))}
        </div>
        <div className="flex flex-col md:w-10/12 h-full gap-4">
          <div className="flex gap-2 w-full flex-wrap md:flex-nowrap">
            {frameList &&
              frameList.map((frame) => (
                <button
                  key={frame.id}
                  className={`w-full transition ease-in-out delay-75 ${
                    frame.order === currentFrame?.order
                      ? "bg-primary font-bold"
                      : ""
                  }`}
                  onClick={() => setCurrentFrame(frame)}
                >
                  Frame {frame.order}
                </button>
              ))}
          </div>
          <div className="w-full h-full relative">
            {currentFrame && (
              <iframe
                srcDoc={currentFrame.html}
                className="rounded-lg border border-primary"
                ref={iframeRef}
              ></iframe>
            )}
            {editedHTML && (
              <button
                className={`absolute top-4 right-4 hover:bg-primary transition font-bold ease-in-out delay-75 ${
                  isSentSuccessfully ? "bg-green hover:bg-green" : ""
                }`}
                onClick={() => saveHTML()}
              >
                Salvar alterações
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
