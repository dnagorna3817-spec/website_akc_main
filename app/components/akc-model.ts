import * as THREE from "three";

/** Constructive geometry: bevelled triangular bands, not an image plane. */
export function createAKCModel() {
  const model = new THREE.Group();
  model.name = "AKC-metal-symbol";
  const pixels = new Uint8Array(128 * 128 * 4);
  let seed = 2718;
  for (let i = 0; i < pixels.length; i += 4) {
    seed = (1664525 * seed + 1013904223) >>> 0;
    const value = 220 + (seed % 26);
    pixels.set([value, value, value, 255], i);
  }
  const grain = new THREE.DataTexture(pixels, 128, 128);
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
  grain.repeat.set(6, 6);
  grain.needsUpdate = true;
  const front = new THREE.MeshPhysicalMaterial({
    color: "#084486", metalness: .9, roughness: .38,
    clearcoat: .15, clearcoatRoughness: .3,
    bumpMap: grain, bumpScale: .0004, roughnessMap: grain,
    envMapIntensity: .65,
  });
  const side = new THREE.MeshPhysicalMaterial({
    color: "#02132c", metalness: .55, roughness: .45, clearcoat: 0, envMapIntensity: .05,
  });
  const rim = new THREE.LineBasicMaterial({
    color: "#379eff", transparent: true, opacity: .36,
  });
  const geometries: THREE.BufferGeometry[] = [];
  const triangle = [new THREE.Vector2(0, 1), new THREE.Vector2(-1.04, -.8), new THREE.Vector2(1.04, -.8)];
  const addBand = (scale: number, x: number, y: number, depth: number) => {
    const shape = new THREE.Shape(triangle.map(p => p.clone().multiplyScalar(scale)));
    const hole = new THREE.Path(triangle.map(p => p.clone().multiplyScalar(scale * (scale === 1 ? .79 : .58))).reverse());
    shape.holes.push(hole);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth, bevelEnabled: true, bevelSegments: 3,
      bevelSize: .012 * Math.sqrt(scale), bevelThickness: .012,
      steps: 1, curveSegments: 1,
    });
    geometry.translate(x, y, -depth / 2);
    const mesh = new THREE.Mesh(geometry, [front, side]);
    model.add(mesh);
    const edges = new THREE.EdgesGeometry(geometry, 38);
    model.add(new THREE.LineSegments(edges, rim));
    geometries.push(geometry, edges);
  };
  addBand(1, 0, 0, .17);
  addBand(.37, 0, .27, .19);
  addBand(.37, -.43, -.47, .19);
  addBand(.37, .43, -.47, .19);
  const centre = new THREE.Shape([
    new THREE.Vector2(-.37, .04), new THREE.Vector2(.37, .04), new THREE.Vector2(0, -.60),
  ]);
  const centreGeometry = new THREE.ExtrudeGeometry(centre, {
    depth: .18, bevelEnabled: true, bevelSize: .012, bevelThickness: .012, bevelSegments: 3, steps: 1,
  });
  centreGeometry.translate(0, 0, -.08);
  const centreEdges = new THREE.EdgesGeometry(centreGeometry, 38);
  model.add(new THREE.Mesh(centreGeometry, [front, side]), new THREE.LineSegments(centreEdges, rim));
  geometries.push(centreGeometry, centreEdges);
  // Centre the physical bounding box, keeping the official triangular proportions.
  model.position.y = -.1;
  // Keep the home material intact; the close-up uses a blue rim and finer,
  // brushed microtexture instead of magnifying the home grain into pixels.
  const closePixels = new Uint8Array(512 * 512 * 4);
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      seed = (1664525 * seed + 1013904223) >>> 0;
      const value = 190 + (seed % 32) + Math.round(10 * Math.sin(y * 2.7));
      closePixels.set([value, value, value, 255], (y * 512 + x) * 4);
    }
  }
  const closeGrain = new THREE.DataTexture(closePixels, 512, 512);
  closeGrain.wrapS = closeGrain.wrapT = THREE.RepeatWrapping;
  closeGrain.repeat.set(14, 14);
  closeGrain.needsUpdate = true;
  const homeColor = front.color.clone();
  const closeColor = new THREE.Color("#155783");
  const homeSide = side.color.clone();
  const closeSide = new THREE.Color("#012953");
  let closeTexture = false;
  return {
    model,
    setExpertise: (progress: number) => {
      front.color.copy(homeColor).lerp(closeColor, progress);
      front.envMapIntensity = THREE.MathUtils.lerp(.65, .18, progress);
      side.color.copy(homeSide).lerp(closeSide, progress);
      side.metalness = THREE.MathUtils.lerp(.55, 1, progress);
      side.roughness = THREE.MathUtils.lerp(.45, .65, progress);
      side.envMapIntensity = .05 * (1 - progress);
      rim.opacity = THREE.MathUtils.lerp(.36, .7, progress);
      const nextClose = progress > .5;
      if (nextClose !== closeTexture) {
        closeTexture = nextClose;
        front.bumpMap = front.roughnessMap = nextClose ? closeGrain : grain;
        front.needsUpdate = true;
      }
    },
    dispose: () => {
      geometries.forEach(geometry => geometry.dispose());
      front.dispose(); side.dispose(); rim.dispose(); grain.dispose(); closeGrain.dispose();
    },
  };
}
