# Ulu

## Usage

```typescript
import Ulu from 'ulu'

// Create an instance of Ulu
const ulu = new Ulu()

// Set up a route
ulu
  .set({ path: '/hello', method: 'GET', handler: (req, coninfo) => new Response('Hello, Ulu!')})
  .set({ path: '/goodbye', method: 'GET', handler: (req, coninfo) => new Response('GoodBye, Ulu...')})
  
// Set custom headers
ulu.setHeader({ name: 'X-Custom-Header', value: 'Custom Value'})

// Set an error handler
ulu.setError({ response: 404, handler: () => new Response('Custom Not Found', { status: 404 })})

// Start listening for requests
ulu.listen({ port: 8000 })

```
