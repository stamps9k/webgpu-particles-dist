import { UniformValues } from "./UniformValues";
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
    private uniform_buffers;
    private last_time;
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
    static init(canvas: HTMLCanvasElement, options?: WebGPUContextOptions): Promise<WebGPUContext>;
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
     *
     * Write some data the GPU's buffer
     *
     * @param buffer_name - The buffer to write to
     * @param bufferOffset - How much to offset the write command
     * @param data - The data to write to the buffer
     */
    write_buffer(canvas: HTMLCanvasElement, uniform_values: UniformValues): void;
    get_uniform_buffers: () => Record<string, GPUBuffer>;
    /** Clean up the WebGPU context when finished */
    destroy(): void;
}
