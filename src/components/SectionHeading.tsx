export default function SectionHeading({ title }: { title: string }) {
    return (
        <h1 className="md:text-2xl text-lg font-semibold p-2 min-w-fit">
            {title}
        </h1>
    );
}
