import { ConnInfo } from "https://deno.land/std@0.186.0/http/server.ts"

type Path = "GET" | "POST" | "PUT" | "DELETE" | string
type Route = {
    path: Path
    method: Method
    headers?: Header
    handler: Handler
}
type Router = Map<Path, Routes>
type Routes = Map<Method, Route>
type Method = string
type Handler = (request: Request, conninfo: ConnInfo) => Response | Promise<Response>
type Error = {
    status: ErrorStatus
    handler: Handler
}
type Errors = Map<ErrorStatus, Handler>
type ErrorStatus = number
type Header = {
    [p: string]: string
}
type Options = {
    path: Path
    headers?: Header
    handler: Handler
}