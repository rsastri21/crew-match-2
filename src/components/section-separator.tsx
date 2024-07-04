export function SectionSeparator({ label }: { label: string }) {
    return (
        <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="bg-gray-100 px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
                    {label}
                </span>
            </div>
        </div>
    );
}
