import { Hono } from 'npm:hono';
import { drizzle } from 'npm:drizzle-orm/libsql';
import { createClient } from 'npm:@libsql/client';
import { sqliteTable, text, integer } from 'npm:drizzle-orm/sqlite-core';
import { eq } from 'npm:drizzle-orm';

// Definición del esquema
export const users = sqliteTable("users", {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name'),
});

// Crear el cliente de conexión
const client = createClient({
  url: Deno.env.get("DATABASE_URL") ?? "libsql://your-database.turso.io",
  authToken: Deno.env.get("DATABASE_AUTH_TOKEN") ?? "your-auth-token"
});

// Inicializar drizzle
const db = drizzle(client);

// Inicializar Hono
const app = new Hono();

// Middleware para medir el tiempo de respuesta
app.use('*', async (c, next) => {
  const startTime = performance.now();
  await next();
  const endTime = performance.now();
  console.log(`⏱️ ${c.req.method} ${c.req.url} - ${(endTime - startTime).toFixed(2)}ms`);
});

// GET /users/create/:name - Crear un usuario
app.get('/users/create/:name', async (c) => {
  try {
    const name = c.req.param('name');
    const startTime = performance.now();
    
    const newUser = await db.insert(users).values({
      name: name
    }).returning();
    
    const endTime = performance.now();
    
    return c.json({
      message: 'Usuario creado exitosamente',
      user: newUser[0],
      tiempoEjecucion: `${(endTime - startTime).toFixed(2)}ms`
    }, 201);
  } catch (error) {
    return c.json({ error: 'Error al crear usuario' }, 500);
  }
});

// GET /users/get - Obtener todos los usuarios
app.get('/users/get', async (c) => {
  try {
    const startTime = performance.now();
    
    const allUsers = await db.select().from(users);
    
    const endTime = performance.now();
    
    return c.json({
      users: allUsers,
      tiempoEjecucion: `${(endTime - startTime).toFixed(2)}ms`
    });
  } catch (error) {
    return c.json({ error: 'Error al obtener usuarios' }, 500);
  }
});

// GET /users/delete/:id - Borrar un usuario por ID
app.get('/users/delete/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const startTime = performance.now();
    
    const deletedUser = await db.delete(users)
      .where(eq(users.id, id))
      .returning();
    
    const endTime = performance.now();
    
    if (deletedUser.length === 0) {
      return c.json({
        error: 'Usuario no encontrado',
        tiempoEjecucion: `${(endTime - startTime).toFixed(2)}ms`
      }, 404);
    }
    
    return c.json({
      message: 'Usuario eliminado exitosamente',
      deletedUser: deletedUser[0],
      tiempoEjecucion: `${(endTime - startTime).toFixed(2)}ms`
    });
  } catch (error) {
    return c.json({ error: 'Error al eliminar usuario' }, 500);
  }
});

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (c) => c.json({
  message: '🚀 API de usuarios funcionando',
  endpoints: {
    crear: 'GET /users/create/:name (reemplaza :name con el nombre)',
    obtener: 'GET /users/get',
    eliminar: 'GET /users/delete/:id (reemplaza :id con el ID del usuario)'
  }
}));

// Manejador de errores
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({
    error: 'Error interno del servidor'
  }, 500);
});

// Manejador para rutas no encontradas
app.notFound((c) => {
  return c.json({
    error: 'Ruta no encontrada',
    rutasDisponibles: {
      crear: 'GET /users/create/:name (reemplaza :name con el nombre)',
      obtener: 'GET /users/get',
      eliminar: 'GET /users/delete/:id (reemplaza :id con el ID del usuario)'
    }
  }, 404);
});

// Iniciar el servidor
Deno.serve(app.fetch); 