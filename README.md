# Fresh project

Your new Fresh project is ready to go. You can follow the Fresh "Getting
Started" guide here: https://fresh.deno.dev/docs/getting-started

### Usage

Make sure to install Deno: https://deno.land/manual/getting_started/installation

Then start the project in development mode:

```
deno task dev
```

This will watch the project directory and restart as necessary.

### Playground Endpoints

Test these endpoints in the Deno Deploy playground:

```http
# Crear un usuario
GET /users/create/:name
Example: /users/create/Juan

# Obtener todos los usuarios
GET /users/get

# Eliminar un usuario por ID
GET /users/delete/:id
Example: /users/delete/1
```

Each response includes execution time and operation details.
