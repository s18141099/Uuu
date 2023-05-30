import { serve, serveTls, ServeTlsInit, ServeInit, ConnInfo } from "https://deno.land/std@0.186.0/http/server.ts"
import { Path, Route, Router, Handlers, Handler, Method, ErrorResponse } from "./index.d.ts"

export default class Uru {
    private defaultError = new Response("Internal Server Error", { status: 500 })
    private errorhandler = new Map<ErrorResponse, Handler>()
    private routers: Router = new Map<Path, Handlers>()
    private headers = new Map<string, string>()

    constructor() {
        this.errorhandler.set(404, () => new Response("Not found", { status: 404 }))
        this.errorhandler.set(403, () => new Response("Forbidden", { status: 403 }))
    }

    private router = async (req: Request, coninfo: ConnInfo): Promise<Response> => {
        const url = new URL(req.url)
        const path = url.pathname
        const route = this.routers.get(path)
        if (!route) return this.getError(404, req, coninfo)

        const method: Method = req.method
        const handler = route.get(method)
        if (!handler) return this.getError(403, req, coninfo)

        const response = await handler(req, coninfo)
        if (this.headers.size > 0) this.headers.forEach((v, n) => response.headers.set(n, v))

        return response
    }

    setError = (errorResponse: ErrorResponse, handler: Handler) => this.errorhandler.set(errorResponse, handler)

    private getError = (errorResponse: ErrorResponse, req: Request, conninfo: ConnInfo) => {
        const error = this.errorhandler.get(errorResponse)
        if (!error) return this.defaultError

        return error(req, conninfo)
    }

    setHeader = (name: string, value: string) => this.headers.set(name, value)

    set = (route: Route): Uru => {
        const handlers = this.routers.get(route.path)
        if (handlers) {
            handlers.set(route.method, route.handler)
            return this
        }

        const newHandlers: Handlers = new Map<Method, Handler>()
        newHandlers.set(route.method, route.handler)
        this.routers.set(route.path, newHandlers)

        return this
    }

    async listen(options?: ServeInit) {
        await serve(this.router, options)
    }

    async listenTls(options: ServeTlsInit) {
        await serveTls(this.router, options)
    }
}
