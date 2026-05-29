import { ValidationRule } from "./types/ValidationRule";
import { EmitterShape } from "./enums/EmitterShapes";
/**
 * A class representing the values needed to create an emitter.
 */
export declare class EmitterConfigPatch {
    shape: EmitterShape | null;
    pos: [number | null, number | null] | null;
    p1: number | null;
    p2: number | null;
    protected static rules: ValidationRule<EmitterConfigPatch>[];
    /**
     * An empty class constructor. Assigns all patch values to null
     */
    constructor();
    constructor(shape: EmitterShape | null, pos: [number | null, number | null] | null, p1: number | null, p2: number | null);
    /**
     * Validate the object properties
     *
     * @returns
     */
    validate(): ValidationResult;
}
