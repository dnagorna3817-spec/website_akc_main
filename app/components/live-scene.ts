import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import gsap from "gsap";
import { createAKCModel } from "./akc-model";

type Mode = "home" | "expertise" | "inactive";
type Rect = { x: number; y: number; width: number; height: number };
const mix = THREE.MathUtils.lerp;

/** One renderer, scene, camera and model for the lifetime of the root layout. */
export class LiveScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(32, 1, .1, 100);
  private asset = createAKCModel();
  private object = new THREE.Group();
  private environment: THREE.WebGLRenderTarget | null = null;
  private key = new THREE.DirectionalLight("#a8c8ff", 1.3);
  private sweep = new THREE.PointLight("#3d7bff", 3.5, 12);
  private studioStrip = new THREE.DirectionalLight("#d0e2f2", 0.65);
  private motion = { progress: 0, tiltX: 0, tiltY: 0 };
  private tween: gsap.core.Timeline | null = null;
  private mode: Mode = "home";
  private active = true;
  private dirty = true;
  private last = 0;
  private homeUntil = 0;
  private intro: gsap.core.Timeline | null = null;
  private introPlayed = false;
  private introGlow = { intensity: 0 };
  private home: Rect = { x: 0, y: 0, width: 400, height: 400 };
  private reduced = matchMedia("(prefers-reduced-motion: reduce)");
  private pointer = matchMedia("(hover: hover) and (pointer: fine)");
  private observer: ResizeObserver;
  private frameCount = 0;
  private rotateX: ReturnType<typeof gsap.quickTo>;
  private rotateY: ReturnType<typeof gsap.quickTo>;

  constructor(private canvas: HTMLCanvasElement, private unavailable: () => void) {
    const context = canvas.getContext("webgl2", { alpha: true, antialias: true, powerPreference: "high-performance" });
    if (!context) throw new Error("WebGL2 unavailable");
    this.renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true, powerPreference: "high-performance" });
    this.renderer.setClearColor(0x010910, 0);
    this.renderer.localClippingEnabled = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.object.add(this.asset.model);
    this.scene.add(this.object);
    this.key.position.set(5, 6, 6);
    this.scene.add(this.key, this.sweep, new THREE.AmbientLight("#20366a", .5));
    const edgeLight = new THREE.DirectionalLight("#187cff", .8);
    edgeLight.position.set(4, -1, 3);
    this.scene.add(edgeLight);
    this.studioStrip.position.set(-4, 5, 7);
    this.scene.add(this.studioStrip);
    this.createEnvironment();
    this.rotateX = gsap.quickTo(this.motion, "tiltX", { duration: .55, ease: "power3.out", onUpdate: this.invalidate });
    this.rotateY = gsap.quickTo(this.motion, "tiltY", { duration: .55, ease: "power3.out", onUpdate: this.invalidate });
    this.observer = new ResizeObserver(this.invalidate);
    this.observer.observe(document.body);
    this.resize();
    gsap.ticker.add(this.tick);
    window.addEventListener("resize", this.resize);
    window.addEventListener("scroll", this.invalidate, { passive: true });
    window.visualViewport?.addEventListener("resize", this.resize);
    window.addEventListener("pointermove", this.pointerMove);
    window.addEventListener("pointerout", this.pointerOut);
    document.addEventListener("visibilitychange", this.invalidate);
    this.reduced.addEventListener("change", this.motionChanged);
    canvas.addEventListener("webglcontextlost", this.contextLost);
    canvas.addEventListener("webglcontextrestored", this.contextRestored);
    canvas.dataset.sceneId = this.scene.uuid;
    canvas.dataset.modelId = this.asset.model.uuid;
  }
  private createEnvironment() {
    this.environment?.dispose();
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const room = new RoomEnvironment();
    this.environment = pmrem.fromScene(room, .04);
    this.scene.environment = this.environment.texture;
    room.dispose(); pmrem.dispose();
  }
  private invalidate = () => { this.dirty = true; };
  private resize = () => {
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 768 ? 1.5 : 1.75));
    this.renderer.setSize(innerWidth, innerHeight, false);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.invalidate();
  };
  private motionChanged = () => {
    if (this.reduced.matches) {
      this.tween?.progress(1);
      this.intro?.kill();
      this.introGlow.intensity = 0;
      this.rotateX(0); this.rotateY(0);
    }
    this.invalidate();
  };
  private pointerMove = (event: PointerEvent) => {
    if (this.mode !== "home" || this.tween?.isActive() || this.reduced.matches || !this.pointer.matches || event.pointerType === "touch") return;
    const r = this.home;
    const inside = event.clientX >= r.x && event.clientX <= r.x + r.width && event.clientY >= r.y && event.clientY <= r.y + r.height;
    this.rotateX(inside ? -(event.clientY - r.y - r.height / 2) / r.height * .28 : 0);
    this.rotateY(inside ? (event.clientX - r.x - r.width / 2) / r.width * .28 : 0);
  };
  private pointerOut = (event: PointerEvent) => {
    if (!event.relatedTarget) { this.rotateX(0); this.rotateY(0); }
  };
  private contextLost = (event: Event) => {
    event.preventDefault();
    this.active = false;
    this.tween?.progress(1);
    this.unavailable();
  };
  private contextRestored = () => {
    this.createEnvironment();
    this.active = true;
    document.documentElement.dataset.akcWebgl = "ready";
    this.resize();
  };
  setMode(mode: Mode, animate = false, complete?: () => void) {
    this.tween?.kill();
    this.intro?.kill();
    this.introGlow.intensity = 0;
    this.mode = mode;
    this.canvas.dataset.mode = animate ? "transitioning" : mode;
    this.canvas.style.visibility = mode === "inactive" ? "hidden" : "visible";
    this.homeUntil = performance.now() + 9000;
    this.observer.disconnect();
    this.observer.observe(document.body);
    document.querySelectorAll(".network-frame, .logo-position, [data-expertise-art]").forEach(element => this.observer.observe(element));
    if (mode === "inactive") return;
    const progress = mode === "expertise" ? 1 : 0;
    this.rotateX(0); this.rotateY(0);
    // One restrained introductory glint and 3D tilt, only on first home reveal.
    // Never compete with route transitions or reduced-motion preferences.
    if (mode === "home" && !this.introPlayed && !this.reduced.matches) {
      this.introPlayed = true;
      this.intro = gsap.timeline({ delay: 1.25, onUpdate: this.invalidate })
        .to(this.motion, { tiltY: .11, tiltX: -.045, duration: .55, ease: "power2.out" })
        .to(this.introGlow, { intensity: 1, duration: .32, ease: "power2.out" }, "<")
        .to(this.motion, { tiltY: -.075, tiltX: .025, duration: .75, ease: "sine.inOut" })
        .to(this.introGlow, { intensity: 0, duration: .7, ease: "power2.inOut" }, "<")
        .to(this.motion, { tiltY: 0, tiltX: 0, duration: .6, ease: "power2.out" });
    }
    if (animate && !this.reduced.matches) {
      this.tween = gsap.timeline({ onComplete: () => {
        this.canvas.dataset.mode = mode;
        complete?.();
      } }).to(this.motion, { progress, duration: 1.75, ease: "power3.inOut", onUpdate: this.invalidate });
    } else {
      this.motion.progress = progress;
      complete?.();
    }
    this.invalidate();
  }
  private tick = () => {
    if (!this.active || document.hidden || this.mode === "inactive") return;
    const now = performance.now();
    const ambient = this.mode === "expertise" && !this.reduced.matches;
    const revealing = this.mode === "home" && now < this.homeUntil;
    if (!this.dirty && !ambient && !revealing && !this.tween?.isActive()) return;
    // Ambient reflections are deliberately limited to 30 fps. Interactive motion uses the display cadence.
    if (!this.dirty && ambient && now - this.last < 1000 / 30) return;
    this.last = now; this.dirty = false;
    const homeElement = document.querySelector<HTMLElement>(".logo-position");
    if (homeElement) this.home = homeElement.getBoundingClientRect();
    const slot = document.querySelector<HTMLElement>("[data-expertise-art]");
    const destination: Rect = slot?.getBoundingClientRect() ?? {
      x: innerWidth * .4493, y: 178, width: innerWidth * .5507, height: innerWidth * .5667,
    };
    const p = this.motion.progress;
    const mobile = innerWidth < 768;
    const stage = document.querySelector<HTMLElement>(".logo-stage");
    let reveal = 1;
    let revealScale = 1;
    if (this.mode === "home" && stage) {
      const style = getComputedStyle(stage);
      reveal = Number(style.opacity);
      revealScale = new DOMMatrixReadOnly(style.transform).a;
    }
    // Match the exact /expertise camera composition in the Claude prototype.
    // Keep the homepage's DOM-aligned framing until the zoom begins.
    const aspect = innerWidth / innerHeight;
    const endDistance = 1.05 * Math.max(1, 1.6 / aspect);
    const z = mix(10.5, endDistance, p);
    const yaw = mix(0, -.3, p);
    const pitch = mix(0, -.08, p);
    const target = new THREE.Vector3(mix(0, .563, p), mix(0, .628, p), mix(0, .15, p));
    this.camera.position.set(
      target.x + z * Math.sin(yaw) * Math.cos(pitch),
      target.y + z * Math.sin(pitch),
      target.z + z * Math.cos(yaw) * Math.cos(pitch),
    );
    this.camera.lookAt(target);
    this.camera.rotateZ(mix(0, 1.0, p));
    const shift = mix(0, innerWidth < 700 ? .27 : aspect < 1.5 ? .30 : .32, p);
    this.camera.clearViewOffset();
    if (shift > 0) this.camera.setViewOffset(innerWidth, innerHeight, -shift * innerWidth, 0, innerWidth, innerHeight);
    const viewHeight = 2 * z * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const unit = viewHeight / innerHeight;
    const homeSize = this.home.height * .72 * revealScale;
    const finalSize = destination.height * (mobile ? 3.4 : 7.2);
    const size = mix(homeSize, finalSize, p);
    const cx = mix(this.home.x + this.home.width / 2, destination.x + destination.width * (mobile ? 1.05 : 1.7), p);
    const cy = mix(this.home.y + this.home.height / 2, destination.y + destination.height * (mobile ? .73 : .65), p);
    // On the detail page the prototype moves the camera, NOT the object.
    this.object.position.set(
      mix((cx - innerWidth / 2) * unit, 0, p),
      mix((innerHeight / 2 - cy) * unit, 0, p),
      0,
    );
    this.object.scale.setScalar(mix(size / 3.55 * unit, 1, p));
    // Claude reference: camera yaw ≈ -0.3, pitch ≈ -0.08 and roll ≈ 1.0.\n    // Apply the corresponding object rotation while preserving the shared camera.
    this.object.rotation.set(this.motion.tiltX * (1 - p), this.motion.tiltY * (1 - p), 0);
    this.asset.setExpertise(p);
    this.canvas.style.opacity = String(mix(reveal, 1, p));
    const t = this.reduced.matches ? 0 : now / 1000;
    this.key.position.x = 5 + (ambient ? Math.sin(t * .22) * .4 : 0);
    // A restrained studio-light sweep follows the existing first-load intro.
    // No extra geometry, screen-space glow, or changes to Claude navigation.
    this.studioStrip.position.x = -4 + this.introGlow.intensity * 8 + (ambient ? Math.sin(t * .38) * 2.5 : 0);
    this.studioStrip.intensity = .65 + this.introGlow.intensity * 1.1 + (ambient ? .12 * (1 + Math.sin(t * .38)) : 0);
    this.key.intensity = 1.3 + (ambient ? Math.sin(t * .3) * .09 : 0);
    const pulse = document.querySelector<HTMLElement>(".logo-light-pulse");
    const pulseAmount = this.mode === "home" && pulse ? Number(getComputedStyle(pulse).opacity) : 0;
    this.sweep.intensity = 3.5 + pulseAmount * 8 + this.introGlow.intensity * 3;
    this.sweep.position.set(this.object.position.x + 2.5, this.object.position.y + .5, 2);
    // Scissor follows the layout slot, interpolating continuously during the approach.
    // It crops only the oversized 3D artwork, never the page's content.
    // Claude uses a full-viewport canvas and an oblique model clipping plane,
    // rather than a rectangular scissor restricted to the artwork slot.
    const clip = { x: 0, y: 0, right: innerWidth, bottom: innerHeight };
    this.renderer.setScissorTest(false);
    this.renderer.clear();
    this.renderer.setScissor(clip.x, innerHeight - clip.bottom, Math.max(0, clip.right - clip.x), Math.max(0, clip.bottom - clip.y));
    this.renderer.setScissorTest(true);
    this.renderer.render(this.scene, this.camera);
    this.canvas.dataset.frames = String(++this.frameCount);
    this.canvas.dataset.cameraZ = z.toFixed(3);
    this.canvas.dataset.rotation = `${this.object.rotation.x.toFixed(4)},${this.object.rotation.y.toFixed(4)}`;
    this.canvas.dataset.light = this.key.intensity.toFixed(4);
  };
  dispose() {
    this.active = false;
    this.tween?.kill(); this.intro?.kill(); this.rotateX.tween.kill(); this.rotateY.tween.kill();
    gsap.ticker.remove(this.tick);
    this.observer.disconnect();
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("scroll", this.invalidate);
    window.visualViewport?.removeEventListener("resize", this.resize);
    window.removeEventListener("pointermove", this.pointerMove);
    window.removeEventListener("pointerout", this.pointerOut);
    document.removeEventListener("visibilitychange", this.invalidate);
    this.reduced.removeEventListener("change", this.motionChanged);
    this.canvas.removeEventListener("webglcontextlost", this.contextLost);
    this.canvas.removeEventListener("webglcontextrestored", this.contextRestored);
    this.asset.dispose(); this.environment?.dispose();
    this.scene.clear();
    this.renderer.dispose(); this.renderer.forceContextLoss();
  }
}
