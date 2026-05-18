/**
 * A class representing the values needed to create an emitter.
 */
export declare class EmitterConfig {
    emitter_type: string;
    emitter_pos: [number, number];
    emitter_p1: number | null;
    emitter_p2: number | null;
    private static rules;
    /**
     * The class constructor. Takes the user definable properties and returns an instance of the class
     *
     * @param emitter_type - the type of the emitter
     * @param emitter_pos - the position of the emitter
     * @param emitter_p1 - Custom variable 1 for the emitter. Purpose depends on the shape.
     * @param emitter_p2 - Custom variable 2 for the emitter. Purpose depends on the shape.
     */
    constructor(emitter_type: string, emitter_pos: [number, number], emitter_p1: number | null, emitter_p2: number | null);
    /**
     * Validate the object properties
     *
     * @returns
     */
    validate(): ValidationResult;
}
