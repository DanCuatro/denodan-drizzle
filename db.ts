import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { users } from '@/db/schema/users.ts';

// Crear el cliente de conexión
const client = createClient({
  url: Deno.env.get("DATABASE_URL")!,
  authToken: Deno.env.get("DATABASE_AUTH_TOKEN")
});

// Inicializar drizzle
const db = drizzle(client);

// Función para insertar un usuario
export async function createUser(name: string) {
  try {
    const newUser = await db.insert(users).values({
      name: name
    }).returning();
    return newUser;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
}

// Función para obtener todos los usuarios
export async function getAllUsers() {
  try {
    const allUsers = await db.select().from(users);
    return allUsers;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

// Función para borrar todos los usuarios
export async function deleteAllUsers() {
  try {
    await db.delete(users);
    return { success: true, message: 'Todos los usuarios han sido eliminados' };
  } catch (error) {
    console.error('Error al eliminar usuarios:', error);
    throw error;
  }
}

// Ejecutar las operaciones
(async () => {
  try {
    // Crear algunos usuarios de ejemplo
    const usuario1 = await createUser("Juan Pérez");
    console.log('Usuario 1 creado:', usuario1);

    const usuario2 = await createUser("María García");
    console.log('Usuario 2 creado:', usuario2);

    // Obtener y mostrar todos los usuarios
    let todosLosUsuarios = await getAllUsers();
    console.log('Lista de usuarios después de crear:', todosLosUsuarios);

    // Borrar todos los usuarios
    const resultadoBorrado = await deleteAllUsers();
    console.log('Resultado del borrado:', resultadoBorrado);

    // Obtener y mostrar usuarios después del borrado
    todosLosUsuarios = await getAllUsers();
    console.log('Lista de usuarios después de borrar:', todosLosUsuarios);

  } catch (error) {
    console.error('Error en las operaciones:', error);
  } finally {
    await client.close();
  }
})();