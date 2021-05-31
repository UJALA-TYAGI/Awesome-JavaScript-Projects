import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";

function main() {
  const canvas = document.querySelector("#canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    preserveDrawingBuffer: true,
    alpha: true,
  });
  renderer.autoClearColor = false;

  const camera = new THREE.OrthographicCamera(-2, 2, 1, -1, -1, 1);

  const scene = new THREE.Scene();

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const radius = 0.8;
  const detail = 2;
  const geometry = new THREE.IcosahedronGeometry(radius, detail);

  const base = new THREE.Object3D();
  scene.add(base);
  base.scale.set(0.1, 0.1, 0.1);

  function makeInstance(geometry, color, x, y, z) {
    const material = new THREE.MeshPhongMaterial({ color });

    const cube = new THREE.Mesh(geometry, material);
    base.add(cube);

    cube.position.set(x, y, z);

    return cube;
  }

  makeInstance(geometry, "#0FF", -2, 0, 0);
  makeInstance(geometry, "#0F0", 2, 0, 0);

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  const state = { x: 0, y: 0 };

  function render(time) {
    time *= 0.001; // convert to seconds

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.right = canvas.clientWidth / canvas.clientHeight;
      camera.left = -camera.right;
      camera.updateProjectionMatrix();
    }

    base.position.set(state.x, state.y, 0);
    base.rotation.x = time;
    base.rotation.y = time * 1.11;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * canvas.width) / rect.width,
      y: ((event.clientY - rect.top) * canvas.height) / rect.height,
    };
  }

  const temp = new THREE.Vector3();
  function setPosition(e) {
    const pos = getCanvasRelativePosition(e);
    const x = (pos.x / canvas.width) * 2 - 1;
    const y = (pos.y / canvas.height) * -2 + 1;
    temp.set(x, y, 0).unproject(camera);
    state.x = temp.x;
    state.y = temp.y;
  }

  canvas.addEventListener("mousemove", setPosition);
  canvas.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
      setPosition(e.touches[0]);
    },
    { passive: false }
  );
}

main();
