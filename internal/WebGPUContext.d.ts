import { ParticleEffect } from "../public/effects/ParticleEffect";
import { ShaderParams } from "../public/ShaderParams";
/** Custom options that the I may want to use */
export interface WebGPUContextOptions {
    powerPreference?: GPUPowerPreference;
    antialias?: boolean;
}
/** Manages the various items required by the WebGPU API */
export declare class WebGPUContext {
    readonly adapter: GPUAdapter;
    readonly device: GPUDevice;
    readonly context: GPUCanvasContext;
    readonly format: GPUTextureFormat;
    readonly shader_set: string;
    readonly shader_config: ShaderParams;
    readonly shaders: Record<string, GPUShaderModule>;
    readonly compute_pipelines: Record<string, GPUComputePipeline>;
    readonly render_pipelines: Record<string, GPURenderPipeline>;
    readonly bind_groups: Record<string, GPUBindGroup>;
    private buffers;
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
    private constructor();
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
    static init(canvas: HTMLCanvasElement, options: WebGPUContextOptions | undefined, effect: ParticleEffect): Promise<WebGPUContext>;
    /**
     *
     * Return the current swap-chain texture view to use as the render target.
     *
     * @returns the current swap-chain texture view
     *
     */
    get_current_color_view(): GPUTextureView;
    /**
     * Create a basic render pass descriptor pointed at the current
     * swap-chain texture. Extend or replace as needed.
     *
     * @param clearColor - the clear color
     * @returns the GPU Render Pass
     *
     */
    create_render_pass_descriptor(clearColor?: GPUColor): GPURenderPassDescriptor;
    /**
     * Create a command encoder to encode a list of commands to be consumed by the GPU
     *
     * @returns a command encoder
     */
    begin_frame(): GPUCommandEncoder;
    /**
     * Finish the encoder and pass to the device for processing
     *
     * @param encoder - the encoder to close
     */
    end_frame(encoder: GPUCommandEncoder): void;
    /**
     * Define everything to be used in the compute pass
     *
     * @param encoder - The encoder that will encode the commands
     * @param uniform_data - The data that will be passed to the copmuter shader
     * @param max_particles - The max number of particles to render
     * @param workgroup_size - The size of each workgroup that the GPU processes
     */
    build_compute_pass(encoder: GPUCommandEncoder, uniform_data: Float32Array, max_particles: number, workgroup_size: number): void;
    /**
     *
     * Define everything to be used in the render pass
     *
     * @param encoder - The encoder that will encode the commands
     * @param uniform_data - The data that will be passed to the vertex shader
     * @param max_particles - The max number of particles to render
     */
    build_render_pass(encoder: GPUCommandEncoder, uniform_data: Float32Array, max_particles: number): void;
    /**
     *
     * Write some data the GPU's buffer
     *
     * @param buffer_name - The buffer to write to
     * @param bufferOffset - How much to offset the write command
     * @param data - The data to write to the buffer
     */
    write_buffer(buffer_name: string, bufferOffset: number | undefined, data: BufferSource): void;
    /** Clean up the WebGPU context when finished */
    destroy(): void;
    /**
     *
     * Dynamically load the particle engine shaders
     *
     * @param name - The name for the shader set
     * @returns the shaders
     */
    private static load_shaders;
    /**
     *
     * Create all needed compute pipelines. Different number of pipelines are made
     * depending on the particle affect required.
     *
     * @param device - The device that the piepline
     * @param shader_set - The effect that is being created
     * @param shaders_compiled - The shaders associated with the affect
     * @returns - a set of pipelines for the effect
     */
    private static create_compute_pipelines;
    private static create_render_pipelines;
    private static create_bind_groups;
    /**
     * Create the compute pipeline
     *
     * @param device - The device the pipeline will run on
     * @param shaders - The shaders the pipeline will use
     * @param entryPoint - The shader entrypoint
     * @param layout - The GPUPipelineLayout
     * @param label - The name for the pipeline
     * @returns the copmute pipeline
     */
    private static create_compute_pipeline;
    /**
     *
     * Create the render pipeline
     *
     * @param device - The device the pipeline will run on
     * @param shaders - The shaders the pipeline will use
     * @returns the render pipeline
     */
    private static create_render_pipeline;
    /**
     * Log any errors reported during shader creation
     *
     * @param shader - The shader to do error reporting for
     */
    private static log_shader_errors;
}
