import type { ProductionWithRoles } from "@/db/schema";

export const ROLES = [
    "Director",
    "Assistant Director",
    "Producer",
    "Director of Photography",
    "Camera Operator",
    "Assistant Camera Operator",
    "Gaffer",
    "Boom Operator",
    "Sound Recordist",
    "Editor",
    "Assistant Editor",
    "Art Department",
    "Makeup",
    "Assistant Writer",
    "Script Supervisor",
    "Production Assistant",
    "Soundtrack",
];

export enum CANDIDATE_PROPERTY_KEYS {
    name = "name",
    yearsInUW = "yearsInUW",
    quartersInLUX = "quartersInLUX",
    isActing = "isActing",
    prioritizeProductions = "prioritizeProductions",
    interestedProductions = "interestedProductions",
    interestedRoles = "interestedRoles",
    auditionProductions = "auditionProductions",
}

type AllCandidateProperties =
    | keyof typeof CANDIDATE_PROPERTY_KEYS
    | "interestedProductions-1"
    | "interestedProductions-2"
    | "interestedProductions-3"
    | "interestedRoles-1"
    | "interestedRoles-2"
    | "interestedRoles-3";
export type CandidatePropertyKeys = Exclude<
    AllCandidateProperties,
    "interestedProductions" | "interestedRoles"
>;

export const CANDIDATE_PROPERTIES: Record<
    CandidatePropertyKeys,
    { label: string; header: string }
> = {
    [CANDIDATE_PROPERTY_KEYS.name]: {
        label: "Name",
        header: "",
    },
    [CANDIDATE_PROPERTY_KEYS.yearsInUW]: {
        label: "Years at UW",
        header: "",
    },
    [CANDIDATE_PROPERTY_KEYS.quartersInLUX]: {
        label: "Quarters in LUX",
        header: "",
    },
    [CANDIDATE_PROPERTY_KEYS.isActing]: {
        label: "Acting Preference",
        header: "",
    },
    [CANDIDATE_PROPERTY_KEYS.prioritizeProductions]: {
        label: "Priotize Productions",
        header: "",
    },
    [`${CANDIDATE_PROPERTY_KEYS.interestedProductions}-1`]: {
        label: "Production Rank 1",
        header: "",
    },
    [`${CANDIDATE_PROPERTY_KEYS.interestedProductions}-2`]: {
        label: "Production Rank 2",
        header: "",
    },
    [`${CANDIDATE_PROPERTY_KEYS.interestedProductions}-3`]: {
        label: "Production Rank 3",
        header: "",
    },
    [`${CANDIDATE_PROPERTY_KEYS.interestedRoles}-1`]: {
        label: "Role Rank 1",
        header: "",
    },
    [`${CANDIDATE_PROPERTY_KEYS.interestedRoles}-2`]: {
        label: "Role Rank 2",
        header: "",
    },
    [`${CANDIDATE_PROPERTY_KEYS.interestedRoles}-3`]: {
        label: "Role Rank 3",
        header: "",
    },
    [CANDIDATE_PROPERTY_KEYS.auditionProductions]: {
        label: "Productions to Audition For",
        header: "",
    },
};

export const VARIANTS = {
    small: {
        heading: "text-base",
        paragraph: "text-sm",
    },
    large: {
        heading: "text-xl",
        paragraph: "text-md",
    },
};

export type variant = "small" | "large";

export const mockProductionsWithRoles: ProductionWithRoles[] = [
    {
        id: 1,
        userId: "1",
        name: "A Letter to 20",
        genre: "Coming of Age",
        logline:
            "A girl turns 20 and shares her bittersweet experience of growing up with her younger self.",
        logistics:
            "Shooting on April 27th + 28th, May 4th + 5th, in my apartment, on campus and around Pike Place Market, mostly done during the day except for one evening shoot at my apartment.",
        lookingFor:
            "Crew: Experienced producer, experienced DP with access to a nice camera, experienced editor who uses Adobe Premiere Pro, an animator, AD, composer, camera operator, gaffers/grips, sound recordists, scriptys, assistant editors, BTS crew and PAs",
        pitchLink: "https://www.google.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: [
            {
                id: 1,
                role: "Director",
                production: "A Letter to 20",
                productionId: 1,
                candidateId: 1,
                candidate: {
                    name: "Bella Quilici",
                },
            },
            {
                id: 2,
                role: "Assistant Director",
                production: "A Letter to 20",
                productionId: 1,
                candidateId: 2,
                candidate: {
                    name: "Evelyn Archibald",
                },
            },
            {
                id: 3,
                role: "Assistant Director",
                production: "A Letter to 20",
                productionId: 1,
                candidateId: 3,
                candidate: {
                    name: "Brianna Robins",
                },
            },
            {
                id: 5,
                role: "Producer",
                production: "A Letter to 20",
                productionId: 1,
                candidateId: 4,
                candidate: {
                    name: "Jonny Kwan",
                },
            },
            {
                id: 6,
                role: "Director of Photography",
                production: "A Letter to 20",
                productionId: 1,
                candidateId: null,
                candidate: null,
            },
            {
                id: 7,
                role: "Camera Operator",
                production: "A Letter to 20",
                productionId: 1,
                candidateId: null,
                candidate: null,
            },
            {
                id: 8,
                role: "Assistant Camera Operator",
                production: "A Letter to 20",
                productionId: 1,
                candidateId: null,
                candidate: null,
            },
        ],
    },
    {
        id: 2,
        userId: "1",
        name: "Pink Robots",
        genre: "Drama",
        logline:
            "A girl turns 20 and shares her bittersweet experience of growing up with her younger self.",
        logistics:
            "Shooting on April 27th + 28th, May 4th + 5th, in my apartment, on campus and around Pike Place Market, mostly done during the day except for one evening shoot at my apartment.",
        lookingFor:
            "Crew: Experienced producer, experienced DP with access to a nice camera, experienced editor who uses Adobe Premiere Pro, an animator, AD, composer, camera operator, gaffers/grips, sound recordists, scriptys, assistant editors, BTS crew and PAs",
        pitchLink: "https://www.google.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: [
            {
                id: 1,
                role: "Director",
                production: "Pink Robots",
                productionId: 1,
                candidateId: 1,
                candidate: {
                    name: "Andrew Shearer",
                },
            },
            {
                id: 2,
                role: "Assistant Director",
                production: "Pink Robots",
                productionId: 1,
                candidateId: null,
                candidate: null,
            },
            {
                id: 3,
                role: "Assistant Director",
                production: "Pink Robots",
                productionId: 1,
                candidateId: 3,
                candidate: {
                    name: "Brianna Robins",
                },
            },
            {
                id: 5,
                role: "Producer",
                production: "Pink Robots",
                productionId: 1,
                candidateId: 4,
                candidate: {
                    name: "Jonny Kwan",
                },
            },
            {
                id: 6,
                role: "Director of Photography",
                production: "Pink Robots",
                productionId: 1,
                candidateId: null,
                candidate: null,
            },
            {
                id: 7,
                role: "Camera Operator",
                production: "Pink Robots",
                productionId: 1,
                candidateId: null,
                candidate: null,
            },
            {
                id: 8,
                role: "Assistant Camera Operator",
                production: "Pink Robots",
                productionId: 1,
                candidateId: null,
                candidate: null,
            },
        ],
    },
];
