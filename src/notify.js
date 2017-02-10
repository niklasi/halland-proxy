// This code is 'borrowed' from the excellent Hyper app.
const {resolve} = require('path')

const {app, BrowserWindow} = require('electron')

let win

// the hack of all hacks
// electron doesn't have a built in notification thing,
// so we launch a window on which we can use the
// HTML5 `Notification` API :'(

let buffer = []

app.on('ready', () => {
  const win_ = new BrowserWindow({
    show: false
  })
  const url = 'file://' + resolve(__dirname, 'notify.html')
  win_.loadURL(url)
  win_.webContents.on('dom-ready', () => {
    win = win_
    buffer.forEach(([title, body]) => {
      notify(title, body)
    })
    buffer = null
  })
})

function notify (title, body) {
  console.log(`[Notification] ${title}: ${body}`)
  if (win) {
    win.webContents.send('notification', {title, body})
  } else {
    buffer.push([title, body])
  }
}

export default notify
