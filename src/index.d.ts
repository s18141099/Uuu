import { ConnInfo } from "https://deno.land/std@0.186.0/http/server.ts"

type Path = string
type Route = { path: Path }
type Config = {
    method: Method
    headers?: Header
    handler: Handler
}
type Router = Map<Path, Routes>
type Routes = Map<Method, Route>
type Method = "GET" | "POST" | "PUT" | "DELETE" | string
type Handler = (request: Request, conninfo: ConnInfo) => Response | Promise<Response>
type Error = {
    status: Status
    handler: Handler
}
type Errors = Map<Status, Handler>
type Status = number
type Header = {
    [p: string]: string
}
type Options = {
    path: Path
    headers?: Header
    handler: Handler
}