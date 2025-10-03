import * as THREE from "https://esm.sh/three@0.178.0";
import { Pane } from "https://cdn.skypack.dev/tweakpane@4.0.4";

let scene, camera, renderer, material;
let clock,
  mouse = { x: 0, y: 0 };
let cursorSphere3D = new THREE.Vector3(0, 0, 0);
let activeMerges = 0;
let targetMousePosition = new THREE.Vector2(0.5, 0.5);
let mousePosition = new THREE.Vector2(0.5, 0.5);
let lastTime = performance.now();
let frameCount = 0;
let fps = 0;

// Enhanced device detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isLowPowerDevice = isMobile || navigator.hardwareConcurrency <= 4;
const devicePixelRatio = Math.min(
  window.devicePixelRatio || 1,
  isMobile ? 1.5 : 2
);

const presets = {
  moody: {
    sphereCount: isMobile ? 4 : 6,
    ambientIntensity: 0.02,
    diffuseIntensity: 0.6,
    specularIntensity: 1.8,
    specularPower: 8,
    fresnelPower: 1.2,
    backgroundColor: new THREE.Color(0x050505),
    sphereColor: new THREE.Color(0x000000),
    lightColor: new THREE.Color(0xffffff),
    lightPosition: new THREE.Vector3(1, 1, 1),
    smoothness: 0.3,
    contrast: 2.0,
    fogDensity: 0.12,
    cursorGlowIntensity: 0.4,
    cursorGlowRadius: 1.2,
    cursorGlowColor: new THREE.Color(0xffffff)
  },
  cosmic: {
    sphereCount: isMobile ? 5 : 8,
    ambientIntensity: 0.03,
    diffuseIntensity: 0.8,
    specularIntensity: 1.6,
    specularPower: 6,
    fresnelPower: 1.4,
    backgroundColor: new THREE.Color(0x000011),
    sphereColor: new THREE.Color(0x000022),
    lightColor: new THREE.Color(0x88aaff),
    lightPosition: new THREE.Vector3(0.5, 1, 0.5),
    smoothness: 0.4,
    contrast: 2.0,
    fogDensity: 0.15,
    cursorGlowIntensity: 0.8,
    cursorGlowRadius: 1.5,
    cursorGlowColor: new THREE.Color(0x4477ff)
  },
  minimal: {
    sphereCount: isMobile ? 2 : 3,
    ambientIntensity: 0.0,
    diffuseIntensity: 0.25,
    specularIntensity: 1.3,
    specularPower: 11,
    fresnelPower: 1.7,
    backgroundColor: new THREE.Color(0x0a0a0a),
    sphereColor: new THREE.Color(0x000000),
    lightColor: new THREE.Color(0xffffff),
    lightPosition: new THREE.Vector3(1, 0.5, 0.8),
    smoothness: 0.25,
    contrast: 2.0,
    fogDensity: 0.1,
    cursorGlowIntensity: 0.3,
    cursorGlowRadius: 1.0,
    cursorGlowColor: new THREE.Color(0xffffff)
  },
  vibrant: {
    sphereCount: isMobile ? 6 : 10,
    ambientIntensity: 0.05,
    diffuseIntensity: 0.9,
    specularIntensity: 1.5,
    specularPower: 5,
    fresnelPower: 1.3,
    backgroundColor: new THREE.Color(0x0a0505),
    sphereColor: new THREE.Color(0x110000),
    lightColor: new THREE.Color(0xff8866),
    lightPosition: new THREE.Vector3(0.8, 1.2, 0.6),
    smoothness: 0.5,
    contrast: 2.0,
    fogDensity: 0.08,
    cursorGlowIntensity: 0.8,
    cursorGlowRadius: 1.3,
    cursorGlowColor: new THREE.Color(0xff6644)
  },
  neon: {
    sphereCount: isMobile ? 4 : 7,
    ambientIntensity: 0.04,
    diffuseIntensity: 1.0,
    specularIntensity: 2.0,
    specularPower: 4,
    fresnelPower: 1.0,
    backgroundColor: new THREE.Color(0x000505),
    sphereColor: new THREE.Color(0x000808),
    lightColor: new THREE.Color(0x00ffcc),
    lightPosition: new THREE.Vector3(0.7, 1.3, 0.8),
    smoothness: 0.7,
    contrast: 2.0,
    fogDensity: 0.08,
    cursorGlowIntensity: 0.8,
    cursorGlowRadius: 1.4,
    cursorGlowColor: new THREE.Color(0x00ffaa)
  },
  sunset: {
    sphereCount: isMobile ? 3 : 5,
    ambientIntensity: 0.04,
    diffuseIntensity: 0.7,
    specularIntensity: 1.4,
    specularPower: 7,
    fresnelPower: 1.5,
    backgroundColor: new THREE.Color(0x150505),
    sphereColor: new THREE.Color(0x100000),
    lightColor: new THREE.Color(0xff6622),
    lightPosition: new THREE.Vector3(1.2, 0.4, 0.6),
    smoothness: 0.35,
    contrast: 2.0,
    fogDensity: 0.1,
    cursorGlowIntensity: 0.8,
    cursorGlowRadius: 1.4,
    cursorGlowColor: new THREE.Color(0xff4422)
  },
  midnight: {
    sphereCount: isMobile ? 3 : 4,
    ambientIntensity: 0.01,
    diffuseIntensity: 0.4,
    specularIntensity: 1.6,
    specularPower: 9,
    fresnelPower: 1.8,
    backgroundColor: new THREE.Color(0x000010),
    sphereColor: new THREE.Color(0x000015),
    lightColor: new THREE.Color(0x4466ff),
    lightPosition: new THREE.Vector3(0.9, 0.8, 1.0),
    smoothness: 0.28,
    contrast: 2.0,
    fogDensity: 0.14,
    cursorGlowIntensity: 0.8,
    cursorGlowRadius: 1.6,
    cursorGlowColor: new THREE.Color(0x3355ff)
  },
  toxic: {
    sphereCount: isMobile ? 5 : 9,
    ambientIntensity: 0.06,
    diffuseIntensity: 0.85,
    specularIntensity: 1.7,
    specularPower: 6,
    fresnelPower: 1.1,
    backgroundColor: new THREE.Color(0x001000),
    sphereColor: new THREE.Color(0x001500),
    lightColor: new THREE.Color(0x66ff44),
    lightPosition: new THREE.Vector3(0.6, 1.1, 0.7),
    smoothness: 0.55,
    contrast: 2.0,
    fogDensity: 0.09,
    cursorGlowIntensity: 0.8,
    cursorGlowRadius: 1.7,
    cursorGlowColor: new THREE.Color(0x44ff22)
  },
  pastel: {
    sphereCount: isMobile ? 4 : 6,
    ambientIntensity: 0.08,
    diffuseIntensity: 0.5,
    specularIntensity: 1.2,
    specularPower: 12,
    fresnelPower: 2.0,
    backgroundColor: new THREE.Color(0x101018),
    sphereColor: new THREE.Color(0x080814),
    lightColor: new THREE.Color(0xaabbff),
    lightPosition: new THREE.Vector3(1.0, 0.7, 0.9),
    smoothness: 0.38,
    contrast: 1.8,
    fogDensity: 0.07,
    cursorGlowIntensity: 0.35,
    cursorGlowRadius: 1.1,
    cursorGlowColor: new THREE.Color(0x8899ff)
  },
  dithered: {
    sphereCount: isMobile ? 5 : 8,
    ambientIntensity: 0.1,
    diffuseIntensity: 0.8,
    specularIntensity: 1.5,
    specularPower: 6,
    fresnelPower: 1.2,
    backgroundColor: new THREE.Color(0x0a0520),
    sphereColor: new THREE.Color(0x000000),
    lightColor: new THREE.Color(0xff00ff),
    lightPosition: new THREE.Vector3(0.8, 0.8, 0.8),
    smoothness: 0.6,
    contrast: 1.8,
    fogDensity: 0.05,
    cursorGlowIntensity: 1.0,
    cursorGlowRadius: 2.0,
    cursorGlowColor: new THREE.Color(0x00ffff)
  },
  holographic: {
    sphereCount: isMobile ? 4 : 6,
    ambientIntensity: 0.12,
    diffuseIntensity: 1.2,
    specularIntensity: 2.5,
    specularPower: 3,
    fresnelPower: 0.8,
    backgroundColor: new THREE.Color(0x0a0a15),
    sphereColor: new THREE.Color(0x050510),
    lightColor: new THREE.Color(0xccaaff),
    lightPosition: new THREE.Vector3(0.9, 0.9, 1.2),
    smoothness: 0.8,
    contrast: 1.6,
    fogDensity: 0.06,
    cursorGlowIntensity: 1.2,
    cursorGlowRadius: 2.2,
    cursorGlowColor: new THREE.Color(0xaa77ff)
  },
      oceanic: {
     sphereCount: isMobile ? 6 : 10,
    ambientIntensity: 0.2,              // brighter ambient light
    diffuseIntensity: 1.0,              // strong surface lighting
    specularIntensity: 2.0,             // very shiny/glossy
    specularPower: 6,
    fresnelPower: 1.6,
    backgroundColor: new THREE.Color(0x101820), // very dark blueish background for contrast
    sphereColor: new THREE.Color(0x66ccff),     // glowing light blue spheres
    lightColor: new THREE.Color(0xffffff),      // pure white light
    lightPosition: new THREE.Vector3(1, 1.2, 1),
    smoothness: 0.6,
    contrast: 2.2,
    fogDensity: 0.05,                  // lighter fog so glow stands out
    cursorGlowIntensity: 1.2,          // stronger aura
    cursorGlowRadius: 1.6,
    cursorGlowColor: new THREE.Color(0xffffff) // bright white aura
  },


};

