import os from 'os'
import path from 'path'
import electron, { app, shell } from 'electron'
import certInstaller from 'cert-installer'
import { updatePlugins } from './plugins'
import notify from './notify'
import debugFactory from 'debug'
import { getMainWindow } from './windows'

const debug = debugFactory('halland-proxy:main')
const appName = app.getName()

const helpSubmenu = [
  {
    label: `${appName} Website`,
    click () {
      shell.openExternal('https://github.com/niklasi/halland-proxy')
    }
  },
  {
    label: 'Report an Issue...',
    click () {
      const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->

-

${app.getName()} ${app.getVersion()}
Electron ${process.versions.electron}
${process.platform} ${process.arch} ${os.release()}`

      shell.openExternal(`https://github.com/niklasi/halland-proxy/issues/new?body=${encodeURIComponent(body)}`)
    }
  }
]

if (process.platform !== 'darwin') {
  helpSubmenu.push({
    type: 'separator'
  }, {
    role: 'about',
    click () {
      electron.dialog.showMessageBox({
        title: `About ${appName}`,
        message: `${appName} ${app.getVersion()}`,
        detail: 'Created by Niklas Ingholt',
        icon: path.join(__dirname, 'static/Icon.png'),
        buttons: []
      })
    }
  })
}

const viewSubmenu = [
  {
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click () {
      getMainWindow().reload()
    }
  },
  {
    label: 'Toggle Developer Tools',
    accelerator: 'Alt+CmdOrCtrl+I',
    click () {
      getMainWindow().toggleDevTools()
    }
  }
]
const toolsSubmenu = [
  {
    label: 'Update plugins',
    accelerator: 'CmdOrCtrl+U',
    click () {
      debug('Update plugins...')
      updatePlugins((err) => {
        if (err) {
          notify('Error installing plugins', err)
        } else {
          notify('Plugins', 'Plugins installed successfully...')
        }
      })
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'Install root cert',
    accelerator: 'CmdOrCtrl+i',
    click () {
      const cert = path.resolve(app.getPath('userData'), 'halland-proxy-ca.pem').replace(/ /g, '\\ ')
      certInstaller(cert, {trust: true}, (err) => {
        if (err) {
          notify('Error installing ca-cert', err.message)
        } else {
          notify('Insalling ca-cert', 'Halland-proxy-ca.pem has been successfully installed.')
        }
      })
    }
  }
]

const darwinTpl = [
  {
    label: appName,
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: viewSubmenu
  },
  {
    label: 'Tools',
    submenu: toolsSubmenu
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      },
      {
        type: 'separator'
      },
      {
        role: 'front'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    role: 'help',
    submenu: helpSubmenu
  }
]

const otherTpl = [
  {
    label: 'File',
    submenu: [
      {
        role: 'quit'
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        type: 'separator'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: viewSubmenu
  },
  {
    label: 'Tools',
    submenu: toolsSubmenu
  },
  {
    role: 'help',
    submenu: helpSubmenu
  }
]

const tpl = process.platform === 'darwin' ? darwinTpl : otherTpl

module.exports = electron.Menu.buildFromTemplate(tpl)
