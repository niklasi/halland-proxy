import async from 'async'
import { readFile } from 'fs'
import { join } from 'path'
import Forge from 'node-forge'

const pki = Forge.pki

export default loadRootCA

function loadRootCA (rootFolder, cb) {
  async.auto({
    certPEM: function (callback) {
      readFile(join(rootFolder, 'halland-proxy-ca.pem'), 'utf-8', callback)
    },
    keyPrivatePEM: function (callback) {
      readFile(join(rootFolder, 'halland-proxy-ca.private.key'), 'utf-8', callback)
    },
    keyPublicPEM: function (callback) {
      readFile(join(rootFolder, 'halland-proxy-ca.public.key'), 'utf-8', callback)
    }
  }, function (err, results) {
    if (err) {
      return cb(err)
    }

    const ca = {
      cert: pki.certificateFromPem(results.certPEM),
      keys: {
        privateKey: pki.privateKeyFromPem(results.keyPrivatePEM),
        publicKey: pki.publicKeyFromPem(results.keyPublicPEM)
      }
    }

    return cb(null, ca)
  })
}