const settings = {

  preset: "oceanic",
  ...presets.oceanic,
  fixedTopLeftRadius: 0.8,
  fixedBottomRightRadius: 0.9,
  smallTopLeftRadius: 0.3,
  smallBottomRightRadius: 0.35,
  cursorRadiusMin: 0.08,
  cursorRadiusMax: 0.15,
  animationSpeed: 0.6,
  movementScale: 1.2,
  mouseSmoothness: 0.1,
  mergeDistance: 1.5,
  mouseProximityEffect: true,
  minMovementScale: 0.3,
  maxMovementScale: 1.0
};

function getStoryText(x, y, radius, merges, fps) {
  if (isMobile) {
    return `vessel: (${x}, ${y})<br>field: ${radius}u<br>merges: ${merges}<br>flux: ${fps}hz`;
  }
  return `our vessel drifts at coordinates (${x}, ${y})<br>gravitational field extends ${radius} units into quantum foam<br>currently merging with ${merges} other entities<br>temporal flux: ${fps} cycles per second`;
}

init();
animate();

function init() {
  const container = document.getElementById("container");
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;
  clock = new THREE.Clock();

  renderer = new THREE.WebGLRenderer({
    antialias: !isMobile && !isLowPowerDevice,
    alpha: true,
    powerPreference: isMobile ? "default" : "high-performance",
    preserveDrawingBuffer: false,
    premultipliedAlpha: false
  });

  // FIXED: Proper pixel ratio handling
  const pixelRatio = Math.min(devicePixelRatio, isMobile ? 1.5 : 2);
  renderer.setPixelRatio(pixelRatio);

  // Get actual viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  renderer.setSize(viewportWidth, viewportHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // Enhanced canvas styling
  const canvas = renderer.domElement;
  canvas.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 0 !important;
    display: block !important;
  `;
  container.appendChild(canvas);

  // Create material with improved shader
  material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(viewportWidth, viewportHeight) },
      // FIXED: Pass actual canvas size including pixel ratio
      uActualResolution: {
        value: new THREE.Vector2(
          viewportWidth * pixelRatio,
          viewportHeight * pixelRatio
        )
      },
      uPixelRatio: { value: pixelRatio },
      uMousePosition: { value: new THREE.Vector2(0.5, 0.5) },
      uCursorSphere: { value: new THREE.Vector3(0, 0, 0) },
      uCursorRadius: { value: settings.cursorRadiusMin },
      uSphereCount: { value: settings.sphereCount },
      uFixedTopLeftRadius: { value: settings.fixedTopLeftRadius },
      uFixedBottomRightRadius: { value: settings.fixedBottomRightRadius },
      uSmallTopLeftRadius: { value: settings.smallTopLeftRadius },
      uSmallBottomRightRadius: { value: settings.smallBottomRightRadius },
      uMergeDistance: { value: settings.mergeDistance },
      uSmoothness: { value: settings.smoothness },
      uAmbientIntensity: { value: settings.ambientIntensity },
      uDiffuseIntensity: { value: settings.diffuseIntensity },
      uSpecularIntensity: { value: settings.specularIntensity },
      uSpecularPower: { value: settings.specularPower },
      uFresnelPower: { value: settings.fresnelPower },
      uBackgroundColor: { value: settings.backgroundColor },
      uSphereColor: { value: settings.sphereColor },
      uLightColor: { value: settings.lightColor },
      uLightPosition: { value: settings.lightPosition },
      uContrast: { value: settings.contrast },
      uFogDensity: { value: settings.fogDensity },
      uAnimationSpeed: { value: settings.animationSpeed },
      uMovementScale: { value: settings.movementScale },
      uMouseProximityEffect: { value: settings.mouseProximityEffect },
      uMinMovementScale: { value: settings.minMovementScale },
      uMaxMovementScale: { value: settings.maxMovementScale },
      uCursorGlowIntensity: { value: settings.cursorGlowIntensity },
      uCursorGlowRadius: { value: settings.cursorGlowRadius },
      uCursorGlowColor: { value: settings.cursorGlowColor },
      uIsSafari: { value: isSafari ? 1.0 : 0.0 },
      uIsMobile: { value: isMobile ? 1.0 : 0.0 },
      uIsLowPower: { value: isLowPowerDevice ? 1.0 : 0.0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      ${
        isMobile || isSafari || isLowPowerDevice
          ? "precision mediump float;"
          : "precision highp float;"
      }
      
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uActualResolution;
      uniform float uPixelRatio;
      uniform vec2 uMousePosition;
      uniform vec3 uCursorSphere;
      uniform float uCursorRadius;
      uniform int uSphereCount;
      uniform float uFixedTopLeftRadius;
      uniform float uFixedBottomRightRadius;
      uniform float uSmallTopLeftRadius;
      uniform float uSmallBottomRightRadius;
      uniform float uMergeDistance;
      uniform float uSmoothness;
      uniform float uAmbientIntensity;
      uniform float uDiffuseIntensity;
      uniform float uSpecularIntensity;
      uniform float uSpecularPower;
      uniform float uFresnelPower;
      uniform vec3 uBackgroundColor;
      uniform vec3 uSphereColor;
      uniform vec3 uLightColor;
      uniform vec3 uLightPosition;
      uniform float uContrast;
      uniform float uFogDensity;
      uniform float uAnimationSpeed;
      uniform float uMovementScale;
      uniform bool uMouseProximityEffect;
      uniform float uMinMovementScale;
      uniform float uMaxMovementScale;
      uniform float uCursorGlowIntensity;
      uniform float uCursorGlowRadius;
      uniform vec3 uCursorGlowColor;
      uniform float uIsSafari;
      uniform float uIsMobile;
      uniform float uIsLowPower;
      
      varying vec2 vUv;
      
      const float PI = 3.14159265359;
      const float EPSILON = 0.001;
      const float MAX_DIST = 100.0;
      
      float smin(float a, float b, float k) {
        float h = max(k - abs(a - b), 0.0) / k;
        return min(a, b) - h * h * k * 0.25;
      }
      
      float sdSphere(vec3 p, float r) {
        return length(p) - r;
      }
      
      // FIXED: Use actual resolution for coordinate transformation
      vec3 screenToWorld(vec2 normalizedPos) {
        // normalizedPos is already 0-1, convert to -1 to 1
        vec2 uv = normalizedPos * 2.0 - 1.0;
        // Apply aspect ratio correction using logical resolution
        uv.x *= uResolution.x / uResolution.y;
        return vec3(uv * 2.0, 0.0);
      }
      
      float getDistanceToCenter(vec2 pos) {
        float dist = length(pos - vec2(0.5, 0.5)) * 2.0;
        return smoothstep(0.0, 1.0, dist);
      }
      
      float sceneSDF(vec3 pos) {
        float result = MAX_DIST;
        
        // Fixed sphere positions using consistent coordinate system
        vec3 topLeftPos = screenToWorld(vec2(0.08, 0.92));
        float topLeft = sdSphere(pos - topLeftPos, uFixedTopLeftRadius);
        
        vec3 smallTopLeftPos = screenToWorld(vec2(0.25, 0.72));
        float smallTopLeft = sdSphere(pos - smallTopLeftPos, uSmallTopLeftRadius);
        
        vec3 bottomRightPos = screenToWorld(vec2(0.92, 0.08));
        float bottomRight = sdSphere(pos - bottomRightPos, uFixedBottomRightRadius);
        
        vec3 smallBottomRightPos = screenToWorld(vec2(0.72, 0.25));
        float smallBottomRight = sdSphere(pos - smallBottomRightPos, uSmallBottomRightRadius);
        
        float t = uTime * uAnimationSpeed;
        
        float dynamicMovementScale = uMovementScale;
        if (uMouseProximityEffect) {
          float distToCenter = getDistanceToCenter(uMousePosition);
          float mixFactor = smoothstep(0.0, 1.0, distToCenter);
          dynamicMovementScale = mix(uMinMovementScale, uMaxMovementScale, mixFactor);
        }
        
        // Optimized iterations for performance
        int maxIter = uIsMobile > 0.5 ? 4 : (uIsLowPower > 0.5 ? 6 : min(uSphereCount, 10));
        for (int i = 0; i < 10; i++) {
          if (i >= uSphereCount || i >= maxIter) break;
          
          float fi = float(i);
          float speed = 0.4 + fi * 0.12;
          float radius = 0.12 + mod(fi, 3.0) * 0.06;
          float orbitRadius = (0.3 + mod(fi, 3.0) * 0.15) * dynamicMovementScale;
          float phaseOffset = fi * PI * 0.35;
          
          float distToCursor = length(vec3(0.0) - uCursorSphere);
          float proximityScale = 1.0 + (1.0 - smoothstep(0.0, 1.0, distToCursor)) * 0.5;
          orbitRadius *= proximityScale;
          
          vec3 offset;
          if (i == 0) {
            offset = vec3(
              sin(t * speed) * orbitRadius * 0.7,
              sin(t * 0.5) * orbitRadius,
              cos(t * speed * 0.7) * orbitRadius * 0.5
            );
          } else if (i == 1) {
            offset = vec3(
              sin(t * speed + PI) * orbitRadius * 0.5,
              -sin(t * 0.5) * orbitRadius,
              cos(t * speed * 0.7 + PI) * orbitRadius * 0.5
            );
          } else {
            offset = vec3(
              sin(t * speed + phaseOffset) * orbitRadius * 0.8,
              cos(t * speed * 0.85 + phaseOffset * 1.3) * orbitRadius * 0.6,
              sin(t * speed * 0.5 + phaseOffset) * 0.3
            );
          }
          
          vec3 toCursor = uCursorSphere - offset;
          float cursorDist = length(toCursor);
          if (cursorDist < uMergeDistance && cursorDist > 0.0) {
            float attraction = (1.0 - cursorDist / uMergeDistance) * 0.3;
            offset += normalize(toCursor) * attraction;
          }
          
          float movingSphere = sdSphere(pos - offset, radius);
          
          float blend = 0.05;
          if (cursorDist < uMergeDistance) {
            float influence = 1.0 - (cursorDist / uMergeDistance);
            blend = mix(0.05, uSmoothness, influence * influence * influence);
          }
          
          result = smin(result, movingSphere, blend);
        }
        
        float cursorBall = sdSphere(pos - uCursorSphere, uCursorRadius);
        
        float topLeftGroup = smin(topLeft, smallTopLeft, 0.4);
        float bottomRightGroup = smin(bottomRight, smallBottomRight, 0.4);
        
        result = smin(result, topLeftGroup, 0.3);
        result = smin(result, bottomRightGroup, 0.3);
        result = smin(result, cursorBall, uSmoothness);
        
        return result;
      }
      
      vec3 calcNormal(vec3 p) {
        float eps = uIsLowPower > 0.5 ? 0.002 : 0.001;
        return normalize(vec3(
          sceneSDF(p + vec3(eps, 0, 0)) - sceneSDF(p - vec3(eps, 0, 0)),
          sceneSDF(p + vec3(0, eps, 0)) - sceneSDF(p - vec3(0, eps, 0)),
          sceneSDF(p + vec3(0, 0, eps)) - sceneSDF(p - vec3(0, 0, eps))
        ));
      }
      
      float ambientOcclusion(vec3 p, vec3 n) {
        if (uIsLowPower > 0.5) {
          float h1 = sceneSDF(p + n * 0.03);
          float h2 = sceneSDF(p + n * 0.06);
          float occ = (0.03 - h1) + (0.06 - h2) * 0.5;
          return clamp(1.0 - occ * 2.0, 0.0, 1.0);
        } else {
          float occ = 0.0;
          float weight = 1.0;
          for (int i = 0; i < 6; i++) {
            float dist = 0.01 + 0.015 * float(i * i);
            float h = sceneSDF(p + n * dist);
            occ += (dist - h) * weight;
            weight *= 0.85;
          }
          return clamp(1.0 - occ, 0.0, 1.0);
        }
      }
      
      float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
        if (uIsLowPower > 0.5) {
          float result = 1.0;
          float t = mint;
          for (int i = 0; i < 3; i++) {
            t += 0.3;
            if (t >= maxt) break;
            float h = sceneSDF(ro + rd * t);
            if (h < EPSILON) return 0.0;
            result = min(result, k * h / t);
          }
          return result;
        } else {
          float result = 1.0;
          float t = mint;
          for (int i = 0; i < 20; i++) {
            if (t >= maxt) break;
            float h = sceneSDF(ro + rd * t);
            if (h < EPSILON) return 0.0;
            result = min(result, k * h / t);
            t += h;
          }
          return result;
        }
      }
      
      float rayMarch(vec3 ro, vec3 rd) {
        float t = 0.0;
        int maxSteps = uIsMobile > 0.5 ? 16 : (uIsSafari > 0.5 ? 16 : 48);
        
        for (int i = 0; i < 48; i++) {
          if (i >= maxSteps) break;
          
          vec3 p = ro + rd * t;
          float d = sceneSDF(p);
          
          if (d < EPSILON) {
            return t;
          }
          
          if (t > 5.0) {
            break;
          }
          
          t += d * (uIsLowPower > 0.5 ? 1.2 : 0.9);
        }
        
        return -1.0;
      }
      
      vec3 lighting(vec3 p, vec3 rd, float t) {
        if (t < 0.0) {
          return vec3(0.0);
        }
        
        vec3 normal = calcNormal(p);
        vec3 viewDir = -rd;
        
        vec3 baseColor = uSphereColor;
        
        float ao = ambientOcclusion(p, normal);
        
        vec3 ambient = uLightColor * uAmbientIntensity * ao;
        
        vec3 lightDir = normalize(uLightPosition);
        float diff = max(dot(normal, lightDir), 0.0);
        
        float shadow = softShadow(p, lightDir, 0.01, 10.0, 20.0);
        
        vec3 diffuse = uLightColor * diff * uDiffuseIntensity * shadow;
        
        vec3 reflectDir = reflect(-lightDir, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), uSpecularPower);
        float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), uFresnelPower);
        
        vec3 specular = uLightColor * spec * uSpecularIntensity * fresnel;
        
        vec3 fresnelRim = uLightColor * fresnel * 0.4;
        
        float distToCursor = length(p - uCursorSphere);
        if (distToCursor < uCursorRadius + 0.4) {
          float highlight = 1.0 - smoothstep(0.0, uCursorRadius + 0.4, distToCursor);
          specular += uLightColor * highlight * 0.2;
          
          float glow = exp(-distToCursor * 3.0) * 0.15;
          ambient += uLightColor * glow * 0.5;
        }
        
        vec3 color = (baseColor + ambient + diffuse + specular + fresnelRim) * ao;
        
        color = pow(color, vec3(uContrast * 0.9));
        color = color / (color + vec3(0.8));
        
        return color;
      }
      
      float calculateCursorGlow(vec3 worldPos) {
        float dist = length(worldPos.xy - uCursorSphere.xy);
        float glow = 1.0 - smoothstep(0.0, uCursorGlowRadius, dist);
        glow = pow(glow, 2.0);
        return glow * uCursorGlowIntensity;
      }
      
      void main() {
        // FIXED: Use actual resolution for proper coordinate calculation
        vec2 uv = (gl_FragCoord.xy * 2.0 - uActualResolution.xy) / uActualResolution.xy;
        uv.x *= uResolution.x / uResolution.y;
        
        vec3 ro = vec3(uv * 2.0, -1.0);
        vec3 rd = vec3(0.0, 0.0, 1.0);
        
        float t = rayMarch(ro, rd);
        
        vec3 p = ro + rd * t;
        
        vec3 color = lighting(p, rd, t);
        
        float cursorGlow = calculateCursorGlow(ro);
        vec3 glowContribution = uCursorGlowColor * cursorGlow;
        
        if (t > 0.0) {
          float fogAmount = 1.0 - exp(-t * uFogDensity);
          color = mix(color, uBackgroundColor.rgb, fogAmount * 0.3);
          
          color += glowContribution * 0.3;
          
          gl_FragColor = vec4(color, 1.0);
        } else {
          if (cursorGlow > 0.01) {
            gl_FragColor = vec4(glowContribution, cursorGlow * 0.8);
          } else {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
          }
        }
      }
    `,
    transparent: true
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  setupUI();
  setupEventListeners();

  // Initialize cursor position
  onPointerMove({
    clientX: window.innerWidth / 2,
    clientY: window.innerHeight / 2
  });
}

