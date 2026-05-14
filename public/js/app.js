// Inicializar el mapa centrado en Madrid
const map = L.map('map').setView([40.4168, -3.7038], 12);

// Capa visual del mapa (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

const infoText = document.getElementById('charger-info');
const btnReserve = document.getElementById('btn-reserve');

// Función para pedirle los cargadores a nuestro backend (server.js)
async function loadChargers() {
    try {
        const response = await fetch('/api/chargers');

        if (!response.ok) {
            throw new Error(`Error de red: ${response.status}`);
        }

        const chargers = await response.json();

        if (chargers.length === 0) {
            infoText.innerHTML = "No hay cargadores en la base de datos todavía.";
            return;
        }

        infoText.innerHTML = "Selecciona un cargador en el mapa para ver los detalles.";

        // Dibujar los marcadores
        chargers.forEach(charger => {
            const markerColor = charger.status === "Disponible" ? "green" : "red";
            const marker = L.marker([charger.lat, charger.lng]).addTo(map);

            marker.on('click', () => {
                infoText.innerHTML = `
                    <strong>Ubicación:</strong> ${charger.name}<br>
                    <strong>Estado:</strong> <span style="color:${markerColor}">${charger.status}</span><br>
                    <strong>Potencia:</strong> ${charger.power}<br>
                    <strong>Tarifa:</strong> ${charger.price}
                `;

                if (charger.status === "Disponible") {
                    btnReserve.disabled = false;
                    btnReserve.onclick = () => alert(`¡Has reservado la plaza en ${charger.name}!`);
                } else {
                    btnReserve.disabled = true;
                }
            });
        });
    } catch (error) {
        console.error("Error cargando los datos:", error);
        infoText.innerHTML = "Error al conectar con la base de datos. Comprueba la consola.";
    }
}

// Arrancar la carga al abrir la web
loadChargers();

// Botón de Geolocalización
document.getElementById('btn-locate').addEventListener('click', () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            map.flyTo([lat, lng], 14);

            L.circleMarker([lat, lng], {
                color: '#0984e3', radius: 8, fillOpacity: 1
            }).addTo(map).bindPopup("Estás aquí").openPopup();
        }, () => {
            alert("No pudimos obtener tu ubicación.");
        });
    } else {
        alert("Geolocalización no soportada en este navegador.");
    }
});