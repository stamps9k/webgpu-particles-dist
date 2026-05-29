import { ParticleEffect } from "../../public/effects/ParticleEffect";
import { EffectRenderer } from "./EffectRenderer";
import { EmitterConfig } from "../../public/EmitterConfig";
export declare class EffectRendererFactory {
    static initialize(effect: ParticleEffect, emitter_config: EmitterConfig, device: GPUDevice, uniform_buffers: Record<string, GPUBuffer>): Promise<EffectRenderer>;
}