function setupEventListeners() {
  window.addEventListener("mousemove", onPointerMove, { passive: true });
  window.addEventListener("touchstart", onTouchStart, { passive: false });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd, { passive: false });
  window.addEventListener("resize", onWindowResize, { passive: true });
  window.addEventListener(
    "orientationchange",
    () => {
      setTimeout(onWindowResize, 100);
    },
    { passive: true }
  );
}

function onTouchStart(event) {
  event.preventDefault();
  if (event.touches.length > 0) {
    const touch = event.touches[0];
    onPointerMove({
      clientX: touch.clientX,
      clientY: touch.clientY
    });
  }
}

function onTouchMove(event) {
  event.preventDefault();
  if (event.touches.length > 0) {
    const touch = event.touches[0];
    onPointerMove({
      clientX: touch.clientX,
      clientY: touch.clientY
    });
  }
}

function onTouchEnd(event) {
  event.preventDefault();
}

function onPointerMove(event) {
  // Use consistent coordinate system for mouse
  targetMousePosition.x = event.clientX / window.innerWidth;
  targetMousePosition.y = 1.0 - event.clientY / window.innerHeight;

  // Convert to world coordinates using the same system as fixed spheres
  const normalizedX = targetMousePosition.x;
  const normalizedY = targetMousePosition.y;
  const worldPos = screenToWorldJS(normalizedX, normalizedY);
  cursorSphere3D.copy(worldPos);

  // Calculate merges and radius
  let closestDistance = 1000.0;
  activeMerges = 0;

  // Use consistent positioning for merge detection
  const fixedPositions = [
    screenToWorldJS(0.08, 0.92), // top left
    screenToWorldJS(0.25, 0.72), // small top left
    screenToWorldJS(0.92, 0.08), // bottom right
    screenToWorldJS(0.72, 0.25) // small bottom right
  ];

  fixedPositions.forEach((pos) => {
    const dist = cursorSphere3D.distanceTo(pos);
    closestDistance = Math.min(closestDistance, dist);
    if (dist < settings.mergeDistance) activeMerges++;
  });

  const proximityFactor = Math.max(
    0,
    1.0 - closestDistance / settings.mergeDistance
  );
  const smoothFactor =
    proximityFactor * proximityFactor * (3.0 - 2.0 * proximityFactor);
  const dynamicRadius =
    settings.cursorRadiusMin +
    (settings.cursorRadiusMax - settings.cursorRadiusMin) * smoothFactor;

  material.uniforms.uCursorSphere.value.copy(cursorSphere3D);
  material.uniforms.uCursorRadius.value = dynamicRadius;

  updateStory(
    cursorSphere3D.x,
    cursorSphere3D.y,
    dynamicRadius,
    activeMerges,
    fps
  );
}

