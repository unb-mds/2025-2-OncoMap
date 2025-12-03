const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
};

if (process.env.DATABASE_URL) {
  poolConfig.ssl = {
    rejectUnauthorized: false 
  };
}

const pool = new Pool(poolConfig);

// Teste de conexão visual (ajuda muito a saber se funcionou)
/*
pool.connect()
  .then(client => {
    console.log('✅ Conectado ao Supabase com sucesso!');
    client.release();
  })
  .catch(err => console.error('❌ Erro de conexão com o Banco:', err.message));
*/
module.exports = {
  query: (text, params) => pool.query(text, params),
};