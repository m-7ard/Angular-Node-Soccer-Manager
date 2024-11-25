import { FormControl } from "@angular/forms";

type RawFormValues<T> = {
    [K in keyof T]: T[K] extends FormControl<infer V> ? V : never;
};

export default RawFormValues;