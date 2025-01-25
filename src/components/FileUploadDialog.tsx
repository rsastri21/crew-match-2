import { useState } from "react";
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import {
    CANDIDATE_PROPERTIES,
    CANDIDATE_PROPERTY_KEYS,
    CandidatePropertyKeys,
} from "@/data/constants";
import { Button } from "./ui/button";
import { LoaderButton } from "./loader-button";
import { useServerAction } from "zsa-react";
import { uploadCandidateAction } from "@/components/candidates-table/actions";
import { useToast } from "./ui/use-toast";

interface FileUploadDialogProps {
    csvHeaders: string[];
    csvData: any;
    onUploadComplete: () => void;
}

type CandidateProperties = Record<
    CandidatePropertyKeys,
    { label: String; header: string }
>;

export default function FileUploadDialog({
    csvHeaders,
    csvData,
    onUploadComplete,
}: FileUploadDialogProps) {
    const { toast } = useToast();

    const [headerOptions, setHeaderOptions] = useState<
        { header: string; selected: boolean }[]
    >(() => csvHeaders.map((header) => ({ header, selected: false })));

    const [selectedHeaders, setSelectedHeaders] =
        useState<CandidateProperties>(CANDIDATE_PROPERTIES);

    const filterSelectableOptions = (
        prevValue: string,
        value: string,
        property: string
    ) => {
        const newHeaderOptions = headerOptions.map((headerOption) => {
            if (value === headerOption.header) {
                return { header: headerOption.header, selected: true };
            }
            if (prevValue === headerOption.header) {
                return { header: headerOption.header, selected: false };
            }
            return headerOption;
        });
        const newSelectedHeaders = {
            ...selectedHeaders,
            [property]: {
                label: selectedHeaders[property as CandidatePropertyKeys].label,
                header: value,
            },
        };
        setHeaderOptions(newHeaderOptions);
        setSelectedHeaders(newSelectedHeaders);
    };

    const isUploadDisabled: boolean = Object.entries(selectedHeaders).some(
        ([_, { header }]) => header.length === 0
    );

    const { execute, isPending } = useServerAction(uploadCandidateAction, {
        onError({ err }) {
            toast({
                title: "Something went wrong",
                description:
                    "File format is invalid or headers are misconfigured",
                variant: "destructive",
            });
        },
        onSuccess({ data: numCandidates }) {
            toast({
                title: "Successfully uploaded CSV!",
                description: `Created ${numCandidates} candidates`,
            });

            onUploadComplete();
        },
    });

    function handleUploadClick() {
        const candidates = transformCsvData(csvData, selectedHeaders);
        execute(candidates);
    }

    return (
        <DialogContent className="md:max-w-[550px] max-h-[80dvh] overflow-y-scroll">
            <DialogHeader>
                <DialogTitle>Configure CSV Headers</DialogTitle>
                <DialogDescription>
                    Match the file&apos;s headers with the internal model. This
                    helps Crew Match understand the uploaded file.
                </DialogDescription>
            </DialogHeader>
            <section className="w-full flex flex-col gap-4">
                {Object.entries(selectedHeaders).map(
                    ([property, { label, header }], index) => (
                        <div
                            key={`${property}-${index}`}
                            className="space-y-0.5"
                        >
                            <Label>{label}</Label>
                            <Select
                                onValueChange={(value: string) =>
                                    filterSelectableOptions(
                                        header,
                                        value,
                                        property
                                    )
                                }
                                value={header}
                            >
                                <SelectTrigger className="w-full text-start">
                                    <SelectValue>{header}</SelectValue>
                                </SelectTrigger>
                                <SelectContent className="max-w-min">
                                    {headerOptions
                                        .filter(
                                            (headerOption) =>
                                                !headerOption.selected &&
                                                headerOption.header.length > 0
                                        )
                                        .map((headerOption, i) => (
                                            <SelectItem
                                                key={`${headerOption.header}-${i}`}
                                                value={headerOption.header}
                                            >
                                                {headerOption.header}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )
                )}
            </section>
            <DialogFooter className="flex justify-end gap-2">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
                <LoaderButton
                    onClick={() => handleUploadClick()}
                    isLoading={isPending}
                    variant="default"
                    disabled={isUploadDisabled}
                >
                    Upload
                </LoaderButton>
            </DialogFooter>
        </DialogContent>
    );
}

function transformCsvData(csvData: any, properties: CandidateProperties) {
    /**
     * CSV Data object is an array with objects that are keyed on headers
     * e.g. { "What is your name? (first and last)": "Rohan Sastri" }
     */

    const transformedCandidates = [];
    for (const candidateObj of csvData) {
        const isActing: boolean =
            candidateObj[
                properties[CANDIDATE_PROPERTY_KEYS.isActing].header
            ] === "Yes";
        const interestedProductions: string[] = getInterestList(
            isActing,
            true,
            candidateObj,
            properties
        );
        const interestedRoles: string[] = getInterestList(
            isActing,
            false,
            candidateObj,
            properties
        );
        const candidate = {
            name: candidateObj[
                properties[CANDIDATE_PROPERTY_KEYS.name].header
            ] as string,
            yearsInUW: Number(
                candidateObj[
                    properties[CANDIDATE_PROPERTY_KEYS.yearsInUW].header
                ]
            ),
            quartersInLUX: Number(
                candidateObj[
                    properties[CANDIDATE_PROPERTY_KEYS.quartersInLUX].header
                ]
            ),
            isActing,
            prioritizeProductions:
                candidateObj[
                    properties[CANDIDATE_PROPERTY_KEYS.prioritizeProductions]
                        .header
                ] !== "Role", // Field is blank when isActing is true, default to productions
            interestedProductions,
            interestedRoles,
        };
        transformedCandidates.push(candidate);
    }
    return transformedCandidates;
}

/**
 * Gets the interested role or production list from the CSV candidate
 * Productions are retrieved based on the following rules:
 *     isActing == true -> Get productions from auditions list
 *     isActing == false -> Get productions from ranked fields
 * @param isActing
 * @param isProductions
 * @param candidateObj parsed CSV candidate object row
 * @param properties selected headers object
 * @returns A string array with the ranked options
 */
function getInterestList(
    isActing: boolean,
    isProductions: boolean,
    candidateObj: any,
    properties: CandidateProperties
) {
    let interests: string[];
    if (isActing && isProductions) {
        interests =
            candidateObj[
                properties[CANDIDATE_PROPERTY_KEYS.auditionProductions].header
            ].split(", ");
        return interests;
    }
    const propKey = isProductions
        ? CANDIDATE_PROPERTY_KEYS.interestedProductions
        : CANDIDATE_PROPERTY_KEYS.interestedRoles;
    interests = [
        candidateObj[properties[`${propKey}-1`].header],
        candidateObj[properties[`${propKey}-2`].header],
        candidateObj[properties[`${propKey}-3`].header],
    ];
    return interests;
}
