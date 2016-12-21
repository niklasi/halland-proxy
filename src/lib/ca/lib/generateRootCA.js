import Forge from 'node-forge'
import { randomBytes } from 'crypto'

const pki = Forge.pki

export default generateRootCA

function generateRootCA (cb) {
  pki.rsa.generateKeyPair({bits: 2048}, function (err, keys) {
    if (err) {
      return cb(err)
    }
    const cert = pki.createCertificate()
    cert.publicKey = keys.publicKey
    cert.serialNumber = randomSerialNumber()
    cert.validity.notBefore = new Date()
    cert.validity.notBefore.setDate(cert.validity.notBefore.getDate() - 1)
    cert.validity.notAfter = new Date()
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 10)
    cert.setSubject(CAattrs)
    cert.setIssuer(CAattrs)
    cert.setExtensions(CAextensions)
    cert.sign(keys.privateKey, Forge.md.sha256.create())

    return cb(null, {
      pemCertificate: pki.certificateToPem(cert),
      pemPrivateKey: pki.privateKeyToPem(keys.privateKey),
      pemPublicKey: pki.publicKeyToPem(keys.publicKey)
    })
  })
}

function randomSerialNumber () {
  return randomBytes(16).toString('hex')
}

const CAattrs = [{
  name: 'commonName',
  value: 'Halland Proxy CA'
}, {
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
  value: 'Halland Proxy CA'
}, {
  shortName: 'OU',
  value: 'CA'
}]

const CAextensions = [{
  name: 'basicConstraints',
  cA: true
}, {
  name: 'keyUsage',
  keyCertSign: true,
  digitalSignature: true,
  nonRepudiation: true,
  keyEncipherment: true,
  dataEncipherment: true
}, {
  name: 'extKeyUsage',
  serverAuth: true,
  clientAuth: true,
  codeSigning: true,
  emailProtection: true,
  timeStamping: true
}, {
  name: 'nsCertType',
  client: true,
  server: true,
  email: true,
  objsign: true,
  sslCA: true,
  emailCA: true,
  objCA: true
}, {
  name: 'subjectKeyIdentifier'
}]
