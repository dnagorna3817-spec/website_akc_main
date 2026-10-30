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
  // Stable, non-periodic micro-scratch normal map. No sinusoidal bands.
  // A flat normal map (128,128,255) is perturbed by many short, faint,
  // randomly placed scratches. Keep the same texel density on every face.
  const textureSize = 1024;
  const scratchCanvas = document.createElement("canvas");
  scratchCanvas.width = scratchCanvas.height = textureSize;
  const ctx = scratchCanvas.getContext("2d");
  if (!ctx) throw new Error("Unable to create AKC metal texture");
  let seed = 3817;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  ctx.fillStyle = "rgb(128,128,255)";
  ctx.fillRect(0, 0, textureSize, textureSize);
  // Fine interrupted grain, not long lines that read as stripes on zoom.
  for (let i = 0; i < 24000; i++) {
    const x = random() * textureSize;
    const y = random() * textureSize;
    const length = 1 + random() * 12;
    const alpha = .018 + random() * .035;
    ctx.strokeStyle = `rgba(174,122,248,${alpha})`;
    ctx.lineWidth = .35 + random() * .4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y + (random() - .5) * 1.1);
    ctx.stroke();
  }
  const normalTexture = new THREE.CanvasTexture(scratchCanvas);
  normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
  normalTexture.repeat.set(1, 1);
  normalTexture.anisotropy = 8;
  normalTexture.colorSpace = THREE.NoColorSpace;

  // Correct the extruded caps' UVs to use world-sized mapping. The original
  // ExtrudeGeometry sidewall UVs are retained for continuous perimeter mapping.
  // Non-indexed triangles have independent vertices, so this is safe.
  const pos = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");
  for (const group of geometry.groups) {
    if (group.materialIndex !== 0) continue;
    for (let i = group.start; i < group.start + group.count; i++) {
      uv.setXY(i, pos.getX(i) * .8, pos.getY(i) * .8);
    }
  }
  uv.needsUpdate = true;

  const clipPlane = new THREE.Plane(new THREE.Vector3(.8745, .4849, 0), 3);
  const metal = new THREE.MeshPhysicalMaterial({
    color: "#193b65",
    metalness: .82,
    roughness: .36,
    anisotropy: .22,
    anisotropyRotation: Math.PI / 2,
    normalMap: normalTexture,
    normalScale: new THREE.Vector2(.18, .18),
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
    color: "#17375e",
    metalness: .8,
    roughness: .4,
    anisotropy: .18,
    anisotropyRotation: Math.PI / 2,
    normalMap: normalTexture,
    normalScale: new THREE.Vector2(.18, .18),
    envMapIntensity: .8,
    clearcoat: .12,
    clearcoatRoughness: .45,
    side: THREE.DoubleSide,
    clippingPlanes: [clipPlane],
  });
  const sideHomeColor = new THREE.Color("#17375e");
  const sideDetailColor = new THREE.Color("#173253");
  const rim = new THREE.LineBasicMaterial({
    color: "#4b9fff", transparent: true, opacity: .44,
    blending: THREE.AdditiveBlending,
  });
  const edges = new THREE.EdgesGeometry(geometry, 28);
  const edgeLines = new THREE.LineSegments(edges, rim);
  model.add(new THREE.Mesh(geometry, [metal, sideMetal]), edgeLines);
  const applyTexture = (_url: string) => {};
  const homeColor = new THREE.Color("#193b65");
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
      geometry.dispose(); edges.dispose(); normalTexture.dispose(); metal.dispose(); sideMetal.dispose(); rim.dispose();
    },
  };
}
