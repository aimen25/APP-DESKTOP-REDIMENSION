const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

// Chargement et affichage de l'image
function loadImage(e) {
  const file = e.target.files[0];

  if (!isFileImage(file)) {
    alertError('Veuillez sélectionner une image.');
    return;
  }

  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    widthInput.value = this.width;
    heightInput.value = this.height;
  };

  form.style.display = 'block';
  filename.textContent = file.name;
  outputPath.textContent = path.join(os.homedir(), 'imageresizer');
}

// Vérification du type de fichier
function isFileImage(file) {
  const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  return file && acceptedImageTypes.includes(file['type']);
}

// Redimensionnement de l'image
function resizeImage(e) {
  e.preventDefault();

  if (!img.files[0]) {
    alertError('Veuillez télécharger une image.');
    return;
  }

  if (widthInput.value === '' || heightInput.value === '') {
    alertError('Veuillez entrer une largeur et une hauteur.');
    return;
  }

  const imgPath = img.files[0].path;
  const width = widthInput.value;
  const height = heightInput.value;

  ipcRenderer.send('image:resize', { imgPath, height, width });
}

// Affichage de message à la fin du processus
ipcRenderer.on('image:done', () => 
  alertSuccess(`Image redimensionnée à ${widthInput.value} x ${heightInput.value}`)
);

function alertSuccess(message) {
  Toastify.toast({
    text: message,
    duration: 3000,
    close: true,
    style: {
      background: 'green',
      color: 'white',
      textAlign: 'center',
    },
  });
}

function alertError(message) {
  Toastify.toast({
    text: message,
    duration: 3000,
    close: true,
    style: {
      background: 'red',
      color: 'white',
      textAlign: 'center',
    },
  });
}

img.addEventListener('change', loadImage);
form.addEventListener('submit', resizeImage);
