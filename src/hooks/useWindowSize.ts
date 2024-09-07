import { useLayoutEffect, useState } from "react";

export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState<number[]>([
        window.innerWidth,
        window.innerHeight,
    ]);

    useLayoutEffect(() => {
        const windowSizeHandler = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };
        window.addEventListener("resize", windowSizeHandler);

        return () => {
            window.removeEventListener("resize", windowSizeHandler);
        };
    }, []);

    return windowSize;
}
