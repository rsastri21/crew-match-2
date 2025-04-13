import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z, ZodSchema } from "zod";
import { useDebounce } from "./use-debounce";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type UsePersistFormOptions<FormData extends ZodSchema<any>, ExtraState> = {
    schema: FormData;
    storageKey: string;
    defaultValues: z.infer<FormData>;
    defaultExtraState?: ExtraState;
};

type UsePersistFormReturn<FormData extends ZodSchema<any>, ExtraState> = {
    form: UseFormReturn<z.infer<FormData>>;
    lastPersistedTimestamp: number | undefined;
    extraState: ExtraState;
    setExtraState: Dispatch<SetStateAction<ExtraState>>;
    clearLocalState: () => void;
};

type PersistedValues<FormData extends ZodSchema<any>, ExtraState> = {
    formValues: z.infer<FormData>;
    lastPersistedTimestamp: number;
    extraState?: ExtraState;
};

export function usePersistForm<FormData extends ZodSchema<any>, ExtraState>({
    schema,
    storageKey,
    defaultValues,
    defaultExtraState,
}: UsePersistFormOptions<FormData, ExtraState>): UsePersistFormReturn<
    FormData,
    ExtraState
> {
    const [lastPersistedTimestamp, setLastPersistedTimestamp] =
        useState<number>();
    const [extraState, setExtraState] = useState<ExtraState>(
        defaultExtraState ?? ({} as ExtraState)
    );

    const clearLocalState = () => {
        localStorage.removeItem(storageKey);
    };

    const persistedData = ((): PersistedValues<FormData, ExtraState> | null => {
        try {
            const persistedString = localStorage.getItem(storageKey);

            if (!persistedString) {
                return null;
            }

            const parsed: PersistedValues<FormData, ExtraState> =
                JSON.parse(persistedString);
            // Discard values if older than two days
            if (
                parsed.lastPersistedTimestamp &&
                Date.now() - parsed.lastPersistedTimestamp >
                    2 * 24 * 60 * 60 * 1000
            ) {
                return null;
            }

            return {
                lastPersistedTimestamp: parsed.lastPersistedTimestamp,
                formValues: parsed.formValues,
                extraState: parsed.extraState,
            };
        } catch {
            return null;
        }
    })();

    const form = useForm<z.infer<FormData>>({
        resolver: zodResolver(schema),
        defaultValues: persistedData?.formValues || defaultValues,
    });

    const watchedValues = form.watch();
    const debouncedValues = useDebounce(watchedValues);

    useEffect(() => {
        if (persistedData?.extraState) {
            setExtraState(persistedData.extraState);
        }
        if (persistedData?.lastPersistedTimestamp) {
            setLastPersistedTimestamp(persistedData.lastPersistedTimestamp);
        }
    }, []);

    useEffect(() => {
        const lastUpdated = Date.now();
        const persistedValues: PersistedValues<FormData, ExtraState> = {
            formValues: debouncedValues,
            lastPersistedTimestamp: lastUpdated,
            extraState,
        };
        localStorage.setItem(storageKey, JSON.stringify(persistedValues));
        setLastPersistedTimestamp(lastUpdated);
    }, [debouncedValues, extraState, storageKey]);

    return {
        form,
        lastPersistedTimestamp,
        extraState,
        setExtraState,
        clearLocalState,
    };
}
