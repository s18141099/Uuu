import { ConnInfo } from "https://deno.land/std@0.186.0/http/server.ts"

type Path = string
type Route = {
    path: Path
    method: Method
    handler: Handler
}
type Router = Map<Path, Handlers>
type Method = string
type Handlers = Map<Method, Handler>
type Handler = (request: Request, conninfo: ConnInfo) => Response | Promise<Response>
type Error = {
    status: ErrorStatus
    handler: Handler
}
type ErrorStatus = number
type Header = {
    name: string
    value: string
}