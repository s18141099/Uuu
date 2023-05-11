import { serve, ServeInit, ConnInfo } from "https://deno.land/std@0.186.0/http/server.ts"
import { Router, Handlers, Handler, Method, ErrorResponse } from "./index.d.ts"

export class Staller {
    private defaultError = new Response("Internal Server Error", { status: 500 })
    private errorhandler = new Map<string, Handler>()
    private handlers: Router = new Map<ErrorResponse, Handlers>()
    private headers = new Map<string, string>()

    constructor() {
        this.errorhandler.set("path", () => new Response("Not found", { status: 404 }))
        this.errorhandler.set("method", () => new Response("Forbidden", { status: 403 }))
    }

    private router = async (req: Request, coninfo: ConnInfo): Promise<Response> => {
        const url = new URL(req.url)
        const path = url.pathname
        const route = this.handlers.get(path)
        if (!route) return this.getError("path", req, coninfo) || this.defaultError

        const method: Method = req.method
        const handler = route.get(method)
        if (!handler) return this.getError("method", req, coninfo) || this.defaultError

        const response = await handler(req, coninfo)
        if (this.headers.size > 0) this.headers.forEach((v, n) => response.headers.set(n, v))

        return response
    }

    setError = (errorResponse: ErrorResponse, handler: Handler) => this.errorhandler.set(errorResponse, handler)

    private getError = (errorResponse: ErrorResponse, req: Request, coninfo: ConnInfo) => {
        const h = this.errorhandler.get(errorResponse)
        if (!h) return this.defaultError

        return h(req, coninfo)
    }

    setHeader = (name: string, value: string) => this.headers.set(name, value)

    set = (path: string, mehod: Method, handler: Handler) => {
        const handlers = this.handlers.get(path)
        if (handlers) return handlers.set(mehod, handler)

        const newHandlers: Handlers = new Map<string, Handler>()
        newHandlers.set(mehod, handler)
        this.handlers.set(path, newHandlers)
    }

    async listen(options?: ServeInit) {
        await serve(this.router, options)
    }
}
