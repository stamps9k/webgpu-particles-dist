import { ParticleEffect } from "./ParticleEffect";
import { Particle } from "../Particle";
import { ShaderParams } from "../ShaderParams";
/**
 *
 * A class Representing the fireworks particle effect
 *
 */
export declare class FireworksEffect implements ParticleEffect {
    readonly kind: "FIREWORKS";
    private MAX_PARTICLES;
    private LAUNCH_SPEED;
    private SPARK_SPEED;
    private ROCKET_COUNT;
    private ping_pong;
    private static rules;
    /**
     * The class constructor. Takes the user definable properties and returns an instance of the class
     *
     * @param max_particles - The max number of particles for the effect
     * @param rocket_number - The max number of rockets for the effect
     */
    constructor(max_particles: number, rocket_number: number);
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
     * Check if the effect uses ping pong buffering or not. This is used by the engine to determine how to buffer the particles on the gpu.
     * @returns - a boolean representing whether the effect uses ping pong buffering or not.
     */
    is_ping_pong(): boolean;
    /**
     * Validate the object properties
     *
     * @returns
     */
    validate(): ValidationResult;
}
