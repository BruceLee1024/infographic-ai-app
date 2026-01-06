
interface InfographicData {
    title?: string;
    desc?: string;
    items?: InfographicItem[];
    [key: string]: any;
}

interface InfographicItem {
    label?: string;
    value?: string | number;
    desc?: string;
    icon?: string;
    children?: InfographicItem[];
    [key: string]: any;
}

interface ParsedInfographic {
    template: string;
    data: InfographicData;
    theme?: any;
}

export function parseDSL(dsl: string): ParsedInfographic {
    // Try to parse as JSON first (for AI-generated format)
    try {
        const jsonObj = JSON.parse(dsl);
        if (jsonObj && typeof jsonObj === 'object') {
            // Convert JSON format to DSL format
            const result: ParsedInfographic = {
                template: jsonObj.design?.structure?.type || '',
                data: jsonObj.data || {},
                theme: {},
            };
            
            // Convert themeConfig to theme
            if (jsonObj.themeConfig) {
                if (jsonObj.themeConfig.colorPrimary) {
                    result.theme!.colorPrimary = jsonObj.themeConfig.colorPrimary;
                }
                // Convert palette array to space-separated string
                if (jsonObj.themeConfig.palette) {
                    if (Array.isArray(jsonObj.themeConfig.palette)) {
                        result.theme!.palette = jsonObj.themeConfig.palette.join(' ');
                    } else {
                        result.theme!.palette = jsonObj.themeConfig.palette;
                    }
                }
                if (jsonObj.themeConfig.colorBg) {
                    result.theme!.colorBg = jsonObj.themeConfig.colorBg;
                }
            }
            
            // Handle theme property (like 'hand-drawn')
            if (jsonObj.theme) {
                result.theme!.stylize = jsonObj.theme;
            }
            
            return result;
        }
    } catch (e) {
        // Not JSON, continue with DSL parsing
    }

    const lines = dsl.split('\n');
    const result: ParsedInfographic = {
        template: '',
        data: {},
    };

    if (!lines[0]?.startsWith('infographic')) {
        return result; // Invalid or empty
    }

    result.template = lines[0].replace('infographic', '').trim();

    let section: 'data' | 'theme' | null = null;
    let currentParent: any = null;
    let indentStack: { indent: number; node: any; isListItem?: boolean }[] = [];

    // Helper to get indentation level (spaces)
    const getIndent = (str: string) => str.search(/\S|$/);

    for (let i = 1; i < lines.length; i++) {
        const rawLine = lines[i];
        if (!rawLine.trim()) continue;

        const indent = getIndent(rawLine);
        const line = rawLine.trim();

        // Section headers (top level, usually indent 0 or small if file starts indented?) 
        // The spec says "usage block describe data / theme... level through two spaces indent"
        // Usually:
        // infographic xxx
        // data
        //   title xxx

        if (indent === 0) {
            if (line === 'data') {
                section = 'data';
                currentParent = result.data;
                indentStack = [{ indent: 0, node: result.data }];
                continue;
            }
            if (line === 'theme') {
                section = 'theme';
                result.theme = {};
                currentParent = result.theme;
                indentStack = [{ indent: 0, node: result.theme }];
                continue;
            }
            // Unknown top level
            section = null;
            continue;
        }

        if (!section) continue; // Skip lines until a section starts

        // Find parent based on indentation
        while (indentStack.length > 0 && indentStack[indentStack.length - 1].indent >= indent) {
            indentStack.pop();
        }

        // Fallback if stack empty (shouldn't happen if logic is correct for data/theme children)
        if (indentStack.length === 0) {
            // Should have been caught by indent === 0 check, but safe fallback
            indentStack.push({ indent: 0, node: section === 'data' ? result.data : result.theme });
        }

        const parent = indentStack[indentStack.length - 1].node;

        // Check if list item
        if (line.startsWith('- ')) {
            const content = line.substring(2).trim();
            const node: any = {};

            // Parse inline kv if any? usually items are complex objects so they start fresh
            // spec:
            // items
            //   - label xxx

            // But maybe: "- label: value" ? No, syntax says "- label 条目"

            // If parent is not an array, make it one? 
            // Actually, standard YAML-ish logic:
            // The previous line was the key for this list. 
            // e.g. "items" -> parent[last_key] = []

            // Wait, my simple parser logic needs to know the key of the parent to push to.
            // But `parent` in my stack is the object `items`.
            // If `parent` is an array? 

            // Let's refine the stack. 
            // When we see "items", we make parent.items = [].
            // The node for "items" in stack should ideally be that array?

            // Custom simplified parser for this specific syntax:
            // keys are "key value"
            // list items start with "-"

            const parts = content.split(' ');
            const key = parts[0];
            const value = parts.slice(1).join(' ');

            // Usually "- label xxx" -> { label: xxx }
            if (key) {
                node[key] = value;
            }

            // We need to add this node to the parent array.
            // But we don't know if parent is an array or we need to find the array in parent.
            // In this DSL, structure usually is:
            // items
            //   - label ...
            // So 'items' key logic created an array.

            if (Array.isArray(parent)) {
                parent.push(node);
                indentStack.push({ indent, node, isListItem: true }); // This node is the context for children
            } else {
                // Did we miss the array creation? 
                // Or is this a root list?
                // Assuming parent is the object that contains the array? No types are loose.
                console.warn('Found list item but parent is not array', line);
            }
        } else {
            // Key Value pair
            // key value...
            const parts = line.split(' ');
            const key = parts[0];
            const rest = parts.slice(1).join(' ');

            // If checks for nested objects like 'items', 'children'
            if (key === 'items' || key === 'children') {
                parent[key] = [];
                indentStack.push({ indent, node: parent[key] }); // Node is the array
            } else {
                // simple property
                if (rest) {
                    // Unescape newlines in string values
                    const unescapedRest = rest.replace(/\\n/g, '\n');
                    parent[key] = unescapedRest;
                    // This is a leaf, but maybe it has children? (unlikely for simple kv)
                    // But just in case, we push it? No, if next line is deeper, it must be under a container.
                    // Simple KV usually don't have children in this DSL.
                    // Exception: value 12.5 (number)
                    if (!isNaN(Number(rest))) {
                        parent[key] = Number(rest);
                    }
                } else {
                    // key with no value, implies object start? e.g. "style"
                    parent[key] = {};
                    indentStack.push({ indent, node: parent[key] });
                }
            }
        }
    }

    return result;
}

