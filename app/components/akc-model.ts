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
  // UV projection from the Claude export: diagonal on front faces,
  // edge-aligned on bevel and side walls.
  const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
  const uv = geometry.getAttribute("uv") as THREE.BufferAttribute;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), d = new THREE.Vector3();
  const n = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i);
    b.fromBufferAttribute(pos, i + 1);
    d.fromBufferAttribute(pos, i + 2);
    n.crossVectors(b.clone().sub(a), d.clone().sub(a)).normalize();
    const wall = Math.abs(n.z) < .5;
    for (let j = 0; j < 3; j++) {
      const x = pos.getX(i + j), y = pos.getY(i + j), z = pos.getZ(i + j);
      const u = wall ? (z + .15) / .9 + .8 : .97 + ((x * .8745 + y * .4849) - .889) / .9;
      const v = wall ? (x * -n.y + y * n.x) / .9 : (x * .481 - y * .877) / .9;
      uv.setXY(i + j, u, v);
    }
  }
  uv.needsUpdate = true;

  // The original prototype's dark-blue metallic finish, without displacement.
  // UV-mapped brushed JPEG is retained in the user's original export and can
  // be introduced as a separate optimized asset after visual verification.
  const metal = new THREE.MeshStandardMaterial({
    color: "#16305e", metalness: .7, roughness: .48, envMapIntensity: .8,
    side: THREE.DoubleSide,
  });
  const rim = new THREE.LineBasicMaterial({
    color: "#4da3ff", transparent: true, opacity: .55,
    blending: THREE.AdditiveBlending,
  });
  const edges = new THREE.EdgesGeometry(geometry, 28);
  model.add(new THREE.Mesh(geometry, metal), new THREE.LineSegments(edges, rim));
  let texture: THREE.Texture | null = null;
  const applyTexture = (url: string) => {
    new THREE.TextureLoader().load(url, loaded => {
      texture?.dispose();
      texture = loaded;
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.wrapS = loaded.wrapT = THREE.MirroredRepeatWrapping;
      loaded.anisotropy = 8;
      metal.map = loaded;
      metal.color.set("#ffffff");
      metal.needsUpdate = true;
    });
  };
  const homeColor = metal.color.clone();
  const detailColor = new THREE.Color("#102a56");

  return {
    model,
    applyTexture,
    setExpertise: (progress: number) => {
      metal.color.copy(homeColor).lerp(detailColor, progress);
      rim.opacity = THREE.MathUtils.lerp(.55, .8, Math.sin(Math.PI * progress));
    },
    dispose: () => {
      geometry.dispose(); edges.dispose(); texture?.dispose(); metal.dispose(); rim.dispose();
    },
  };
}
