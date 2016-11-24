import ip from 'ip'
import packageJson from '../../../package.json'

export default () => {
  const q = document.querySelector.bind(document)

  const title = q('title')
  title.innerText += packageJson.name + ' ' + ip.address()
}
