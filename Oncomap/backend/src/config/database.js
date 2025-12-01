const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
};

// CORREÇÃO: O Supabase (Nuvem) exige SSL obrigatório.
// Como estamos usando a variável DATABASE_URL no .env, assumimos que é um banco externo.
// Então ativamos o SSL para garantir a conexão, mesmo rodando local no Docker.
if (process.env.DATABASE_URL) {
  poolConfig.ssl = {
    rejectUnauthorized: false // Aceita certificados autoassinados (comum no Supabase)
  };
}

const pool = new Pool(poolConfig);

// Teste de conexão visual (ajuda muito a saber se funcionou)
pool.connect()
  .then(client => {
    console.log('✅ Conectado ao Supabase com sucesso!');
    client.release();
  })
  .catch(err => console.error('❌ Erro de conexão com o Banco:', err.message));

module.exports = {
  query: (text, params) => pool.query(text, params),
};