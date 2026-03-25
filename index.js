const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// conexión a postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());
app.use(express.static('public')); // aquí servimos tu html de las hormigas

// crear tabla si no existe (esto te ahorra hacerlo a mano)
pool.query(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    rol VARCHAR(50)
  )
`);

// rutas del crud
app.get('/api/usuarios', async (req, res) => {
  const result = await pool.query('SELECT * FROM usuarios ORDER BY id DESC');
  res.json(result.rows);
});

app.post('/api/usuarios', async (req, res) => {
  const { nombre, rol } = req.body;
  const result = await pool.query('INSERT INTO usuarios (nombre, rol) VALUES ($1, $2) RETURNING *', [nombre, rol]);
  res.json(result.rows[0]);
});

app.listen(port, () => console.log(`servidor activo en el puerto ${port}`));