// src/internal/shaders/scatter-fade/scatter-fade.frag.wgsl
var scatter_fade_frag_default = "struct FragmentIn { @location(0) color : vec4f, @location(1) uv : vec2f, } @fragment fn fs_main(in: FragmentIn) -> @location(0) vec4f { let centered = in.uv * 2.0 - 1.0; let dist = length(centered); if (dist > 1.0) { discard; } let alpha = smoothstep(1.0, 0.0, dist) * in.color.a; return vec4f(in.color.rgb, alpha); }";

// src/internal/shaders/scatter-fade/scatter-fade.vert.wgsl
var scatter_fade_vert_default = "struct Uniforms { deltaTime : f32, time : f32, canvasSize: vec2f, emitterPos : vec2f, emitterType: f32, emitterP1 : f32, emitterP2 : f32, sp0 : f32, sp1 : f32, sp2 : f32, sp3 : f32, sp4 : f32 } struct Particle { position : vec2f, velocity : vec2f, color : vec4f, seed : f32, life : f32, maxLife : f32, size : f32 } @group(0) @binding(0) var<uniform> uniforms : Uniforms; @group(0) @binding(1) var<storage, read> particles : array<Particle>; struct VertexOut { @builtin(position) clipPosition : vec4f, @location(0) color : vec4f, @location(1) uv : vec2f, } const QUAD_POS = array<vec2f, 6>( vec2f(-1.0, -1.0), vec2f( 1.0, -1.0), vec2f( 1.0, 1.0), vec2f(-1.0, -1.0), vec2f( 1.0, 1.0), vec2f(-1.0, 1.0), ); const QUAD_UV = array<vec2f, 6>( vec2f(0.0, 1.0), vec2f(1.0, 1.0), vec2f(1.0, 0.0), vec2f(0.0, 1.0), vec2f(1.0, 0.0), vec2f(0.0, 0.0), ); @vertex fn vs_main( @builtin(vertex_index) vIdx : u32, @builtin(instance_index) pIdx : u32, ) -> VertexOut { let p = particles[pIdx]; let corner = QUAD_POS[vIdx]; let uv = QUAD_UV[vIdx]; let pixelPos = p.position + corner * p.size; let clipPos = (pixelPos / uniforms.canvasSize) * 2.0 - 1.0; var out: VertexOut; out.clipPosition = vec4f(clipPos.x, -clipPos.y, 0.0, 1.0); out.color = p.color; out.uv = uv; return out; }";

// src/internal/shaders/scatter-fade/scatter-fade.comp.wgsl
var scatter_fade_comp_default = "struct Uniforms { deltaTime : f32, time : f32, canvasSize: vec2f, emitterPos : vec2f, emitterType: f32, emitterP1 : f32, emitterP2 : f32, sp0 : f32, sp1 : f32, sp2 : f32, sp3 : f32, sp4 : f32 } struct Particle { position : vec2f, velocity : vec2f, color : vec4f, seed : u32, life : f32, maxLife : f32, size : f32, } @group(0) @binding(0) var<uniform> uniforms : Uniforms; @group(0) @binding(1) var<storage, read_write> particles : array<Particle>; fn pcg(v: u32) -> u32 { let state = v * 747796405u + 2891336453u; let word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u; return (word >> 22u) ^ word; } fn rand_f32(seed: u32) -> f32 { return f32(pcg(seed)) / f32(0xffffffffu); } fn respawn(i: u32) -> Particle { var p: Particle; let r1 = rand_f32(pcg(i)); let r2 = rand_f32(pcg(i + 100000u)); let r3 = rand_f32(pcg(i + 200000u)); let r4 = rand_f32(pcg(i + 300000u)); let r5 = rand_f32(pcg(i + 400000u)); let r6 = rand_f32(pcg(i + 500000u)); let r7 = rand_f32(pcg(i + 600000u)); var spawnPos: vec2f; if (uniforms.emitterType == 0.0) { spawnPos = uniforms.emitterPos; } else if (uniforms.emitterType == 1.0) { let angle = rand_f32(i * 7) * 6.2832; let radius = sqrt(rand_f32(i * 8)) * uniforms.emitterP1; spawnPos = uniforms.emitterPos + vec2f(cos(angle), sin(angle)) * radius; } else if (uniforms.emitterType == 2.0) { let rx = (rand_f32(i * 7) - 0.5) * uniforms.emitterP1; let ry = (rand_f32(i * 8) - 0.5) * uniforms.emitterP2; spawnPos = uniforms.emitterPos + vec2f(rx, ry); } p.position = spawnPos; p.velocity = vec2f((r1 - 0.5) * 400.0, -(r2 * 300.0 + 100.0)); p.color = vec4f(r3, r4, 1.0 - r3, 1.0); p.seed = pcg(i + u32(uniforms.time * 1000.0)); p.life = 1.0; p.maxLife = r7 * 2.0 + 0.5; p.size = r1 * 8.0 + 4.0; return p; } @compute @workgroup_size(64) fn main(@builtin(global_invocation_id) id: vec3u) { let i = id.x; if (i >= arrayLength(&particles)) { return; } var p = particles[i]; p.life -= uniforms.deltaTime / p.maxLife; if (p.life <= 0.0) { particles[i] = respawn(i); return; } p.velocity.y += 100 * uniforms.deltaTime; p.position += p.velocity * uniforms.deltaTime; p.color.a = p.life; particles[i] = p; }";

// src/internal/shaders/scatter-swirl/scatter-swirl.frag.wgsl
var scatter_swirl_frag_default = "struct VertexOut { @builtin(position) pos : vec4f, @location(0) uv : vec2f, @location(1) color : vec4f, } @fragment fn fs_main(in: VertexOut) -> @location(0) vec4f { let d = length(in.uv); if (d > 1.0) { discard; } let core = 1.0 - smoothstep(0.0, 0.6, d); let glow = pow(core, 2.0); let life = in.color.a; let hotColor = vec3f(0.85, 1.00, 1.00); let coldColor = vec3f(0.15, 0.00, 0.40); let baseColor = mix(coldColor, hotColor, pow(life, 0.5)); return vec4f(baseColor * glow, glow * life); }";

