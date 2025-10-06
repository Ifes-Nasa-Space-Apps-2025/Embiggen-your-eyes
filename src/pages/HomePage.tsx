// src/pages/HomePage.tsx
import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import "./HomePage.css";

interface Marcador {
  point: OpenSeadragon.Point;
  texto: string;
}

const HomePage: React.FC = () => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstance = useRef<OpenSeadragon.Viewer | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [marcadores, setMarcadores] = useState<Marcador[]>([]);
  const [gabaritoVisivel, setGabaritoVisivel] = useState(false);

  const getImagemByIndex = (index: number) => {
    const imagens = {
      data: [
        {
          diretorio: "tiles/night-sky_files/14/7_2.jpeg",
          coordenadas_quadrado: [0.14, -0.0, 0.15, 0.15],
          coordenadas_pino_gabarito: [0.1739653969924779, 0.0593560143486153],
        },
        {
          diretorio: "tiles/night-sky_files/14/6_8.jpeg",
          coordenadas_quadrado: [0.1, 0.1, 0.15, 0.15],
          coordenadas_pino_gabarito: [0.15690454395618236, 0.21051408682326955],
        },
        {
          diretorio: "tiles/night-sky_files/14/26_0.jpeg",
          coordenadas_quadrado: [0.6, -0.025, 0.15, 0.15],
          coordenadas_pino_gabarito: [0.6419981297168088, 0.012578777486416545],
        },
      ],
    };
    return imagens.data[index];
  };

  // Função que desenha todos os overlays
  const desenharOverlays = () => {
    const viewer = viewerInstance.current;
    if (!viewer || !viewer.isOpen() || !viewer.drawer) return;

    try {
      if (viewer.world.getItemCount() === 0) return;
      viewer.clearOverlays();
    } catch {
      return;
    }

    // Quadrado vermelho
    const pos = new OpenSeadragon.Rect(...getImagemByIndex(currentIndex).coordenadas_quadrado);
    const square = document.createElement("div");
    square.style.border = "3px solid red";
    square.style.background = "transparent";
    square.style.pointerEvents = "none";

    viewer.addOverlay({
      element: square,
      location: pos,
    });

    // Pino do gabarito
    if (gabaritoVisivel) {
      const [x, y] = getImagemByIndex(currentIndex).coordenadas_pino_gabarito;
      const gabaritoCircle = document.createElement("div");
      gabaritoCircle.style.width = "10px";
      gabaritoCircle.style.height = "10px";
      gabaritoCircle.style.borderRadius = "50%";
      gabaritoCircle.style.background = "blue";
      gabaritoCircle.style.border = "2px solid white";
      gabaritoCircle.style.pointerEvents = "none";
      viewer.addOverlay({
        element: gabaritoCircle,
        location: new OpenSeadragon.Point(x, y),
        placement: OpenSeadragon.Placement.CENTER,
      });
    }

    // Marcadores do jogador com número
    marcadores.forEach((m, index) => {
      const circle = document.createElement("div");
      circle.style.width = "20px";
      circle.style.height = "20px";
      circle.style.borderRadius = "50%";
      circle.style.background = "red";
      circle.style.border = "2px solid white";
      circle.style.display = "flex";
      circle.style.alignItems = "center";
      circle.style.justifyContent = "center";
      circle.style.color = "white";
      circle.style.fontSize = "12px";
      circle.style.pointerEvents = "none";
      circle.innerText = (index + 1).toString();

      viewer.addOverlay({
        element: circle,
        location: m.point,
        placement: OpenSeadragon.Placement.CENTER,
      });
    });
  };

  // Inicializa OpenSeadragon
  useEffect(() => {
    if (viewerRef.current && !viewerInstance.current) {
      const viewer = OpenSeadragon({
        element: viewerRef.current,
        prefixUrl: "/openseadragon-images/",
        tileSources: "/tiles/night-sky.dzi",
        showNavigator: true,
        navigatorPosition: "BOTTOM_RIGHT",
        maxZoomPixelRatio: 2,
        visibilityRatio: 1,
        constrainDuringPan: true,
        minZoomLevel: 0,
        zoomPerScroll: 1.3,
        showZoomControl: false,
        showFullPageControl: false,
        showHomeControl: false,
      });

      viewerInstance.current = viewer;

      viewer.addHandler("open", () => {
        desenharOverlays();
      });

      viewer.addHandler("canvas-click", (event) => {
        const mouseEvent = event.originalEvent as MouseEvent;
        if (!mouseEvent.ctrlKey) return;

        event.preventDefaultAction = true;
        const webPoint = event.position;
        const viewportPoint = viewer.viewport.pointFromPixel(webPoint);

        const texto = prompt("Digite sua anotação:");
        if (texto) {
          setMarcadores((prev) => [...prev, { point: viewportPoint, texto }]);
        }
      });
    }

    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
        viewerInstance.current = null;
      }
    };
  }, []);

  // Redesenha overlays quando mudam marcadores ou índice
  useEffect(() => {
    // A short timeout prevents drawing attempts while the viewer might be transitioning
    const id = setTimeout(() => desenharOverlays(), 50);
    return () => clearTimeout(id);
  }, [marcadores, currentIndex, gabaritoVisivel]);

  // Navegação e controles
  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? 2 : prev - 1));
  const handleNext = () => setCurrentIndex((prev) => (prev === 2 ? 0 : prev + 1));
  const toggleGabarito = () => setGabaritoVisivel((prev) => !prev);
  const limparMarkers = () => setMarcadores([]);

  return (
    <div className="home-container">
      <div
        ref={viewerRef}
        className="viewer-container"
        style={{ width: "100%", height: "100vh", position: "absolute", top: 0, left: 0, zIndex: 0 }}
      />

      {/* Overlay de controles */}
      <div
        className="overlay-top-right"
        style={{ position: "fixed", top: 20, right: 20, zIndex: 100, userSelect: "none" }}
      >
        <img
          src={getImagemByIndex(currentIndex).diretorio}
          alt="preview"
          style={{ width: "150px", borderRadius: "10px", border: "2px solid white" }}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "10px" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button type="button" onClick={handlePrev} style={{ marginRight: "10px" }}>
              ⬅️
            </button>
            <button type="button" onClick={handleNext}>
              ➡️
            </button>
          </div>
          <button
            type="button"
            onClick={toggleGabarito}
            style={{ marginTop: "10px", padding: "5px 10px", borderRadius: "5px" }}
          >
            {gabaritoVisivel ? "Hide markers" : "Show markers"}
          </button>
          <button
            type="button"
            onClick={limparMarkers}
            style={{ marginTop: "10px", padding: "5px 10px", borderRadius: "5px" }}
          >
            Clear player's markers
          </button>
        </div>
      </div>

      {/* Lista lateral de marcadores numerada */}
      <div
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          width: "250px",
          maxHeight: "80vh",
          overflowY: "auto",
          background: "rgba(0,0,0,0.6)",
          padding: "10px",
          borderRadius: "10px",
          color: "white",
          zIndex: 100,
        }}
      >
        <h3>Marker's annotation</h3>
        {marcadores.length === 0 && <p>No annotations made</p>}
        <ol style={{ paddingLeft: "20px" }}>
          {marcadores.map((m, i) => (
            <li
              key={i}
              style={{ marginBottom: "5px", cursor: "pointer" }}
              onClick={() => {
                if (viewerInstance.current) {
                  viewerInstance.current.viewport.panTo(m.point);
                  viewerInstance.current.viewport.zoomTo(2);
                }
              }}
            >
              {m.texto}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default HomePage;