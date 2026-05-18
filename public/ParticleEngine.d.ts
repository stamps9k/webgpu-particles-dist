import { WebGPUContextOptions } from "../internal/WebGPUContext";
import { ParticleEffect } from "./effects/ParticleEffect";
import { EmitterConfig } from "./EmitterConfig";
/** Manages the WebGPU particle simulation lifecycle */
export declare class ParticleEngine {
    private WORKGROUP_SIZE;
    private emitter;
    private effect;
    private canvas;
    private ctx;
    private particle_type;
    private last_time;
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
    private constructor();
    /**
     *
     * Start the animation of the particles
     *
     */
    start(): void;
    /**
     *
     * Handle each frame of animation tick.
     * Passed to requestAnimationFrame to drive the particle simulation loop.
     * Note use of arrow notation. This keeps this in scope at all times.
     *
     */
    animate_particles: () => void;
    /**
     *
     * Check that the context is operating as expected by turning the canvaas red.
     *
     */
    context_check(): void;
    resize(canvas: HTMLCanvasElement): void;
    /**
     *
     * Generate all the raw particle data for the initial set of particles
     *
     */
    private buffer_particles;
    /**
     *
     * Creates an emitter of a given shape for a given canvas.
     *
     * @param emitter_shape the shape of the emitter
     * @param canvas the canvas the emitter will use
     * @returns an emitter for particle drawing
     */
    private generate_emitter;
    /**
     *
     * Convert the emitter object to a data format that can be ingested by the WebGPU Uniform Buffer.
     *
     * @returns the generated Emitter data ready to be passed into the WebGPU buffer
     *
     */
    private generate_emitter_data;
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
    static init(canvas: HTMLCanvasElement, effect: ParticleEffect, emitter_config: EmitterConfig, options?: WebGPUContextOptions): Promise<ParticleEngine>;
    static normalize_shader_config(shader_set: string, shader_config: Record<string, string>): Record<string, string>;
}
