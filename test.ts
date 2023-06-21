import { Uuu } from "./mods.ts"

const app = new Uuu()

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "Content-Type"
}

app.route({ path: "/" })
    .on({
        method: "OPTIONS",
        headers: headers,
        handler: () => {
            return new Response("OPTIONS")
        }
    })
    .on({
        method: "GET",
        headers: headers,
        handler: () => {
            // console.log("GET")
            return new Response("GET")
        }
    })
    .on({
        method: "POST",
        headers: headers,
        handler: () => {
            // console.log("POST")
            return new Response("POST")
        }
    })
    .on({
        method: "PUT",
        headers: headers,
        handler: () => {
            // console.log("PUT")
            return new Response("PUT")
        }
    })

app.listen()
