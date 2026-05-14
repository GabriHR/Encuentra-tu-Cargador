require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// ESTO ES LO QUE EVITA LA PANTALLA EN BLANCO:
// Le dice al servidor que envíe el index.html de la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a la Base de Datos (MongoDB Atlas)
mongoose.connect("mongodb+srv://ghr_db_user:UD65FLYvmeJ7vIjP@clusterchargers.wmn2apk.mongodb.net/?appName=ClusterChargers")
    .then(() => console.log('Conectado a la base de datos en la nube ⚡'))
    .catch(err => console.error('Error conectando a la BD:', err));

// Modelo de la Base de Datos
const chargerSchema = new mongoose.Schema({
    name: String,
    lat: Number,
    lng: Number,
    status: String,
    power: String,
    price: String
});
const Charger = mongoose.model('Charger', chargerSchema);

// API para enviar los cargadores al Frontend
app.get('/api/chargers', async (req, res) => {
    try {
        const chargers = await Charger.find();
        res.json(chargers);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los cargadores" });
    }
});

// Iniciar Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});