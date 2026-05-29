import { EmitterConfigPatch } from "./EmitterConfigPatch";
import { EmitterShape } from "./enums/EmitterShapes";
import { ValidationRule } from "./types/ValidationRule";
/**
 * A class representing the values needed to create an emitter.
 */
export declare class EmitterConfig extends EmitterConfigPatch {
    shape: EmitterShape;
    pos: [number, number];
    protected static rules: ValidationRule<EmitterConfigPatch>[];
    /**
     * The class constructor. Takes the user definable properties and returns an instance of the class
     *
     * @param emitter_type - the type of the emitter
     * @param emitter_pos - the position of the emitter
     * @param emitter_p1 - Custom variable 1 for the emitter. Purpose depends on the shape.
     * @param emitter_p2 - Custom variable 2 for the emitter. Purpose depends on the shape.
     */
    constructor(shape: EmitterShape, pos: [number, number], p1: number | null, p2: number | null);
    /**
     * Validate the object properties
     *
     * @returns
     */
    validate(): ValidationResult;
}
