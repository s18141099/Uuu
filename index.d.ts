import { ConnInfo } from "https://deno.land/std@0.186.0/http/server.ts"

type Path = string
type Route = {
    path: Path
    method: Method
    handler: Handler
}
type Router = Map<Path, Handlers>
type Method = string
type Handler = (request: Request, conninfo: ConnInfo) => Response | Promise<Response>
type Handlers = Map<Method, Handler>
type Error = {
    status: ErrorStatus
    handler: Handler
}
type Errors = Map<ErrorStatus, Handler>
type ErrorStatus = number
type Header = {
    name: string
    value: string
}