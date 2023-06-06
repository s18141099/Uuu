const mids = {
    setTemplate: async ({ path, values = {} }: { path: string, values?: Record<string, string> }): Promise<Uint8Array> => {
        const html: Uint8Array = await Deno.readFile(path)

        let htmlText: string = new TextDecoder().decode(html)
        Object.keys(values).forEach(key => {
            htmlText = htmlText.replaceAll(key, values[key])
        })

        return new TextEncoder().encode(htmlText)
    }
}

export { mids }