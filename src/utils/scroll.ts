export const scrollToTop = (element: HTMLDivElement | null) => {
    element?.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};