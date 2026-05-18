import { ParticleEffect } from "./ParticleEffect";
import { Particle } from "../Particle";
import { ShaderParams } from "../ShaderParams";
export declare class ScatterSwirlEffect implements ParticleEffect {
    private MAX_PARTICLES;
    private SPIN_STRENGTH;
    private PULL_STRENGTH;
    private static rules;
    constructor(max_particles: number);
    seed_particles(): Particle[];
    get_shader_params(): ShaderParams;
    get_max_particles(): number;
    get_effect_name(): string;
    validate(): ValidationResult;
}
