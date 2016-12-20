import { randomBytes } from 'crypto'
import Forge from 'node-forge'

const pki = Forge.pki

export default generateServerCertificate

function generateServerCertificate (ca = {cert: {}, keys: {privateKey: '', publicKey: ''}}, host, cb) {
  const keysServer = pki.rsa.generateKeyPair(1024)
  const certServer = pki.createCertificate()
  certServer.publicKey = keysServer.publicKey
  certServer.serialNumber = randomSerialNumber()
  certServer.validity.notBefore = new Date()
  certServer.validity.notBefore.setDate(certServer.validity.notBefore.getDate() - 1)
  certServer.validity.notAfter = new Date()
  certServer.validity.notAfter.setFullYear(certServer.validity.notBefore.getFullYear() + 2)
  const attrsServer = ServerAttrs.slice(0)
  attrsServer.unshift({
    name: 'commonName',
    value: host
  })
  certServer.setSubject(attrsServer)
  certServer.setIssuer(ca.cert.issuer.attributes)
  certServer.setExtensions(ServerExtensions.concat([{
    name: 'subjectAltName',
    altNames: host.match(/^[\d.]+$/) ? {type: 7, ip: host} : {type: 2, value: host}
  }]))
  certServer.sign(ca.keys.privateKey, Forge.md.sha256.create())
  const certPem = pki.certificateToPem(certServer)
  const keyPrivatePem = pki.privateKeyToPem(keysServer.privateKey)

  cb(certPem, keyPrivatePem)
}

function randomSerialNumber () {
  return randomBytes(16).toString('hex')
}

const ServerAttrs = [{
  name: 'countryName',
  value: 'Internet'
}, {
  shortName: 'ST',
  value: 'Internet'
}, {
  name: 'localityName',
  value: 'Internet'
}, {
  name: 'organizationName',
  value: 'Halland-Proxy'
}, {
  shortName: 'OU',
  value: 'Halland Proxy Server Certificate'
}]

const ServerExtensions = [{
  name: 'basicConstraints',
  cA: false
}, {
  name: 'keyUsage',
  keyCertSign: false,
  digitalSignature: true,
  nonRepudiation: false,
  keyEncipherment: true,
  dataEncipherment: true
}, {
  name: 'extKeyUsage',
  serverAuth: true,
  clientAuth: true,
  codeSigning: false,
  emailProtection: false,
  timeStamping: false
}, {
  name: 'nsCertType',
  client: true,
  server: true,
  email: false,
  objsign: false,
  sslCA: false,
  emailCA: false,
  objCA: false
}, {
  name: 'subjectKeyIdentifier'
}]