// src/internal/shaders/scatter-swirl/scatter-swirl.vert.wgsl
var scatter_swirl_vert_default = "struct Uniforms { deltaTime : f32, time : f32, canvasSize : vec2f, emitterPos : vec2f, emitterType : f32, emitterP1 : f32, emitterP2 : f32, sp0 : f32, sp1 : f32, sp2 : f32, sp3 : f32, sp4 : f32 } struct Particle { position : vec2f, velocity : vec2f, color : vec4f, seed : f32, life : f32, maxLife : f32, size : f32, } struct VertexOut { @builtin(position) pos : vec4f, @location(0) uv : vec2f, @location(1) color : vec4f, } @group(0) @binding(0) var<uniform> uniforms : Uniforms; @group(0) @binding(1) var<storage, read> particles : array<Particle>; const QUAD = array<vec2f, 6>( vec2f(-1.0, -1.0), vec2f( 1.0, -1.0), vec2f(-1.0, 1.0), vec2f(-1.0, 1.0), vec2f( 1.0, -1.0), vec2f( 1.0, 1.0), ); @vertex fn vs_main( @builtin(vertex_index) vertIdx : u32, @builtin(instance_index) instIdx : u32, ) -> VertexOut { let p = particles[instIdx]; let corner = QUAD[vertIdx]; let pixelPos = p.position + corner * p.size; let clipPos = (pixelPos / uniforms.canvasSize) * 2.0 - 1.0; var out: VertexOut; out.pos = vec4f(clipPos.x, -clipPos.y, 0.0, 1.0); out.uv = corner; out.color = p.color; return out; }";

// src/internal/shaders/scatter-swirl/scatter-swirl.comp.wgsl
var scatter_swirl_comp_default = "struct Uniforms { deltaTime : f32, time : f32, canvasSize : vec2f, emitterPos : vec2f, emitterType : f32, emitterP1 : f32, emitterP2 : f32, sp0 : f32, sp1 : f32, sp2 : f32, sp3 : f32, sp4 : f32, } struct Particle { position : vec2f, velocity : vec2f, color : vec4f, seed : f32, life : f32, maxLife : f32, size : f32, } @group(0) @binding(0) var<uniform> uniforms : Uniforms; @group(0) @binding(1) var<storage, read_write> particles : array<Particle>; fn pcg(v: u32) -> u32 { let state = v * 747796405u + 2891336453u; let word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u; return (word >> 22u) ^ word; } fn rand_f32(seed: u32) -> f32 { return f32(pcg(seed)) / f32(0xffffffffu); } fn respawn(i: u32, seed: f32) -> Particle { var p: Particle; let s = u32(seed * f32(0xffffffffu)); let r = rand_f32(pcg(i ^ s)) * uniforms.emitterP1; let angle = rand_f32(pcg((i ^ s) + 100000u)) * 6.2831853; p.position = uniforms.emitterPos + vec2f(cos(angle), sin(angle)) * r; p.velocity = vec2f(0.0); p.seed = rand_f32(pcg((i ^ s) + 200000u)); p.life = 1.0; p.maxLife = rand_f32(pcg((i ^ s) + 300000u)) * 2.0 + 1.0; p.color = vec4f(1.0); p.size = 6.0; return p; } @compute @workgroup_size(64) fn main(@builtin(global_invocation_id) id: vec3u) { let i = id.x; if (i >= arrayLength(&particles)) { return; } var p = particles[i]; p.life -= uniforms.deltaTime / p.maxLife; if (p.life <= 0.0) { particles[i] = respawn(i, p.seed); return; } let toCenter = uniforms.emitterPos - p.position; let dist = max(length(toCenter), 1.0); let radial = toCenter / dist; let tangent = vec2f(-radial.y, radial.x); let spin = tangent * uniforms.sp0 / sqrt(dist); let pull = radial * uniforms.sp1; p.velocity += (spin + pull) * uniforms.deltaTime; p.position += p.velocity * uniforms.deltaTime; p.color.a = p.life; particles[i] = p; }";

// src/internal/shaders/fireworks/fireworks.frag.wgsl
var fireworks_frag_default = "struct VertexOut { @builtin(position) pos : vec4f, @location(0) uv : vec2f, @location(1) color : vec4f, } @fragment fn fs_main(in: VertexOut) -> @location(0) vec4f { let isSpark = in.uv.y > 5.0; let uv = select(in.uv, vec2f(in.uv.x, in.uv.y - 10.0), isSpark); if (!isSpark) { let d = length(uv); if (d > 1.0) { discard; } let core = 1.0 - smoothstep(0.0, 0.5, d); let glow = pow(core, 2.0); let col = mix(vec3f(1.0, 0.8, 0.2), vec3f(1.0, 1.0, 1.0), core); return vec4f(col * glow, glow); } else { let crossSection = 1.0 - smoothstep(0.0, 1.0, abs(uv.x)); let tip = 1.0 - smoothstep(0.0, 0.6, uv.y); let tail = 1.0 - smoothstep(-1.0, 0.2, uv.y); let along = tip * tail; let intensity = crossSection * along; if (intensity < 0.01) { discard; } let hotColor = vec3f(1.0, 1.0, 0.9); let col = mix(in.color.rgb, hotColor, pow(intensity, 3.0)); return vec4f(col * intensity, intensity * in.color.a); } }";

// src/internal/shaders/fireworks/fireworks.vert.wgsl
var fireworks_vert_default = "struct Uniforms { deltaTime : f32, time : f32, canvasSize : vec2f, emitterPos : vec2f, emitterType : f32, emitterP1 : f32, emitterP2 : f32, sp0 : f32, sp1 : f32, sp2 : f32, sp3 : f32, sp4 : f32, } struct Particle { position : vec2f, velocity : vec2f, color : vec4f, seed : f32, life : f32, maxLife : f32, size : f32, } struct VertexOut { @builtin(position) pos : vec4f, @location(0) uv : vec2f, @location(1) color : vec4f, } @group(0) @binding(0) var<uniform> uniforms : Uniforms; @group(0) @binding(1) var<storage, read> particles : array<Particle>; const QUAD = array<vec2f, 6>( vec2f(-1.0, -1.0), vec2f( 1.0, -1.0), vec2f(-1.0, 1.0), vec2f(-1.0, 1.0), vec2f( 1.0, -1.0), vec2f( 1.0, 1.0), ); @vertex fn vs_main( @builtin(vertex_index) vertIdx : u32, @builtin(instance_index) instIdx : u32, ) -> VertexOut { let p = particles[instIdx]; let corner = QUAD[vertIdx]; var pixelPos: vec2f; if (p.seed < 0.5) { pixelPos = p.position + corner * p.size; } else { let speed = length(p.velocity); if (speed > 0.001) { let along = normalize(p.velocity); let perp = vec2f(-along.y, along.x); let stretchLen = p.size + speed * 0.04; let widthLen = p.size * 0.4; pixelPos = p.position + along * corner.y * stretchLen + perp * corner.x * widthLen; } else { pixelPos = p.position + corner * p.size; } } let clipPos = (pixelPos / uniforms.canvasSize) * 2.0 - 1.0; var out: VertexOut; out.pos = vec4f(clipPos.x, -clipPos.y, 0.0, 1.0); out.color = p.color; if (p.seed < 0.5) { out.uv = corner; } else { out.uv = vec2f(corner.x, corner.y + 10.0); } return out; }";

