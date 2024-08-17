import { DragControls, Reorder } from "framer-motion";
import { Grip } from "lucide-react";
import { PropsWithChildren } from "react";

export interface RankSectionProps extends PropsWithChildren {
    axis: "x" | "y" | undefined;
    values: string[];
    onReorder: (newOrder: string[]) => void;
}

export interface RankItemProps {
    value: string;
    rankNumber: number;
    dragListener: boolean;
    dragControls: DragControls;
}

export function RankSection({
    axis,
    values,
    onReorder,
    children,
}: RankSectionProps) {
    return (
        <Reorder.Group
            axis={axis}
            values={values}
            layoutScroll
            onReorder={onReorder}
            className="flex flex-col gap-4"
        >
            {children}
        </Reorder.Group>
    );
}

export function RankItem({
    value,
    rankNumber,
    dragControls,
    dragListener,
}: RankItemProps) {
    return (
        <Reorder.Item
            value={value}
            dragListener={dragListener}
            dragControls={dragControls}
        >
            <div className="flex flex-row items-center justify-between rounded-lg border p-4 bg-background">
                <h1 className="font-medium text-md">
                    Choice {rankNumber + 1}: {value}
                </h1>
                <span
                    onPointerDown={(e) => dragControls.start(e)}
                    className="hover:cursor-grab active:cursor-grabbing select-none"
                >
                    <Grip className="w-4 h-4" />
                </span>
            </div>
        </Reorder.Item>
    );
}
