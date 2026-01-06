const dividerRegistry = new Map();
export const registerDivider = (type, component) => {
    dividerRegistry.set(type, component);
};
export const getDividerComponent = (type) => {
    if (!type)
        return null;
    return dividerRegistry.get(type) ?? null;
};
