import { ParticleEffect } from "./ParticleEffect";
import { Particle } from "../Particle";
import { ShaderParams } from "../ShaderParams";
/**
 *
 * A class Representing the ScatterSwirl particle effect
 *
 */
export declare class ScatterSwirlEffect implements ParticleEffect {
    private MAX_PARTICLES;
    private SPIN_STRENGTH;
    private PULL_STRENGTH;
    private static rules;
    /**
     * The class constructor. Takes the user definable properties and returns an instance of the class
     *
     * @param max_particles - The max number of particles for the effect
     */
    constructor(max_particles: number);
    /**
     * Generate all the particles for the intial buffering of the cpu.
     *
     * @returns - An array of particles with random initial values
     *
     */
    seed_particles(): Particle[];
    /**
     * Get the various custom shader particle parameters
     *
     * @returns an object representing the custom shader params.
     */
    get_shader_params(): ShaderParams;
    /**
     * Getter for the max_particles property.
     *
     * @returns - the maximum number of particles for the effect.
     */
    get_max_particles(): number;
    /**
     * Fetch the name of the effect as a string
     *
     */
    get_effect_name(): string;
    /**
     * Validate the object properties
     *
     * @returns
     */
    validate(): ValidationResult;
}