// JavaScript version of screenToWorld for consistency
function screenToWorldJS(normalizedX, normalizedY) {
  const uv_x = normalizedX * 2.0 - 1.0;
  const uv_y = normalizedY * 2.0 - 1.0;
  const aspect = window.innerWidth / window.innerHeight;
  return new THREE.Vector3(uv_x * aspect * 2.0, uv_y * 2.0, 0.0);
}

function updateStory(x, y, radius, merges, fps) {
  const storyText = document.getElementById("story-text");
  if (storyText) {
    const newText = getStoryText(
      x.toFixed(2),
      y.toFixed(2),
      radius.toFixed(2),
      merges,
      fps || 0
    );
    storyText.innerHTML = newText;
  }
}

function applyPreset(presetName) {
  const preset = presets[presetName];
  if (!preset) return;

  settings.preset = presetName;
  Object.keys(preset).forEach((key) => {
    if (settings.hasOwnProperty(key)) {
      settings[key] = preset[key];
    }
  });

  // Update uniforms
  material.uniforms.uSphereCount.value = settings.sphereCount;
  material.uniforms.uAmbientIntensity.value = settings.ambientIntensity;
  material.uniforms.uDiffuseIntensity.value = settings.diffuseIntensity;
  material.uniforms.uSpecularIntensity.value = settings.specularIntensity;
  material.uniforms.uSpecularPower.value = settings.specularPower;
  material.uniforms.uFresnelPower.value = settings.fresnelPower;
  material.uniforms.uBackgroundColor.value = settings.backgroundColor;
  material.uniforms.uSphereColor.value = settings.sphereColor;
  material.uniforms.uLightColor.value = settings.lightColor;
  material.uniforms.uLightPosition.value = settings.lightPosition;
  material.uniforms.uSmoothness.value = settings.smoothness;
  material.uniforms.uContrast.value = settings.contrast;
  material.uniforms.uFogDensity.value = settings.fogDensity;
  material.uniforms.uCursorGlowIntensity.value = settings.cursorGlowIntensity;
  material.uniforms.uCursorGlowRadius.value = settings.cursorGlowRadius;
  material.uniforms.uCursorGlowColor.value = settings.cursorGlowColor;
}

