import { jsx as _jsx } from "@antv/infographic/jsx-runtime";
import EventEmitter from 'eventemitter3';
import { Editor } from '../editor';
import { exportToPNGString, exportToSVGString, } from '../exporter';
import { renderSVG } from '../jsx';
import { parseOptions, } from '../options';
import { Renderer } from '../renderer';
import { parseSyntax } from '../syntax';
import { getTypes, parseSVG } from '../utils';
import { DEFAULT_OPTIONS } from './options';
import { cloneOptions, isCompleteParsedInfographicOptions, mergeOptions, } from './utils';
export class Infographic {
    constructor(options) {
        this.rendered = false;
        this.emitter = new EventEmitter();
        this.node = null;
        this.initialOptions = {};
        this.setOptions(options, 'replace', true);
    }
    getOptions() {
        return this.options;
    }
    setOptions(options, mode = 'replace', isInitial = false) {
        const { options: parsedOptions, errors, warnings, } = parseSyntaxOptions(options);
        if (isInitial) {
            this.initialOptions = cloneOptions(parsedOptions);
        }
        const base = mode === 'replace'
            ? mergeOptions(cloneOptions(this.initialOptions || {}), parsedOptions)
            : mergeOptions(this.options || cloneOptions(this.initialOptions || {}), parsedOptions);
        this.options = base;
        this.parsedOptions = parseOptions(mergeOptions(DEFAULT_OPTIONS, this.options));
        if (warnings.length) {
            this.emitter.emit('warning', warnings);
        }
        if (errors.length) {
            this.emitter.emit('error', errors);
        }
    }
    /**
     * Render the infographic into the container
     */
    render(options) {
        if (options) {
            this.setOptions(options, 'replace');
        }
        else if (!this.options && this.initialOptions) {
            this.setOptions(this.initialOptions, 'replace');
        }
        this.performRender();
    }
    update(options) {
        this.setOptions(options, 'merge');
        this.performRender();
    }
    performRender() {
        const parsedOptions = this.parsedOptions;
        if (!isCompleteParsedInfographicOptions(parsedOptions)) {
            this.emitter.emit('error', new Error('Incomplete options'));
            return;
        }
        const { container } = this.parsedOptions;
        const template = this.compose(parsedOptions);
        const renderer = new Renderer(parsedOptions, template);
        this.node = renderer.render();
        container?.replaceChildren(this.node);
        this.editor?.destroy();
        this.editor = undefined;
        if (this.options.editable) {
            this.editor = new Editor(this.emitter, this.node, parsedOptions);
        }
        this.rendered = true;
        this.emitter.emit('rendered', { node: this.node, options: this.options });
    }
    /**
     * Compose the SVG template
     */
    compose(parsedOptions) {
        const { design, data } = parsedOptions;
        const { title, item, items, structure } = design;
        const { component: Structure, props: structureProps } = structure;
        const Title = title.component;
        const Item = item.component;
        const Items = items.map((it) => it.component);
        const svg = renderSVG(_jsx(Structure, { data: data, Title: Title, Item: Item, Items: Items, options: parsedOptions, ...structureProps }));
        const template = parseSVG(svg);
        if (!template) {
            throw new Error('Failed to parse SVG template');
        }
        return template;
    }
    getTypes() {
        const parsedOptions = this.parsedOptions;
        if (!isCompleteParsedInfographicOptions(parsedOptions)) {
            this.emitter.emit('error', new Error('Incomplete options'));
            return;
        }
        const design = parsedOptions.design;
        const structure = design.structure.composites || [];
        const items = design.items.map((it) => it.composites || []);
        return getTypes({ structure, items });
    }
    /**
     * Export the infographic to data URL
     * @param options Export option
     * @returns Data URL string of the exported infographic
     * @description This method need to be called after `render()` and in a browser environment.
     */
    async toDataURL(options) {
        if (!this.node) {
            throw new Error('Infographic is not rendered yet.');
        }
        if (options?.type === 'svg') {
            return await exportToSVGString(this.node, options);
        }
        return await exportToPNGString(this.node, options);
    }
    on(event, listener) {
        this.emitter.on(event, listener);
    }
    off(event, listener) {
        this.emitter.off(event, listener);
    }
    destroy() {
        this.editor?.destroy();
        this.node?.remove();
        this.node = null;
        this.rendered = false;
        this.emitter.emit('destroyed');
        this.emitter.removeAllListeners();
    }
}
function parseSyntaxOptions(input) {
    if (typeof input === 'string') {
        const { options, errors, warnings } = parseSyntax(input);
        return { options, errors, warnings };
    }
    return {
        options: cloneOptions(input),
        errors: [],
        warnings: [],
    };
}
