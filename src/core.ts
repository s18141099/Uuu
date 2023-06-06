/**
 * Ulu is a TypeScript class that provides a simple and flexible handlers for handling HTTP requests.
 */
import { Path, Route, Routes, Router, Handler, Method, Error, ErrorStatus, Errors } from "./index.d.ts"
import { serve, serveTls, ServeTlsInit, ServeInit, ConnInfo } from "https://deno.land/std@0.186.0/http/server.ts"

export { Uuu }

class Uuu {
    private errorHandler: Errors = new Map<ErrorStatus, Handler>()
    private routes: Router = new Map<Path, Routes>()

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
        const routes = this.routes.get(path)
        if (!routes) {
            const errorHandler = this.getError(404)
            return errorHandler(req, coninfo)
        }

        const method: Method = req.method
        const route = routes.get(method)
        if (!route) {
            const errorHandler = this.getError(403)
            return errorHandler(req, coninfo)
        }

        const response = await route.handler(req, coninfo)
        if (route.headers) route.headers.forEach((header) => response.headers.set(header.name, header.value))

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
     * Sets the route and its corresponding handler.
     * @param route The route configuration
     * @returns An instance of the Ulu class
     */
    set = (route: Route): Uuu => {
        const method = route.method.toUpperCase()
        const routes = this.routes.get(route.path)
        if (routes) {
            routes.set(method, route)
            return this
        }

        const newRoutes: Routes = new Map<Method, Route>()
        newRoutes.set(method, route)
        this.routes.set(route.path, newRoutes)

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

