import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useState } from "react";
import ReactMapGL, { Layer, Source } from "react-map-gl";
import '../../css/Challenges/FindCountry.css'; 

function FindCountry() {
    const [viewport, setViewport] = useState({
        longitude: 0,
        latitude: 0,
        zoom: 1.5,
        pitch: 0,
        bearing: 0,
        width: "100%",
        height: "500px"
    });

    const [countryFr, setCountryFr] = useState(null);
    const [countryEn, setCountryEn] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [showCorrect, setShowCorrect] = useState(false);
    const [result, setResult] = useState('');
    const [message, setMessage] = useState(null);

    const fetchCountry = () => {
        fetch("http://localhost:8000/findcountry/api/get_country/")
            .then(res => res.json())
            .then(data => {
                setCountryFr(data.country_name_fr);
                setCountryEn(data.country_name_en);
                setSelectedCountry(null);
                setShowCorrect(false);
                setResult('');
                setMessage(null);
                console.log("🎯 Pays à trouver :", data.country_name_fr, "(", data.country_name_en, ")");
            })
            .catch(err => console.error("❌ Erreur de chargement du pays cible :", err));
    };

    useEffect(() => {
        fetchCountry();
        window.scrollTo(0, 0);
    }, []);

    useEffect(fetchCountry, []);

    const onCountryClick = (event) => {
        const features = event.features;

        if (!features || features.length === 0) {
            console.log("⚠️ Aucune donnée détectée au clic.");
            return;
        }

        console.log("✅ Données détectées :", features);

        const clickedCountry = features[0]?.properties?.name_en || features[0]?.properties?.admin;
        console.log("✅ Pays détecté :", clickedCountry);

        setSelectedCountry(clickedCountry);

        if (clickedCountry === countryEn) {
            setResult('correct');
            setMessage("🎉 Bien joué !");
        } else {
            setResult('incorrect');
            setShowCorrect(true);
            setMessage(`❌ Non, c'était : ${clickedCountry}`);
        }
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
            <div className="countrypopup">
                <h2>Trouve : {countryFr}</h2>
                {message && <p className="message">{message}</p>}
            </div>

            {result && (
                <button className="countrynext-button" onClick={fetchCountry}>
                    Suivant
                </button>
            )}

            <ReactMapGL
                {...viewport}
                mapStyle="mapbox://styles/rom001/cm7g1tval000j01sb6hrxf5wl"
                mapboxAccessToken="pk.eyJ1Ijoicm9tMDAxIiwiYSI6ImNtN2Y4cjUzajBtN2Mya3NqODc4MXQ4c3cifQ.OiECvZLHHMsxEi6E2Qm2xA"
                onMove={(evt) => setViewport(evt.viewState)}
                style={{ width: "100%", height: "calc(100vh - 150px)" }}
                interactiveLayerIds={["country-layer"]}
                onClick={onCountryClick}
            >
                <Source
                    id="countries"
                    type="vector"
                    url="mapbox://mapbox.country-boundaries-v1"
                >
                    <Layer
                        id="country-layer"
                        source-layer="country_boundaries"
                        type="fill"
                        paint={{
                            "fill-color": [
                                "case",
                                ["all", showCorrect, ["==", ["get", "name_en"], countryEn]], "green",
                                ["==", ["get", "name_en"], selectedCountry], result === "incorrect" ? "red" : "blue",
                                "transparent"
                            ],
                            "fill-opacity": 0.5
                        }}
                    />
                </Source>
            </ReactMapGL>
        </div>
    );
}

export default FindCountry;
