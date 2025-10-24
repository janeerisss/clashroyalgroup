// === AR.js + A-Frame para producción (GitHub Pages) ===
// Arranca en SIM si el navegador no permite cámara; en móviles (HTTPS) podrás cambiar a CÁMARA.
(function () {
  const HIRO_IMG =
    'https://raw.githubusercontent.com/AR-js-org/AR.js/master/three.js/examples/marker-training/examples/Hiro_marker.png';

  const MODES = { CAMERA: 'camera', SIM: 'sim' };
  // Intento: si hay HTTPS + mediaDevices, usa cámara; si no, SIM
  let current = (window.isSecureContext && navigator.mediaDevices) ? MODES.CAMERA : MODES.SIM;

  const stage = document.getElementById('stage');
  const statusEl = document.getElementById('status');
  function setStatus(t) { if (statusEl) statusEl.textContent = t; }

  function build(mode) {
    current = mode;
    stage.innerHTML = '';

    const scene = document.createElement('a-scene');
    scene.setAttribute('embedded', '');
    scene.setAttribute('vr-mode-ui', 'enabled: false');
    scene.setAttribute('renderer', 'alpha:true; antialias:true');

    if (mode === MODES.CAMERA) {
      scene.setAttribute(
        'arjs',
        'sourceType: webcam; facingMode: environment; videoTexture: true; trackingMethod: best; debugUIEnabled:false;'
      );
    } else {
      scene.setAttribute(
        'arjs',
        `sourceType: image; sourceUrl: ${HIRO_IMG}; trackingMethod: best; debugUIEnabled:false;`
      );
    }

    // Cámara
    const cam = document.createElement('a-entity');
    cam.setAttribute('camera', '');
    scene.appendChild(cam);

    // Marcador Hiro
    const marker = document.createElement('a-marker');
    marker.setAttribute('preset', 'hiro');

    // Objetos de ejemplo
    const plane = document.createElement('a-plane');
    plane.setAttribute('position', '0 0 0');
    plane.setAttribute('rotation', '-90 0 0');
    plane.setAttribute('width', '2');
    plane.setAttribute('height', '2');
    plane.setAttribute('color', '#666');
    marker.appendChild(plane);

    const box = document.createElement('a-box');
    box.setAttribute('color', '#6aa8ff');
    box.setAttribute('width', '0.5');
    box.setAttribute('height', '0.5');
    box.setAttribute('depth', '0.5');
    box.setAttribute('position', '-0.6 0.25 0');
    box.setAttribute('animation', 'property=rotation; to=0 360 0; loop:true; dur:3000');
    marker.appendChild(box);

    const sphere = document.createElement('a-sphere');
    sphere.setAttribute('position', '0 0.4 0');
    sphere.setAttribute('radius', '0.3');
    sphere.setAttribute('color', '#F9C74F');
    sphere.setAttribute('animation', 'property: position; dir: alternate; dur: 1200; loop: true; to: 0 0.8 0');
    marker.appendChild(sphere);

    const txt = document.createElement('a-text');
    txt.setAttribute('value', 'Hiro');
    txt.setAttribute('align', 'center');
    txt.setAttribute('position', '0 1.1 0');
    txt.setAttribute('scale', '1.5 1.5 1.5');
    marker.appendChild(txt);

    // Tu caja extra (roja) de ejemplo
    const box2 = document.createElement('a-box');
    box2.setAttribute('position', '0 0.5 0');
    box2.setAttribute('color', '#ff0000');
    marker.appendChild(box2);

    scene.appendChild(marker);

    // Estados
    scene.addEventListener('loaded', () => {
      setStatus(`Modo: ${mode === MODES.CAMERA ? 'Cámara' : 'Simulación'}`);
    });
    document.addEventListener('arjs-video-loaded', () => setStatus('Cámara lista'), { once: true });
    marker.addEventListener('markerFound', () => setStatus('Marcador detectado ✔'));
    marker.addEventListener('markerLost',  () => setStatus('Buscando marcador…'));

    stage.appendChild(scene);
  }

  // Iniciar
  build(current);

  // Botón para alternar
  document.getElementById('modeBtn').addEventListener('click', () => {
    build(current === MODES.CAMERA ? MODES.SIM : MODES.CAMERA);
  });
})();
