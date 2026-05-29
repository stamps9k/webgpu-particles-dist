import { WebGPUContextOptions } from "../internal/WebGPUContext";
import { ParticleEffect } from "./effects/ParticleEffect";
import { EmitterConfig } from "./EmitterConfig";
import { EmitterConfigPatch } from "./EmitterConfigPatch";
/** Manages the WebGPU particle simulation lifecycle */
export declare class ParticleEngine {
    private canvas;
    private ctx;
    private uniform_values;
    private renderer;
    private last_time;
    private paused;
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
    pause(): void;
    resume(): void;
    /**
     * Update the UniformValues with new emitter values
     *
     * @param emitter_config - The new emitter values to be used
     *
     */
    update_emitter(emitter_config: EmitterConfigPatch): void;
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
    /**
     * Update the canvas on resize.
     *
     * @param canvas
     */
    resize(canvas: HTMLCanvasElement): void;
    private generate_uniform_values;
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
}
