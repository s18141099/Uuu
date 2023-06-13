import { Uuu } from "./mods.ts"

// Create an instance of Uuu
const uuu = new Uuu()

// Set up a route
uuu
    .route({ path: "/" })
    .on({
        method: "GET",
        headers: { "X-Custom-Header": "Custom Value" },
        handler: () => new Response("Hello!"),
    })
    .on({
        method: "POST",
        headers: { "X-Custom-Header": "Custom Value" },
        handler: () => new Response("GoodBye!"),
    })

// Start listening for requests
uuu.listen({ port: 8000 })