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

    const [countryFr, setCountryFr] = useState(null);
    const [countryEn, setCountryEn] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [showCorrect, setShowCorrect] = useState(false);
    const [result, setResult] = useState('');
    const [message, setMessage] = useState(null); // Message affiché au centre

    // Fonction pour charger un pays
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
        window.scrollTo(0, 0); // 🔹 Remet la page tout en haut à chaque chargement
    }, []);    

    // Charger le premier pays
    useEffect(fetchCountry, []);

    // Fonction de détection au clic
    const onCountryClick = (event) => {
        const features = event.features;
        
        if (!features || features.length === 0) {
            console.log("⚠️ Aucune donnée détectée au clic.");
            return;
        }

        console.log("✅ Données détectées :", features);

        // Essayer d'extraire le pays cliqué
        const clickedCountry = features[0]?.properties?.name_en || features[0]?.properties?.admin;
        console.log("✅ Pays détecté :", clickedCountry);

        setSelectedCountry(clickedCountry);

        if (clickedCountry === countryEn) {
            setResult('correct');
            setMessage("🎉 Bien joué !");
        } else {
            setResult('incorrect');
            setShowCorrect(true); // ✅ Afficher le pays correct en vert
            setMessage(`❌ Non, c'était : ${clickedCountry}`);
        }
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
            {/* Affichage du pays à trouver */}
            <h2> Trouve : {countryFr} </h2>

            {/* Message au centre de l'écran */}
            {message && (
                <div style={{
                    position: "absolute",
                    top: "4.6%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "15px 20px",
                    borderRadius: "10px",
                    fontSize: "1.5em",
                    fontWeight: "bold",
                    textAlign: "center"
                }}>
                    {message}
                </div>
            )}

            {/* Bouton Suivant */}
            {result && (
                <button 
                    onClick={fetchCountry} 
                    style={{
                        position: "absolute", 
                        top: "15px", 
                        right: "10px", 
                        padding: "10px 15px", 
                        backgroundColor: "#4CAF50", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "5px", 
                        cursor: "pointer"
                    }}>
                    Suivant →
                </button>
            )}

            {/* Carte Mapbox */}
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
                                // ✅ Pays correct en vert uniquement si mauvaise réponse
                                ["all", showCorrect, ["==", ["get", "name_en"], countryEn]], "green",
                                // ❌ Pays cliqué en rouge si erreur
                                ["==", ["get", "name_en"], selectedCountry], result === "incorrect" ? "red" : "blue",
                                // 🎨 Pays non concernés transparents
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
