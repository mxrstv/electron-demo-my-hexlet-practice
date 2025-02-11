import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import connectDB from './db';

async function getPartners() {
  try {
    const response = await global.dbclient.query(`
    SELECT p.*, ot.name as org_type, ot.id as org_type_id,
    CASE WHEN sum(o.kolio) > 300000 THEN 15
    	   WHEN sum(o.kolio) > 50000 THEN 10
         WHEN sum(o.kolio) > 10000 THEN 5
    ELSE 0
    END as discount
    FROM partners as p
    LEFT JOIN orders as o on p.id = o.partner_id
    LEFT JOIN org_types as ot on p.org_type_id = ot.id
    GROUP BY p.id, ot.name, ot.id`)
    return response.rows
  } catch (e) {
    console.log(e)
  }
}

async function getOrgTypes() {
  try {
    const response = await global.dbclient.query(`SELECT * FROM org_types`)
    return response.rows
  } catch (e) {
    console.log(e)
  }
}

async function createPartner(_event, partner) {
  const { name, director, email, phone, inn, address, rating, orgTypeId } = partner;
  // console.log(partner)
  try {
    await global.dbclient.query(`
      INSERT into partners (name, director, email, phone, inn, address, rating, org_type_id)
      values( '${name}', '${director}', '${email}', '${phone}', '${inn}', '${address}', ${rating}, '${orgTypeId}')`)
    dialog.showMessageBox({ message: 'Успех! Партнер создан' })
  } catch (e) {
    console.log(e)
    dialog.showErrorBox('Ошибка', "Партнер с таким именем уже есть")
  }
}

async function updatePartner(_event, partner) {
  const {id, name, director, email, phone, inn, address, rating, orgTypeId } = partner;
  console.log(partner);
  try {
    await global.dbclient.query(`UPDATE partners
      SET 
        name = '${name}',
        director='${director}',
        email='${email}',
        phone='${phone}',
        inn='${inn}',
        address='${address}',
        rating='${rating}',
        org_type_id = '${orgTypeId}'
      WHERE partners.id = ${id};`)
    dialog.showMessageBox({ message: 'Успех! Данные обновлены' })
    return;
  } catch (e) {
    console.log(e);
    dialog.showErrorBox('Ошибка', "Партнер с таким именем уже есть")
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 800,
    show: false,
    icon: join(__dirname, '../../resources/icon.ico'),
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  global.dbclient = await connectDB();

  ipcMain.handle('getPartners', getPartners)
  ipcMain.handle('createPartner', createPartner)
  ipcMain.handle('updatePartner', updatePartner)
  ipcMain.handle('getOrgTypes', getOrgTypes)

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
