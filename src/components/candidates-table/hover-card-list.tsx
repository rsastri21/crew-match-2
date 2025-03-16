interface HoverCardListProps {
    title: string;
    values: string[];
    disambiguator: string;
}

export default function HoverCardList({
    title,
    values,
    disambiguator,
}: HoverCardListProps) {
    return (
        <div className="w-full flex flex-col gap-1">
            <h3 className="text-sm font-medium w-full">{title}</h3>
            <ol className="list-decimal list-inside">
                {values.map((value, index) => (
                    <li key={`${disambiguator}_${value}_${index}`}>{value}</li>
                ))}
            </ol>
        </div>
    );
}
