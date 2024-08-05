import { ReactElement } from "react";

interface SectionRowProps<T> {
    data: T[];
    blankText: string;
    sectionCard: (props: T) => ReactElement<T>;
}

export default function SectionRow<T>({
    data,
    blankText,
    sectionCard,
}: SectionRowProps<T>) {
    return (
        <div className="w-full h-fit flex flex-wrap justify-start gap-4 p-2">
            {data.length === 0 ? (
                <h1 className="text-lg font-light text-muted-foreground w-fit h-fit">
                    {blankText}
                </h1>
            ) : (
                data.map((item: T, index: number) =>
                    sectionCard({ ...item, key: index })
                )
            )}
        </div>
    );
}