function setupUI() {
  const uiContainer = document.getElementById("ui-container");
  if (!uiContainer) return;

  const pane = new Pane({
    container: uiContainer,
    title: "Metaball Controls",
    expanded: !isMobile
  });

  pane
    .addBinding(settings, "preset", {
      options: {
        Moody: "moody",
        Cosmic: "cosmic",
        Minimal: "minimal",
        Vibrant: "vibrant",
        Neon: "neon",
        Sunset: "sunset",
        Midnight: "midnight",
        Toxic: "toxic",
        Pastel: "pastel",
        Psychedelic: "dithered",
        Holographic: "holographic",
        oceanic: "oceanic"
      }
    })
    .on("change", (ev) => {
      applyPreset(ev.value);
      pane.refresh();
    });

  const metaballFolder = pane.addFolder({ title: "Metaballs" });

  metaballFolder
    .addBinding(settings, "fixedTopLeftRadius", {
      min: 0.2,
      max: 2.0,
      step: 0.01,
      label: "Top Left Size"
    })
    .on("change", (ev) => {
      material.uniforms.uFixedTopLeftRadius.value = ev.value;
    });

  metaballFolder
    .addBinding(settings, "fixedBottomRightRadius", {
      min: 0.2,
      max: 2.0,
      step: 0.01,
      label: "Bottom Right Size"
    })
    .on("change", (ev) => {
      material.uniforms.uFixedBottomRightRadius.value = ev.value;
    });

  metaballFolder
    .addBinding(settings, "smallTopLeftRadius", {
      min: 0.1,
      max: 0.8,
      step: 0.01,
      label: "Small Top Left"
    })
    .on("change", (ev) => {
      material.uniforms.uSmallTopLeftRadius.value = ev.value;
    });

  metaballFolder
    .addBinding(settings, "smallBottomRightRadius", {
      min: 0.1,
      max: 0.8,
      step: 0.01,
      label: "Small Bottom Right"
    })
    .on("change", (ev) => {
      material.uniforms.uSmallBottomRightRadius.value = ev.value;
    });

  metaballFolder
    .addBinding(settings, "sphereCount", {
      min: 2,
      max: 10,
      step: 1,
      label: "Moving Count"
    })
    .on("change", (ev) => {
      material.uniforms.uSphereCount.value = ev.value;
    });

  metaballFolder
    .addBinding(settings, "smoothness", {
      min: 0.1,
      max: 1.0,
      step: 0.01,
      label: "Blend Smoothness"
    })
    .on("change", (ev) => {
      material.uniforms.uSmoothness.value = ev.value;
    });

  const mouseFolder = pane.addFolder({ title: "Mouse Interaction" });

  mouseFolder
    .addBinding(settings, "mouseProximityEffect")
    .on("change", (ev) => {
      material.uniforms.uMouseProximityEffect.value = ev.value;
    });

  mouseFolder
    .addBinding(settings, "minMovementScale", {
      min: 0.1,
      max: 1.0,
      step: 0.05
    })
    .on("change", (ev) => {
      material.uniforms.uMinMovementScale.value = ev.value;
    });

  mouseFolder
    .addBinding(settings, "maxMovementScale", {
      min: 0.5,
      max: 2.0,
      step: 0.05
    })
    .on("change", (ev) => {
      material.uniforms.uMaxMovementScale.value = ev.value;
    });

  mouseFolder.addBinding(settings, "mouseSmoothness", {
    min: 0.01,
    max: 0.2,
    step: 0.01,
    label: "Mouse Smoothness"
  });

  const cursorFolder = pane.addFolder({ title: "Cursor" });

  cursorFolder.addBinding(settings, "cursorRadiusMin", {
    min: 0.05,
    max: 0.2,
    step: 0.01,
    label: "Min Radius"
  });

  cursorFolder.addBinding(settings, "cursorRadiusMax", {
    min: 0.1,
    max: 0.25,
    step: 0.01,
    label: "Max Radius"
  });

  const animationFolder = pane.addFolder({ title: "Animation" });

  animationFolder
    .addBinding(settings, "animationSpeed", {
      min: 0.1,
      max: 3.0,
      step: 0.1
    })
    .on("change", (ev) => {
      material.uniforms.uAnimationSpeed.value = ev.value;
    });

  animationFolder
    .addBinding(settings, "movementScale", {
      min: 0.5,
      max: 2.0,
      step: 0.1
    })
    .on("change", (ev) => {
      material.uniforms.uMovementScale.value = ev.value;
    });

  const lightingFolder = pane.addFolder({ title: "Lighting" });

  lightingFolder
    .addBinding(settings, "ambientIntensity", {
      min: 0,
      max: 0.5,
      step: 0.01
    })
    .on("change", (ev) => {
      material.uniforms.uAmbientIntensity.value = ev.value;
    });

  lightingFolder
    .addBinding(settings, "diffuseIntensity", {
      min: 0,
      max: 1.0,
      step: 0.01
    })
    .on("change", (ev) => {
      material.uniforms.uDiffuseIntensity.value = ev.value;
    });

  lightingFolder
    .addBinding(settings, "specularIntensity", {
      min: 0,
      max: 2.0,
      step: 0.01
    })
    .on("change", (ev) => {
      material.uniforms.uSpecularIntensity.value = ev.value;
    });

  lightingFolder
    .addBinding(settings, "specularPower", {
      min: 1,
      max: 64,
      step: 1
    })
    .on("change", (ev) => {
      material.uniforms.uSpecularPower.value = ev.value;
    });

  lightingFolder
    .addBinding(settings, "fresnelPower", {
      min: 1,
      max: 5,
      step: 0.1
    })
    .on("change", (ev) => {
      material.uniforms.uFresnelPower.value = ev.value;
    });

  lightingFolder
    .addBinding(settings, "contrast", {
      min: 0.5,
      max: 2.0,
      step: 0.1
    })
    .on("change", (ev) => {
      material.uniforms.uContrast.value = ev.value;
    });

  const glowFolder = pane.addFolder({ title: "Cursor Glow" });

  glowFolder
    .addBinding(settings, "cursorGlowIntensity", {
      min: 0,
      max: 2.0,
      step: 0.1
    })
    .on("change", (ev) => {
      material.uniforms.uCursorGlowIntensity.value = ev.value;
    });

  glowFolder
    .addBinding(settings, "cursorGlowRadius", {
      min: 0.5,
      max: 3.0,
      step: 0.1
    })
    .on("change", (ev) => {
      material.uniforms.uCursorGlowRadius.value = ev.value;
    });

  glowFolder
    .addBinding(settings, "fogDensity", {
      min: 0,
      max: 0.5,
      step: 0.01
    })
    .on("change", (ev) => {
      material.uniforms.uFogDensity.value = ev.value;
    });
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const currentPixelRatio = Math.min(devicePixelRatio, isMobile ? 1.5 : 2);

  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.setPixelRatio(currentPixelRatio);

  // FIXED: Update resolution uniforms with proper values
  material.uniforms.uResolution.value.set(width, height);
  material.uniforms.uActualResolution.value.set(
    width * currentPixelRatio,
    height * currentPixelRatio
  );
  material.uniforms.uPixelRatio.value = currentPixelRatio;

  // Ensure canvas stays properly positioned
  const canvas = renderer.domElement;
  canvas.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 0 !important;
    display: block !important;
  `;

  if (renderer.info) {
    renderer.info.autoReset = true;
  }
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  const currentTime = performance.now();
  frameCount++;

  if (currentTime - lastTime >= 1000) {
    fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
    updateStory(
      cursorSphere3D.x,
      cursorSphere3D.y,
      material.uniforms.uCursorRadius.value,
      activeMerges,
      fps
    );
    frameCount = 0;
    lastTime = currentTime;
  }

  // Smooth mouse movement
  mousePosition.x +=
    (targetMousePosition.x - mousePosition.x) * settings.mouseSmoothness;
  mousePosition.y +=
    (targetMousePosition.y - mousePosition.y) * settings.mouseSmoothness;

  material.uniforms.uTime.value = clock.getElapsedTime();
  material.uniforms.uMousePosition.value = mousePosition;

  // Periodic cleanup for better memory management
  if (performance.now() % 5000 < 16) {
    renderer.renderLists.dispose();
  }

  renderer.render(scene, camera);
}

// Email functionality
document.addEventListener("DOMContentLoaded", function () {
  const emailLink = document.querySelector(".contact-email");
  if (emailLink) {
    const originalText = emailLink.textContent;
    emailLink.addEventListener("click", function (e) {
      e.preventDefault();
      navigator.clipboard
        .writeText("hi@filip.fyi")
        .then(() => {
          emailLink.textContent = "transmission sent to clipboard";
          setTimeout(() => {
            emailLink.textContent = originalText;
          }, 2000);
        })
        .catch(() => {
          window.location.href = "mailto:hi@filip.fyi";
        });
    });
  }
});


// alert
var xmlns = "http://www.w3.org/2000/svg",
  xlinkns = "http://www.w3.org/1999/xlink",
  select = function(s) {
    return document.querySelector(s);
  },
  selectAll = function(s) {
    return document.querySelectorAll(s);
  }

TweenMax.set('svg', {
  visibility: 'visible'
})

var tl = new TimelineMax({
  repeat: -1
}).timeScale(1.4);
tl.staggerFromTo('#cpuGroup path', 0.5, {
  drawSVG: '0% 50%'
}, {
  drawSVG: '0% 0%',
  ease: Sine.easeOut
}, 0)

.from('#outline', 1, {
    drawSVG: '0% 0%',
    ease: Sine.easeInOut
  }, '-=0.5')
  .from('#exclamationDot', 0.3, {
    attr: {
      r: 0
    }
  }, '-=0.3')
  .from('#exclamationLine', 0.0001, {
    autoAlpha: 0
  }, '-=0.31')
  .from('#exclamationLine', 0.5, {
    attr: {
      y1: 293
    }
  }, '-=0.3')
  .staggerFrom(['#exclamationLine', '#exclamationDot'], 1, {
    cycle: {
      y: [40, 20]
    },
    ease: Anticipate.easeIn //Back.easeOut.config(2,0.7)
  }, 0.21, '-=1')

.to('#exclamationLine', 0.5, {
    drawSVG: '100% 100%'
  }, '+=2')
  .to('#exclamationDot', 0.5, {
    attr: {
      r: 0
    }
  }, '-=0.3')
  .staggerTo(['#exclamationLine', '#exclamationDot'], 0.5, {
    cycle: {
      y: [40, 20]
    },
    ease: Anticipate.easeOut
  }, 0.1, '-=0.5')

.to('#outline', 1, {
    drawSVG: '100% 100%',
    ease: Sine.easeInOut
  }, '-=0.5')
  .set('#outline', {
    autoAlpha: 0
  })
  .staggerTo('#cpuGroup path', 1, {
    drawSVG: '0% 100%'
  }, 0.08, '-=0.3')
  .to('#cpuGroup path', 0.2, {
    stroke: '#ededed',
    repeat: 11,
    yoyo: true,
    ease: Linear.easeNone
  })
.staggerFromTo('#heatlineGroup path', 0.5, {
  drawSVG:'0% 0%',
  alpha:0,
  stroke:'#f63'
},{
  alpha:1,
  drawSVG:'0% 30%',
  ease:Linear.easeNone
},0,'-=2.2')
.staggerTo('#heatlineGroup path', 0.7, {
  drawSVG:'70% 100%',
  ease:Linear.easeNone,
  stroke:'#232C38'
},0,'-=1.7')
.staggerTo('#heatlineGroup path', 0.5, {
  drawSVG:'100% 100%',
  alpha:0,
  ease:Power1.easeOut
},0,'-=1')

  .staggerTo('#cpuGroup path', 0.5, {
    drawSVG: '0% 50%',
    ease: Sine.easeIn
  }, 0)


//TweenMax.globalTimeScale(0.5)


// Fungsi untuk menutup alert
    function closeAlert() {
      document.getElementById("alertBox").style.display = "none";
    }

    // Tampilkan popup otomatis ketika halaman dibuka
    window.onload = function() {
      document.getElementById("alertBox").style.display = "flex";
    }
