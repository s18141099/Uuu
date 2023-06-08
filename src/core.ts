import { Path, Route, Routes, Router, Handler, Method, Error, ErrorStatus, Errors } from "./index.d.ts"
import { serve, serveTls, ServeTlsInit, ServeInit, ConnInfo } from "https://deno.land/std@0.186.0/http/server.ts"

export { Uuu }

/**
 * Uuu is a TypeScript class that provides a simple and flexible handlers for handling HTTP requests.
 */
class Uuu {
    private errorsMap: Errors = new Map<ErrorStatus, Handler>()
    private routesMap: Router = new Map<Path, Routes>()

    /**
     * Sets the default error handler for a specific error response.
     */
    constructor() {
        this.setError({ status: 500, handler: () => new Response("Internal Server Error", { status: 500 }) })
        this.setError({ status: 404, handler: () => new Response("Not found", { status: 404 }) })
        this.setError({ status: 403, handler: () => new Response("Forbidden", { status: 403 }) })
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
        const routes = this.routesMap.get(path)
        if (!routes) {
            const errors = this.getError(404)
            return errors(req, coninfo)
        }

        const method: Method = req.method
        const route = routes.get(method)
        if (!route) {
            const errors = this.getError(403)
            return errors(req, coninfo)
        }

        const response = await route.handler(req, coninfo)
        if (route.headers) route.headers.forEach((header) => response.headers.set(header.name, header.value))

        return response
    }

    /**
     * Sets a custom error handler for a specific error response.
     * @param error The error object
     */
    setError = (error: Error): void => { this.errorsMap.set(error.status, error.handler) }

    /**
     * Gets the appropriate error handler for an error response.
     * Returns the default error handler if a custom error handler is not found.
     * @param errorResponse The error response status code
     * @returns The error handler
     */
    private getError = (errorResponse: ErrorStatus): Handler => this.errorsMap.get(errorResponse) || this.errorsMap.get(505) as Handler

    /**
     * Sets the route and its corresponding handler.
     * @param route The route configuration
     * @returns An instance of the Ulu class
     */
    route = (route: Route): Uuu => {
        const method = route.method.toUpperCase()
        const routes = this.routesMap.get(route.path)
        if (routes) {
            routes.set(method, route)
            return this
        }

        const newRoutes: Routes = new Map<Method, Route>()
        newRoutes.set(method, route)
        this.routesMap.set(route.path, newRoutes)

        return this
    }

    /**
     * Display the set path and the corresponding method in the console.
     */
    showRoute = (): void => {
        let log = `\n---------------------\n| Route and method. |\n---------------------\n`

        const routeMap = this.routesMap
        Array.from(routeMap.keys()).forEach(route => {
            log += `\n● \x1b[34m${route}\x1b[0m\n`

            const method = routeMap.get(route)!.keys()
            Array.from(method).forEach((method) => {
                log += `└----------${method}\n`
            })
        })

        console.log(log)
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