// src/internal/shaders/fireworks/fireworks.comp.wgsl
var fireworks_comp_default = "struct Uniforms { deltaTime : f32, time : f32, canvasSize : vec2f, emitterPos : vec2f, emitterType : f32, emitterP1 : f32, emitterP2 : f32, sp0 : f32, sp1 : f32, sp2 : f32, sp3 : f32, sp4 : f32, } struct Particle { position : vec2f, velocity : vec2f, color : vec4f, seed : f32, life : f32, maxLife : f32, size : f32, } @group(0) @binding(0) var<uniform> uniforms : Uniforms; @group(0) @binding(1) var<storage, read_write> particles : array<Particle>; fn pcg(v: u32) -> u32 { let state = v * 747796405u + 2891336453u; let word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u; return (word >> 22u) ^ word; } fn rand_f32(seed: u32) -> f32 { return f32(pcg(seed)) / f32(0xffffffffu); } fn dormantSpark() -> Particle { var p: Particle; p.position = vec2f(-99999.0); p.velocity = vec2f(0.0); p.color = vec4f(0.0); p.seed = 1.0; p.life = 0.0; p.maxLife = 1.0; p.size = 0.0; return p; } fn respawnRocket(i: u32) -> Particle { var p: Particle; let r1 = rand_f32(pcg(i)); let r2 = rand_f32(pcg(i + 100000u)); let r3 = rand_f32(pcg(i + 200000u)); let r4 = rand_f32(pcg(i + 300000u)); let r5 = rand_f32(pcg(i + 400000u)); let angle = (r2 - 0.5) * 0.4; let mod_speed = (0.8 + (r2 * 0.2)) * -uniforms.sp0; p.position = uniforms.emitterPos + vec2f((r1 - 0.5) * uniforms.emitterP1, uniforms.emitterP2 / 2); p.velocity = vec2f(sin(angle) * uniforms.sp0 * 0.3, mod_speed); p.color = vec4f(r3, r4, r5, 1.0); p.seed = 0.0; p.life = 1.0; p.maxLife = 1.0; p.size = 15.0; return p; } @compute @workgroup_size(64) fn main_rockets(@builtin(global_invocation_id) id: vec3u) { let i = id.x; let rocketCount = u32(uniforms.sp3); if (i >= rocketCount) { return; } var p = particles[i]; if (p.seed == 0.25) { particles[i] = respawnRocket(i); return; } p.velocity.y += uniforms.sp2 * uniforms.deltaTime; p.position += p.velocity * uniforms.deltaTime; if (p.velocity.y >= 0.0) { p.seed = 0.25; } particles[i] = p; } @compute @workgroup_size(64) fn main_sparks(@builtin(global_invocation_id) id: vec3u) { let i = id.x; let rocketCount = u32(uniforms.sp3); let totalParticles = arrayLength(&particles); let r1 = rand_f32(pcg(i)); let r2 = rand_f32(pcg(i + 100000u)); let r3 = rand_f32(pcg(i + 200000u)); let r4 = rand_f32(pcg(i + 300000u)); if (i < rocketCount || i >= totalParticles) { return; } if (rocketCount == 0u) { return; } let sparksPerRocket = (totalParticles - rocketCount) / rocketCount; if (sparksPerRocket == 0u) { return; } var p = particles[i]; let rocketIdx = (i - rocketCount) / sparksPerRocket; if (rocketIdx >= rocketCount) { return; } let rocket = particles[rocketIdx]; if (rocket.seed == 0.25 && p.size == 0.0) { let s = i; let angle = r1 * 6.2831853; let speed = r2 * uniforms.sp1 + uniforms.sp1 * 0.3; p.position = rocket.position; p.velocity = vec2f(cos(angle), sin(angle)) * speed; p.color = vec4f(rocket.color.rgb, 1.0); p.seed = 1.0; p.life = 1.0; p.maxLife = r3 * 1.5 + 0.5; p.size = r4 * 9.0 + 6.0; particles[i] = p; return; } if (p.size == 0.0) { return; } p.life -= uniforms.deltaTime / p.maxLife; if (p.life <= 0.0) { particles[i] = dormantSpark(); return; } p.velocity *= 0.98; p.velocity.y += uniforms.sp2 * uniforms.deltaTime; p.position += p.velocity * uniforms.deltaTime; p.color.a = p.life; particles[i] = p; }";

// src/internal/shaders/index.ts
var shader_registry = {
  scatter_fade_frag: scatter_fade_frag_default,
  scatter_fade_vert: scatter_fade_vert_default,
  scatter_fade_comp: scatter_fade_comp_default,
  scatter_swirl_frag: scatter_swirl_frag_default,
  scatter_swirl_vert: scatter_swirl_vert_default,
  scatter_swirl_comp: scatter_swirl_comp_default,
  fireworks_frag: fireworks_frag_default,
  fireworks_vert: fireworks_vert_default,
  fireworks_comp: fireworks_comp_default
};

// src/public/enums/ParticleTypes.ts
var ParticleType = /* @__PURE__ */ ((ParticleType2) => {
  ParticleType2[ParticleType2["Star"] = 0] = "Star";
  ParticleType2[ParticleType2["Cross"] = 1] = "Cross";
  ParticleType2[ParticleType2["Square"] = 2] = "Square";
  return ParticleType2;
})(ParticleType || {});

// src/public/types/ValidationRule.ts
function validate(value, rules) {
  for (const rule of rules) {
    if (!rule.check(value)) {
      return { valid: false, message: rule.message };
    }
  }
  return { valid: true };
}

