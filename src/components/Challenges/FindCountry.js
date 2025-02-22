import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useState } from "react";
import ReactMapGL, { Layer, Source } from "react-map-gl";

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

    const [countryFr, setCountryFr] = useState(null);  // Affichage en français
    const [countryEn, setCountryEn] = useState(null);  // Nom en anglais pour Mapbox
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [result, setResult] = useState('');

    // Récupérer le pays à trouver
    useEffect(() => {
        fetch("http://localhost:8000/findcountry/api/get_country/")
            .then(res => res.json())
            .then(data => {
                setCountryFr(data.country_name_fr);  // Nom français affiché
                setCountryEn(data.country_name_en);  // Nom anglais pour Mapbox
                console.log("🎯 Pays à trouver :", data.country_name_fr, "/", data.country_name_en);
            })
            .catch(err => console.error("❌ Erreur de chargement du pays cible :", err));
    }, []);

    // Fonction déclenchée lors d'un clic sur la carte
    const onCountryClick = (event) => {
        const features = event.features;
        
        if (!features || features.length === 0) {
            console.log("⚠️ Aucune donnée détectée au clic.");
            return;
        }

        console.log("✅ Données détectées :", features);

        // Essayer d'extraire le pays cliqué depuis Mapbox
        const clickedCountry = features[0]?.properties?.name_en || features[0]?.properties?.admin;
        console.log("✅ Pays détecté :", clickedCountry);

        setSelectedCountry(clickedCountry);

        if (clickedCountry === countryEn) {
            setResult('correct');
        } else {
            setResult('incorrect');
        }

        setTimeout(() => window.location.reload(), 1500);
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <h2> Trouve : {countryFr} </h2>
            <ReactMapGL
                {...viewport}
                mapStyle="mapbox://styles/rom001/cm7g1tval000j01sb6hrxf5wl"
                mapboxAccessToken="pk.eyJ1Ijoicm9tMDAxIiwiYSI6ImNtN2Y4cjUzajBtN2Mya3NqODc4MXQ4c3cifQ.OiECvZLHHMsxEi6E2Qm2xA"
                onMove={(evt) => setViewport(evt.viewState)}
                style={{ width: "100%", height: "calc(100vh - 150px)" }}
                interactiveLayerIds={["country-layer"]}
                onClick={onCountryClick}
            >
                {/* Utilisation des données de Mapbox */}
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
                                ["==", ["get", "name_en"], selectedCountry],
                                result === "correct" ? "green" : "red",
                                "transparent"
                            ],
                            "fill-opacity": 0.5
                        }}
                    />
                </Source>
            </ReactMapGL>

            {result && <h3 className={result === "correct" ? "success" : "error"}>
                {result === "correct" ? "Bonne réponse !" : "Mauvaise réponse"}
            </h3>}
        </div>
    );
}

export default FindCountry;
