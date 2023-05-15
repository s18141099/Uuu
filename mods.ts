import { serve, ServeInit, ConnInfo } from "https://deno.land/std@0.186.0/http/server.ts"
import { Route, Router, Handlers, Handler, Method, ErrorResponse } from "./index.d.ts"

export class Alice {
    private defaultError = new Response("Internal Server Error", { status: 500 })
    private errorhandler = new Map<ErrorResponse, Handler>()
    private routers: Router = new Map<Route, Handlers>()
    private headers = new Map<string, string>()

    constructor() {
        this.errorhandler.set("path", () => new Response("Not found", { status: 404 }))
        this.errorhandler.set("method", () => new Response("Forbidden", { status: 403 }))
    }

    private router = async (req: Request, coninfo: ConnInfo): Promise<Response> => {
        const url = new URL(req.url)
        const path = url.pathname
        const route = this.routers.get(path)
        if (!route) return this.getError("path", req, coninfo)

        const method: Method = req.method
        const handler = route.get(method)
        if (!handler) return this.getError("method", req, coninfo)

        const response = await handler(req, coninfo)
        if (this.headers.size > 0) this.headers.forEach((v, n) => response.headers.set(n, v))

        return response
    }

    setError = (errorResponse: ErrorResponse, handler: Handler) => this.errorhandler.set(errorResponse, handler)

    private getError = (errorResponse: ErrorResponse, req: Request, coninfo: ConnInfo) => {
        const error = this.errorhandler.get(errorResponse)
        if (!error) return this.defaultError

        return error(req, coninfo)
    }

    setHeader = (name: string, value: string) => this.headers.set(name, value)

    set = (path: string, mehod: Method, handler: Handler) => {
        const handlers = this.routers.get(path)
        if (handlers) return handlers.set(mehod, handler)

        const newHandlers: Handlers = new Map<string, Handler>()
        newHandlers.set(mehod, handler)
        this.routers.set(path, newHandlers)
    }

    async listen(options?: ServeInit) {
        await serve(this.router, options)
    }
}