// src/public/effects/ScatterFadeEffect.ts
var ScatterFadeEffect = class _ScatterFadeEffect {
  // #region --- The class properties ------------------------------------------
  MAX_PARTICLES;
  static rules = [
    {
      check: (e) => e.MAX_PARTICLES > 0,
      message: "Max Particles must be greater than 0"
    },
    {
      check: (e) => e.MAX_PARTICLES <= 1e5,
      message: "Max particles must not exceed 100,000"
    }
  ];
  // #endregion ----------------------------------------------------------------
  /**
   * The class constructor. Takes the user definable properties and returns an instance of the class
   * 
   * @param max_particles - The max number of particles for the effect
   * @param rocket_number - The max number of rockets for the effect
   */
  constructor(max_particles) {
    this.MAX_PARTICLES = max_particles;
  }
  /**
   * Generate all the particles for the intial buffering of the cpu.
   * 
   * @returns - An array of particles with random initial values
   * 
   */
  seed_particles() {
    return Array.from({ length: this.MAX_PARTICLES }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 300;
      return {
        position: [0, 0],
        velocity: [Math.cos(angle) * speed, Math.sin(angle) * speed],
        color: [Math.random(), Math.random(), Math.random(), 1],
        seed: Math.random(),
        maxLife: 1 + Math.random() * 2,
        life: 1 + Math.random() * 2,
        size: 2 + Math.random() * 6,
        type: 2 /* Square */
      };
    });
  }
  /**
   * Get the various custom shader particle parameters
   * 
   * @returns an object representing the custom shader params.
   */
  get_shader_params() {
    return { sp0: 0, sp1: 0, sp2: 0, sp3: 0, sp4: 0 };
  }
  /**
   * Getter for the max_particles property.
   * 
   * @returns - the maximum number of particles for the effect. 
   */
  get_max_particles() {
    return this.MAX_PARTICLES;
  }
  /**
   * Fetch the name of the effect as a string
   * 
   */
  get_effect_name() {
    return "scatter-fade";
  }
  /**
   * Validate the object properties
   * 
   * @returns 
   */
  validate() {
    return validate(this, _ScatterFadeEffect.rules);
  }
};

// src/public/effects/FireworksEffect.ts
var FireworksEffect = class _FireworksEffect {
  // #region --- The class properties ------------------------------------------
  MAX_PARTICLES;
  LAUNCH_SPEED;
  SPARK_SPEED;
  ROCKET_COUNT;
  static rules = [
    {
      check: (e) => e.MAX_PARTICLES > 0,
      message: "Max Particles must be greater than 0"
    },
    {
      check: (e) => e.MAX_PARTICLES <= 1e5,
      message: "Max particles must not exceed 100,000"
    },
    {
      check: (e) => e.ROCKET_COUNT <= e.MAX_PARTICLES / 2,
      message: "Rocket count must not exceed 1/2 the max particles"
    },
    {
      check: (e) => e.LAUNCH_SPEED > 0,
      message: "Lanuch Speed must be greater than 0"
    }
  ];
  // #endregion ----------------------------------------------------------------
  /**
   * The class constructor. Takes the user definable properties and returns an instance of the class
   * 
   * @param max_particles - The max number of particles for the effect
   * @param rocket_number - The max number of rockets for the effect
   */
  constructor(max_particles, rocket_number) {
    this.MAX_PARTICLES = max_particles;
    this.ROCKET_COUNT = rocket_number;
    this.LAUNCH_SPEED = 400;
    this.SPARK_SPEED = 300;
  }
  /**
   * Generate all the particles for the intial buffering of the cpu.
   * 
   * @returns - An array of particles with random initial values
   * 
   */
  seed_particles() {
    return Array.from({ length: this.ROCKET_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 300;
      return {
        position: [0, 0],
        velocity: [Math.cos(angle) * speed, Math.sin(angle) * speed],
        color: [Math.random(), Math.random(), Math.random(), 1],
        seed: Math.random(),
        maxLife: 1 + Math.random() * 2,
        life: 1 + Math.random() * 2,
        size: 2 + Math.random() * 6,
        type: 2 /* Square */
      };
    });
  }
  /**
   * Get the various custom shader particle parameters
   * 
   * @returns an object representing the custom shader params.
   */
  get_shader_params() {
    return {
      sp0: this.LAUNCH_SPEED,
      // - Launch speed
      sp1: this.SPARK_SPEED,
      // - Spark speed
      sp2: 200,
      // - gravity
      sp3: this.ROCKET_COUNT,
      // - Rocket Count
      sp4: 0
      // - Unused
    };
  }
  /**
   * Getter for the max_particles property.
   * 
   * @returns - the maximum number of particles for the effect. 
   */
  get_max_particles() {
    return this.MAX_PARTICLES;
  }
  /**
   * Fetch the name of the effect as a string
   * 
   */
  get_effect_name() {
    return "fireworks";
  }
  /**
   * Validate the object properties
   * 
   * @returns 
   */
  validate() {
    return validate(this, _FireworksEffect.rules);
  }
};

// src/public/effects/ScatterSwirlEffect.ts
var ScatterSwirlEffect = class _ScatterSwirlEffect {
  // #region --- The class properties ------------------------------------------
  MAX_PARTICLES;
  SPIN_STRENGTH;
  PULL_STRENGTH;
  static rules = [
    {
      check: (e) => e.MAX_PARTICLES > 0,
      message: "Max Particles must be greater than 0"
    },
    {
      check: (e) => e.MAX_PARTICLES <= 1e5,
      message: "Max particles must not exceed 100,000"
    },
    {
      check: (e) => e.SPIN_STRENGTH > 0,
      message: "Spin strength must be greater than 0"
    },
    {
      check: (e) => e.PULL_STRENGTH > 0,
      message: "Pull strength must be greater than 0"
    }
  ];
  // #endregion ----------------------------------------------------------------
  /**
   * The class constructor. Takes the user definable properties and returns an instance of the class
   * 
   * @param max_particles - The max number of particles for the effect
   */
  constructor(max_particles) {
    this.MAX_PARTICLES = max_particles;
    this.SPIN_STRENGTH = 150;
    this.PULL_STRENGTH = 30;
  }
  /**
   * Generate all the particles for the intial buffering of the cpu.
   * 
   * @returns - An array of particles with random initial values
   * 
   */
  seed_particles() {
    return Array.from({ length: this.MAX_PARTICLES }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 300;
      return {
        position: [0, 0],
        velocity: [Math.cos(angle) * speed, Math.sin(angle) * speed],
        color: [Math.random(), Math.random(), Math.random(), 1],
        seed: Math.random(),
        maxLife: 1 + Math.random() * 2,
        life: 1 + Math.random() * 2,
        size: 2 + Math.random() * 6,
        type: 2 /* Square */
      };
    });
  }
  /**
   * Get the various custom shader particle parameters
   * 
   * @returns an object representing the custom shader params.
   */
  get_shader_params() {
    return {
      sp0: this.SPIN_STRENGTH,
      // - spin strength
      sp1: this.PULL_STRENGTH,
      // - pull strength
      sp2: 0,
      // - Unused
      sp3: 0,
      // - Unused
      sp4: 0
      // - Unused
    };
  }
  /**
   * Getter for the max_particles property.
   * 
   * @returns - the maximum number of particles for the effect. 
   */
  get_max_particles() {
    return this.MAX_PARTICLES;
  }
  /**
   * Fetch the name of the effect as a string
   * 
   */
  get_effect_name() {
    return "scatter-swirl";
  }
  /**
   * Validate the object properties
   * 
   * @returns 
   */
  validate() {
    return validate(this, _ScatterSwirlEffect.rules);
  }
};

