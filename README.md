# Uuu

## Usage

```typescript
import Uuu from "uuu";

// Create an instance of Uuu
const uuu = new Uuu();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Set up a route
uuu
  .route({ path: "/" })
  .on({
    method: "OPTIONS",
    headers: headers,
    handler: () => {
      return new Response("OPTIONS");
    },
  })
  .on({
    method: "GET",
    headers: headers,
    handler: () => {
      return new Response("GET");
    },
  })
  .on({
    method: "POST",
    headers: headers,
    handler: () => {
      return new Response("POST");
    },
  })
  .on({
    method: "PUT",
    headers: headers,
    handler: () => {
      return new Response("PUT");
    },
  })
  .on({
    method: "DELETE",
    headers: headers,
    handler: () => {
      return new Response("DELETE");
    },
  });

// Set an error handler
uuu.setError({
  response: 404,
  handler: () => new Response("Custom Not Found", { status: 404 }),
});

// Start listening for requests
uuu.listen({ port: 8000 });
```
