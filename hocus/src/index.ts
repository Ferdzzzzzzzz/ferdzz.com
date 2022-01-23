import {Server} from '@hocuspocus/server'

const server = Server.configure({
  port: 1234,
  onChange: async data => {
    console.log('===================')
    console.log(data)
  },
})

server.listen(async val => {
  console.log('started listening')
})
