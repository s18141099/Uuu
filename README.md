# Uuu

## Usage

```typescript
import Uuu from "uuu";

// Create an instance of Uuu
const uuu = new Uuu();

// Set up a route
uuu
  .route({
    path: "/",
    method: "GET",
    handler: (req, coninfo) => new Response("Hello!"),
  })
  .route({
    path: "/goodbye",
    method: "POST",
    handler: (req, coninfo) => new Response("GoodBye!"),
    headers: [
      { name: "X-Custom-Header", value: "Custom Value" },
    ],
  });

// Set an error handler
uuu.onError({
  response: 404,
  handler: () => new Response("Custom Not Found", { status: 404 }),
});

// Start listening for requests
uuu.listen({ port: 8000 });
```
