import { ParticleEffect } from "./ParticleEffect";
import { Particle } from "../Particle";
import { ShaderParams } from "../ShaderParams";
/**
 *
 * A class Representing the fireworks particle effect
 *
 */
export declare class BoidsEffect implements ParticleEffect {
    readonly kind: "BOIDS";
    private MAX_PARTICLES;
    private PERCEPTION_RADIUS;
    private SEPERATION_RADIUS;
    private SEPERATION_WEIGHT;
    private ALIGNMENT_WEIGHT;
    private COHESION_WEIGHT;
    private MAX_SPEED;
    private MAX_FORCE;
    private ping_pong;
    private frame_index;
    private static rules;
    /**
     * The class constructor. Takes the user definable properties and returns an instance of the class
     *
     * @param max_particles - The max number of particles for the effect
     * @param rocket_number - The max number of rockets for the effect
     */
    constructor(max_particles: number, perception_radius: number, seperation_radius: number, seperation_weight: number, alignment_weight: number, cohesion_weight: number, max_speed: number, max_force: number);
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
    get_frame_index(): number;
    increment_frame_index(): void;
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
