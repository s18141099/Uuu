/**
 * Ulu is a TypeScript class that provides a simple and flexible router for handling HTTP requests.
 */
import { serve, serveTls, ServeTlsInit, ServeInit, ConnInfo } from "https://deno.land/std@0.186.0/http/server.ts"
import { Path, Route, Router, Handlers, Handler, Method, Errors, Error, ErrorStatus, Header } from "./index.d.ts"

export default class Ulu {
    private errorHandler: Errors = new Map<ErrorStatus, Handler>()
    private routers: Router = new Map<Path, Handlers>()
    private headers = new Map<string, string>()

    /**
     * Sets the default error handler for a specific error response.
     */
    constructor() {
        this.errorHandler.set(505, () => new Response("Internal Server Error", { status: 500 }))
        this.errorHandler.set(404, () => new Response("Not found", { status: 404 }))
        this.errorHandler.set(403, () => new Response("Forbidden", { status: 403 }))
    }

    /**
     * Processes the request and routes it to the appropriate handler.
     * Returns the appropriate response based on the route and request method.
     * @param req The request object
     * @param coninfo The connection information object
     * @returns The processed response object
     */
    private router = async (req: Request, coninfo: ConnInfo): Promise<Response> => {
        const url = new URL(req.url)
        const path = url.pathname
        const route = this.routers.get(path)
        if (!route) {
            const errorHandler = this.getError(404)
            return errorHandler(req, coninfo)
        }

        const method: Method = req.method
        const handler = route.get(method)
        if (!handler) {
            const errorHandler = this.getError(403)
            return errorHandler(req, coninfo)
        }

        const response = await handler(req, coninfo)
        if (this.headers.size > 0) this.headers.forEach((v, n) => response.headers.set(n, v))

        return response
    }

    /**
     * Sets a custom error handler for a specific error response.
     * @param error The error object
     */
    setError = (error: Error): void => { this.errorHandler.set(error.status, error.handler) }

    /**
     * Gets the appropriate error handler for an error response.
     * Returns the default error handler if a custom error handler is not found.
     * @param errorResponse The error response status code
     * @returns The error handler
     */
    private getError = (errorResponse: ErrorStatus): Handler => this.errorHandler.get(errorResponse) || this.errorHandler.get(505) as Handler

    /**
     * Sets a custom header to include in the response.
     * @param header The header object
     */
    setHeader = (header: Header) => this.headers.set(header.name, header.value)

    /**
     * Sets the route and its corresponding handler.
     * @param route The route configuration
     * @returns An instance of the Ulu class
     */
    set = (route: Route): Ulu => {
        const method = route.method.toUpperCase()
        const handlers = this.routers.get(route.path)
        if (handlers) {
            handlers.set(method, route.handler)
            return this
        }

        const newHandlers: Handlers = new Map<Method, Handler>()
        newHandlers.set(method, route.handler)
        this.routers.set(route.path, newHandlers)

        return this
    }

    /**
     * Starts listening for HTTP requests with the specified options.
     * @param options The server initialization options
     */
    async listen(options?: ServeInit): Promise<void> {
        await serve(this.router, options)
    }

    /**
     * Starts listening for HTTPS requests with the specified options.
     * @param options The TLS server initialization options
     */
    async listenTls(options: ServeTlsInit): Promise<void> {
        await serveTls(this.router, options)
    }
}