// src/internal/WebGPUContext.ts
var WebGPUContext = class _WebGPUContext {
  adapter;
  device;
  context;
  format;
  shader_set;
  shader_config;
  shaders;
  compute_pipelines;
  render_pipelines;
  bind_groups;
  // -- The buffers used in simulation
  buffers;
  /**
   *
   * Construct a new particle engine instance.
   * Called by the static init function to enable the async nature of the
   * generation of WebGPU contexts
   *
   * @param adapter - The standard WebGPU Adapter
   * @param device - The standard WebGPU device
   * @param context - The standard WebGPU context
   * @param format  - The standard WebGPU Texture format
   * @param shaders - A list of all shaders used by WebGPU
   * @param buffers - A list of all buffers used by WebGPU
   * @param compute_pipeline - The standard WebGPU Compute Pipeline
   * @param render_pipeline - The standard WebGPU Render Pipeline
   * @param bind_groups - A list of all bindgroups used by WebGPU
   */
  constructor(adapter, device, context, format, shader_set, shader_config, shaders, buffers, compute_pipelines, render_pipelines, bind_groups) {
    this.adapter = adapter;
    this.device = device;
    this.context = context;
    this.format = format;
    this.shader_set = shader_set;
    this.shader_config = shader_config;
    this.shaders = shaders;
    this.bind_groups = bind_groups;
    this.buffers = buffers;
    this.compute_pipelines = compute_pipelines;
    this.render_pipelines = render_pipelines;
  }
  // -------------------------------------------------------------------------
  // Initialisation
  // -------------------------------------------------------------------------
  /**
   *
   * asyncronous init code
   *
   * @param canvas - The canvas element in the browser DOM
   * @param options - Any WebGPU options provided by the user
   * @param shaders_text - The text of each shader used by the program
   * @param max_particles - The max number of particles requested by the user
   * @param particle_stride - The stride of each particle
   * @returns
   */
  static async init(canvas, options = {}, effect) {
    const particle_stride = 48;
    if (!navigator.gpu) {
      throw new Error("WebGPU is not supported in this environment.");
    }
    const adapter = await navigator.gpu.requestAdapter({
      powerPreference: options.powerPreference ?? "high-performance"
    });
    if (!adapter) {
      throw new Error("No GPUAdapter found. WebGPU may not be available.");
    }
    const device = await adapter.requestDevice({
      requiredFeatures: [],
      requiredLimits: {}
    });
    device.lost.then((info) => {
      console.error(
        `GPU device lost: ${info.message} (reason: ${info.reason})`
      );
    });
    const context = canvas.getContext("webgpu");
    if (!context) {
      throw new Error("Failed to get WebGPU canvas context.");
    }
    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
      device,
      format,
      alphaMode: "premultiplied"
    });
    var shaders_text = await this.load_shaders(effect);
    var shaders_compiled = {};
    shaders_compiled["compute"] = device.createShaderModule({
      code: shaders_text["compute"],
      label: "particle_compute_shader"
    });
    await this.log_shader_errors(shaders_compiled["compute"]);
    shaders_compiled["vert"] = device.createShaderModule({
      code: shaders_text["vert"],
      label: "particle_vert_shader"
    });
    await this.log_shader_errors(shaders_compiled["vert"]);
    shaders_compiled["frag"] = device.createShaderModule({
      code: shaders_text["frag"],
      label: "particle_frag_shader"
    });
    await this.log_shader_errors(shaders_compiled["frag"]);
    var buffers = {};
    buffers["uniform_buffer"] = device.createBuffer({
      label: "uniforms",
      size: 56,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    buffers["particle_buffer"] = device.createBuffer({
      label: "particles",
      size: effect.get_max_particles() * particle_stride,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    var compute_pipelines = this.create_compute_pipelines(
      device,
      effect.get_effect_name(),
      shaders_compiled
    );
    var render_pipelines = this.create_render_pipelines(
      device,
      effect.get_effect_name(),
      shaders_compiled
    );
    var bind_groups = this.create_bind_groups(
      device,
      effect.get_effect_name(),
      compute_pipelines,
      render_pipelines,
      buffers
    );
    return new _WebGPUContext(
      adapter,
      device,
      context,
      format,
      effect.get_effect_name(),
      effect.get_shader_params(),
      shaders_compiled,
      buffers,
      compute_pipelines,
      render_pipelines,
      bind_groups
    );
  }
  // -------------------------------------------------------------------------
  // Frame helpers
  // -------------------------------------------------------------------------
  /**
   *
   * Return the current swap-chain texture view to use as the render target.
   *
   * @returns the current swap-chain texture view
   *
   */
  get_current_color_view() {
    return this.context.getCurrentTexture().createView();
  }
  /**
   * Create a basic render pass descriptor pointed at the current
   * swap-chain texture. Extend or replace as needed.
   *
   * @param clearColor - the clear color
   * @returns the GPU Render Pass
   *
   */
  create_render_pass_descriptor(clearColor = { r: 0, g: 0, b: 0, a: 1 }) {
    return {
      colorAttachments: [
        {
          view: this.get_current_color_view(),
          clearValue: clearColor,
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    };
  }
  /**
   * Create a command encoder to encode a list of commands to be consumed by the GPU
   *
   * @returns a command encoder
   */
  begin_frame() {
    return this.device.createCommandEncoder();
  }
  /**
   * Finish the encoder and pass to the device for processing
   *
   * @param encoder - the encoder to close
   */
  end_frame(encoder) {
    this.device.queue.submit([encoder.finish()]);
  }
  // -------------------------------------------------------------------------
  // Resource helpers
  // -------------------------------------------------------------------------
  /**
   * Define everything to be used in the compute pass
   *
   * @param encoder - The encoder that will encode the commands
   * @param uniform_data - The data that will be passed to the copmuter shader
   * @param max_particles - The max number of particles to render
   * @param workgroup_size - The size of each workgroup that the GPU processes
   */
  build_compute_pass(encoder, uniform_data, max_particles, workgroup_size) {
    var compute = encoder.beginComputePass();
    switch (this.shader_set) {
      case "fireworks":
        compute.setPipeline(this.compute_pipelines["rocket_pipeline"]);
        compute.setBindGroup(0, this.bind_groups["rocket_bind_group"]);
        compute.dispatchWorkgroups(Math.ceil(max_particles / workgroup_size));
        compute.setPipeline(this.compute_pipelines["spark_pipeline"]);
        compute.setBindGroup(0, this.bind_groups["spark_bind_group"]);
        compute.dispatchWorkgroups(Math.ceil(max_particles / workgroup_size));
        break;
      default:
        compute.setPipeline(this.compute_pipelines["compute_pipeline"]);
        compute.setBindGroup(0, this.bind_groups["compute_bind_group"]);
        compute.dispatchWorkgroups(Math.ceil(max_particles / workgroup_size));
        break;
    }
    compute.end();
  }
  /**
   *
   * Define everything to be used in the render pass
   *
   * @param encoder - The encoder that will encode the commands
   * @param uniform_data - The data that will be passed to the vertex shader
   * @param max_particles - The max number of particles to render
   */
  build_render_pass(encoder, uniform_data, max_particles) {
    const render = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: this.context.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    });
    render.setPipeline(this.render_pipelines["render_pipeline"]);
    render.setBindGroup(0, this.bind_groups["render_bind_group"]);
    render.draw(6, max_particles);
    render.end();
  }
  /**
   *
   * Write some data the GPU's buffer
   *
   * @param buffer_name - The buffer to write to
   * @param bufferOffset - How much to offset the write command
   * @param data - The data to write to the buffer
   */
  write_buffer(buffer_name, bufferOffset = 0, data) {
    this.device.queue.writeBuffer(
      this.buffers[buffer_name],
      bufferOffset,
      data
    );
  }
  // -------------------------------------------------------------------------
  // Cleanup
  // -------------------------------------------------------------------------
  /** Clean up the WebGPU context when finished */
  destroy() {
    this.context.unconfigure();
    this.device.destroy();
  }
  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------
  /**
   *
   * Dynamically load the particle engine shaders
   *
   * @param name - The name for the shader set
   * @returns the shaders
   */
  static async load_shaders(effect) {
    var comp_s = "";
    var vert_s = "";
    var frag_s = "";
    switch (true) {
      case effect instanceof ScatterFadeEffect:
        comp_s = `scatter_fade_comp`;
        vert_s = `scatter_fade_vert`;
        frag_s = `scatter_fade_frag`;
        break;
      case effect instanceof ScatterSwirlEffect:
        comp_s = `scatter_swirl_comp`;
        vert_s = `scatter_swirl_vert`;
        frag_s = `scatter_swirl_frag`;
        break;
      case effect instanceof FireworksEffect:
        comp_s = `fireworks_comp`;
        vert_s = `fireworks_vert`;
        frag_s = `fireworks_frag`;
        break;
    }
    if (comp_s === "" || vert_s === "" || frag_s === "") {
      throw new Error(`Unknown shader effect passed to WebGPUContext`);
    }
    const comp_key = comp_s;
    const vert_key = vert_s;
    const frag_key = frag_s;
    const compute = shader_registry[comp_key];
    const vert = shader_registry[vert_key];
    const frag = shader_registry[frag_key];
    if (!compute || !vert || !frag) {
      throw new Error(
        `No shaders found for "${name}". Available: ${Object.keys(shader_registry).join(", ")}`
      );
    }
    return { compute, vert, frag };
  }
  /**
   *
   * Create all needed compute pipelines. Different number of pipelines are made
   * depending on the particle affect required.
   *
   * @param device - The device that the piepline is attached to.
   * @param shader_set - The effect that is being created
   * @param shaders_compiled - The shaders associated with the affect
   * @returns - a set of pipelines for the effect
   */
  static create_compute_pipelines(device, shader_set, shaders_compiled) {
    var result = {};
    switch (shader_set) {
      case "fireworks":
        result["rocket_pipeline"] = this.create_compute_pipeline(
          device,
          shaders_compiled,
          "main_rockets",
          "auto",
          "rocket_pipeline"
        );
        result["spark_pipeline"] = this.create_compute_pipeline(
          device,
          shaders_compiled,
          "main_sparks",
          "auto",
          "spark_pipeline"
        );
        break;
      default:
        result["compute_pipeline"] = this.create_compute_pipeline(
          device,
          shaders_compiled,
          "main",
          "auto",
          "compute_pipeline"
        );
        break;
    }
    return result;
  }
  /**
   * 
   * Create the render pipeline for the effect.
   * 
   * @param device - the device the pipeline is attached to.
   * @param shader_set - the Effect that is being created
   * @param shaders_compiled - The shaders associated with the effect
   * @returns - the render pipeline for the effect
   */
  static create_render_pipelines(device, shader_set, shaders_compiled) {
    var result = {};
    switch (shader_set) {
      default:
        result["render_pipeline"] = this.create_render_pipeline(
          device,
          shaders_compiled
        );
        break;
    }
    return result;
  }
  /**
   * Creat the bind groups for the effect.
   * 
   * @param device - The device that the bind groups attach to.
   * @param shader_set- The effect that is being created.
   * @param compute_pipelines - The compute pipelin(s) for the effect.
   * @param render_pipelines - The render pipeline.
   * @param buffers - The buffers for the effect.
   * @returns a set of bind groups
   */
  static create_bind_groups(device, shader_set, compute_pipelines, render_pipelines, buffers) {
    var result = {};
    switch (shader_set) {
      case "fireworks":
        result["rocket_bind_group"] = device.createBindGroup({
          layout: compute_pipelines["rocket_pipeline"].getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: buffers["uniform_buffer"] } },
            { binding: 1, resource: { buffer: buffers["particle_buffer"] } }
          ]
        });
        result["spark_bind_group"] = device.createBindGroup({
          layout: compute_pipelines["spark_pipeline"].getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: buffers["uniform_buffer"] } },
            { binding: 1, resource: { buffer: buffers["particle_buffer"] } }
          ]
        });
        result["render_bind_group"] = device.createBindGroup({
          layout: render_pipelines["render_pipeline"].getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: buffers["uniform_buffer"] } },
            { binding: 1, resource: { buffer: buffers["particle_buffer"] } }
          ]
        });
        break;
      default:
        result["compute_bind_group"] = device.createBindGroup({
          layout: compute_pipelines["compute_pipeline"].getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: buffers["uniform_buffer"] } },
            { binding: 1, resource: { buffer: buffers["particle_buffer"] } }
          ]
        });
        result["render_bind_group"] = device.createBindGroup({
          layout: render_pipelines["render_pipeline"].getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: buffers["uniform_buffer"] } },
            { binding: 1, resource: { buffer: buffers["particle_buffer"] } }
          ]
        });
    }
    return result;
  }
  /**
   * Create the compute pipeline
   *
   * @param device - The device the pipeline will run on
   * @param shaders - The shaders the pipeline will use
   * @param entryPoint - The shader entrypoint
   * @param layout - The GPUPipelineLayout
   * @param label - The name for the pipeline
   * @returns the compute pipeline
   */
  static create_compute_pipeline(device, shaders, entryPoint, layout = "auto", label) {
    if (!shaders["compute"]) {
      throw new Error("No compute shader defined.");
    }
    return device.createComputePipeline({
      label,
      layout,
      compute: { module: shaders["compute"], entryPoint }
    });
  }
  /**
   *
   * Create the render pipeline
   *
   * @param device - The device the pipeline will run on
   * @param shaders - The shaders the pipeline will use
   * @returns the render pipeline
   */
  static create_render_pipeline(device, shaders) {
    return device.createRenderPipeline({
      vertex: {
        module: shaders["vert"],
        entryPoint: "vs_main"
      },
      fragment: {
        module: shaders["frag"],
        entryPoint: "fs_main",
        targets: [
          {
            format: navigator.gpu.getPreferredCanvasFormat(),
            blend: {
              color: {
                srcFactor: "src-alpha",
                dstFactor: "one-minus-src-alpha",
                operation: "add"
              },
              alpha: {
                srcFactor: "one",
                dstFactor: "one-minus-src-alpha",
                operation: "add"
              }
            }
          }
        ]
      },
      primitive: {
        topology: "triangle-list"
      },
      layout: "auto"
    });
  }
  /**
   * Log any errors reported during shader creation
   *
   * @param shader - The shader to do error reporting for
   */
  static async log_shader_errors(shader) {
    const info = await shader.getCompilationInfo();
    for (const msg of info.messages) {
      if (msg.type === "error") {
        console.error(`shader error: ${msg.message} (line ${msg.lineNum})`);
      }
    }
  }
};

