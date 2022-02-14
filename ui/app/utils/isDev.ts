export const isDev = process.env.NODE_ENV === 'development'

// default to prod incase something goes wrong
export const isProd = !isDev
