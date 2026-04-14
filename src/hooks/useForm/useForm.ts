import React, { useState } from "react";

type FieldValue = string | boolean | string[];

interface Rules {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: FieldValue) => string | undefined;
}

interface RegisterReturn {
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const useForm = () => {
    const [values, setValues] = useState<Record<string, FieldValue>>({});
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});
    const [fieldRules, setFieldRules] = useState<Record<string, Rules>>({});

    const register = (name: string, rules: Rules = {}): RegisterReturn => {
        setFieldRules((prev: Record<string, Rules>) => ({ ...prev, [name]: rules }));

        return {
            name,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                let value: FieldValue;

                if (e.target.type === "checkbox") {
                    value = (e.target as HTMLInputElement).checked;
                } else if (e.target.tagName === "SELECT" && (e.target as HTMLSelectElement).multiple) {
                    value = Array.from((e.target as HTMLSelectElement).selectedOptions, opt => opt.value);
                } else {
                    value = e.target.value;
                }

                setValues((prev: Record<string, FieldValue>) => ({ ...prev, [name]: value }));
                let error: string | undefined = undefined;
                for (const rule in rules) {
                    if (rule === "required" && rules.required && !value) {
                        error = "This field is required";
                        break;
                    }
                    if (rule === "minLength" && typeof value === "string" && value.length < rules.minLength!) {
                        error = `Minimum length is ${rules.minLength}`;
                        break;
                    }
                    if (rule === "maxLength" && typeof value === "string" && value.length > rules.maxLength!) {
                        error = `Maximum length is ${rules.maxLength}`;
                        break;
                    }
                    if (rule === "pattern" && typeof value === "string" && !rules.pattern!.test(value)) {
                        error = "Invalid format";
                        break;
                    }
                    if (rule === "custom" && typeof rules.custom === "function") {
                        const result = rules.custom(value);
                        if (result) {
                            error = result;
                            break;
                        }
                    }
                }

                setErrors((prev: Record<string, string | undefined>) => ({ ...prev, [name]: error }));
            }
        };
    };

    const handleSubmit = (callback: (values: Record<string, FieldValue>) => void) => (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const newErrors: Record<string, string> = {};
        for (const field in fieldRules) {
            const value: FieldValue = values[field] ?? "";
            const rules = fieldRules[field];
            let error: string | undefined = undefined;

            for (const rule in rules) {
                if (rule === "required" && rules.required && !value) {
                    error = "This field is required";
                    break;
                }
                if (rule === "minLength" && typeof value === "string" && value.length < rules.minLength!) {
                    error = `Minimum length is ${rules.minLength}`;
                    break;
                }
                if (rule === "maxLength" && typeof value === "string" && value.length > rules.maxLength!) {
                    error = `Maximum length is ${rules.maxLength}`;
                    break;
                }
                if (rule === "pattern" && typeof value === "string" && !rules.pattern!.test(value)) {
                    error = "Invalid format";
                    break;
                }
                if (rule === "custom" && typeof rules.custom === "function") {
                    const result = rules.custom(value);
                    if (result) {
                        error = result;
                        break;
                    }
                }
            }

            if (error) newErrors[field] = error;
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            callback(values);
        }
    };

    const watch = (name: string): FieldValue | undefined => values[name];

    const reset = (): void => {
        setValues({});
        setErrors({});
        setFieldRules({});
    };

    const getValues = (): Record<string, FieldValue> => ({ ...values });

    const clearErrors = (fields?: string[]): void => {
        if (!fields) {
            setErrors({});
        } else {
            setErrors((prev: Record<string, string | undefined>) => {
                const updated = { ...prev };
                fields.forEach(f => delete updated[f]);
                return updated;
            });
        }
    };

    const formState = { errors };

    return {
        register,
        handleSubmit,
        watch,
        reset,
        getValues,
        clearErrors,
        formState
    };
};

export default useForm;