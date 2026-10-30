import * as THREE from "three";

/** Constructive geometry: bevelled triangular bands, not an image plane. */
export function createAKCModel() {
  const model = new THREE.Group();
  model.name = "AKC-metal-symbol";
  const front = new THREE.MeshPhysicalMaterial({
    color: "#12558f", metalness: .72, roughness: .54,
    clearcoat: .06, clearcoatRoughness: .65,
    envMapIntensity: .55,
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
  // Keep the same physically smooth surface at every zoom level.
  // Brushed texture can later be added as a properly UV-mapped color map,
  // without noisy bump/displacement or a sudden mid-transition texture swap.
  const homeColor = front.color.clone();
  const closeColor = new THREE.Color("#155783");
  const homeSide = side.color.clone();
  const closeSide = new THREE.Color("#012953");
  return {
    model,
    setExpertise: (progress: number) => {
      front.color.copy(homeColor).lerp(closeColor, progress);
      front.envMapIntensity = THREE.MathUtils.lerp(.55, .32, progress);
      front.roughness = THREE.MathUtils.lerp(.54, .62, progress);
      front.metalness = THREE.MathUtils.lerp(.72, .76, progress);
      side.color.copy(homeSide).lerp(closeSide, progress);
      side.metalness = THREE.MathUtils.lerp(.55, 1, progress);
      side.roughness = THREE.MathUtils.lerp(.45, .65, progress);
      side.envMapIntensity = .05 * (1 - progress);
      rim.opacity = THREE.MathUtils.lerp(.36, .7, progress);

    },
    dispose: () => {
      geometries.forEach(geometry => geometry.dispose());
      front.dispose(); side.dispose(); rim.dispose();
    },
  };
}
