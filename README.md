# Ulu

## Usage

```typescript
import Uuu from "uuu";

// Create an instance of Ulu
const uuu = new Uuu();

// Set up a route
uuu
  .set({
    path: "/hello",
    method: "GET",
    handler: (req, coninfo) => new Response("Hello, Ulu!"),
  })
  .set({
    path: "/goodbye",
    method: "GET",
    handler: (req, coninfo) => new Response("GoodBye, Ulu..."),
  });

// Set custom headers
uuu.setHeader({ name: "X-Custom-Header", value: "Custom Value" });

// Set an error handler
uuu.setError({
  response: 404,
  handler: () => new Response("Custom Not Found", { status: 404 }),
});

// Start listening for requests
uuu.listen({ port: 8000 });
```