// src/public/ParticleEngine.ts
var ParticleEngine = class _ParticleEngine {
  // #region --- The class properties ------------------------------------------
  WORKGROUP_SIZE = 64;
  emitter;
  effect;
  canvas;
  ctx;
  particle_type;
  last_time = performance.now();
  // #endregion ----------------------------------------------------------------
  /**
   *
   * Construct a new particle engine instance.
   * Called by the static init function to enable the async nature of the
   * generation of WebGPU contexts
   *
   * @param ctx - the WebGPUContext created in the init function
   * @param max_particles - the max number of particles requested by the user
   * @param particle_stride - The size of each particle in GPU memory
   */
  constructor(canvas, ctx, effect, emitter_config) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.emitter = this.generate_emitter(emitter_config);
    this.effect = effect;
    this.particle_type = 2 /* Square */;
    this.last_time = performance.now();
  }
  /**
   *
   * Start the animation of the particles
   *
   */
  start() {
    requestAnimationFrame(this.animate_particles);
  }
  /**
   * 
   * Handle each frame of animation tick.
   * Passed to requestAnimationFrame to drive the particle simulation loop.
   * Note use of arrow notation. This keeps this in scope at all times.
   *
   */
  animate_particles = () => {
    const now = performance.now();
    const delta_time = (now - this.last_time) / 1e3;
    this.last_time = now;
    const emitter_data = this.generate_emitter_data();
    const shader_params = this.effect.get_shader_params();
    const uniform_data = new Float32Array([
      delta_time,
      now / 1e3,
      this.canvas.width,
      this.canvas.height,
      emitter_data[0],
      emitter_data[1],
      emitter_data[2],
      emitter_data[3],
      emitter_data[4],
      shader_params.sp0,
      shader_params.sp1,
      shader_params.sp2,
      shader_params.sp3,
      shader_params.sp4
    ]);
    this.ctx.write_buffer("uniform_buffer", 0, uniform_data);
    const encoder = this.ctx.begin_frame();
    this.ctx.build_compute_pass(
      encoder,
      uniform_data,
      this.effect.get_max_particles(),
      this.WORKGROUP_SIZE
    );
    this.ctx.build_render_pass(
      encoder,
      uniform_data,
      this.effect.get_max_particles()
    );
    this.ctx.end_frame(encoder);
    requestAnimationFrame(this.animate_particles);
  };
  /**
   *
   * Check that the context is operating as expected by turning the canvaas red.
   *
   */
  context_check() {
    const encoder = this.ctx.begin_frame();
    const pass = encoder.beginRenderPass(
      this.ctx.create_render_pass_descriptor({ r: 1, g: 0, b: 0, a: 1 })
    );
    pass.end();
    this.ctx.end_frame(encoder);
  }
  /**
   * Update the canvas on resize.
   * 
   * @param canvas 
   */
  resize(canvas) {
    this.canvas = canvas;
  }
  /**
   *
   * Generate all the raw particle data and write to the GPU Buffer
   *
  * @param particles - the particles to be buffered 
  */
  buffer_particles(particles) {
    const data = new Float32Array(this.effect.get_max_particles() * 12);
    for (let i = 0; i < this.effect.get_max_particles(); i++) {
      const offset = i * 12;
      let x, y;
      switch (this.emitter.type) {
        case "point":
          x = this.emitter.pos[0];
          y = this.emitter.pos[1];
          break;
        case "circle":
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.sqrt(Math.random()) * (this.emitter.p1 ?? 0);
          x = this.emitter.pos[0] + Math.cos(angle) * radius;
          y = this.emitter.pos[1] + Math.sin(angle) * radius;
          break;
        case "rect":
          x = this.emitter.pos[0] + (Math.random() - 0.5) * (this.emitter.p1 ?? 1);
          y = this.emitter.pos[1] + (Math.random() - 0.5) * (this.emitter.p2 ?? 0);
          break;
        default:
          x = 0;
          y = 0;
      }
      data[offset + 0] = x;
      data[offset + 1] = y;
      data[offset + 2] = (Math.random() - 0.5) * 400;
      data[offset + 3] = Math.random() * 300 + 0.2;
      data[offset + 4] = Math.random();
      data[offset + 5] = Math.random();
      data[offset + 6] = Math.random();
      data[offset + 7] = 1;
      data[offset + 8] = 0;
      data[offset + 9] = Math.random();
      data[offset + 10] = 1;
      data[offset + 11] = Math.random() * 8 + 4;
    }
    this.ctx.write_buffer("particle_buffer", 0, data);
  }
  /**
   *
   * Creates an emitter of a given shape for a given canvas.
   *
   * @param emitter_shape the shape of the emitter
   * @param canvas the canvas the emitter will use
   * @returns an emitter for particle drawing
   */
  generate_emitter(emitter_config) {
    return {
      type: emitter_config.emitter_type,
      pos: emitter_config.emitter_pos,
      p1: emitter_config.emitter_p1 ?? 50,
      p2: emitter_config.emitter_p2 ?? 50
    };
  }
  /**
   *
   * Convert the emitter object to a data format that can be ingested by the WebGPU Uniform Buffer.
   *
   * @returns the generated Emitter data ready to be passed into the WebGPU buffer
   *
   */
  generate_emitter_data() {
    switch (this.emitter.type) {
      case "point":
        return new Float32Array([
          this.emitter.pos[0],
          // x
          this.emitter.pos[1],
          // y
          0,
          // Emitter type
          0,
          // Not used by a point emitter
          0
          // Not used by a point emitter
        ]);
      case "circle":
        return new Float32Array([
          this.emitter.pos[0],
          // x position
          this.emitter.pos[1],
          // y position
          1,
          // Emitter type
          this.emitter.p1,
          // Circle emitter radius
          0
          // Not used by a circle emitter
        ]);
      case "rect":
        return new Float32Array([
          this.emitter.pos[0],
          // x
          this.emitter.pos[1],
          // y
          2,
          // Emitter type
          this.emitter.p1,
          // Emitter width
          this.emitter.p2
          // Emitter height
        ]);
      default:
        return new Float32Array([
          this.emitter.pos[0],
          // x
          this.emitter.pos[1],
          // y
          0,
          // Emitter type
          this.emitter.p1,
          // Emitter width
          this.emitter.p2
          // Emitter height
        ]);
    }
  }
  /**
   *
   * Initilize the particle engine in preparation of use
   *
   * @param canvas - the canvas element to tie the particles to.
   * @param max_particles - the number of particles to render.
   * @param emitter_shape - The shape that the particles are emmited as.
   * @param shader_set - the set of shaders to use.
   * @param options - any special options.
   * @returns - The created ParticleEngine
   */
  static async init(canvas, effect, emitter_config, options = {}) {
    var valid_result = effect.validate();
    if (!valid_result.valid) throw new Error(valid_result.message);
    valid_result = emitter_config.validate();
    if (!valid_result.valid) throw new Error(valid_result.message);
    const tmp_ctx = await WebGPUContext.init(canvas, options, effect);
    const result = new _ParticleEngine(
      canvas,
      tmp_ctx,
      effect,
      emitter_config
    );
    var particles = effect.seed_particles();
    result.buffer_particles(particles);
    return result;
  }
  /*
   static normalize_shader_config(
     shader_set: string,
     shader_config: Record<string, string>,
   ): Record<string, string> {
     switch (shader_set) {
       case "scatter-fade":
         if (shader_config["max-particles"] === undefined)
           shader_config["max-particles"] = "500";
         if (shader_config["emitter-shape"] === undefined)
           shader_config["emitter-shape"] = "Rectangle";
         break;
       case "scatter-swirl":
         if (shader_config["max-particles"] === undefined)
           shader_config["max-particles"] = "500";
         if (shader_config["emitter-shape"] === undefined)
           shader_config["emitter-shape"] = "Rectangle";
         break;
       case "fireworks":
         if (shader_config["max-particles"] === undefined)
           shader_config["max-particles"] = "500";
         if (shader_config["rocket-count"] === undefined)
           shader_config["rocket-count"] = "5";
         shader_config["emitter-shape"] = "Rectangle";
         break;
       default:
         throw new Error("Unknown shader-set type");
         break;
     }
     return shader_config;
   }*/
};

