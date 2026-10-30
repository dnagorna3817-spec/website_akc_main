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
  // Procedural directional titanium brushing: two physically distinct maps.
  // Roughness variation makes the grain visible in reflections; the normal
  // map adds fine relief without introducing broad repeating stripes.
  const textureSize = 1024;
  const scratchCanvas = document.createElement("canvas");
  const roughnessCanvas = document.createElement("canvas");
  scratchCanvas.width = scratchCanvas.height = textureSize;
  roughnessCanvas.width = roughnessCanvas.height = textureSize;
  const ctx = scratchCanvas.getContext("2d");
  const roughCtx = roughnessCanvas.getContext("2d");
  if (!ctx || !roughCtx) throw new Error("Unable to create AKC titanium texture");
  let seed = 3817;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  ctx.fillStyle = "rgb(128,128,255)";
  ctx.fillRect(0, 0, textureSize, textureSize);
  roughCtx.fillStyle = "rgb(185,185,185)";
  roughCtx.fillRect(0, 0, textureSize, textureSize);
  // Interrupted hairline scratches: directionally aligned, varying lengths,
  // low contrast, and seeded for stable rendering between page transitions.
  for (let i = 0; i < 35000; i++) {
    const x = random() * textureSize;
    const y = random() * textureSize;
    const length = 3 + Math.pow(random(), 2) * 65;
    const bright = random() > .5;
    ctx.strokeStyle = bright ? "rgba(150,128,255,0.16)" : "rgba(108,128,255,0.13)";
    ctx.lineWidth = .35 + random() * .55;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y + (random() - .5) * .55);
    ctx.stroke();
    roughCtx.strokeStyle = bright ? "rgba(245,245,245,0.23)" : "rgba(80,80,80,0.19)";
    roughCtx.lineWidth = .4 + random() * .8;
    roughCtx.beginPath();
    roughCtx.moveTo(x, y);
    roughCtx.lineTo(x + length, y);
    roughCtx.stroke();
  }
  const normalTexture = new THREE.CanvasTexture(scratchCanvas);
  const roughnessTexture = new THREE.CanvasTexture(roughnessCanvas);
  for (const texture of [normalTexture, roughnessTexture]) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.4, 1.4);
    texture.anisotropy = 8;
    texture.colorSpace = THREE.NoColorSpace;
  }

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
    color: "#173755",
    metalness: .72,
    roughness: .54,
    roughnessMap: roughnessTexture,
    anisotropy: .55,
    anisotropyRotation: Math.PI / 2,
    normalMap: normalTexture,
    normalScale: new THREE.Vector2(.38, .38),
    envMapIntensity: .52,
    clearcoat: .06,
    clearcoatRoughness: .62,
    side: THREE.DoubleSide,
    clippingPlanes: [clipPlane],
  });
  // ExtrudeGeometry assigns material 0 to the flat caps and material 1
  // to the bevel and side walls. Keep the same blue family on both,
  // while reducing grey/white environment reflections on the walls.
  const sideMetal = new THREE.MeshPhysicalMaterial({
    color: "#10263d",
    metalness: .7,
    roughness: .58,
    roughnessMap: roughnessTexture,
    anisotropy: .4,
    anisotropyRotation: Math.PI / 2,
    normalMap: normalTexture,
    normalScale: new THREE.Vector2(.24, .24),
    envMapIntensity: .42,
    clearcoat: .04,
    clearcoatRoughness: .65,
    side: THREE.DoubleSide,
    clippingPlanes: [clipPlane],
  });
  const sideHomeColor = new THREE.Color("#0c2138");
  const sideDetailColor = new THREE.Color("#06162d");
  const rim = new THREE.LineBasicMaterial({
    color: "#7aadd4", transparent: true, opacity: .23,
    blending: THREE.AdditiveBlending,
  });
  const edges = new THREE.EdgesGeometry(geometry, 28);
  const edgeLines = new THREE.LineSegments(edges, rim);
  model.add(new THREE.Mesh(geometry, [metal, sideMetal]), edgeLines);
  const applyTexture = (_url: string) => {};
  const homeColor = new THREE.Color("#12304d");
  const detailColor = new THREE.Color("#07539a");
  return {
    model,
    applyTexture,
    setExpertise: (progress: number) => {
      // Scale-aware brushing: larger visible grain on the small home logo,
      // fine micro-scratches when the camera zooms into the expertise surface.
      const grainRepeat = THREE.MathUtils.lerp(.48, 1.4, progress);
      normalTexture.repeat.set(grainRepeat, grainRepeat);
      roughnessTexture.repeat.set(grainRepeat, grainRepeat);
      metal.normalScale.setScalar(THREE.MathUtils.lerp(.72, .38, progress));
      sideMetal.normalScale.setScalar(THREE.MathUtils.lerp(.4, .24, progress));
      metal.color.copy(homeColor).lerp(detailColor, THREE.MathUtils.smoothstep(progress, .12, .88));
      metal.roughness = THREE.MathUtils.lerp(.56, .65, progress);
      metal.envMapIntensity = THREE.MathUtils.lerp(.52, .24, progress);
      sideMetal.color.copy(sideHomeColor).lerp(sideDetailColor, THREE.MathUtils.smoothstep(progress, .12, .88));
      sideMetal.roughness = THREE.MathUtils.lerp(.58, .7, progress);
      sideMetal.envMapIntensity = THREE.MathUtils.lerp(.42, .18, progress);
      // Claude starts clipping after 0.95s of a 1.75s transition.
      const cut = THREE.MathUtils.smoothstep(progress, .54, 1);
      clipPlane.constant = THREE.MathUtils.lerp(3, -.665, cut);
      // No wireframe or diagonal contour lines over the page text.
      // Only the large clipped 3D metal face remains on the expertise route.
      edgeLines.visible = progress < .015;
      rim.opacity = .23 * (1 - THREE.MathUtils.smoothstep(progress, 0, .15));
    },
    dispose: () => {
      geometry.dispose(); edges.dispose(); normalTexture.dispose(); roughnessTexture.dispose(); metal.dispose(); sideMetal.dispose(); rim.dispose();
    },
  };
}
