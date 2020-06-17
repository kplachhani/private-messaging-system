// All configurations will extend these options
// ============================================

const configFactory: any = {
  apiName: "ChatServer",
  env: process.env.NODE_ENV,
  // Server port
  port: process.env.PORT,

  // Server protocol
  protocol: process.env.PROTOCOL,

  // Server host
  host: process.env.HOST,

  // Server IP
  ip: process.env.IP,

  // Domain (e.g. https://localhost)
  domain: process.env.DOMAIN,

};


export default configFactory;