export function serializeDSL(parsed: ParsedInfographic): string {
    let output = `infographic ${parsed.template}\n`;

    // Serialize Data
    if (parsed.data && Object.keys(parsed.data).length > 0) {
        output += 'data\n';
        output += serializeObject(parsed.data, 2);
    }

    // Serialize Theme
    if (parsed.theme && Object.keys(parsed.theme).length > 0) {
        output += 'theme\n';
        output += serializeObject(parsed.theme, 2);
    }

    return output;
}

function serializeObject(obj: any, indent: number): string {
    let output = '';
    const spaces = ' '.repeat(indent);

    // keys to prioritize order
    const priorityKeys = ['title', 'desc', 'label', 'value', 'icon'];
    const keys = Object.keys(obj).sort((a, b) => {
        const idxA = priorityKeys.indexOf(a);
        const idxB = priorityKeys.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return 0;
    });

    for (const key of keys) {
        const value = obj[key];
        if (value === undefined || value === null) continue;

        if (key === 'items' || key === 'children') {
            if (Array.isArray(value) && value.length > 0) {
                output += `${spaces}${key}\n`;
                value.forEach(item => {
                    // first property of item goes with dash
                    // We can grab 'label' as the first usually
                    const itemKeys = Object.keys(item);
                    // If empty object
                    if (itemKeys.length === 0) return;

                    // Heuristic: pick the first key to render as "- key value"
                    const firstKey = itemKeys.includes('label') ? 'label' : itemKeys[0];

                    // Render "- key val"
                    output += `${spaces}  - ${firstKey} ${item[firstKey] !== undefined ? item[firstKey] : ''}\n`;

                    // Render rest
                    const restObj = { ...item };
                    delete restObj[firstKey];
                    output += serializeObject(restObj, indent + 4);
                });
            }
        } else if (typeof value === 'object' && !Array.isArray(value)) {
            output += `${spaces}${key}\n`;
            output += serializeObject(value, indent + 2);
        } else {
            // Escape newlines in string values to preserve multi-line text
            const serializedValue = typeof value === 'string'
                ? value.replace(/\n/g, '\\n')
                : value;
            output += `${spaces}${key} ${serializedValue}\n`;
        }
    }

    return output;
}
