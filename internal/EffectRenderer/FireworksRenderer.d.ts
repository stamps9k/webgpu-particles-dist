import { EffectRenderer } from "./EffectRenderer";
import { FireworksEffect } from "../../public/effects/FireworksEffect";
import { EmitterConfig } from "../../public/EmitterConfig";
export declare class FireworksRenderer implements EffectRenderer {
    private compute_pipelines;
    private render_pipelines;
    private buffers;
    private bindgroups;
    private shaders;
    private max_particles;
    private particle_stride;
    private workgroup_size;
    constructor(effect: FireworksEffect);
    static initialize(effect: FireworksEffect): FireworksRenderer;
    create_shaders(device: GPUDevice): Promise<void>;
    create_buffers(device: GPUDevice): void;
    create_compute_pipelines(device: GPUDevice): void;
    create_render_pipelines(device: GPUDevice): void;
    create_bindgroups(device: GPUDevice, uniform_buffers: Record<string, GPUBuffer>): void;
    write_particles_to_buffer(device: GPUDevice, emitter_config: EmitterConfig): void;
    destroy(): void;
    encode_compute_pass(encoder: GPUCommandEncoder): void;
    encode_render_pass(encoder: GPUCommandEncoder, view: GPUTextureView): void;
    /**
     *
     * Dynamically load the particle engine shaders
     *
     * @param name - The name for the shader set
     * @returns the shaders
     */
    private load_shaders;
    /**
     * Log any errors reported during shader creation
     *
     * @param shader - The shader to do error reporting for
     */
    private log_shader_errors;
}
