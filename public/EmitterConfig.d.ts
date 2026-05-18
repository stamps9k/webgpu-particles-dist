export declare class EmitterConfig {
    emitter_type: string;
    emitter_pos: [number, number];
    emitter_p1: number | null;
    emitter_p2: number | null;
    private static rules;
    constructor(emitter_type: string, emitter_pos: [number, number], emitter_p1: number | null, emitter_p2: number | null);
    validate(): ValidationResult;
}
