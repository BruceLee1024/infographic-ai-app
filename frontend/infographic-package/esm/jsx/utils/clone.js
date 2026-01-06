export const cloneElement = (element, props) => {
    const { type, props: originalProps, ...rest } = element;
    return { type, props: { ...originalProps, ...props }, ...rest };
};
