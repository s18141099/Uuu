import { ConnInfo } from "https://deno.land/std@0.186.0/http/server.ts"

type Router = Map<string, Handlers>
type Method = string | "GET" | "POST" | "PUT" | "DELETE"
type Handlers = Map<Method, Handler>
type Handler = (request: Request, conninfo: ConnInfo) => Response | Promise<Response>
type ErrorResponse = "path" | "method"