type ValidationRule<T> = {
    check: (value: T) => boolean;
    message: string;
};
declare function validate<T>(value: T, rules: ValidationRule<T>[]): ValidationResult;
