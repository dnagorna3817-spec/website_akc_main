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
  // Horizontal micro-scratches with slow variation along their length.
  for (let y = 0; y < textureSize; y++) grain[y] = random() * 2 - 1;
  for (let y = 0; y < textureSize; y++) {
    const horizontal = grain[y];
    for (let x = 0; x < textureSize; x++) {
      const i = (y * textureSize + x) * 4;
      const fine = horizontal + (random() - .5) * 1.5;
      const v = Math.max(0, Math.min(255, Math.round(128 + fine)));
      image.data[i] = image.data[i + 1] = image.data[i + 2] = v;
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  const microtexture = new THREE.CanvasTexture(surface);
  microtexture.wrapS = microtexture.wrapT = THREE.RepeatWrapping;
  microtexture.repeat.set(12, 12);
  microtexture.anisotropy = 8;
  microtexture.generateMipmaps = true;

  // Directional satin grain: subtle roughness variation on every surface.
  // The neutral bump texture alone cannot reproduce polished metal reflections.
  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = roughCanvas.height = textureSize;
  const roughCtx = roughCanvas.getContext("2d");
  if (!roughCtx) throw new Error("Unable to create AKC roughness texture");
  const roughData = roughCtx.createImageData(textureSize, textureSize);
  for (let y = 0; y < textureSize; y++) {
    const line = grain[y] * 1.5;
    for (let x = 0; x < textureSize; x++) {
      const i = (y * textureSize + x) * 4;
      const value = Math.max(0, Math.min(255, 220 + line + (random() - .5) * 2));
      roughData.data[i] = roughData.data[i + 1] = roughData.data[i + 2] = value;
      roughData.data[i + 3] = 255;
    }
  }
  roughCtx.putImageData(roughData, 0, 0);
  const roughnessTexture = new THREE.CanvasTexture(roughCanvas);
  roughnessTexture.wrapS = roughnessTexture.wrapT = THREE.RepeatWrapping;
  roughnessTexture.repeat.set(12, 12);
  roughnessTexture.anisotropy = 8;

  const clipPlane = new THREE.Plane(new THREE.Vector3(.8745, .4849, 0), 3);
  const metal = new THREE.MeshPhysicalMaterial({
    color: "#20436e",
    metalness: .82,
    roughness: .42,
    anisotropy: .28,
    anisotropyRotation: Math.PI / 2,
    roughnessMap: roughnessTexture,
    bumpMap: microtexture,
    bumpScale: .00008,
    envMapIntensity: .9,
    clearcoat: .14,
    clearcoatRoughness: .3,
    side: THREE.DoubleSide,
    clippingPlanes: [clipPlane],
  });
  // ExtrudeGeometry assigns material 0 to the flat caps and material 1
  // to the bevel and side walls. Keep the same blue family on both,
  // while reducing grey/white environment reflections on the walls.
  const sideMetal = new THREE.MeshPhysicalMaterial({
    color: "#1b3c65",
    metalness: .8,
    roughness: .46,
    anisotropy: .22,
    anisotropyRotation: Math.PI / 2,
    roughnessMap: roughnessTexture,
    bumpMap: microtexture,
    bumpScale: .00007,
    envMapIntensity: .8,
    clearcoat: .12,
    clearcoatRoughness: .45,
    side: THREE.DoubleSide,
    clippingPlanes: [clipPlane],
  });
  const sideHomeColor = new THREE.Color("#1b3c65");
  const sideDetailColor = new THREE.Color("#173253");
  const rim = new THREE.LineBasicMaterial({
    color: "#4b9fff", transparent: true, opacity: .44,
    blending: THREE.AdditiveBlending,
  });
  const edges = new THREE.EdgesGeometry(geometry, 28);
  const edgeLines = new THREE.LineSegments(edges, rim);
  model.add(new THREE.Mesh(geometry, [metal, sideMetal]), edgeLines);
  const applyTexture = (_url: string) => {};
  const homeColor = new THREE.Color("#20436e");
  const detailColor = new THREE.Color("#183557");
  return {
    model,
    applyTexture,
    setExpertise: (progress: number) => {
      metal.color.copy(homeColor).lerp(detailColor, progress);
      sideMetal.color.copy(sideHomeColor).lerp(sideDetailColor, progress);
      // Claude starts clipping after 0.95s of a 1.75s transition.
      const cut = THREE.MathUtils.smoothstep(progress, .54, 1);
      clipPlane.constant = THREE.MathUtils.lerp(3, -.665, cut);
      // No wireframe or diagonal contour lines over the page text.
      // Only the large clipped 3D metal face remains on the expertise route.
      edgeLines.visible = progress < .015;
      rim.opacity = .44 * (1 - THREE.MathUtils.smoothstep(progress, 0, .15));
    },
    dispose: () => {
      geometry.dispose(); edges.dispose(); microtexture.dispose(); roughnessTexture.dispose(); metal.dispose(); sideMetal.dispose(); rim.dispose();
    },
  };
}
