import { ParticleEffect } from "./ParticleEffect";
import { Particle } from "../Particle";
import { ShaderParams } from "../ShaderParams";
export declare class FireworksEffect implements ParticleEffect {
    private MAX_PARTICLES;
    private LAUNCH_SPEED;
    private SPARK_SPEED;
    private ROCKET_COUNT;
    private static rules;
    constructor(max_particles: number, rocket_number: number);
    seed_particles(): Particle[];
    get_shader_params(): ShaderParams;
    get_max_particles(): number;
    get_effect_name(): string;
    validate(): ValidationResult;
}
