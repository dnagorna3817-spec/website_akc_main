import * as THREE from "three";

/**
 * Claude prototype's traced PNG silhouette, rather than the previous
 * approximation assembled from overlapping triangular bands.
 * Coordinates are from the user's exported AKC prototype (1050 × 1024).
 */
const OUTLINE: [number, number][] = [[521,126],[515,126],[197,675],[199,681],[425,683],[356,558],[350,558],[296,651],[253,650],[353,480],[489,720],[174,717],[150,752],[151,759],[784,763],[785,757],[675,558],[669,559],[600,675],[601,681],[704,681],[729,724],[531,722],[673,480],[829,762],[832,764],[870,764],[871,759],[561,200],[556,200],[436,404],[438,407],[586,410],[587,405],[535,310],[557,270],[656,448],[374,444],[538,162],[538,158]];
const HOLES: [number, number][][] = [
  [[352,622],[369,652],[335,651]],
  [[673,621],[689,649],[689,653],[655,651]],
  [[515,343],[532,374],[497,375]],
];
const point = ([x, y]: [number, number]) => new THREE.Vector2((x - 510) / 180, -(y - 443) / 180);

export function createAKCModel() {
  const model = new THREE.Group();
  model.name = "AKC-claude-traced-metal-symbol";
  const shape = new THREE.Shape(OUTLINE.map(point));
  HOLES.forEach(hole => shape.holes.push(new THREE.Path(hole.map(point))));
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: .3, bevelEnabled: true, bevelThickness: .018,
    bevelSize: .014, bevelSegments: 2, curveSegments: 1,
  });
  geometry.translate(0, 0, -.15);
  geometry.computeVertexNormals();
  // Project the supplied 1050x1024 transparent logo directly onto the
  // extruded front/back faces. The texture's silhouette and holes stay aligned.
  const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
  const uv = geometry.getAttribute("uv") as THREE.BufferAttribute;
  for (const group of geometry.groups) {
    if (group.materialIndex !== 0) continue;
    for (let i = group.start; i < group.start + group.count; i++) {
      const x = pos.getX(i), y = pos.getY(i);
      uv.setXY(i, (x * 180 + 510) / 1050, 1 - (443 - y * 180) / 1024);
    }
  }
  uv.needsUpdate = true;

  const clipPlane = new THREE.Plane(new THREE.Vector3(.8745, .4849, 0), 3);
  const metal = new THREE.MeshStandardMaterial({
    color: "#ffffff", metalness: .32, roughness: .72, envMapIntensity: .25,
    side: THREE.DoubleSide, clippingPlanes: [clipPlane],
    transparent: true, alphaTest: .04,
  });
  // Keep bevels and extruded walls physically three-dimensional.
  const sides = new THREE.MeshStandardMaterial({
    color: "#183458", metalness: .65, roughness: .48, envMapIntensity: .55,
    side: THREE.DoubleSide, clippingPlanes: [clipPlane],
  });
  const rim = new THREE.LineBasicMaterial({
    color: "#4da3ff", transparent: true, opacity: .55,
    blending: THREE.AdditiveBlending,
  });
  const edges = new THREE.EdgesGeometry(geometry, 28);
  const edgeLines = new THREE.LineSegments(edges, rim);
  model.add(new THREE.Mesh(geometry, [metal, sides]), edgeLines);
  let texture: THREE.Texture | null = null;
  let disposed = false;
  let requestId = 0;
  const applyTexture = (url: string) => {
    const current = ++requestId;
    new THREE.TextureLoader().load(url, loaded => {
      if (disposed || current !== requestId) { loaded.dispose(); return; }
      texture?.dispose();
      texture = loaded;
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.wrapS = loaded.wrapT = THREE.ClampToEdgeWrapping;
      loaded.anisotropy = 8;
      metal.map = loaded;
      metal.needsUpdate = true;
    }, undefined, () => {
      // If the PNG has not been copied to public/ yet, keep the solid model.
    });
  };
  applyTexture("/akc-logo-metal-overlay.png");
  const homeColor = new THREE.Color("#25477d");
  const detailColor = new THREE.Color("#102a56");
  return {
    model,
    applyTexture,
    setExpertise: (progress: number) => {
      if (!texture) metal.color.copy(homeColor).lerp(detailColor, progress);
      // Claude starts clipping after 0.95s of a 1.75s transition.
      const cut = THREE.MathUtils.smoothstep(progress, .54, 1);
      clipPlane.constant = THREE.MathUtils.lerp(3, -.665, cut);
      // No wireframe or diagonal contour lines over the page text.
      // Only the large clipped 3D metal face remains on the expertise route.
      edgeLines.visible = progress < .015;
      rim.opacity = .55 * (1 - THREE.MathUtils.smoothstep(progress, 0, .15));
    },
    dispose: () => {
      disposed = true; requestId++;
      geometry.dispose(); edges.dispose(); texture?.dispose(); metal.dispose(); sides.dispose(); rim.dispose();
    },
  };
}
