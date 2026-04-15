import '@fastify/cookie'

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      sub: string
    }
  }
}