// src/public/EmitterConfig.ts
var EmitterConfig = class _EmitterConfig {
  // #region --- The class properties -----------------------------------------
  emitter_type;
  emitter_pos;
  emitter_p1;
  emitter_p2;
  static rules = [
    {
      check: (e) => e.emitter_type !== "Rect" && e.emitter_type !== "Circle" && e.emitter_type !== "Point",
      message: "Emitter type must be Rectangle, Circle or Point"
    }
  ];
  // #endregion ---------------------------------------------------------------
  /**
   * The class constructor. Takes the user definable properties and returns an instance of the class
   * 
   * @param emitter_type - the type of the emitter
   * @param emitter_pos - the position of the emitter
   * @param emitter_p1 - Custom variable 1 for the emitter. Purpose depends on the shape.
   * @param emitter_p2 - Custom variable 2 for the emitter. Purpose depends on the shape.
   */
  constructor(emitter_type, emitter_pos, emitter_p1, emitter_p2) {
    this.emitter_type = emitter_type;
    this.emitter_pos = emitter_pos;
    this.emitter_p1 = emitter_p1;
    this.emitter_p2 = emitter_p2;
  }
  /**
   * Validate the object properties
   * 
   * @returns 
   */
  validate() {
    return validate(this, _EmitterConfig.rules);
  }
};

// src/index.ts
function hello_particles() {
  return "particles ready changed \u{1F386}";
}
function init(canvas, particle_effect, emitter_config) {
  return ParticleEngine.init(canvas, particle_effect, emitter_config);
}
export {
  EmitterConfig,
  FireworksEffect,
  ParticleEngine,
  ParticleType,
  ScatterFadeEffect,
  ScatterSwirlEffect,
  hello_particles,
  init
};
