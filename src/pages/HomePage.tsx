// src/pages/HomePage.tsx
import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import "./HomePage.css";
import Sidebar from "../components/Sidebar";

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
	const [quadradoVisivel, setQuadradoVisivel] = useState(false);

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
		if (!viewer || viewer.isOpen() === false || !viewer.drawer) return;

		try {
			if (viewer.world.getItemCount() === 0) return;
			viewer.clearOverlays();
		} catch {
			return;
		}

		// Quadrado vermelho
		if (quadradoVisivel) {
			const pos = new OpenSeadragon.Rect(
				...getImagemByIndex(currentIndex).coordenadas_quadrado
			);
			const square = document.createElement("div");
			square.style.border = "3px solid red";
			square.style.width = "100px";
			square.style.height = "100px";
			square.style.background = "transparent";
			square.style.position = "absolute";
			square.style.pointerEvents = "none";

			viewer.addOverlay({
				element: square,
				location: pos,
				placement: OpenSeadragon.OverlayPlacement.CENTER,
			});
		}

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
				placement: OpenSeadragon.OverlayPlacement.CENTER,
			});
		}

		// Marcadores do jogador com número
		marcadores.forEach((m, index) => {
			const container = document.createElement("div");
			container.style.position = "relative";
			container.style.pointerEvents = "none";

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
			circle.innerText = (index + 1).toString();

			container.appendChild(circle);

			viewer.addOverlay({
				element: container,
				location: m.point,
				placement: OpenSeadragon.OverlayPlacement.CENTER,
			});
		});
	};

	// Inicializa OpenSeadragon
	useEffect(() => {
		if (!viewerRef.current || viewerInstance.current) return;

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

		viewer.addHandler("canvas-click", async (event) => {
			if (!event.originalEvent.ctrlKey) return;

			event.preventDefaultAction = true;
			const webPoint = event.position;
			const viewportPoint = viewer.viewport.pointFromPixel(webPoint);

			const texto = prompt("Digite sua anotação:");
			if (!texto) return;

			setMarcadores((prev) => [...prev, { point: viewportPoint, texto }]);
		});

		return () => {
			viewer.destroy();
			viewerInstance.current = null;
		};
	}, []);

	// Redesenha overlays quando mudam marcadores ou índice ou visibilidade
	useEffect(() => {
		const id = setTimeout(() => desenharOverlays(), 50);
		return () => clearTimeout(id);
	}, [marcadores, currentIndex, gabaritoVisivel, quadradoVisivel]);

	// Navegação e controles
	const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? 2 : prev - 1));
	const handleNext = () => setCurrentIndex((prev) => (prev === 2 ? 0 : prev + 1));
	const toggleGabarito = () => setGabaritoVisivel((prev) => !prev);
	const toggleQuadrado = () => setQuadradoVisivel((prev) => !prev);
	const limparMarkers = () => setMarcadores([]);

	return (
		<div className="home-container">
			<div
				ref={viewerRef}
				className="viewer-container"
				style={{
					width: "100%",
					height: "100vh",
					position: "absolute",
					top: 0,
					left: 0,
					zIndex: 0,
				}}
			/>

			{/* Overlay de controles */}
			<div
				className="overlay-top-right"
				style={{ position: "fixed", top: 20, right: 20, zIndex: 100, userSelect: "none" }}
			>
				<div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
					<button
						type="button"
						onClick={handlePrev}
						style={{ padding: "5px 10px", borderRadius: "5px", height: "40px" }}
					>
						⬅️
					</button>
					<button
						type="button"
						onClick={handleNext}
						style={{ padding: "5px 10px", borderRadius: "5px", height: "40px" }}
					>
						➡️
					</button>
					<button
						type="button"
						onClick={toggleGabarito}
						style={{ padding: "5px 10px", borderRadius: "5px", height: "40px" }}
					>
						{gabaritoVisivel ? "Hide markers" : "Show markers"}
					</button>
					<button
						type="button"
						onClick={toggleQuadrado}
						style={{ padding: "5px 10px", borderRadius: "5px", height: "40px" }}
					>
						{quadradoVisivel ? "Leave gaming mode" : "Enter gaming mode"}
					</button>
					<button
						type="button"
						onClick={limparMarkers}
						style={{ padding: "5px 10px", borderRadius: "5px", height: "40px" }}
					>
						Clear player's markers
					</button>
					<img
						src={getImagemByIndex(currentIndex).diretorio}
						alt="preview"
						style={{
							width: "150px",
							borderRadius: "10px",
							border: "2px solid white",
							marginBottom: "10px",
						}}
					/>
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
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						width: "500px",
						flexWrap: "wrap",
						gap: "10px",
					}}
				>
					<h3>
						Marker's annotation <br /> Press CTRL + left click <br /> to make new annotations
					</h3>
				</div>
				{marcadores.length === 0 && <p>No annotations made</p>}
				<ol style={{ paddingLeft: "20px" }}>
					{marcadores.map((m, i) => (
						<li
							key={i}
							style={{ marginBottom: "5px", cursor: "pointer" }}
							onClick={() => {
								viewerInstance.current?.viewport.panTo(m.point);
								viewerInstance.current?.viewport.zoomTo(2);
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
