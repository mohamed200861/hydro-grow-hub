// Growing Knowledge - gestione caricamenti con IndexedDB
(function () {
  const DB_NAME = 'gk-db';
  const STORE = 'files';
  const VIDEO_KEY = 'userVideo';
  const PHOTOS_KEY = 'userPhotos';

  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  async function idbGet(key) {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readonly').objectStore(STORE).get(key);
      tx.onsuccess = () => res(tx.result);
      tx.onerror = () => rej(tx.error);
    });
  }
  async function idbSet(key, value) {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readwrite').objectStore(STORE).put(value, key);
      tx.onsuccess = () => res();
      tx.onerror = () => rej(tx.error);
    });
  }
  async function idbDel(key) {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readwrite').objectStore(STORE).delete(key);
      tx.onsuccess = () => res();
      tx.onerror = () => rej(tx.error);
    });
  }

  function fileToBlob(file) {
    return { blob: file, type: file.type, name: file.name };
  }

  // ---------- Render galleria ----------
  async function renderGallery(containerId, emptyId) {
    const container = document.getElementById(containerId);
    const empty = document.getElementById(emptyId);
    if (!container) return;
    const photos = (await idbGet(PHOTOS_KEY)) || [];
    container.innerHTML = '';
    if (!photos.length) { if (empty) empty.style.display = 'block'; return; }
    if (empty) empty.style.display = 'none';
    photos.forEach(p => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(p.blob);
      img.alt = p.name || 'Foto caricata';
      img.loading = 'lazy';
      container.appendChild(img);
    });
  }

  // ---------- Render video ----------
  async function renderVideo(wrapId, emptyId) {
    const wrap = document.getElementById(wrapId);
    const empty = document.getElementById(emptyId);
    if (!wrap) return;
    const video = await idbGet(VIDEO_KEY);
    wrap.innerHTML = '';
    if (!video) { if (empty) empty.style.display = 'block'; return; }
    if (empty) empty.style.display = 'none';
    const v = document.createElement('video');
    v.controls = true;
    v.src = URL.createObjectURL(video.blob);
    wrap.appendChild(v);
  }

  // ---------- Upload page ----------
  function initUploadPage() {
    const videoInput = document.getElementById('videoInput');
    const videoPreview = document.getElementById('videoPreview');
    const saveVideoBtn = document.getElementById('saveVideoBtn');
    const videoMsg = document.getElementById('videoMsg');
    let pendingVideo = null;

    videoInput.addEventListener('change', e => {
      videoPreview.innerHTML = '';
      videoMsg.textContent = '';
      const f = e.target.files[0];
      if (!f) { saveVideoBtn.disabled = true; return; }
      pendingVideo = f;
      const v = document.createElement('video');
      v.src = URL.createObjectURL(f);
      v.controls = true;
      videoPreview.appendChild(v);
      saveVideoBtn.disabled = false;
    });

    saveVideoBtn.addEventListener('click', async () => {
      if (!pendingVideo) return;
      try {
        await idbSet(VIDEO_KEY, fileToBlob(pendingVideo));
        videoMsg.textContent = '✓ Video caricato correttamente';
        videoMsg.className = 'msg success';
      } catch (err) {
        videoMsg.textContent = 'Errore nel salvataggio: ' + err.message;
        videoMsg.className = 'msg error';
      }
    });

    const photoInput = document.getElementById('photoInput');
    const photoPreview = document.getElementById('photoPreview');
    const savePhotoBtn = document.getElementById('savePhotoBtn');
    const photoMsg = document.getElementById('photoMsg');
    let pendingPhotos = [];

    photoInput.addEventListener('change', e => {
      photoPreview.innerHTML = '';
      photoMsg.textContent = '';
      pendingPhotos = Array.from(e.target.files);
      if (!pendingPhotos.length) { savePhotoBtn.disabled = true; return; }
      pendingPhotos.forEach(f => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(f);
        img.alt = f.name;
        photoPreview.appendChild(img);
      });
      savePhotoBtn.disabled = false;
    });

    savePhotoBtn.addEventListener('click', async () => {
      if (!pendingPhotos.length) return;
      try {
        const existing = (await idbGet(PHOTOS_KEY)) || [];
        const next = existing.concat(pendingPhotos.map(fileToBlob));
        await idbSet(PHOTOS_KEY, next);
        photoMsg.textContent = '✓ Foto caricate correttamente (' + pendingPhotos.length + ')';
        photoMsg.className = 'msg success';
      } catch (err) {
        photoMsg.textContent = 'Errore nel salvataggio: ' + err.message;
        photoMsg.className = 'msg error';
      }
    });

    document.getElementById('clearAllBtn').addEventListener('click', async () => {
      if (!confirm('Vuoi eliminare tutti i contenuti caricati (foto e video)?')) return;
      await idbDel(VIDEO_KEY);
      await idbDel(PHOTOS_KEY);
      videoPreview.innerHTML = '';
      photoPreview.innerHTML = '';
      videoMsg.textContent = '';
      photoMsg.textContent = '';
      saveVideoBtn.disabled = true;
      savePhotoBtn.disabled = true;
      videoInput.value = '';
      photoInput.value = '';
      alert('Contenuti caricati eliminati.');
    });
  }

  window.GK = { renderGallery, renderVideo, initUploadPage };
})();
