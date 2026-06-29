import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
 connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
 if (err) {
 console.error('❌ Error al conectar a PostgreSQL:', err.message);
 return;
 }
 console.log('✅ Conexión a PostgreSQL establecida correctamente');
 release(); 
});

export default pool;