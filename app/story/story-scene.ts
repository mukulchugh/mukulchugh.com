import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import {
  artifacts,
  beatPhase,
  beats,
  clampProgress,
  sceneAt,
} from "./story-data";

type Point = [number, number, number];
type Material = THREE.MeshStandardMaterial | THREE.MeshBasicMaterial;

// All geometry is illustrative, not a reconstruction of family likenesses.
export function createStoryScene(host: HTMLElement, onFailure: () => void) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  const scene = new THREE.Scene();
  const textures = new Set<THREE.Texture>();
  const sphereGeometry = new THREE.SphereGeometry(1, 20, 12);
  const boxGeometries = new Map<string, THREE.BufferGeometry>();
  let env: THREE.WebGLRenderTarget | undefined;
  let disposed = false;
  let frame = 0;
  let releaseEvents: (() => void) | undefined;
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    releaseEvents?.();
    const geometries = new Set<THREE.BufferGeometry>(boxGeometries.values());
    const usedMaterials = new Set<THREE.Material>();
    geometries.add(sphereGeometry);
    scene.traverse((object) => {
      if (object instanceof THREE.Light && "shadow" in object)
        (object.shadow as THREE.LightShadow).dispose();
      if (object instanceof THREE.Mesh) geometries.add(object.geometry);
      if (!(object instanceof THREE.Mesh || object instanceof THREE.Sprite))
        return;
      for (const material of Array.isArray(object.material)
        ? object.material
        : [object.material])
        usedMaterials.add(material);
    });
    for (const geometry of geometries) geometry.dispose();
    for (const material of usedMaterials) material.dispose();
    for (const texture of textures) texture.dispose();
    env?.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  }
  try {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0xf8_f8_f6, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.dataset.storyCanvas = "true";
    host.append(renderer.domElement);
    scene.fog = new THREE.Fog(0xf8_f8_f6, 21, 44);
    const camera = new THREE.PerspectiveCamera(34, 1, 0.08, 100);
    let progress = 0;
    let portrait = false;
    let width = 1,
      height = 1,
      copyBottom = 0;
    const copyElement =
      host.parentElement?.querySelector<HTMLElement>("[data-story-copy]");
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = new RoomEnvironment();
    try {
      env = pmrem.fromScene(environment, 0.04);
      scene.environment = env.texture;
      scene.environmentIntensity = 0.52;
    } finally {
      environment.dispose();
      pmrem.dispose();
    }

    scene.add(new THREE.HemisphereLight(0xf1_f5_ff, 0xb9_ac_96, 1.5));
    const key = new THREE.DirectionalLight(0xff_f0_df, 2.8);
    key.position.set(-3, 8, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, {
      bottom: -7,
      far: 25,
      left: -7,
      near: 0.1,
      right: 7,
      top: 7,
    });
    key.shadow.bias = -0.0002;
    key.shadow.normalBias = 0.035;
    scene.add(key, key.target);
    const fill = new THREE.DirectionalLight(0xd9_e6_ff, 1.2);
    fill.position.set(7, 4, -5);
    scene.add(fill);

    const materials = {
      accent: new THREE.MeshStandardMaterial({
        color: 0xce_83_50,
        roughness: 0.4,
      }),
      blue: new THREE.MeshStandardMaterial({
        color: 0x71_8f_9c,
        roughness: 0.82,
      }),
      board: new THREE.MeshStandardMaterial({
        color: 0x3c_66_61,
        metalness: 0.25,
        roughness: 0.55,
      }),
      copper: new THREE.MeshStandardMaterial({
        color: 0xb9_80_4e,
        metalness: 0.7,
        roughness: 0.3,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: 0x29_2a_2b,
        roughness: 0.55,
      }),
      hair: new THREE.MeshStandardMaterial({
        color: 0x25_20_1e,
        roughness: 0.7,
      }),
      metal: new THREE.MeshStandardMaterial({
        color: 0xa7_b0_ba,
        metalness: 0.85,
        roughness: 0.28,
      }),
      plastic: new THREE.MeshStandardMaterial({
        color: 0xdd_d9_cf,
        roughness: 0.48,
      }),
      porcelain: new THREE.MeshStandardMaterial({
        color: 0xf7_f5_ed,
        roughness: 0.38,
      }),
      skin: new THREE.MeshStandardMaterial({
        color: 0xc9_92_68,
        roughness: 0.64,
      }),
      trousers: new THREE.MeshStandardMaterial({
        color: 0x46_4b_52,
        roughness: 0.85,
      }),
    };

    function group(x = 0, y = 0, z = 0, parent: THREE.Object3D = scene) {
      const g = new THREE.Group();
      g.position.set(x, y, z);
      parent.add(g);
      return g;
    }
    function mesh(
      parent: THREE.Object3D,
      geometry: THREE.BufferGeometry,
      material: Material,
      position: Point
    ) {
      const m = new THREE.Mesh(geometry, material);
      m.position.set(...position);
      m.castShadow = false;
      m.receiveShadow = false;
      parent.add(m);
      return m;
    }
    function box(
      parent: THREE.Object3D,
      size: Point,
      position: Point,
      material: Material = materials.plastic,
      radius = 0.04
    ) {
      const edge = Math.min(radius, ...size.map((n) => n / 3));
      const id = `${size.join(",")}:${edge}`;
      let geometry = boxGeometries.get(id);
      if (!geometry) {
        geometry = new RoundedBoxGeometry(...size, 2, edge);
        boxGeometries.set(id, geometry);
      }
      return mesh(parent, geometry, material, position);
    }

    function sphere(
      parent: THREE.Object3D,
      size: Point,
      position: Point,
      material: Material
    ) {
      const m = mesh(parent, sphereGeometry, material, position);
      m.scale.set(...size);
      return m;
    }
    function rod(
      parent: THREE.Object3D,
      a: Point,
      b: Point,
      radius: number,
      material: Material
    ) {
      const from = new THREE.Vector3(...a);
      const to = new THREE.Vector3(...b);
      const direction = to.clone().sub(from);
      const m = mesh(
        parent,
        new THREE.CapsuleGeometry(
          radius,
          Math.max(0.01, direction.length() - 2 * radius),
          5,
          10
        ),
        material,
        [0, 0, 0]
      );
      m.position.copy(from.add(to).multiplyScalar(0.5));
      m.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize()
      );
      return m;
    }
    function cable(
      parent: THREE.Object3D,
      points: Point[],
      radius = 0.018,
      material: Material = materials.dark
    ) {
      const curve = new THREE.CatmullRomCurve3(
        points.map((p) => new THREE.Vector3(...p))
      );
      return mesh(
        parent,
        new THREE.TubeGeometry(curve, 48, radius, 6, false),
        material,
        [0, 0, 0]
      );
    }
    function canvasTexture(
      draw: (ctx: CanvasRenderingContext2D) => void,
      width = 1024,
      height = 768
    ) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas drawing is unavailable");
      draw(ctx);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(
        4,
        renderer.capabilities.getMaxAnisotropy()
      );
      textures.add(texture);
      return texture;
    }
    function plane(
      parent: THREE.Object3D,
      width: number,
      height: number,
      position: Point,
      texture: THREE.Texture
    ) {
      return mesh(
        parent,
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
        position
      );
    }
    function textTexture(title: string, subtitle = "") {
      return canvasTexture((ctx) => {
        ctx.fillStyle = "#f7f7f4";
        ctx.fillRect(0, 0, 1024, 768);
        ctx.fillStyle = "#e4e5e3";
        ctx.fillRect(0, 0, 1024, 62);
        ctx.fillStyle = "#aaaead";
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(30 + i * 28, 31, 7, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = "#262a2b";
        ctx.font = "500 62px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(title, 512, 350);
        ctx.fillStyle = "#686e70";
        ctx.font = "26px sans-serif";
        ctx.fillText(subtitle, 512, 408);
      });
    }

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(240, 100),
      new THREE.ShadowMaterial({ opacity: 0.07 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(45, -0.04, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    const opening = group();
    const desk = group(0, 0, 0, opening);
    box(desk, [3.45, 0.12, 1.65], [0.15, 1.3, 0.1], materials.porcelain);
    for (const x of [-1.35, 1.65])
      for (const z of [-0.5, 0.73])
        box(desk, [0.09, 1.25, 0.09], [x, 0.63, z], materials.metal, 0.015);
    box(desk, [0.95, 0.18, 0.72], [-0.8, 1.1, 0.15], materials.porcelain);

    const search = canvasTexture((ctx) => {
      ctx.fillStyle = "#f6f7f9";
      ctx.fillRect(0, 0, 1024, 768);
      ctx.fillStyle = "#5b85c3";
      ctx.fillRect(0, 0, 1024, 42);
      ctx.fillStyle = "#e5e8ed";
      ctx.fillRect(0, 42, 1024, 82);
      ctx.fillStyle = "#fff";
      ctx.fillRect(108, 66, 810, 33);
      ctx.fillStyle = "#4c5b77";
      ctx.font = "22px sans-serif";
      ctx.fillText("Search the web", 130, 90);
      ctx.font = "600 72px serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#3d639b";
      ctx.fillText("A world to explore.", 512, 320);
      ctx.strokeStyle = "#a9b2bf";
      ctx.lineWidth = 2;
      ctx.strokeRect(160, 385, 704, 62);
      ctx.fillStyle = "#455369";
      ctx.font = "30px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("video games", 185, 427);
      ctx.fillStyle = "#e2e6ec";
      ctx.fillRect(410, 476, 204, 52);
      ctx.fillStyle = "#3b4657";
      ctx.textAlign = "center";
      ctx.font = "24px sans-serif";
      ctx.fillText("Search", 512, 511);
    });
    const monitor = group(0.48, 1.4, -0.12, opening);
    monitor.rotation.y = -0.17;
    box(monitor, [1.25, 1.12, 0.93], [0, 0.73, -0.25], materials.plastic, 0.14);
    box(
      monitor,
      [1.16, 1.06, 0.15],
      [0, 0.74, 0.22],
      materials.porcelain,
      0.08
    );
    box(monitor, [0.97, 0.77, 0.025], [0, 0.79, 0.306], materials.dark, 0.055);
    plane(monitor, 0.91, 0.7, [0, 0.79, 0.323], search);
    box(monitor, [0.54, 0.12, 0.45], [0, 0.02, 0], materials.plastic);
    box(monitor, [0.24, 0.17, 0.22], [0, 0.15, -0.04], materials.plastic);
    sphere(
      monitor,
      [0.025, 0.025, 0.008],
      [0.44, 0.34, 0.307],
      materials.accent
    );
    for (let i = 0; i < 9; i++)
      box(
        monitor,
        [0.006, 0.025, 0.41],
        [0.632, 0.65 + i * 0.036, -0.25],
        materials.dark,
        0.001
      );

    const keyboard = group(-0.1, 1.39, 0.68, opening);
    keyboard.rotation.y = -0.08;
    box(keyboard, [1.15, 0.075, 0.41], [0, 0, 0], materials.plastic, 0.025);
    const keys = new THREE.InstancedMesh(
      new RoundedBoxGeometry(0.062, 0.04, 0.057, 1, 0.008),
      materials.porcelain,
      70
    );
    const matrix = new THREE.Matrix4();
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 14; c++) {
        matrix.makeTranslation(-0.51 + c * 0.078, 0.045, -0.15 + r * 0.071);
        keys.setMatrixAt(r * 14 + c, matrix);
      }
    keys.castShadow = true;
    keyboard.add(keys);
    box(
      keyboard,
      [0.32, 0.04, 0.058],
      [-0.1, 0.048, 0.14],
      materials.porcelain,
      0.008
    );
    const tvs = plane(
      keyboard,
      0.13,
      0.045,
      [0.47, 0.044, -0.175],
      canvasTexture(
        (ctx) => {
          ctx.fillStyle = "#ddd9cf";
          ctx.fillRect(0, 0, 256, 64);
          ctx.fillStyle = "#575e5e";
          ctx.font = "bold 46px sans-serif";
          ctx.fillText("TVS", 24, 49);
        },
        256,
        64
      )
    );
    tvs.rotation.x = -Math.PI / 2;
    sphere(
      opening,
      [0.115, 0.065, 0.17],
      [0.73, 1.42, 0.73],
      materials.porcelain
    );
    cable(opening, [
      [0.74, 1.38, 0.6],
      [0.94, 1.37, 0.42],
      [1.04, 1.37, -0.15],
      [0.5, 1.37, -0.45],
    ]);

    const shirtTexture = canvasTexture(
      (ctx) => {
        ctx.fillStyle = "#eee9e1";
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = "#d2cbc2";
        ctx.lineWidth = 3;
        for (let i = 0; i < 512; i += 45) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, 512);
          ctx.moveTo(0, i);
          ctx.lineTo(512, i);
          ctx.stroke();
        }
      },
      512,
      512
    );
    const shirt = new THREE.MeshStandardMaterial({
      map: shirtTexture,
      roughness: 0.94,
    });
    const striped = new THREE.MeshStandardMaterial({
      map: canvasTexture(
        (ctx) => {
          for (let i = 0; i < 512; i += 32) {
            ctx.fillStyle = i % 64 === 0 ? "#edf0e9" : "#78989d";
            ctx.fillRect(0, i, 512, 32);
          }
        },
        512,
        512
      ),
      roughness: 0.9,
    });

    function head(
      parent: THREE.Object3D,
      position: Point,
      scale: number,
      adult: boolean
    ) {
      const h = group(...position, parent);
      h.scale.setScalar(scale);
      sphere(h, [0.29, 0.36, 0.27], [0, 0, 0], materials.skin);
      sphere(h, [0.245, 0.21, 0.22], [0, -0.15, 0.06], materials.skin);
      for (const side of [-1, 1]) {
        sphere(
          h,
          [0.055, 0.087, 0.035],
          [side * 0.29, -0.015, 0.01],
          materials.skin
        );
        sphere(
          h,
          [0.065, 0.025, 0.02],
          [side * 0.112, 0.015, 0.243],
          materials.porcelain
        );
        sphere(
          h,
          [0.023, 0.023, 0.012],
          [side * 0.11 + 0.015, 0.012, 0.268],
          materials.hair
        );
        sphere(
          h,
          [0.006, 0.007, 0.004],
          [side * 0.11 + 0.008, 0.022, 0.286],
          materials.porcelain
        );
        rod(
          h,
          [side * 0.18, 0.092, 0.249],
          [side * 0.066, 0.099, 0.271],
          0.016,
          materials.hair
        );
      }
      sphere(h, [0.054, 0.075, 0.07], [0.013, -0.065, 0.273], materials.skin);
      const mouth = new THREE.MeshStandardMaterial({
        color: 0x75_44_31,
        roughness: 0.8,
      });
      cable(
        h,
        [
          [-0.095, -0.16, 0.233],
          [-0.025, -0.182, 0.278],
          [0.056, -0.175, 0.27],
          [0.103, -0.148, 0.233],
        ],
        0.015,
        mouth
      );
      if (adult)
        for (const side of [-1, 1]) {
          const moustache = sphere(
            h,
            [0.082, 0.023, 0.026],
            [side * 0.065, -0.121, 0.261],
            materials.hair
          );
          moustache.rotation.z = side * 0.15;
        }
      mesh(
        h,
        new THREE.SphereGeometry(
          0.307,
          24,
          16,
          0,
          Math.PI * 2,
          0,
          Math.PI * 0.49
        ),
        materials.hair,
        [0, 0.1, -0.015]
      );
      for (let i = 0; i < 17; i++) {
        const angle = i * 2.399;
        const radius = 0.07 + (i % 4) * 0.048;
        const lock = sphere(
          h,
          [0.105, 0.028, 0.068],
          [
            Math.cos(angle) * radius,
            0.355 - (i % 4) * 0.033,
            Math.sin(angle) * radius + 0.015,
          ],
          materials.hair
        );
        lock.rotation.set(0.2, angle, 0.16);
      }
      return h;
    }
    function hand(parent: THREE.Object3D, position: Point, pointing = false) {
      const h = group(...position, parent);
      sphere(h, [0.075, 0.04, 0.085], [0, 0, 0], materials.skin);
      for (let i = 0; i < 4; i++)
        rod(
          h,
          [-0.048 + i * 0.03, 0, -0.01],
          [-0.052 + i * 0.032, -0.01, pointing && i === 3 ? -0.22 : -0.11],
          0.014,
          materials.skin
        );
      rod(h, [-0.055, 0, 0.035], [-0.12, -0.02, -0.018], 0.022, materials.skin);
      return h;
    }

    const father = group(-1.45, 0, -0.65, opening);
    for (const side of [-1, 1]) {
      rod(
        father,
        [side * 0.17, 0.14, 0],
        [side * 0.18 + 0.06, 1.2, 0],
        0.15,
        materials.trousers
      );
      box(
        father,
        [0.27, 0.14, 0.48],
        [side * 0.17, 0.075, 0.1],
        materials.dark,
        0.055
      );
    }
    const torso = sphere(father, [0.45, 0.67, 0.26], [0.14, 1.81, 0.05], shirt);
    torso.rotation.z = -0.15;
    rod(father, [0.19, 2.23, 0.05], [0.3, 2.55, 0.12], 0.13, materials.skin);
    const dadHead = head(father, [0.36, 2.81, 0.2], 1.03, true);
    dadHead.name = "dad-head";
    dadHead.rotation.set(0.26, 1.15, -0.08);
    rod(father, [0.48, 2.14, 0.08], [0.65, 1.85, 0.6], 0.155, shirt);
    rod(father, [0.65, 1.85, 0.6], [1.18, 2.12, 1.26], 0.092, materials.skin);
    const pointingHand = hand(father, [1.2, 2.12, 1.28], true);
    pointingHand.rotation.y = -0.85;
    rod(father, [-0.22, 2.1, 0.07], [-0.39, 1.62, 0.65], 0.14, shirt);
    rod(father, [-0.39, 1.62, 0.65], [0.1, 1.45, 1.25], 0.085, materials.skin);
    hand(father, [0.14, 1.45, 1.26]);

    const chair = group(-0.9, 0, 1.0, opening);
    box(chair, [0.73, 0.11, 0.66], [0, 0.7, 0], materials.blue, 0.08);
    box(chair, [0.71, 0.65, 0.11], [0, 1.06, 0.36], materials.blue, 0.075);
    rod(chair, [0, 0.14, 0], [0, 0.65, 0], 0.055, materials.metal);
    for (let i = 0; i < 5; i++) {
      const a = i * Math.PI * 0.4;
      rod(
        chair,
        [0, 0.15, 0],
        [Math.cos(a) * 0.47, 0.07, Math.sin(a) * 0.47],
        0.035,
        materials.metal
      );
      sphere(
        chair,
        [0.053, 0.06, 0.053],
        [Math.cos(a) * 0.47, 0.055, Math.sin(a) * 0.47],
        materials.dark
      );
    }
    const child = group(-0.85, 0, 0.82, opening);
    sphere(child, [0.26, 0.38, 0.2], [0, 1.1, 0], striped);
    rod(child, [0, 1.29, 0], [0.01, 1.55, 0], 0.085, materials.skin);
    const childHead = head(child, [0.055, 1.8, -0.015], 0.86, false);
    childHead.rotation.set(-0.12, 1.2, -0.12);
    for (const side of [-1, 1]) {
      rod(
        child,
        [side * 0.14, 0.81, 0],
        [side * 0.14, 0.66, -0.33],
        0.09,
        materials.blue
      );
      rod(
        child,
        [side * 0.14, 0.66, -0.33],
        [side * 0.14, 0.25, -0.35],
        0.072,
        materials.skin
      );
      box(
        child,
        [0.14, 0.1, 0.29],
        [side * 0.14, 0.18, -0.42],
        materials.dark,
        0.045
      );
    }
    rod(child, [0.21, 1.32, 0], [0.48, 1.23, -0.02], 0.1, striped);
    rod(child, [0.48, 1.23, -0.02], [0.92, 1.43, -0.15], 0.067, materials.skin);
    hand(child, [0.93, 1.43, -0.17]);
    rod(child, [-0.2, 1.28, 0], [-0.24, 1.13, -0.23], 0.085, striped);
    rod(
      child,
      [-0.24, 1.13, -0.23],
      [-0.07, 1.61, 0.11],
      0.063,
      materials.skin
    );
    hand(child, [-0.08, 1.6, 0.12]);

    function browser(
      parent: THREE.Object3D,
      texture: THREE.Texture,
      width: number,
      position: Point
    ) {
      const g = group(...position, parent);
      const height = width * 0.65;
      box(
        g,
        [width + 0.1, height + 0.16, 0.12],
        [0, 0, -0.03],
        materials.porcelain,
        0.07
      );
      plane(g, width, height, [0, -0.025, 0.035], texture);
      return g;
    }

    const plaster = new THREE.MeshStandardMaterial({
      color: 0xe2_d7_c4,
      roughness: 0.98,
    });
    const clay = new THREE.MeshStandardMaterial({
      color: 0xb4_6d_4e,
      roughness: 0.93,
    });
    const sage = new THREE.MeshStandardMaterial({
      color: 0x7c_8d_81,
      roughness: 0.96,
    });
    const wood = new THREE.MeshStandardMaterial({
      color: 0x86_5e_45,
      roughness: 0.88,
    });
    const room = group(0, 0, 0, opening);
    box(room, [5.1, 0.09, 3.8], [0, 0, -0.3], plaster);
    box(room, [5.1, 3.5, 0.12], [0, 1.75, -2.2], plaster);
    box(room, [0.12, 3.5, 3.8], [-2.55, 1.75, -0.3], plaster);
    box(room, [1.65, 1.9, 0.12], [-1.05, 2.05, -2.1], wood);
    box(room, [1.48, 1.72, 0.05], [-1.05, 2.05, -2.01], materials.blue);
    box(room, [0.045, 1.8, 0.07], [-1.05, 2.05, -1.95], materials.porcelain);
    box(room, [1.5, 0.05, 0.07], [-1.05, 2.05, -1.95], materials.porcelain);
    for (const x of [-2.0, -0.12])
      box(room, [0.3, 2.05, 0.12], [x, 1.95, -1.85], clay);
    const town = group();
    box(town, [65, 0.2, 54], [0, -0.18, -4], plaster);
    const asphalt = new THREE.MeshStandardMaterial({
      color: 0xa3_9f_94,
      roughness: 1,
    });
    box(town, [60, 0.025, 3.5], [0, -0.045, 7], asphalt);
    box(town, [3, 0.025, 45], [-7, -0.04, -4], asphalt);
    for (let i = 0; i < 36; i++) {
      const x = (i % 6) * 7.3 - 22;
      const z = Math.floor(i / 6) * 7 - 24;
      if (Math.abs(x) < 6 && Math.abs(z) < 5) continue;
      const h = 1.3 + (i % 4) * 0.7;
      const building = group(x, 0, z, town);
      const finish = [plaster, sage, clay, materials.blue][i % 4];
      box(building, [4.6, h, 4.2], [0, h / 2, 0], finish, 0.02);
      box(building, [4.8, 0.15, 4.4], [0, h, 0], plaster, 0.02);
      for (const side of [-1, 1])
        box(building, [0.12, 0.25, 4.4], [side * 2.32, h + 0.1, 0], finish);
      mesh(
        building,
        new THREE.CylinderGeometry(0.36, 0.36, 0.6, 12),
        materials.dark,
        [1, h + 0.35, -0.5]
      );
      for (let j = 0; j < 3; j++)
        box(
          building,
          [0.62, 0.8, 0.035],
          [-1.5 + j * 1.4, h * 0.57, 2.12],
          materials.dark,
          0.01
        );
      rod(town, [x + 2.8, 0, z], [x + 2.8, 1.4, z], 0.08, wood);
      sphere(town, [0.9, 1.15, 0.85], [x + 2.8, 2, z], sage);
    }
    const roof = box(town, [5.3, 0.17, 4.05], [0, 3.57, -0.3], clay);
    const cloudTexture = canvasTexture(
      (ctx) => {
        const glow = ctx.createRadialGradient(128, 128, 8, 128, 128, 125);
        glow.addColorStop(0, "rgba(255,255,255,.95)");
        glow.addColorStop(0.45, "rgba(255,255,255,.8)");
        glow.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, 256, 256);
      },
      256,
      256
    );
    const cloudMaterial = new THREE.SpriteMaterial({
      depthWrite: false,
      map: cloudTexture,
      opacity: 0.78,
      transparent: true,
    });
    const clouds = group();
    for (let i = 0; i < 26; i++) {
      const cloud = new THREE.Sprite(cloudMaterial);
      cloud.position.set(
        Math.sin(i * 2.4) * 26,
        8 + (i % 4) * 4,
        Math.cos(i * 2.4) * 18
      );
      cloud.scale.set(13 + (i % 3) * 4, 8 + (i % 4), 1);
      clouds.add(cloud);
    }

    const playWorld = group(7, 0, 0);
    const gameWindow = browser(
      playWorld,
      textTexture(
        "There was always another world.",
        "Playing · exploring · learning"
      ),
      3.05,
      [0, 1.95, -0.85]
    );
    gameWindow.rotation.y = -0.16;
    const jet = group(0.2, 1.55, 0.75, playWorld);
    jet.rotation.set(-0.12, -0.55, -0.16);
    sphere(jet, [0.16, 0.13, 0.86], [0, 0, 0], materials.metal);
    sphere(jet, [0.11, 0.11, 0.29], [0, 0.13, 0.29], materials.blue);
    const wingShape = new THREE.Shape();
    wingShape.moveTo(-1.2, -0.45);
    wingShape.lineTo(0, 0.45);
    wingShape.lineTo(1.2, -0.45);
    wingShape.lineTo(0, -0.17);
    wingShape.closePath();
    const wings = mesh(
      jet,
      new THREE.ExtrudeGeometry(wingShape, {
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.018,
        bevelThickness: 0.018,
        depth: 0.025,
        steps: 1,
      }),
      materials.metal,
      [0, 0, 0]
    );
    wings.rotation.x = Math.PI / 2;
    const tail = box(
      jet,
      [0.035, 0.38, 0.35],
      [0, 0.15, -0.6],
      materials.blue,
      0.02
    );
    tail.rotation.x = -0.3;
    const tinkering = group(0, 0, 0, playWorld);
    const youngMe = child.clone();
    youngMe.position.set(-0.65, 0.25, 0.5);
    youngMe.rotation.y = 0.25;
    tinkering.add(youngMe);
    const cousin = child.clone();
    cousin.position.set(0.6, 0.25, -0.2);
    cousin.rotation.y = -0.5;
    tinkering.add(cousin);
    cousin.scale.setScalar(1.12);
    cousin.traverse((part) => {
      if (part instanceof THREE.Mesh && part.material === materials.blue)
        part.material = clay;
    });
    box(tinkering, [1.4, 0.1, 0.8], [0, 0.8, 0.45], materials.plastic);
    box(tinkering, [0.65, 0.04, 0.45], [0, 0.88, 0.45], materials.board);
    const television = browser(
      tinkering,
      textTexture("Backyard Science", "A childhood television memory"),
      1.5,
      [1.4, 2.7, -1.7]
    );
    television.rotation.y = 0.18;

    const computer = group(1.7, 0.05, -0.28);
    const chassis = group(0, 0, 0, computer);
    box(chassis, [0.64, 1.15, 0.94], [0, 0.6, 0], materials.metal, 0.035);
    box(chassis, [0.025, 1.08, 0.88], [0.335, 0.6, 0], materials.plastic, 0.02);
    box(
      chassis,
      [0.65, 1.15, 0.065],
      [0, 0.6, 0.5],
      materials.porcelain,
      0.035
    );
    for (let i = 0; i < 2; i++) {
      box(
        chassis,
        [0.52, 0.12, 0.008],
        [0, 0.98 - i * 0.15, 0.535],
        materials.plastic,
        0.008
      );
      box(
        chassis,
        [0.39, 0.008, 0.006],
        [-0.035, 0.99 - i * 0.15, 0.543],
        materials.dark,
        0.002
      );
    }
    for (let i = 0; i < 7; i++)
      box(
        chassis,
        [0.39, 0.009, 0.005],
        [0, 0.16 + i * 0.033, 0.537],
        materials.dark,
        0.002
      );
    sphere(
      chassis,
      [0.025, 0.025, 0.012],
      [0.18, 0.59, 0.541],
      materials.accent
    );
    const board = group(0.25, 0.6, 0, computer);
    const boardBase = box(
      board,
      [0.024, 0.76, 0.66],
      [0, 0, 0],
      materials.board,
      0.01
    );
    for (let i = 0; i < 10; i++)
      box(
        board,
        [0.015, 0.025, 0.36],
        [0.02, -0.3 + i * 0.062, 0.01],
        materials.copper,
        0.002
      );
    for (let i = 0; i < 5; i++)
      box(
        board,
        [0.05, 0.12, 0.08],
        [0.04, -0.26 + i * 0.11, -0.23],
        materials.dark,
        0.004
      );
    const heatsink = group(0.08, 0.12, 0, board);
    for (let i = 0; i < 14; i++)
      box(
        heatsink,
        [0.15, 0.006, 0.23],
        [0, -0.14 + i * 0.021, 0],
        materials.metal,
        0.002
      );
    const fan = group(0.14, 0.12, 0, board);
    fan.name = "cooling-fan";
    const rim = mesh(
      fan,
      new THREE.TorusGeometry(0.19, 0.018, 8, 40),
      materials.dark,
      [0, 0, 0]
    );
    rim.rotation.y = Math.PI / 2;
    sphere(fan, [0.03, 0.06, 0.06], [0, 0, 0], materials.dark);
    for (let i = 0; i < 7; i++) {
      const angle = (i * Math.PI * 2) / 7;
      const blade = box(
        fan,
        [0.018, 0.13, 0.064],
        [0, Math.cos(angle) * 0.1, Math.sin(angle) * 0.1],
        materials.dark,
        0.02
      );
      blade.rotation.x = angle + 0.6;
    }
    const ram = box(
      board,
      [0.025, 0.45, 0.09],
      [0.02, -0.04, 0.25],
      materials.board,
      0.005
    );
    ram.name = "memory-module";
    for (let i = 0; i < 5; i++)
      box(
        ram,
        [0.017, 0.045, 0.07],
        [0.019, -0.16 + i * 0.075, 0],
        materials.dark,
        0.002
      );
    boardBase.receiveShadow = true;

    const repair = group(14, 0, 0);
    box(repair, [6.7, 0.1, 4.6], [0, 0, -0.1], plaster);
    box(repair, [6.7, 3.8, 0.12], [0, 1.9, -2.4], sage);
    box(repair, [0.12, 3.8, 4.6], [-3.35, 1.9, -0.1], plaster);
    // The name comes from memory; this title is not a replica of the shop sign.
    plane(
      repair,
      2.4,
      0.36,
      [0.6, 3.28, -2.3],
      canvasTexture(
        (ctx) => {
          ctx.fillStyle = "#7c8d81";
          ctx.fillRect(0, 0, 1024, 154);
          ctx.fillStyle = "#fff8e9";
          ctx.font = "500 65px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("Uttaranchal Computer", 512, 105);
        },
        1024,
        154
      )
    );
    box(repair, [4.8, 0.15, 1.7], [0.35, 1.27, 0.1], wood);
    for (const x of [-1.75, 2.45])
      for (const z of [-0.55, 0.73])
        box(repair, [0.1, 1.22, 0.1], [x, 0.63, z], materials.dark);
    for (const y of [0.55, 1.75, 2.85]) {
      box(repair, [2.2, 0.085, 0.65], [-1.96, y, -1.83], wood);
      for (let j = 0; j < 3; j++) {
        const unit = chassis.clone();
        unit.position.set(-2.64 + j * 0.7, y + 0.045, -1.78);
        unit.scale.setScalar(0.58);
        repair.add(unit);
      }
    }
    const spareMonitor = monitor.clone();
    spareMonitor.position.set(1.93, 1.36, -1.25);
    spareMonitor.rotation.y = -0.23;
    repair.add(spareMonitor);
    for (let i = 0; i < 3; i++) {
      box(repair, [0.9, 0.63, 0.85], [2.66, 0.37 + i * 0.66, -1.72], plaster);
      box(repair, [0.11, 0.015, 0.86], [2.66, 0.69 + i * 0.66, -1.72], clay);
    }
    // One reversible disassembly on his workbench, inside the inhabited shop.
    const repairComputer = group(0.92, 1.36, 0.12, repair);
    repairComputer.scale.setScalar(0.9);
    repairComputer.rotation.y = -0.28;
    const repairChassis = chassis.clone();
    repairComputer.add(repairChassis);
    repairChassis.children[0].visible = false;
    box(repairChassis, [0.025, 1.12, 0.92], [-0.31, 0.6, 0], materials.metal);
    box(repairChassis, [0.62, 0.025, 0.92], [0, 0.055, 0], materials.metal);
    box(repairChassis, [0.62, 0.025, 0.92], [0, 1.15, 0], materials.metal);
    box(repairChassis, [0.62, 1.12, 0.025], [0, 0.6, -0.46], materials.metal);
    const repairPanel = repairChassis.children[1];
    const repairBoard = board.clone();
    repairBoard.position.set(0.25, 0.6, 0);
    repairComputer.add(repairBoard);
    const repairFan = repairBoard.getObjectByName("cooling-fan")!;
    const repairRam = repairBoard.getObjectByName("memory-module")!;
    // A seated technician and child attend to the same object, not the viewer.
    const mandal = group(-0.77, 0, -0.77, repair);
    box(mandal, [0.8, 0.1, 0.6], [0, 0.65, 0], materials.dark);
    sphere(mandal, [0.47, 0.58, 0.31], [0, 1.35, 0], materials.blue);
    const mandalHead = head(mandal, [0.05, 2.08, 0.12], 0.88, true);
    mandalHead.rotation.set(0.42, 0.35, -0.04);
    for (const side of [-1, 1]) {
      rod(
        mandal,
        [side * 0.24, 0.77, 0],
        [side * 0.29, 0.65, 0.5],
        0.17,
        materials.trousers
      );
      rod(
        mandal,
        [side * 0.29, 0.65, 0.5],
        [side * 0.29, 0.12, 0.62],
        0.13,
        materials.trousers
      );
      box(mandal, [0.22, 0.1, 0.4], [side * 0.29, 0.08, 0.74], materials.dark);
      rod(
        mandal,
        [side * 0.38, 1.65, 0.03],
        [side * 0.47, 1.38, 0.36],
        0.13,
        materials.blue
      );
      rod(
        mandal,
        [side * 0.47, 1.38, 0.36],
        [0.45 + side * 0.2, 1.54, 0.95],
        0.077,
        materials.skin
      );
      hand(mandal, [0.45 + side * 0.2, 1.54, 0.96], side === 1);
    }
    const visitor = child.clone();
    visitor.position.set(-1.35, 0.06, 1.22);
    visitor.rotation.y = 0.85;
    repair.add(visitor);
    const visitorChair = chair.clone();
    visitorChair.position.set(-1.35, 0.06, 1.25);
    visitorChair.rotation.y = 0.85;
    repair.add(visitorChair);
    for (let i = 0; i < 4; i++)
      box(
        repair,
        [0.07, 0.045, 0.45],
        [0.6 + i * 0.14, 1.39, 0.6],
        materials.board
      );
    rod(repair, [-0.2, 1.4, 0.75], [-0.6, 1.4, 0.65], 0.025, materials.metal);
    rod(repair, [-0.6, 1.4, 0.65], [-0.77, 1.4, 0.61], 0.06, clay);

    const community = group(22, 0, 0);
    const conversation = browser(
      community,
      textTexture("Learning, together.", "Facebook · blogs · communities"),
      2.9,
      [0, 1.95, 0]
    );
    conversation.rotation.y = -0.18;
    const blog = browser(
      community,
      textTexture("On Blogger since", "June 2012"),
      1.7,
      [1.5, 1.05, 0.65]
    );
    blog.rotation.y = -0.3;
    const empty = textTexture(
      "An early corner of the web.",
      "Loading the original archive…"
    );
    const publishing = group(29, 0, 0);
    const making = group(0, 0, 0, publishing);
    const early = browser(publishing, empty, 3.35, [-0.45, 1.95, -0.15]);
    early.rotation.y = 0.05;
    const orb = browser(publishing, empty, 3.35, [1.2, 1.45, 0.85]);
    orb.rotation.y = -0.22;
    const loader = new THREE.TextureLoader();
    function loadArtifact(
      url: string,
      target:
        | THREE.Group
        | THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
    ) {
      loader.load(
        url,
        (texture) => {
          if (disposed) {
            texture.dispose();
            return;
          }
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = 4;
          textures.add(texture);
          const surface =
            target instanceof THREE.Mesh
              ? target
              : (target.children[1] as THREE.Mesh<
                  THREE.PlaneGeometry,
                  THREE.MeshBasicMaterial
                >);
          surface.material.map = texture;
          surface.material.needsUpdate = true;
          invalidate();
        },
        undefined,
        () => {
          if (!disposed) invalidate();
        }
      );
    }
    loadArtifact(artifacts[0].image, early);
    loadArtifact(artifacts[1].image, orb);

    function laptop(
      parent: THREE.Object3D,
      position: Point,
      texture: THREE.Texture,
      dark = false
    ) {
      const g = group(...position, parent);
      const finish = dark ? materials.dark : materials.metal;
      box(g, [2.2, 0.095, 1.42], [0, 0, 0.25], finish, 0.035);
      box(g, [0.72, 0.012, 0.42], [0, 0.057, 0.57], finish, 0.035);
      for (let r = 0; r < 4; r++)
        for (let c = 0; c < 12; c++)
          box(
            g,
            [0.13, 0.01, 0.12],
            [-0.9 + c * 0.164, 0.055, -0.22 + r * 0.155],
            materials.dark,
            0.014
          );
      const lid = group(0, 0.03, -0.43, g);
      lid.name = "laptop-lid";
      lid.rotation.x = -0.14;
      box(lid, [2.2, 1.4, 0.06], [0, 0.7, 0], finish, 0.05);
      plane(lid, 2.07, 1.25, [0, 0.72, 0.034], texture);
      return g;
    }
    function phone(
      parent: THREE.Object3D,
      position: Point,
      title: string,
      color = materials.dark
    ) {
      const g = group(...position, parent);
      box(g, [0.67, 1.32, 0.07], [0, 0, 0], color, 0.075);
      plane(
        g,
        0.59,
        1.17,
        [0, 0, 0.04],
        canvasTexture(
          (ctx) => {
            ctx.fillStyle = "#e8ded0";
            ctx.fillRect(0, 0, 400, 800);
            ctx.fillStyle = "#944722";
            ctx.fillRect(25, 140, 350, 5);
            ctx.fillStyle = "#262827";
            ctx.font = "500 36px sans-serif";
            ctx.textAlign = "center";
            title
              .split("\n")
              .forEach((line, i) => ctx.fillText(line, 200, 350 + i * 52));
          },
          400,
          800
        )
      );
      return g;
    }
    function worktable(parent: THREE.Object3D, wide = false, standing = false) {
      const w = wide ? 5.2 : 3.7;
      box(parent, [w, 0.12, 1.75], [0, 1.16, 0], wood);
      for (const x of [-w * 0.4, w * 0.4]) {
        if (standing) {
          box(parent, [0.12, 1.12, 0.16], [x, 0.58, 0], materials.dark);
          box(parent, [0.5, 0.07, 1.4], [x, 0.04, 0], materials.dark);
        } else
          for (const z of [-0.62, 0.62])
            box(parent, [0.08, 1.12, 0.08], [x, 0.58, z], materials.dark);
      }
    }

    function picture(
      parent: THREE.Object3D,
      url: string,
      width: number,
      height: number,
      at: Point
    ) {
      const g = group(...at, parent);
      box(
        g,
        [width + 0.06, height + 0.06, 0.06],
        [0, 0, -0.02],
        materials.porcelain,
        0.02
      );
      plane(g, width, height, [0, 0, 0.015], empty);
      loadArtifact(url, g);
      return g;
    }
    function notebook(parent: THREE.Object3D, at: Point, color: Material) {
      const g = group(...at, parent);
      box(g, [1.08, 0.12, 1.5], [0, 0, 0], materials.porcelain, 0.02);
      for (const y of [-0.08, 0.08])
        box(g, [1.13, 0.025, 1.56], [0, y, 0], color, 0.025);
      box(g, [0.085, 0.2, 1.56], [-0.56, 0, 0], color);
      return g;
    }
    function microphone(parent: THREE.Object3D, at: Point) {
      const g = group(...at, parent);
      box(g, [0.52, 0.06, 0.38], [0, 0, 0], materials.dark);
      rod(g, [0, 0, 0], [0, 0.85, 0], 0.035, materials.metal);
      sphere(g, [0.18, 0.33, 0.18], [0, 1.05, 0], materials.dark);
      for (let i = 0; i < 8; i++)
        box(
          g,
          [0.24, 0.013, 0.022],
          [0, 0.82 + i * 0.065, 0.163],
          materials.metal,
          0.003
        );
      return g;
    }
    // Artifacts are different objects, not a succession of identical desks.
    const themes = group(36, 0, 0);
    const themePages = picture(
      themes,
      "/story/duke-2015.webp",
      2.9,
      1.81,
      [-0.35, 2, -0.35]
    );
    themePages.rotation.set(-0.08, 0.16, -0.1);
    const octane = notebook(themes, [-0.8, 0.64, 0.65], clay);
    octane.rotation.set(0.55, 0.2, -0.1);
    const dongle = group(0.97, 0.87, 0.8, themes);
    dongle.rotation.set(0.2, -0.25, 0.45);
    box(dongle, [0.28, 0.16, 0.72], [0, 0, 0], materials.porcelain);
    box(dongle, [0.18, 0.08, 0.18], [0, 0, -0.41], materials.metal);
    sphere(dongle, [0.022, 0.012, 0.022], [0, 0.085, 0.15], materials.accent);
    cable(
      dongle,
      [
        [0, 0, -0.5],
        [0.4, -0.2, -0.75],
        [0.7, -0.7, -0.4],
      ],
      0.025
    );
    const beximo = browser(
      themes,
      textTexture("Beximo", "Learning to work together · 2016–2017"),
      2.4,
      [0, 2, 0]
    );
    const portable = group(44, 0, 0);
    const firstLaptop = laptop(
      portable,
      [-0.15, 0.85, 0],
      textTexture("A room of possibilities", "My first laptop"),
      true
    );
    const cameraRig = group(0, 0, 0, portable);
    const cameraBody = group(-1.25, 1.05, 0.8, cameraRig);
    box(cameraBody, [0.65, 0.43, 0.36], [0, 0, 0], materials.dark);
    const lens = mesh(
      cameraBody,
      new THREE.CylinderGeometry(0.15, 0.15, 0.25, 24),
      materials.metal,
      [0.12, 0, 0.25]
    );
    lens.rotation.x = Math.PI / 2;
    for (let i = 0; i < 3; i++)
      rod(
        cameraRig,
        [-1.25, 0.85, 0.8],
        [-1.25 + Math.cos(i * 2.1) * 0.38, 0.1, 0.8 + Math.sin(i * 2.1) * 0.38],
        0.025,
        materials.dark
      );
    const college = group(52, 0, 0);
    const collegeWork = group(0, 0, 0, college);
    const studioPage = picture(
      collegeWork,
      "/story/digital-moshai.webp",
      3.05,
      1.9,
      [0.3, 2.15, -0.5]
    );
    studioPage.rotation.y = -0.12;
    const voices = group(0, 0.3, 0.4, collegeWork);
    microphone(voices, [0, 0, 0]);
    const voiceNodes: THREE.Group[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const node = group(
        Math.cos(angle) * 1.4,
        0.65 + Math.sin(angle) * 0.7,
        -0.65,
        voices
      );
      sphere(
        node,
        [0.075, 0.075, 0.075],
        [0, 0.2, 0],
        i % 3 ? materials.blue : clay
      );
      rod(
        node,
        [0, -0.05, 0],
        [0, 0.08, 0],
        0.08,
        i % 3 ? materials.blue : clay
      );
      voiceNodes.push(node);
    }
    const product = group(60, 0, 0);
    const folio = group(-0.3, 1.25, -0.2, product);
    folio.rotation.set(0.15, -0.2, -0.08);
    for (let i = 0; i < 3; i++) {
      const sheet = group(i * 0.25, i * 0.18, -i * 0.2, folio);
      box(sheet, [1.75, 2.1, 0.03], [0, 0, 0], materials.porcelain, 0.025);
      box(
        sheet,
        [1.2, 0.24, 0.02],
        [0, 0.65, 0.03],
        i % 2 ? clay : materials.blue
      );
      for (let line = 0; line < 4; line++)
        box(
          sheet,
          [1.2 - (line % 2) * 0.3, 0.04, 0.02],
          [(-line % 2) * 0.15, 0.12 - line * 0.22, 0.03],
          materials.plastic,
          0.005
        );
    }
    const heroBrand = picture(
      product,
      "/design/brand/heroapp.webp",
      0.55,
      0.55,
      [-1.22, 2.1, 0.45]
    );
    const heroPhone = phone(product, [0.65, 1.55, 0.7], "Hero App");
    heroPhone.scale.setScalar(0.42);
    rod(product, [-1.25, 0.28, 0.8], [0.3, 0.4, 1], 0.05, clay);
    const portfolioPage = picture(
      product,
      "/story/portfolio-2021.webp",
      3.1,
      1.94,
      [0, 1.9, 0.45]
    );
    const team = group(68, 0, 0);
    const teamWork = group(0, 0, 0, team);
    const whiteboard = group(0, 1.8, -0.35, teamWork);
    box(whiteboard, [3.2, 1.85, 0.075], [0, 0, 0], materials.porcelain);
    for (const x of [-1.2, 1.2])
      rod(teamWork, [x, 0.1, -0.35], [x, 2, -0.35], 0.035, materials.metal);
    picture(
      whiteboard,
      "/design/brand/zenduty.webp",
      0.56,
      0.56,
      [-1.05, 0.5, 0.05]
    );
    for (let i = 0; i < 6; i++)
      box(
        whiteboard,
        [0.55, 0.35, 0.035],
        [-0.7 + (i % 3) * 0.73, -0.18 - Math.floor(i / 3) * 0.5, 0.06],
        i % 2 ? materials.blue : clay
      );
    const sharing = group(77, 0, 0);
    const air = laptop(
      sharing,
      [-0.55, 0.8, 0],
      textTexture("React Native security", "4 November 2023")
    );
    air.scale.setScalar(0.85);
    const talkMic = microphone(sharing, [1.15, 0.45, 0.4]);
    phone(sharing, [-1.4, 0.55, 0.85], "iPhone 14").scale.setScalar(0.42);
    const mentorNotes = group(0, 0, 0, sharing);
    for (const side of [-1, 1]) {
      const book = notebook(
        mentorNotes,
        [side * 0.65, 0.65, 0.25],
        side < 0 ? clay : materials.blue
      );
      book.rotation.set(0.7, side * 0.25, side * 0.08);
    }
    const roles = group(87, 0, 0);
    const today = group(98, 0, 0);
    worktable(today, true, true);
    function display(
      parent: THREE.Object3D,
      width: number,
      height: number,
      position: Point,
      texture: THREE.Texture
    ) {
      const g = group(...position, parent);
      box(g, [width, height, 0.075], [0, 0, 0], materials.dark, 0.04);
      plane(g, width - 0.08, height - 0.09, [0, 0, 0.044], texture);
      rod(
        g,
        [0, -height / 2, -0.07],
        [0, -height / 2 - 0.35, -0.07],
        0.045,
        materials.metal
      );
      box(
        g,
        [0.6, 0.045, 0.38],
        [0, -height / 2 - 0.35, -0.02],
        materials.dark
      );
      return g;
    }
    const ultrawide = display(
      today,
      3.05,
      1.14,
      [-0.53, 2.19, -0.35],
      textTexture(
        "The screen stayed on.",
        "Creating digital experiences for humans."
      )
    );
    loadArtifact("/story/altr-2026.webp", ultrawide);
    const secondDisplay = display(
      today,
      1.55,
      1.09,
      [1.83, 2.17, -0.1],
      textTexture("Altr · Tethr", "Early access · private alpha")
    );
    secondDisplay.rotation.y = -0.28;
    loadArtifact("/story/tethr-2026.webp", secondDisplay);
    laptop(
      today,
      [-1.42, 1.27, 0.55],
      textTexture("Quivly", "Still building.")
    ).scale.setScalar(0.57);
    phone(today, [2.08, 1.55, 0.5], "CMF\nPhone 2", clay).scale.setScalar(0.32);
    phone(today, [1.67, 1.55, 0.5], "iPhone", materials.metal).scale.setScalar(
      0.32
    );
    const projectArtifacts = group(98, 0, 0);
    const altrArtifact = picture(
      projectArtifacts,
      "/story/altr-2026.webp",
      3.2,
      2,
      [0, 1.75, 0]
    );
    const tethrArtifact = picture(
      projectArtifacts,
      "/story/tethr-2026.webp",
      3.2,
      2,
      [0, 1.75, 0]
    );
    const tetherBook = notebook(projectArtifacts, [-0.9, 0.45, 0.55], clay);
    tetherBook.rotation.y = -0.25;
    const adult = group(-0.2, 0, 1.2, today);
    const workChair = chair.clone();
    workChair.position.set(0, 0.2, 0.12);
    workChair.scale.set(1.08, 1.15, 1.05);
    adult.add(workChair);
    sphere(adult, [0.34, 0.5, 0.23], [0, 1.42, 0], materials.blue);
    rod(adult, [0, 1.7, 0], [0, 1.91, -0.025], 0.105, materials.skin);
    const workingHead = head(adult, [0, 2.13, -0.035], 1, false);
    workingHead.name = "working-head";
    workingHead.rotation.set(0.1, Math.PI - 0.22, 0.05);
    for (const side of [-1, 1]) {
      rod(
        adult,
        [side * 0.16, 0.99, 0],
        [side * 0.22, 0.62, -0.35],
        0.13,
        materials.trousers
      );
      rod(
        adult,
        [side * 0.22, 0.62, -0.35],
        [side * 0.22, 0.17, -0.39],
        0.1,
        materials.trousers
      );
      box(
        adult,
        [0.21, 0.13, 0.39],
        [side * 0.22, 0.08, -0.47],
        materials.dark
      );
      rod(
        adult,
        [side * 0.28, 1.66, 0],
        [side * 0.38, 1.28, -0.2],
        0.115,
        materials.blue
      );
      rod(
        adult,
        [side * 0.38, 1.28, -0.2],
        [side * 0.3, 1.29, -0.68],
        0.078,
        materials.skin
      );
      hand(adult, [side * 0.3, 1.29, -0.68]);
    }
    const workKeyboard = keyboard.clone();
    workKeyboard.position.set(-0.2, 1.265, 0.5);
    workKeyboard.scale.setScalar(0.88);
    today.add(workKeyboard);

    // Revisit the white computer with an older, independently working figure.
    making.add(desk.clone(), keyboard.clone());
    const teenMonitor = monitor.clone();
    making.add(teenMonitor);
    const teenScreen = teenMonitor.children[3] as THREE.Mesh<
      THREE.PlaneGeometry,
      THREE.MeshBasicMaterial
    >;
    teenScreen.material = teenScreen.material.clone();
    loadArtifact(artifacts[0].image, teenScreen);
    const teenTower = computer.clone();
    teenTower.position.set(1.7, 0.05, -0.28);
    making.add(teenTower);
    const teenager = adult.clone();
    teenager.position.set(-0.4, 0.2, 1.33);
    teenager.scale.setScalar(0.92);
    teenager
      .getObjectByName("working-head")!
      .rotation.set(0.16, Math.PI - 0.45, 0);
    making.add(teenager);
    sphere(
      making,
      [0.115, 0.065, 0.17],
      [0.73, 1.42, 0.73],
      materials.porcelain
    );
    cable(making, [
      [0.74, 1.38, 0.6],
      [0.94, 1.37, 0.42],
      [1.04, 1.37, -0.15],
      [0.5, 1.37, -0.45],
    ]);
    notebook(making, [-1.05, 1.43, -0.2], clay).scale.setScalar(0.48);

    function walkingPerson(
      parent: THREE.Group,
      clothing: Material = materials.blue
    ) {
      const person = group(0, 0, 0, parent);
      sphere(person, [0.32, 0.48, 0.21], [0, 1.46, 0], clothing);
      rod(person, [0, 1.7, 0], [0, 1.95, 0], 0.1, materials.skin);
      head(person, [0, 2.14, 0], 0.94, false);
      const limbs: THREE.Group[] = [];
      for (const side of [-1, 1]) {
        const leg = group(side * 0.15, 1.03, 0, person);
        rod(leg, [0, 0, 0], [0, -0.87, 0], 0.11, materials.trousers);
        box(leg, [0.2, 0.13, 0.34], [0, -0.95, 0.07], materials.dark);
        const arm = group(side * 0.32, 1.7, 0, person);
        rod(arm, [0, 0, 0], [side * 0.07, -0.35, 0], 0.1, clothing);
        rod(
          arm,
          [side * 0.07, -0.35, 0],
          [side * 0.07, -0.67, 0],
          0.065,
          materials.skin
        );
        hand(arm, [side * 0.07, -0.72, 0]);
        limbs.push(leg, arm);
      }
      return { limbs, person };
    }
    function walk(limbs: THREE.Group[], phase: number, amount: number) {
      for (let i = 0; i < limbs.length; i++)
        limbs[i].rotation.x =
          Math.sin(phase + (i === 0 || i === 3 ? 0 : Math.PI)) * amount;
    }
    const chapterPeople: THREE.Group[] = [];
    for (const [place, x, z] of [
      [community, -1.45, 0.7],
      [themes, -1.75, 0.4],
      [portable, 1.25, 0.6],
      [collegeWork, 1.7, 0.4],
      [product, -1.8, 0.5],
      [teamWork, 1.8, 0.6],
      [sharing, -1.6, 0.2],
      [roles, -1.9, 0.7],
      [projectArtifacts, 1.8, 0.4],
    ] as [THREE.Group, number, number][]) {
      const person = walkingPerson(place).person;
      person.scale.setScalar(0.8);
      person.position.set(x, 0, z);
      person.rotation.y = x < 0 ? 0.65 : -0.55;
      chapterPeople.push(person);
      box(place, [5.2, 0.06, 3.7], [0, -0.02, 0], materials.porcelain);
    }
    const booth = group(0, 0, 0, sharing);
    box(booth, [3.7, 2.7, 0.12], [0.2, 1.35, -0.7], materials.blue);
    picture(booth, "/design/brand/zenduty.webp", 0.8, 0.8, [0.15, 1.95, -0.61]);
    box(booth, [2.45, 0.95, 0.65], [0.15, 0.48, 0.5], materials.porcelain);
    plane(
      booth,
      1.65,
      0.32,
      [0.15, 0.58, 0.833],
      textTexture("Zenduty", "KubeCon India · 2024")
    );
    function campus(
      parent: THREE.Group,
      name = "Gurgaon",
      description = "College"
    ) {
      const building = group(0, 0, -3.1, parent);
      box(building, [6.1, 0.12, 3], [0, 0, 0.6], plaster);
      for (const side of [-1, 1]) {
        box(building, [2.15, 3, 1.3], [side * 1.9, 1.5, -0.25], plaster);
        for (let row = 0; row < 2; row++)
          for (let col = 0; col < 2; col++)
            box(
              building,
              [0.63, 0.7, 0.04],
              [side * 1.9 - 0.43 + col * 0.86, 1.05 + row * 1.12, 0.43],
              materials.blue
            );
      }
      box(building, [1.55, 2.2, 0.12], [0, 1.1, -0.7], materials.dark);
      box(building, [2, 0.25, 1.55], [0, 2.7, 0], clay);
      for (const side of [-1, 1])
        box(
          building,
          [0.16, 2.6, 0.16],
          [side * 0.85, 1.3, 0.58],
          materials.porcelain
        );
      plane(
        building,
        1.2,
        0.32,
        [0, 2.5, 0.79],
        textTexture(name, description)
      );
      return building;
    }
    // Physical events: an illustrative town and campus, never a recovered map.
    function eventSign(
      parent: THREE.Group,
      label: string,
      at: Point,
      width = 1.5
    ) {
      return plane(
        parent,
        width,
        width / 3,
        at,
        canvasTexture(
          (ctx) => {
            ctx.fillStyle = "#f5efe4";
            ctx.fillRect(0, 0, 768, 256);
            ctx.fillStyle = "#7d3c24";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "600 72px sans-serif";
            ctx.fillText(label, 384, 128, 720);
          },
          768,
          256
        )
      );
    }
    const hunt = group(40, 0, 0);
    box(hunt, [5.8, 0.16, 4.6], [0, 0, 0], plaster);
    const mall = group(-1.65, 0.08, -1.4, hunt);
    box(mall, [2.1, 1.5, 1], [0, 0.75, 0], materials.porcelain);
    box(mall, [2.3, 0.18, 1.2], [0, 1.58, 0], clay);
    for (let i = 0; i < 4; i++)
      box(
        mall,
        [0.35, 0.85, 0.03],
        [-0.72 + i * 0.48, 0.63, 0.52],
        materials.blue
      );
    eventSign(mall, "MALL", [0, 1.27, 0.53], 1.05);
    for (const [x, z] of [
      [1.7, -1.25],
      [2.05, 0.7],
    ]) {
      for (let i = 0; i < 3; i++) {
        box(
          hunt,
          [0.55, 0.95, 0.7],
          [x - 0.6 + i * 0.62, 0.55, z],
          materials.porcelain
        );
        box(hunt, [0.64, 0.12, 0.79], [x - 0.6 + i * 0.62, 1.05, z], clay);
        box(
          hunt,
          [0.18, 0.32, 0.025],
          [x - 0.6 + i * 0.62, 0.57, z + 0.36],
          materials.blue
        );
      }
    }
    const trailPoints: Point[][] = [
      [
        [-1.2, 0.12, 1.4],
        [-1.55, 0.12, 0.1],
        [-0.7, 0.12, -0.65],
      ],
      [
        [-1, 0.12, 1.5],
        [0.2, 0.12, 0.65],
        [1.65, 0.12, -0.45],
      ],
      [
        [-0.8, 0.12, 1.6],
        [0.4, 0.12, 1.1],
        [1.8, 0.12, 1.55],
      ],
      [
        [-0.6, 0.12, 1.7],
        [0.15, 0.12, -0.1],
        [0.4, 0.12, -1.65],
      ],
    ];
    const huntTeams = trailPoints.map((points, index) => {
      cable(
        hunt,
        points,
        0.014,
        [clay, materials.blue, materials.copper, materials.board][index]
      );
      const path = new THREE.CatmullRomCurve3(
        points.map((at) => new THREE.Vector3(...at))
      );
      const people = [walkingPerson(hunt), walkingPerson(hunt)];
      for (const member of people) member.person.scale.setScalar(0.34);
      return { path, people };
    });
    const huntOrganiser = walkingPerson(hunt, clay);
    huntOrganiser.person.position.set(-1.85, 0.1, 1.5);
    huntOrganiser.person.scale.setScalar(0.46);
    huntOrganiser.limbs[3].rotation.x = -0.75;
    box(
      huntOrganiser.person,
      [0.38, 0.48, 0.025],
      [0.37, 1.17, 0.42],
      materials.porcelain
    );
    const clueDesk = group(-1.1, 0, 1.65, hunt);
    box(clueDesk, [0.9, 0.06, 0.5], [0, 0.54, 0], wood);
    for (const x of [-0.35, 0.35])
      box(clueDesk, [0.05, 0.5, 0.32], [x, 0.28, 0], materials.dark);
    for (let i = 0; i < 4; i++)
      box(
        clueDesk,
        [0.16, 0.008, 0.23],
        [-0.3 + i * 0.2, 0.58, 0],
        materials.porcelain
      );
    eventSign(hunt, "HuntIT", [-0.8, 2, -0.65], 1.4);

    const spark = group(48, 0, 0);
    box(spark, [6.2, 0.15, 5.4], [0, 0, -0.2], plaster);
    const sparkCampus = campus(spark, "SPARK", "DPS Rudrapur");
    sparkCampus.scale.setScalar(0.8);
    sparkCampus.position.z = -1.9;
    for (const x of [-2.65, 2.65])
      rod(spark, [x, 0.08, 1.5], [x, 2.5, 1.5], 0.025, materials.metal);
    cable(
      spark,
      [
        [-2.65, 2.5, 1.5],
        [0, 2.1, 1.5],
        [2.65, 2.5, 1.5],
      ],
      0.012
    );
    for (let i = 0; i < 9; i++) {
      const flag = box(
        spark,
        [0.22, 0.32, 0.012],
        [-2.4 + i * 0.6, 2.3 - Math.sin((i / 8) * Math.PI) * 0.4, 1.5],
        i % 2 ? clay : materials.blue
      );
      flag.rotation.z = ((i % 3) - 1) * 0.12;
    }
    const arena = group(1.55, 0.1, 0.2, spark);
    box(arena, [2.1, 0.04, 2.4], [0, 0, 0], materials.blue);
    for (let i = 0; i < 4; i++)
      box(
        arena,
        [0.6, 0.5, 0.26],
        [((i % 2) - 0.5) * 1.1, 0.27, -0.7 + Math.floor(i / 2) * 1.2],
        materials.dark
      );
    eventSign(arena, "LASER TAG", [0, 1.12, -1.1], 1.6);
    const registration = group(-1.8, 0.1, 0.4, spark);
    box(registration, [1.6, 0.72, 0.65], [0, 0.36, 0], clay);
    eventSign(registration, "HuntIT", [0, 0.45, 0.34], 1.1);
    for (const x of [-0.73, 0.73])
      rod(registration, [x, 0, -0.25], [x, 1.6, -0.25], 0.025, materials.metal);
    box(registration, [1.8, 0.08, 1.1], [0, 1.65, 0], materials.porcelain);
    const sparkHost = walkingPerson(spark, clay);
    sparkHost.person.scale.setScalar(0.48);
    sparkHost.person.position.set(-2.4, 0.1, 1.2);
    sparkHost.limbs[1].rotation.x = -0.7;
    box(
      sparkHost.person,
      [0.38, 0.5, 0.025],
      [-0.38, 1.2, 0.35],
      materials.porcelain
    );
    const festivalVisitors = [
      [-1.75, 1.5],
      [-1.15, 1.65],
      [-0.4, 0.5],
      [0.3, -0.1],
      [1.1, 0.85],
      [2, -0.65],
      [0.2, 1.8],
      [-0.9, -1],
    ].map(([x, z], index) => {
      const visitor = walkingPerson(
        spark,
        [materials.blue, clay, sage][index % 3]
      );
      visitor.person.position.set(x, 0.1, z);
      visitor.person.scale.setScalar(0.34 + (index % 2) * 0.03);
      visitor.person.rotation.y = index % 2 ? -0.6 : Math.PI - 0.5;
      return { ...visitor, x, z };
    });
    eventSign(spark, "SPARK", [0, 2.6, -1.15], 1.5);

    const qsolve = group(0, 0, 0, portable);
    phone(qsolve, [0.94, 1.05, 0.9], "QSolve").scale.setScalar(0.3);
    box(qsolve, [1.4, 1.45, 0.13], [-0.65, 0.82, -0.3], materials.porcelain);
    eventSign(qsolve, "QSolve", [-0.65, 1.12, -0.225], 1.12);
    eventSign(qsolve, "Amazon Appstore", [-0.65, 0.72, -0.223], 1.1);
    const interview = group(0, 0, 0, publishing);
    const youngWriter = walkingPerson(interview).person;
    youngWriter.scale.setScalar(0.68);
    youngWriter.position.set(-1.4, 0, 0.7);
    const byline = eventSign(
      interview,
      "Writing. Asking. Sharing.",
      [0.2, 0.65, 1.4],
      2.3
    );
    byline.rotation.y = -0.1;
    const earnings = group(-0.5, 0.65, 0.7, publishing);
    box(earnings, [1.6, 0.85, 0.05], [0, 0, 0], materials.porcelain);
    eventSign(earnings, "AdSense", [0, 0.13, 0.029], 1.2);
    eventSign(earnings, "About US$100", [0, -0.16, 0.03], 1.3);

    const toolsWorld = group(98, 0, 0);
    box(toolsWorld, [5.2, 0.08, 3.7], [0, 0, 0], materials.porcelain);
    const toolMaker = walkingPerson(toolsWorld).person;
    toolMaker.position.set(-1.9, 0.05, 0.8);
    toolMaker.scale.setScalar(0.72);
    for (const x of [-0.75, 0.95]) {
      const screen = browser(
        toolsWorld,
        textTexture(
          x < 0 ? "OpenKVM" : "Connected",
          "One keyboard. One mouse."
        ),
        1.55,
        [x, 1.8, -0.4]
      );
      screen.rotation.y = x < 0 ? 0.12 : -0.12;
    }
    box(toolsWorld, [1.4, 0.08, 0.48], [-0.65, 1.26, 0.5], materials.metal);
    const sharedCursor = group(-0.7, 1.75, -0.25, toolsWorld);
    const pointerShape = new THREE.Shape();
    pointerShape.moveTo(0, 0);
    pointerShape.lineTo(0, 0.23);
    pointerShape.lineTo(0.17, 0.08);
    pointerShape.lineTo(0.08, 0.08);
    pointerShape.closePath();
    mesh(sharedCursor, new THREE.ShapeGeometry(pointerShape), clay, [0, 0, 0]);
    const videoContext = group(1.05, 1.43, 0.35, toolsWorld);
    videoContext.scale.setScalar(0.62);
    box(videoContext, [2.55, 0.06, 0.3], [0.05, -0.22, 0], materials.plastic);
    box(
      videoContext,
      [0.12, 0.25, 0.12],
      [0.05, -0.11, -0.02],
      materials.metal
    );
    for (let i = 0; i < 3; i++) {
      box(
        videoContext,
        [0.42, 0.3, 0.035],
        [-0.85 + i * 0.48, 0, 0],
        materials.dark
      );
      box(
        videoContext,
        [0.31, 0.18, 0.012],
        [-0.85 + i * 0.48, 0, 0.025],
        materials.blue
      );
    }
    eventSign(videoContext, "ctxr", [0.9, 0, 0], 0.65);
    cable(
      videoContext,
      [
        [0.35, 0, 0],
        [0.5, 0.08, 0],
        [0.58, 0, 0],
      ],
      0.012,
      materials.copper
    );

    const collegeJourney = group(0, 0, 0, college);
    const collegeBuilding = campus(collegeJourney);
    box(collegeJourney, [7.5, 0.04, 3.4], [0, 0.025, 1], materials.dark);
    const car = group(-1.8, 0, 1.5, collegeJourney);
    box(car, [3.45, 0.58, 1.53], [0, 0.7, 0], sage, 0.18);
    box(car, [1.06, 0.18, 1.48], [1.14, 1.07, 0], sage, 0.12);
    box(car, [2.03, 0.11, 1.5], [-0.26, 1.84, 0], sage, 0.07);
    for (const x of [-1.22, 0.7])
      for (const z of [-0.69, 0.69])
        rod(car, [x, 1, z], [x * 0.82, 1.82, z], 0.045, sage);
    box(
      car,
      [0.11, 0.76, 1.35],
      [0.66, 1.45, 0],
      materials.blue,
      0.035
    ).rotation.z = 0.16;
    for (const z of [-0.5, 0.5]) {
      box(car, [0.05, 0.16, 0.28], [1.74, 0.81, z], materials.porcelain);
      box(car, [0.08, 0.16, 0.24], [-1.73, 0.81, z], clay);
    }
    const carDoor = group(0.61, 0.96, 0.78, car);
    box(carDoor, [1.55, 0.38, 0.065], [-0.77, 0.08, 0], sage, 0.03);
    rod(carDoor, [-1.48, 0.25, 0], [-1.36, 0.82, 0], 0.025, sage);
    rod(carDoor, [-1.36, 0.82, 0], [-0.03, 0.82, 0], 0.025, sage);
    const carPassenger = adult.clone();
    carPassenger.remove(carPassenger.children[0]);
    carPassenger.position.set(-0.32, 0.43, 0.16);
    carPassenger.scale.setScalar(0.52);
    carPassenger.rotation.y = -Math.PI / 2;
    carPassenger.getObjectByName("working-head")!.rotation.y =
      Math.PI / 2 + 0.3;
    car.add(carPassenger);
    box(car, [0.65, 0.12, 0.56], [-0.38, 0.86, 0.13], materials.dark);
    const carWheels: THREE.Group[] = [];
    for (const x of [-1.08, 1.1])
      for (const z of [-0.79, 0.79]) {
        const wheel = group(x, 0.36, z, car);
        mesh(
          wheel,
          new THREE.CylinderGeometry(0.34, 0.34, 0.17, 24),
          materials.dark,
          [0, 0, 0]
        ).rotation.x = Math.PI / 2;
        mesh(
          wheel,
          new THREE.CylinderGeometry(0.2, 0.2, 0.18, 16),
          materials.metal,
          [0, 0, 0]
        ).rotation.x = Math.PI / 2;
        for (let i = 0; i < 3; i++)
          box(
            wheel,
            [0.34, 0.035, 0.19],
            [0, 0, 0],
            materials.dark,
            0.005
          ).rotation.z = (i * Math.PI) / 3;
        carWheels.push(wheel);
      }
    const campusArrival = walkingPerson(collegeJourney);
    campusArrival.person.scale.setScalar(0.75);
    const arrivalPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.15, 0, 2.5),
      new THREE.Vector3(-1.65, 0, 1.9),
      new THREE.Vector3(-1.9, 0, 0.1),
      new THREE.Vector3(-1.6, 0, -1.5),
      new THREE.Vector3(0, 0, -3.5),
    ]);
    const walkingDirection = new THREE.Vector3();
    const flightJourney = group(0, 0, 0, team);
    const campusDeparture = group(0, 0, 0, flightJourney);
    campusDeparture.add(collegeBuilding.clone());
    const leavingCampus = walkingPerson(campusDeparture);
    leavingCampus.person.scale.setScalar(0.75);
    const suitcase = group(0.48, 0.45, -0.22, leavingCampus.person);
    box(suitcase, [0.4, 0.58, 0.22], [0, 0, 0], clay);
    rod(suitcase, [0, 0.28, 0], [0, 0.65, 0], 0.02, materials.metal);
    const flightExterior = group(0, 0, 0, flightJourney);
    box(flightExterior, [5, 0.06, 30], [0, 0, -10], materials.dark);
    for (let i = 0; i < 12; i++)
      box(
        flightExterior,
        [0.12, 0.01, 0.75],
        [0, 0.04, 3 - i * 2.1],
        materials.porcelain
      );
    const airliner = group(0, 0.78, 0, flightExterior);
    sphere(airliner, [0.34, 0.34, 2.2], [0, 0, 0], materials.porcelain);
    sphere(airliner, [0.27, 0.17, 0.37], [0, 0.14, -1.64], materials.blue);
    for (const side of [-1, 1]) {
      const wing = box(
        airliner,
        [2.25, 0.06, 0.98],
        [side * 1.16, -0.04, 0.18],
        materials.porcelain,
        0.025
      );
      wing.rotation.y = side * -0.25;
      sphere(
        airliner,
        [0.2, 0.2, 0.56],
        [side * 0.93, -0.3, -0.21],
        materials.metal
      );
      box(
        airliner,
        [0.88, 0.05, 0.45],
        [side * 0.5, 0.07, 1.6],
        materials.porcelain
      ).rotation.y = side * -0.25;
      for (let i = 0; i < 8; i++)
        sphere(
          airliner,
          [0.009, 0.047, 0.06],
          [side * 0.337, 0.09, -1.15 + i * 0.28],
          materials.blue
        );
    }
    box(airliner, [0.05, 0.82, 0.65], [0, 0.42, 1.55], clay, 0.04).rotation.x =
      -0.18;
    const landingGear = group(0, 0, 0, airliner);
    for (const [x, z] of [
      [0, -1.35],
      [-0.38, 0.58],
      [0.38, 0.58],
    ]) {
      rod(landingGear, [x, -0.2, z], [x, -0.6, z], 0.035, materials.metal);
      sphere(landingGear, [0.06, 0.12, 0.12], [x, -0.61, z], materials.dark);
    }
    const travelCloudMaterial = cloudMaterial.clone();
    travelCloudMaterial.opacity = 0.36;
    for (let i = 0; i < 8; i++) {
      const cloud = new THREE.Sprite(travelCloudMaterial);
      cloud.position.set(
        (i % 2 ? -1 : 1) * (4.8 + (i % 3)),
        3 + i * 0.45,
        -5 - i * 2
      );
      cloud.scale.set(7, 3.5, 1);
      flightExterior.add(cloud);
    }
    const cabin = group(0, 0, -8, flightJourney);
    box(cabin, [3.6, 0.1, 2.9], [0, 0, 0], materials.plastic);
    box(cabin, [3.6, 2.9, 0.16], [0, 1.45, -0.9], materials.porcelain, 0.12);
    box(
      cabin,
      [1.02, 1.35, 0.15],
      [0.75, 1.88, -0.77],
      materials.plastic,
      0.24
    );
    box(cabin, [0.81, 1.12, 0.08], [0.75, 1.89, -0.66], materials.blue, 0.22);
    for (let i = 0; i < 4; i++)
      sphere(
        cabin,
        [0.19, 0.075, 0.025],
        [0.55 + i * 0.12, 1.72 + Math.sin(i) * 0.11, -0.6],
        materials.porcelain
      );
    const flightPassenger = adult.clone();
    flightPassenger.remove(flightPassenger.children[0]);
    flightPassenger.position.set(-0.36, 0, 0.22);
    flightPassenger
      .getObjectByName("working-head")!
      .rotation.set(0.08, Math.PI - 0.75, 0);
    cabin.add(flightPassenger);
    for (const x of [-0.62, -0.1]) {
      rod(cabin, [x, 0.1, -0.02], [x, 0.89, 0.14], 0.05, materials.metal);
      rod(cabin, [x, 0.1, 0.58], [x, 0.89, 0.44], 0.05, materials.metal);
    }
    box(cabin, [0.79, 0.14, 0.79], [-0.36, 0.92, 0.24], materials.blue, 0.09);
    box(cabin, [0.79, 1.25, 0.18], [-0.36, 1.47, 0.67], materials.blue, 0.11);
    box(cabin, [0.8, 0.05, 0.36], [-0.36, 1.23, -0.42], materials.plastic);
    for (const side of [-1, 1])
      box(
        cabin,
        [0.1, 0.08, 0.68],
        [-0.36 + side * 0.43, 1.3, 0.2],
        materials.dark
      );
    // Stage the memories before assigning the route. A place may hold several actions.
    // Geometry is illustrative; archived screens remain the genuine public artifacts.
    function furnishedRoom(parent: THREE.Group, finish: Material = plaster) {
      box(parent, [6.2, 0.1, 4.6], [0, -0.05, -0.3], finish);
      box(parent, [6.2, 3.5, 0.12], [0, 1.7, -2.6], finish);
      box(parent, [1.4, 1.7, 0.04], [1.7, 2.1, -2.52], materials.blue);
      for (const x of [1.05, 1.7, 2.35])
        box(parent, [0.035, 1.7, 0.05], [x, 2.1, -2.48], materials.porcelain);
    }
    function seatedMaker(parent: THREE.Group, x = -0.35, z = 1.1) {
      const person = adult.clone();
      person.position.set(x, 0, z);
      parent.add(person);
      return person;
    }
    function colleague(
      parent: THREE.Group,
      at: Point,
      clothing = sage,
      yaw = -0.5
    ) {
      const person = walkingPerson(parent, clothing);
      person.person.position.fromArray(at);
      person.person.scale.setScalar(0.84);
      person.person.rotation.y = yaw;
      person.limbs[1].rotation.x = -1.05;
      return person;
    }
    // The games emerge from the same computer; the child never vanishes into props.
    opening.add(playWorld, computer);
    playWorld.position.set(0, 0, 0);
    gameWindow.position.set(0.7, 3.15, -1);
    gameWindow.scale.setScalar(0.62);
    jet.scale.setScalar(0.52);
    tinkering.position.set(0.55, 0, 0);
    youngMe.visible = false;
    cousin.position.set(1.1, 0.2, 0.65);
    const repairScreen = spareMonitor.children[3] as THREE.Mesh<
      THREE.PlaneGeometry,
      THREE.MeshBasicMaterial
    >;
    repairScreen.material = repairScreen.material.clone();
    repairScreen.material.map = textTexture(
      "System check",
      "Memory · drives · connections"
    );
    mandal.position.x = -0.2;

    for (const person of chapterPeople) person.visible = false;
    furnishedRoom(community);
    worktable(community);
    const communityMaker = seatedMaker(community);
    conversation.position.set(-0.55, 2.05, -0.25);
    conversation.scale.setScalar(0.75);
    blog.position.set(1.6, 1.7, -0.3);
    blog.scale.setScalar(0.7);
    furnishedRoom(publishing);
    // The seated writer remains throughout the rebuild, interviews and first payout.
    interview.visible = false;
    youngWriter.visible = false;
    byline.position.set(0.95, 2.8, -1.7);
    publishing.add(byline);
    earnings.position.set(1.9, 1.85, 0.4);
    earnings.scale.setScalar(0.78);
    orb.position.set(0.7, 2.7, -0.9);
    orb.scale.setScalar(0.7);
    early.visible = false;
    const interviewGuest = colleague(publishing, [1.9, 0, 0.5]);
    interviewGuest.person.scale.setScalar(0.7);

    furnishedRoom(themes);
    worktable(themes);
    seatedMaker(themes);
    themePages.position.set(0.25, 2.35, -0.6);
    themePages.scale.setScalar(0.85);
    octane.position.set(-1.1, 1.3, 0.2);
    octane.scale.setScalar(0.55);
    const neighbourhood = group();
    furnishedRoom(neighbourhood, sage);
    box(neighbourhood, [3.6, 1.12, 0.9], [0, 0.56, -0.4], wood);
    eventSign(neighbourhood, "LOCAL BUSINESSES", [0, 2.6, -2.5], 2.7);
    const localMaker = colleague(
      neighbourhood,
      [-0.9, 0, 0.85],
      materials.blue,
      0.7
    );
    const localClient = colleague(neighbourhood, [1.3, 0, -1.15], clay, -0.9);
    browser(
      neighbourhood,
      textTexture("A business, online", "Design · build · hand over"),
      1.8,
      [0, 1.9, -0.6]
    );
    const rechargeRoom = group();
    furnishedRoom(rechargeRoom);
    const rechargeDesk = making.clone();
    rechargeRoom.add(rechargeDesk, dongle);
    dongle.position.set(1.05, 1.45, 0.4);
    dongle.rotation.set(0, -0.25, 0.1);
    const rechargeCard = eventSign(
      rechargeRoom,
      "Design → recharge → online",
      [0.1, 2.95, -1.8],
      2.8
    );
    const beximoRoom = group();
    furnishedRoom(beximoRoom, sage);
    worktable(beximoRoom);
    beximoRoom.add(beximo);
    beximo.position.set(0.1, 2.2, -0.65);
    seatedMaker(beximoRoom);
    colleague(beximoRoom, [1.5, 0, -1.15], clay, -0.7);

    furnishedRoom(portable);
    worktable(portable);
    firstLaptop.position.set(0, 1.25, -0.1);
    firstLaptop.scale.setScalar(0.8);
    seatedMaker(portable);
    const firstScreen = firstLaptop.getObjectByName("laptop-lid")!
      .children[1] as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
    const laptopTexture = firstScreen.material.map;
    const youtubeTexture = textTexture(
      "TheTechSire",
      "Learning to make videos"
    );
    const qsolveRoom = group();
    furnishedRoom(qsolveRoom);
    qsolveRoom.add(qsolve);
    worktable(qsolveRoom);
    qsolve.position.set(0.2, 0.2, -0.1);
    colleague(qsolveRoom, [-2.05, 0, 0.7], materials.blue, 0.75);
    box(
      qsolveRoom,
      [0.85, 0.025, 0.65],
      [-0.7, 1.24, 0.15],
      materials.porcelain
    );

    furnishedRoom(collegeWork);
    worktable(collegeWork);
    seatedMaker(collegeWork);
    const campusPosters = group(0, 0, 0, collegeWork);
    eventSign(campusPosters, "E-CELL", [0, 2.5, -1.8], 2.2);
    eventSign(
      campusPosters,
      "Designing for the entrepreneurship club",
      [0, 1.95, -1.8],
      3.3
    );
    const collegePeer = colleague(campusPosters, [1.55, 0, -1.2]);
    studioPage.position.set(0.4, 2.3, -0.65);
    studioPage.scale.setScalar(0.84);
    voices.position.set(0.1, 0.55, -0.15);
    const rudrapur = group(-4.5, 0, -1.3, collegeJourney);
    box(rudrapur, [3.3, 3, 2.2], [0, 1.5, -1], clay);
    box(rudrapur, [0.75, 1.8, 0.06], [0.8, 0.9, 0.12], wood);
    eventSign(rudrapur, "Rudrapur", [-0.3, 2.25, 0.13], 2);

    furnishedRoom(product);
    worktable(product);
    seatedMaker(product, -0.7);
    folio.position.set(0.55, 1.8, -0.8);
    folio.scale.setScalar(0.62);
    portfolioPage.position.set(0.1, 2.3, -0.9);
    portfolioPage.scale.setScalar(0.76);
    const heroRoom = group();
    furnishedRoom(heroRoom, sage);
    worktable(heroRoom);
    heroRoom.add(heroBrand, heroPhone);
    heroBrand.position.set(0, 2.9, -2.51);
    heroBrand.scale.setScalar(1.6);
    heroPhone.position.set(0.55, 1.52, 0.35);
    seatedMaker(heroRoom, -0.5);
    colleague(heroRoom, [1.3, 0, -1.2], clay);
    eventSign(heroRoom, "Volunteering. Goodwill. An app.", [0, 2.18, -1], 2.6);

    // A team room, a stage, a mentoring pair, and a booth are distinct places.
    furnishedRoom(teamWork, sage);
    worktable(teamWork);
    whiteboard.position.set(0.25, 2.35, -2.05);
    whiteboard.scale.setScalar(0.9);
    seatedMaker(teamWork, -0.75);
    const teamColleagues = [
      colleague(teamWork, [2.25, 0, 1.05], clay, -1.3),
      colleague(teamWork, [-2.35, 0, 0.1], materials.blue, 1.5),
      colleague(teamWork, [0.75, 0, -1.65], materials.plastic, -0.5),
    ];
    const engineering = group();
    furnishedRoom(engineering, sage);
    worktable(engineering);
    seatedMaker(engineering);
    const engineeringLaptop = laptop(
      engineering,
      [0, 1.25, -0.2],
      textTexture("Zenduty", "Mobile · web · product tools")
    );
    engineeringLaptop.scale.setScalar(0.83);
    phone(engineering, [1.12, 1.5, 0.3], "iPhone 14").scale.setScalar(0.3);
    eventSign(engineering, "Intern → engineer", [0, 2.8, -2.5], 2.5);
    // The talk gets a lectern, screen, speaker and audience rather than a floating laptop.
    const talkStage = group();
    box(talkStage, [6.2, 0.18, 4.6], [0, 0, 0], wood);
    box(talkStage, [6.2, 3.6, 0.12], [0, 1.8, -2.1], sage);
    browser(
      talkStage,
      textTexture("React Native security", "4 November 2023"),
      3.2,
      [0.5, 2.2, -1.8]
    );
    const lectern = group(-1.1, 0.12, 0, talkStage);
    box(lectern, [1, 1.3, 0.65], [0, 0.65, 0], wood);
    talkStage.add(air, talkMic);
    air.position.set(-1.25, 1.45, 0);
    air.scale.setScalar(0.27);
    talkMic.position.set(-0.75, 1.4, 0.05);
    talkMic.scale.setScalar(0.3);
    const speaker = colleague(
      talkStage,
      [-1.1, 0.12, -0.55],
      materials.blue,
      0
    );
    speaker.person.scale.setScalar(1);
    speaker.limbs[3].rotation.x = -1.25;
    const audience = [-1.9, -0.8, 0.4, 1.6].map((x, i) => {
      const member = seatedMaker(talkStage, x, 2.05);
      member.scale.setScalar(0.62);
      member.rotation.y = (i - 1.5) * -0.08;
      return member;
    });
    const mentoring = group();
    furnishedRoom(mentoring, sage);
    // Match the opening's screen, chair and pointing silhouette with grown-up figures.
    mentoring.add(desk.clone(), keyboard.clone());
    display(
      mentoring,
      1.85,
      1.28,
      [0.48, 2.05, -0.12],
      textTexture("A problem, together", "Learning at Zenduty")
    );
    const intern = adult.clone();
    intern.position.copy(child.position);
    intern.scale.setScalar(0.88);
    mentoring.add(intern);
    const mentor = father.clone();
    mentor.position.copy(father.position);
    mentor.getObjectByName("dad-head")?.removeFromParent();
    const mentorHead = workingHead.clone();
    mentorHead.position.copy(dadHead.position);
    mentorHead.rotation.copy(dadHead.rotation);
    mentor.add(mentorHead);
    mentor.traverse((part) => {
      if (part instanceof THREE.Mesh && part.material === shirt)
        part.material = materials.blue;
    });
    mentoring.add(mentor);
    mentorNotes.position.set(1.25, 0.8, -0.6);
    mentorNotes.scale.setScalar(0.45);
    mentoring.add(mentorNotes);
    const conference = group();
    conference.add(booth);
    box(conference, [6.2, 0.08, 4.6], [0, -0.02, 0], plaster);
    const boothHost = colleague(
      conference,
      [-1.45, 0, 0.35],
      materials.blue,
      0.5
    );
    const boothVisitors = [
      colleague(conference, [0.35, 0, 1.8], clay, Math.PI),
      colleague(conference, [1.6, 0, 1.4], sage, -2.3),
    ];
    furnishedRoom(roles);
    worktable(roles);
    seatedMaker(roles);
    picture(roles, "/design/brand/swiggy.webp", 0.8, 0.8, [-1.9, 2.5, -2.5]);
    browser(
      roles,
      textTexture("Pyng", "Onboarding · self-service · operations"),
      2.8,
      [0, 2.1, -0.6]
    );
    colleague(roles, [1.6, 0, -1.2], clay);
    const quivly = group();
    furnishedRoom(quivly, sage);
    worktable(quivly);
    seatedMaker(quivly, -0.6);
    picture(
      quivly,
      "/design/brand/quivly-icon.ico",
      0.7,
      0.7,
      [-1.8, 2.55, -2.51]
    );
    browser(
      quivly,
      textTexture("Quivly", "Product · architecture · implementation"),
      2.5,
      [0, 2.15, -0.5]
    );
    for (let i = 0; i < 3; i++) {
      const paper = box(
        quivly,
        [0.65, 0.025, 0.5],
        [0.7 + i * 0.3, 1.25 + i * 0.03, 0.4],
        i % 2 ? clay : materials.porcelain
      );
      paper.rotation.y = i * 0.18;
    }
    furnishedRoom(toolsWorld);
    worktable(toolsWorld);
    toolMaker.visible = false;
    seatedMaker(toolsWorld);
    furnishedRoom(projectArtifacts);
    worktable(projectArtifacts);
    seatedMaker(projectArtifacts);
    altrArtifact.position.set(0.4, 2.35, -0.55);
    altrArtifact.scale.setScalar(0.85);
    tetherBook.position.set(-1, 1.3, 0.4);
    tetherBook.scale.setScalar(0.5);
    const planning = group();
    furnishedRoom(planning, sage);
    worktable(planning);
    planning.add(tethrArtifact);
    tethrArtifact.position.set(0.3, 2.5, -0.85);
    tethrArtifact.scale.setScalar(0.78);
    const planner = colleague(planning, [-1.45, 0, 0.4], materials.blue, 0.9);
    for (let i = 0; i < 3; i++) {
      box(
        planning,
        [0.9, 0.02, 0.65],
        [-0.8 + i * 0.95, 1.25, 0.1],
        materials.porcelain
      );
      box(
        planning,
        [0.6, 0.025, 0.06],
        [-0.8 + i * 0.95, 1.28, -0.05],
        i === 2 ? clay : materials.blue
      );
    }
    eventSign(planning, "One shared plan", [0, 3.05, -2.5], 2.3);
    furnishedRoom(today);
    secondDisplay.position.x = 1.25;
    secondDisplay.rotation.y = -0.42;

    const smooth = (value: number) => {
      const t = clampProgress(value);
      return t * t * (3 - 2 * t);
    };
    // One registry binds a beat to its world and shot. All timing comes from story-data.
    const places: Record<string, THREE.Group> = {
      adsense: publishing,
      altr: projectArtifacts,
      "avalon-voices": collegeWork,
      "bangalore-flight": flightJourney,
      beximo: beximoRoom,
      "blog-rebuild": publishing,
      "car-to-college": collegeJourney,
      "college-ecell": collegeWork,
      communities: community,
      "cousin-tv": opening,
      "dad-open": opening,
      "digital-moshai": collegeWork,
      dismantling: repair,
      dongle: rechargeRoom,
      engineer: engineering,
      "first-laptop": portable,
      "games-windows": opening,
      google: opening,
      heroapp: heroRoom,
      huntit: hunt,
      interviews: publishing,
      kubecon: conference,
      "local-businesses": neighbourhood,
      mentoring,
      "product-experiments": product,
      "public-tools": toolsWorld,
      qsolve: qsolveRoom,
      quivly,
      "repair-store": repair,
      "search-games": opening,
      spark,
      "still-building": today,
      swiggy: roles,
      talk: talkStage,
      "teen-making": publishing,
      tethr: planning,
      themes,
      youtube: portable,
      "zenduty-team": teamWork,
    };
    const shotWorlds = beats.map((beat) => places[beat.id]);
    if (shotWorlds.some((world) => !world))
      throw new Error("Every story beat needs a shot");
    // Reparent places so their position is always the route anchor, never an old era offset.
    const worlds = [...new Set(shotWorlds)];
    const anchors = worlds.map((world, index) => {
      scene.add(world);
      const point = new THREE.Vector3(
        index * 8,
        0,
        Math.sin(index * 1.13) * 3.5
      );
      world.position.copy(point);
      return point;
    });
    // Remove obsolete wrapper sets from rendering, while retaining ownership for disposal.
    for (const wrapper of [college, team, sharing]) wrapper.visible = false;
    const palette = [
      0xc3_d8_de, 0xf0_e8_dd, 0xf3_ee_e5, 0xe8_ed_f0, 0xf8_f5_ec, 0xe8_e9_e0,
      0xe8_e5_da, 0xee_e7_da, 0xec_e6_d9, 0xf3_ee_e5, 0xf6_f1_e7, 0xe9_ee_f0,
      0xf0_eb_e1, 0xe7_ec_eb, 0xe7_ea_e3, 0xe8_ed_f0, 0xe7_ed_ef, 0xec_e9_e2,
      0xf0_ea_e1, 0xe7_ec_eb, 0xe9_ed_f0, 0xe6_e9_e8, 0xec_e9_e2, 0xef_e8_dd,
      0xe9_e9_e2, 0xf1_e8_dc,
    ];
    const colours = worlds.map(
      (_, i) => new THREE.Color(palette[i % palette.length])
    );
    const shots = shotWorlds.map((world, index) => ({
      anchor: worlds.indexOf(world),
      focus: new THREE.Vector3(-0.15, 1.55, 0),
      height: 4.4,
      id: beats[index].id,
      view: new THREE.Vector3(3, 3.6, 8.7),
      width: 6.5,
      world,
    }));
    const byId = new Map(shots.map((shot, index) => [shot.id, index]));
    function phase(id: string) {
      return beatPhase(progress, byId.get(id)!);
    }
    function presence(id: string, from: number, to: number, blend: number) {
      return (
        (shots[from].id === id ? 1 - blend : 0) +
        (shots[to].id === id ? blend : 0)
      );
    }
    const googleShot = shots[byId.get("google")!];
    googleShot.focus.set(-0.15, 1.7, 0);
    googleShot.view.set(3.9, 3.3, 8.5);
    const mentorShot = shots[byId.get("mentoring")!];
    mentorShot.focus.copy(googleShot.focus);
    mentorShot.view.copy(googleShot.view);
    shots[byId.get("still-building")!].view.set(4.9, 3.7, 8.7);
    for (const id of ["huntit", "spark", "car-to-college"]) {
      const shot = shots[byId.get(id)!];
      shot.width = 7.4;
      shot.height = 5.1;
      shot.focus.set(0, 1, -0.3);
      shot.view.set(3.7, 5.3, 10.5);
    }
    const timelineCable = group();
    const cableAnchors = anchors.map(
      (point) => [point.x, 0.08, point.z - 2.8] as Point
    );
    cable(
      timelineCable,
      [
        [1.7, 0.5, -0.6],
        [1.9, 0.08, -1.6],
        ...cableAnchors,
        [anchors.at(-1)!.x - 0.5, 0.08, anchors.at(-1)!.z - 0.6],
        [anchors.at(-1)!.x - 0.5, 1.9, anchors.at(-1)!.z - 0.5],
      ],
      0.018,
      materials.copper
    );
    // Small grounded leads keep the motif on phones without a vertical pole across the scene.
    const portraitLeads = worlds.map((world) =>
      cable(
        world,
        [
          [-2.8, 0.07, -1.5],
          [-1.6, 0.07, -1.9],
          [0.2, 0.07, -2.1],
          [2.7, 0.07, -1.7],
        ],
        0.014,
        materials.copper
      )
    );
    const target = new THREE.Vector3(),
      destination = new THREE.Vector3();
    const targetB = new THREE.Vector3(),
      cameraB = new THREE.Vector3();
    const offset = new THREE.Vector3();
    const background = new THREE.Color();
    const skyBackground = new THREE.Color(0xc3_d8_de);
    function shotPose(
      index: number,
      focus: THREE.Vector3,
      location: THREE.Vector3
    ) {
      const shot = shots[index];
      focus.copy(shot.focus);
      location.copy(shot.view);
      const q = phase(shot.id);
      if (shot.id === "dad-open") {
        const descent = smooth(q / 0.85);
        focus.lerp(destination.set(0, 0, -4), 1 - descent);
        location.lerp(destination.set(22, 48, 38), 1 - descent);
      } else if (shot.id === "search-games") {
        const approach = Math.sin(smooth(q) * Math.PI) * 0.2;
        location.lerp(destination.set(0.9, 2.6, 4.8), approach);
      } else if (shot.id === "car-to-college") {
        const drive = smooth((q - 0.15) / 0.4);
        focus.x = -2.6 * (1 - drive);
        location.x += focus.x;
      } else if (shot.id === "bangalore-flight") {
        const takeoff = smooth((q - 0.24) / 0.38);
        const cabinVisit = smooth((q - 0.62) / 0.13);
        focus.set(0, 1.4 + takeoff * 3 * (1 - cabinVisit), -takeoff * 8);
        location.copy(focus).add(destination.set(3, 2.5, 10));
      } else if (shot.id === "still-building") {
        location.lerp(destination.set(3.8, 3.2, 7.1), smooth(q));
      }
      const anchor = anchors[shot.anchor];
      offset.copy(anchor);
      if (portrait) offset.set(0, -shot.anchor * 6.8, anchor.z);
      focus.add(offset);
      location.add(offset);
    }
    for (const object of [
      desk,
      father,
      child,
      chair,
      mandal,
      repairComputer,
      making,
      adult,
      car,
      campusArrival.person,
      leavingCampus.person,
      flightPassenger,
      huntOrganiser.person,
      sparkHost.person,
      communityMaker,
      localMaker.person,
      localClient.person,
      collegePeer.person,
      speaker.person,
      intern,
      mentor,
      boothHost.person,
      planner.person,
      ...audience,
      ...teamColleagues.map((p) => p.person),
      ...boothVisitors.map((p) => p.person),
    ]) {
      object.traverse((part) => {
        if (part instanceof THREE.Mesh) part.castShadow = true;
      });
    }
    function render() {
      frame = 0;
      if (disposed || document.hidden) return;
      const state = sceneAt(progress);
      const { from, to, blend, index } = state;
      const active = (id: string) => presence(id, from, to, blend);
      const fromShot = shots[from],
        toShot = shots[to];
      for (let i = 0; i < worlds.length; i++) {
        worlds[i].position.copy(anchors[i]);
        if (portrait) worlds[i].position.set(0, -i * 6.8, anchors[i].z);
        worlds[i].visible =
          worlds[i] === fromShot.world || worlds[i] === toShot.world;
      }
      shotPose(from, target, camera.position);
      shotPose(to, targetB, cameraB);
      target.lerp(targetB, blend);
      camera.position.lerp(cameraB, blend);
      const travel =
        fromShot.world === toShot.world ? 0 : Math.sin(blend * Math.PI);
      camera.position.z += travel * (portrait ? 3 : 4);
      camera.position.x += travel * (index % 2 ? -0.6 : 0.6);
      camera.position.y += travel * 0.8;
      const w = width,
        h = height;
      const stageTop = portrait ? copyBottom + 12 : 0;
      const stageHeight = portrait ? Math.max(125, h - 176 - stageTop) : h;
      const stageWidth = portrait ? w : w * 0.545;
      camera.clearViewOffset();
      camera.aspect = stageWidth / stageHeight;
      offset.subVectors(camera.position, target);
      const framingWidth = THREE.MathUtils.lerp(
        fromShot.width,
        toShot.width,
        blend
      );
      const framingHeight = THREE.MathUtils.lerp(
        fromShot.height,
        toShot.height,
        blend
      );
      const fitDistance =
        Math.max(framingHeight, framingWidth / camera.aspect) /
        (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
      // Preserve the cloud descent and gentle finale push; fit the full physical set elsewhere.
      const minimum =
        fitDistance *
        (portrait ? 0.92 : 0.97) *
        (1 - active("still-building") * smooth(phase("still-building")) * 0.12);
      if (offset.length() < minimum) offset.setLength(minimum);
      camera.position.copy(target).add(offset);
      if (!portrait) camera.setViewOffset(stageWidth, h, 0, 0, w, h);
      camera.updateProjectionMatrix();
      camera.lookAt(target);
      renderer.domElement.dataset.travelAxis = portrait
        ? "vertical"
        : "horizontal";
      renderer.domElement.dataset.beat = beats[index].id;
      renderer.domElement.dataset.progress = String(progress);
      renderer.domElement.dataset.shot = `${shots[from].id}:${shots[to].id}`;
      renderer.domElement.dataset.hold = String(from === to);
      const sky = active("dad-open") * (1 - smooth(phase("dad-open") / 0.85));
      background
        .copy(colours[fromShot.anchor])
        .lerp(colours[toShot.anchor], blend);
      if (shots[index].world === opening)
        background.setHex(0xf3_ee_e5).lerp(skyBackground, sky);
      const flightLight = active("bangalore-flight");
      background.lerp(
        skyBackground,
        flightLight * smooth((phase("bangalore-flight") - 0.2) / 0.2)
      );
      renderer.setClearColor(background, 1);
      host.parentElement?.style.setProperty(
        "--scene-paper",
        `#${background.getHexString()}`
      );
      const fog = scene.fog as THREE.Fog;
      fog.color.copy(background);
      fog.near = 25 + sky * 25;
      fog.far = 54 + sky * 65;
      clouds.visible = sky > 0.02;
      cloudMaterial.opacity = sky * 0.8;
      town.visible = sky > 0.05;
      roof.visible = sky > 0.45;
      father.visible = active("dad-open") + active("google") > 0.01;
      playWorld.visible =
        active("search-games") + active("games-windows") + active("cousin-tv") >
        0.01;
      tinkering.visible = active("cousin-tv") > 0.01;
      gameWindow.visible = !tinkering.visible;
      jet.visible = active("games-windows") > 0.01;
      jet.position.set(
        0.6,
        2.85 + Math.sin(phase("games-windows") * Math.PI) * 0.45,
        0.6
      );
      jet.rotation.z = -0.16 + phase("games-windows") * 0.35;
      computer.visible = true;
      timelineCable.visible = !portrait && sky < 0.5;
      for (const lead of portraitLeads) lead.visible = portrait && sky < 0.5;
      byline.visible = active("interviews") > 0.01;
      earnings.visible = active("adsense") > 0.01;
      interviewGuest.person.visible = active("interviews") > 0.01;
      orb.visible = active("blog-rebuild") > 0.01;
      orb.rotation.y = (1 - smooth(phase("blog-rebuild"))) * 0.18;
      making.visible = true;
      making.position.z = 0;
      rechargeCard.rotation.y = Math.sin(phase("dongle") * Math.PI) * 0.03;
      cameraRig.visible = active("youtube") > 0.01;
      firstScreen.material.map = cameraRig.visible
        ? youtubeTexture
        : laptopTexture;
      firstLaptop.getObjectByName("laptop-lid")!.rotation.x =
        1.2 - smooth(phase("first-laptop") / 0.45) * 1.34;
      firstLaptop.rotation.y = -0.12;
      const followTrail = smooth((phase("huntit") - 0.15) / 0.65);
      for (let i = 0; i < huntTeams.length; i++) {
        const { path, people } = huntTeams[i];
        for (let j = 0; j < people.length; j++) {
          const member = people[j];
          const step = clampProgress(followTrail - j * 0.13 + i * 0.04);
          path.getPoint(step, member.person.position);
          member.person.position.x += j * 0.16;
          path.getTangent(step, destination);
          member.person.rotation.y = Math.atan2(destination.x, destination.z);
          walk(member.limbs, step * 24, 0.3);
        }
      }
      const festivalArrival = smooth((phase("spark") - 0.1) / 0.6);
      for (let i = 0; i < festivalVisitors.length; i++) {
        const visitor = festivalVisitors[i];
        visitor.person.position.z = visitor.z + (1 - festivalArrival) * 0.6;
        walk(visitor.limbs, festivalArrival * 16 + i, 0.18);
      }
      const journey = phase("car-to-college");
      const drive = smooth((journey - 0.12) / 0.4);
      car.position.set(-3.8 + drive * 4.5, 0, 1.5 - drive * 0.9);
      car.rotation.y = drive * 0.45;
      collegeBuilding.position.x = (1 - drive) * 5;
      rudrapur.position.x = -4.5 - drive * 4;
      carDoor.rotation.y = smooth((journey - 0.53) / 0.09) * 1.05;
      carPassenger.visible = journey < 0.64;
      for (const wheel of carWheels) wheel.rotation.z = -drive * 10;
      const enterCampus = smooth((journey - 0.64) / 0.3);
      campusArrival.person.visible = journey >= 0.64;
      arrivalPath.getPoint(enterCampus, campusArrival.person.position);
      arrivalPath.getTangent(enterCampus, walkingDirection);
      campusArrival.person.rotation.y = Math.atan2(
        walkingDirection.x,
        walkingDirection.z
      );
      walk(campusArrival.limbs, enterCampus * 26, 0.3);
      campusPosters.visible = active("college-ecell") > 0.01;
      studioPage.visible = active("digital-moshai") > 0.01;
      voices.visible = active("avalon-voices") > 0.01;
      for (let i = 0; i < voiceNodes.length; i++) {
        const gathered = smooth(phase("avalon-voices") * 2 - i * 0.025);
        voiceNodes[i].scale.setScalar(0.6 + gathered * 0.4);
      }
      portfolioPage.visible =
        active("product-experiments") > 0.01 &&
        phase("product-experiments") > 0.55;
      folio.visible = !portfolioPage.visible;
      const flight = phase("bangalore-flight");
      campusDeparture.visible = flight < 0.27;
      const depart = smooth(flight / 0.25);
      leavingCampus.person.position.set(-0.2, 0, -3.6 + depart * 4.6);
      walk(leavingCampus.limbs, depart * 25, 0.3);
      flightExterior.visible = flight >= 0.2 && flight < 0.76;
      const takeoff = smooth((flight - 0.24) / 0.38);
      airliner.position.set(
        Math.sin(takeoff * Math.PI) * 0.45,
        0.78 + takeoff * takeoff * 5.5,
        1 - takeoff * 13
      );
      airliner.rotation.set(takeoff * 0.18, -takeoff * 0.16, takeoff * 0.08);
      landingGear.visible = takeoff < 0.55;
      cabin.visible = flight >= 0.62;
      flightPassenger.getObjectByName("working-head")!.rotation.y =
        Math.PI - 0.65 - smooth((flight - 0.62) / 0.2) * 0.15;
      for (const [i, member] of teamColleagues.entries())
        member.limbs[1].rotation.x =
          -0.8 - Math.sin(phase("zenduty-team") * Math.PI + i) * 0.3;
      speaker.limbs[3].rotation.z = smooth(phase("talk")) * -0.35;
      planner.limbs[1].rotation.x = -1.1 - smooth(phase("tethr")) * 0.4;
      sharedCursor.position.x = -0.75 + smooth(phase("public-tools")) * 1.7;
      videoContext.rotation.y = (1 - smooth(phase("public-tools"))) * 0.35;
      workingHead.rotation.x = 0.1 + smooth(phase("still-building")) * 0.07;
      workKeyboard.visible = true;
      const dismantle = phase("dismantling");
      repairPanel.position.set(
        0.335 + smooth(dismantle / 0.45) * 0.7,
        0.6,
        smooth(dismantle / 0.45) * 0.8
      );
      repairPanel.rotation.y = smooth(dismantle / 0.45) * 0.22;
      repairBoard.position.set(
        0.25 + smooth((dismantle - 0.2) / 0.45) * 0.38,
        0.6,
        smooth((dismantle - 0.2) / 0.45) * 0.45
      );
      repairFan.position.x = 0.14 + smooth((dismantle - 0.4) / 0.35) * 0.25;
      repairFan.rotation.x = smooth((dismantle - 0.4) / 0.35) * Math.PI * 2;
      repairRam.position.x = 0.02 + smooth((dismantle - 0.55) / 0.3) * 0.2;
      renderer.domElement.dataset.subject =
        beats[index].id === "car-to-college"
          ? journey < 0.64
            ? "car"
            : "college-entry"
          : beats[index].id === "bangalore-flight"
            ? flight >= 0.62
              ? "flight-cabin"
              : flight >= 0.2
                ? "takeoff"
                : "college-departure"
            : beats[index].id;
      key.position.set(target.x - 4, target.y + 7, target.z + 5);
      key.target.position.set(target.x, target.y - 1, target.z);
      fill.position.set(target.x + 7, target.y + 4, target.z - 5);
      const anchorY = THREE.MathUtils.lerp(
        fromShot.anchor,
        toShot.anchor,
        blend
      );
      floor.position.y = portrait ? -anchorY * 6.8 - 0.06 : -0.06;
      renderer.setScissorTest(false);
      renderer.setViewport(0, 0, w, h);
      renderer.clear();
      renderer.setViewport(
        0,
        h - stageTop - stageHeight,
        portrait ? stageWidth : w,
        stageHeight
      );
      renderer.setScissor(
        0,
        h - stageTop - stageHeight,
        stageWidth,
        stageHeight
      );
      renderer.setScissorTest(portrait);
      renderer.render(scene, camera);
    }
    function invalidate() {
      if (!(frame || disposed)) frame = requestAnimationFrame(render);
    }
    function resize() {
      width = host.clientWidth;
      height = host.clientHeight;
      copyBottom = copyElement
        ? copyElement.offsetTop + copyElement.offsetHeight
        : height * 0.36;
      portrait = window.matchMedia(
        "(max-width: 760px) and (orientation: portrait)"
      ).matches;
      camera.aspect = width / Math.max(height, 1);
      camera.fov = portrait ? 42 : 34;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, portrait ? 1.25 : 1.5)
      );
      renderer.setSize(width, height, false);
      const shadowSize = portrait ? 1024 : 2048;
      if (key.shadow.mapSize.x !== shadowSize) {
        key.shadow.map?.dispose();
        key.shadow.map = null;
        key.shadow.mapSize.set(shadowSize, shadowSize);
      }
      invalidate();
    }
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    if (copyElement) observer.observe(copyElement);
    window.addEventListener("resize", resize);
    let density = window.matchMedia(
      `(resolution: ${window.devicePixelRatio}dppx)`
    );
    function densityChanged() {
      density.removeEventListener("change", densityChanged);
      density = window.matchMedia(
        `(resolution: ${window.devicePixelRatio}dppx)`
      );
      density.addEventListener("change", densityChanged);
      resize();
    }
    density.addEventListener("change", densityChanged);
    function contextLost(event: Event) {
      event.preventDefault();
      onFailure();
    }
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    document.addEventListener("visibilitychange", invalidate);
    releaseEvents = () => {
      observer.disconnect();
      density.removeEventListener("change", densityChanged);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", invalidate);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
    };
    resize();
    return {
      dispose,
      seek(value: number) {
        progress = clampProgress(value);
        invalidate();
      },
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
