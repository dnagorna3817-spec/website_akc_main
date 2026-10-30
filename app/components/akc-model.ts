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
  // Physically shaded titanium: no photographic logo overlay.
  // Fine, deterministic brushed micro-grooves modulate roughness and normals,
  // while the metallic highlights come from the scene's environment.
  const textureSize = 512;
  const surface = document.createElement("canvas");
  surface.width = surface.height = textureSize;
  const ctx = surface.getContext("2d");
  if (!ctx) throw new Error("Unable to create AKC titanium microtexture");
  const image = ctx.createImageData(textureSize, textureSize);
  let seed = 3817;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const grain = new Float32Array(textureSize);
  for (let x = 0; x < textureSize; x++) grain[x] = random() * 24 - 12;
  for (let y = 0; y < textureSize; y++) {
    const horizontal = Math.sin(y * .37) * 1.8;
    for (let x = 0; x < textureSize; x++) {
      const i = (y * textureSize + x) * 4;
      const fine = grain[x] + horizontal + (random() - .5) * 5;
      const v = Math.max(0, Math.min(255, Math.round(150 + fine)));
      image.data[i] = image.data[i + 1] = image.data[i + 2] = v;
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  const microtexture = new THREE.CanvasTexture(surface);
  microtexture.wrapS = microtexture.wrapT = THREE.RepeatWrapping;
  microtexture.repeat.set(3, 3);
  microtexture.anisotropy = 8;
  microtexture.generateMipmaps = true;

  const clipPlane = new THREE.Plane(new THREE.Vector3(.8745, .4849, 0), 3);
  const metal = new THREE.MeshPhysicalMaterial({
    color: "#446c97",
    metalness: .78,
    roughness: .31,
    bumpMap: microtexture,
    bumpScale: .0015,
    envMapIntensity: 1.4,
    clearcoat: .08,
    clearcoatRoughness: .3,
    side: THREE.DoubleSide,
    clippingPlanes: [clipPlane],
  });
  const rim = new THREE.LineBasicMaterial({
    color: "#4da3ff", transparent: true, opacity: .55,
    blending: THREE.AdditiveBlending,
  });
  const edges = new THREE.EdgesGeometry(geometry, 28);
  const edgeLines = new THREE.LineSegments(edges, rim);
  model.add(new THREE.Mesh(geometry, metal), edgeLines);
  const applyTexture = (_url: string) => {};
  const homeColor = new THREE.Color("#446c97");
  const detailColor = new THREE.Color("#355981");
  return {
    model,
    applyTexture,
    setExpertise: (progress: number) => {
      metal.color.copy(homeColor).lerp(detailColor, progress);
      // Claude starts clipping after 0.95s of a 1.75s transition.
      const cut = THREE.MathUtils.smoothstep(progress, .54, 1);
      clipPlane.constant = THREE.MathUtils.lerp(3, -.665, cut);
      // No wireframe or diagonal contour lines over the page text.
      // Only the large clipped 3D metal face remains on the expertise route.
      edgeLines.visible = progress < .015;
      rim.opacity = .55 * (1 - THREE.MathUtils.smoothstep(progress, 0, .15));
    },
    dispose: () => {
      geometry.dispose(); edges.dispose(); microtexture.dispose(); metal.dispose(); rim.dispose();
    },
  };
}
