const os = require('os');
const path = require('path');
const { contextBridge, ipcRenderer } = require('electron');
const Toastify = require('toastify-js');

// Liste des canaux IPC valides
const validChannels = ["image:resize", "image:done"];

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  on: (channel, func) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});

// Toastify personnalisé pour une meilleure intégration UI
contextBridge.exposeInMainWorld('Toastify', {
  toast: (options) => Toastify({
    ...options,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)", // Personnalisez selon le thème de votre application
    }
  }).showToast(),
});
