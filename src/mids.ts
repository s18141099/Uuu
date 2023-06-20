export { mids }

const mids = {
    genTemplate: ({ path, values = {} }: { path: string, values?: Record<string, string> }): Uint8Array => {
        const html: Uint8Array = Deno.readFileSync(path)

        let htmlText: string = new TextDecoder().decode(html)
        Object.keys(values).forEach(key => {
            htmlText = htmlText.replaceAll(key, values[key])
        })

        return new TextEncoder().encode(htmlText)
    }
}