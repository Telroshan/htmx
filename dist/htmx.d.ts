declare namespace htmx {
    export { onLoadHelper as onLoad };
    export { processNode as process };
    export { addEventListenerImpl as on };
    export { removeEventListenerImpl as off };
    export { triggerEvent as trigger };
    export { ajaxHelper as ajax };
    export { find };
    export { findAll };
    export { closest };
    export function values(elt: Element, type: HttpVerb): any;
    export { removeElement as remove };
    export { addClassToElement as addClass };
    export { removeClassFromElement as removeClass };
    export { toggleClassOnElement as toggleClass };
    export { takeClassForElement as takeClass };
    export { swap };
    export { defineExtension };
    export { removeExtension };
    export { logAll };
    export { logNone };
    export const logger: any;
    export namespace config {
        const historyEnabled: boolean;
        const historyCacheSize: number;
        const refreshOnHistoryMiss: boolean;
        const defaultSwapStyle: HtmxSwapStyle;
        const defaultSwapDelay: number;
        const defaultSettleDelay: number;
        const includeIndicatorStyles: boolean;
        const indicatorClass: string;
        const requestClass: string;
        const addedClass: string;
        const settlingClass: string;
        const swappingClass: string;
        const allowEval: boolean;
        const allowScriptTags: boolean;
        const inlineScriptNonce: string;
        const attributesToSettle: string[];
        const withCredentials: boolean;
        const timeout: number;
        const wsReconnectDelay: "full-jitter" | ((retryCount: number) => number);
        const wsBinaryType: BinaryType;
        const disableSelector: string;
        const scrollBehavior: 'auto' | 'instant' | 'smooth';
        const defaultFocusScroll: boolean;
        const getCacheBusterParam: boolean;
        const globalViewTransitions: boolean;
        const methodsThatUseUrlParams: (HttpVerb)[];
        const selfRequestsOnly: boolean;
        const ignoreTitle: boolean;
        const scrollIntoViewOnBoost: boolean;
        const triggerSpecsCache: any | null;
        const disableInheritance: boolean;
        const responseHandling: HtmxResponseHandlingConfig[];
    }
    export { parseInterval };
    export { internalEval as _ };
    export const version: string;
}
type HttpVerb = 'get' | 'head' | 'post' | 'put' | 'delete' | 'connect' | 'options' | 'trace' | 'patch';
type CustomEventListener = (evt: CustomEvent) => void;
type SwapOptions = {
    select?: string;
    selectOOB?: string;
    eventInfo?: any;
    anchor?: string;
    contextElement?: Element;
    afterSwapCallback?: swapCallback;
    afterSettleCallback?: swapCallback;
};
type swapCallback = () => any;
type HtmxSwapStyle = 'innerHTML' | 'outerHTML' | 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend' | 'delete' | 'none' | string;
type HtmxSwapSpecification = {
    swapStyle: HtmxSwapStyle;
    swapDelay: number;
    settleDelay: number;
    transition?: boolean;
    ignoreTitle?: boolean;
    head?: string;
    scroll?: 'top' | 'bottom';
    scrollTarget?: string;
    show?: string;
    showTarget?: string;
    focusScroll?: boolean;
};
type HtmxTriggerSpecification = {
    trigger: string;
    pollInterval?: number;
    eventFilter?: (this: Node, evt: Event) => boolean;
    changed?: boolean;
    once?: boolean;
    consume?: boolean;
    delay?: number;
    from?: string;
    target?: string;
    throttle?: number;
    queue?: string;
    root?: string;
    threshold?: string;
};
type HtmxElementValidationError = {
    elt: Element;
    message: string;
    validity: ValidityState;
};
type HtmxHeaderSpecification = Record<string, string>;
type HtmxAjaxHelperContext = {
    source?: Element | string;
    event?: Event;
    handler?: HtmxAjaxHandler;
    target: Element | string;
    swap?: string;
    values?: any | FormData;
    headers?: Record<string, string>;
    select?: string;
};
type HtmxRequestConfig = {
    boosted: boolean;
    useUrlParams: boolean;
    formData: FormData;
    /**
     * formData proxy
     */
    parameters: any;
    unfilteredFormData: FormData;
    /**
     * unfilteredFormData proxy
     */
    unfilteredParameters: any;
    headers: HtmxHeaderSpecification;
    target: Element;
    verb: HttpVerb;
    errors: HtmxElementValidationError[];
    withCredentials: boolean;
    timeout: number;
    path: string;
    triggeringEvent: Event;
};
type HtmxResponseInfo = {
    xhr: XMLHttpRequest;
    target: Element;
    requestConfig: HtmxRequestConfig;
    etc: HtmxAjaxEtc;
    boosted: boolean;
    select: string;
    pathInfo: {
        requestPath: string;
        finalRequestPath: string;
        responsePath: string | null;
        anchor: string;
    };
    failed?: boolean;
    successful?: boolean;
};
type HtmxAjaxEtc = {
    returnPromise?: boolean;
    handler?: HtmxAjaxHandler;
    select?: string;
    targetOverride?: Element;
    swapOverride?: HtmxSwapStyle;
    headers?: Record<string, string>;
    values?: any | FormData;
    credentials?: boolean;
    timeout?: number;
};
type HtmxResponseHandlingConfig = {
    code?: string;
    swap: boolean;
    error?: boolean;
    ignoreTitle?: boolean;
    select?: string;
    target?: string;
    swapOverride?: string;
    event?: string;
};
type HtmxBeforeSwapDetails = HtmxResponseInfo & {
    shouldSwap: boolean;
    serverResponse: any;
    isError: boolean;
    ignoreTitle: boolean;
    selectOverride: string;
};
type HtmxAjaxHandler = (elt: Element, responseInfo: HtmxResponseInfo) => any;
type HtmxSettleTask = (() => void);
type HtmxSettleInfo = {
    tasks: HtmxSettleTask[];
    elts: Element[];
    title?: string;
};
type HtmxExtension = any;
/**
 * Adds a callback for the **htmx:load** event. This can be used to process new content, for example initializing the content with a javascript library
 *
 * @see https://htmx.org/api/#onLoad
 *
 * @param {(evt: CustomEvent) => void} callback the callback to call on newly loaded content
 * @returns {EventListener|CustomEventListener}
 */
declare function onLoadHelper(callback: (evt: CustomEvent) => void): EventListener | CustomEventListener;
/**
 * Processes new content, enabling htmx behavior. This can be useful if you have content that is added to the DOM outside of the normal htmx request cycle but still want htmx attributes to work.
 *
 * @see https://htmx.org/api/#process
 *
 * @param {Element|string} elt element to process
 */
declare function processNode(elt: Element | string): void;
/**
 * Adds an event listener to an element
 *
 * @see https://htmx.org/api/#on
 *
 * @param {EventTarget|string} arg1 the element to add the listener to | the event name to add the listener for
 * @param {string|EventListener|CustomEventListener} arg2 the event name to add the listener for | the listener to add
 * @param {EventListener|CustomEventListener} [arg3] the listener to add
 * @returns {EventListener|CustomEventListener}
 */
declare function addEventListenerImpl(arg1: EventTarget | string, arg2: string | EventListener | CustomEventListener, arg3?: EventListener | CustomEventListener): EventListener | CustomEventListener;
/**
 * Removes an event listener from an element
 *
 * @see https://htmx.org/api/#off
 *
 * @param {EventTarget|string} arg1 the element to remove the listener from | the event name to remove the listener from
 * @param {string|EventListener|CustomEventListener} arg2 the event name to remove the listener from | the listener to remove
 * @param {EventListener|CustomEventListener} [arg3] the listener to remove
 * @returns {EventListener|CustomEventListener}
 */
declare function removeEventListenerImpl(arg1: EventTarget | string, arg2: string | EventListener | CustomEventListener, arg3?: EventListener | CustomEventListener): EventListener | CustomEventListener;
/**
 * Triggers a given event on an element
 *
 * @see https://htmx.org/api/#trigger
 *
 * @param {EventTarget|string} elt the element to trigger the event on
 * @param {string} eventName the name of the event to trigger
 * @param {any=} detail details for the event
 * @returns {boolean}
 */
declare function triggerEvent(elt: EventTarget | string, eventName: string, detail?: any | undefined): boolean;
/**
 * Issues an htmx-style AJAX request
 *
 * @see https://htmx.org/api/#ajax
 *
 * @param {HttpVerb} verb
 * @param {string} path the URL path to make the AJAX
 * @param {Element|string|HtmxAjaxHelperContext} context the element to target (defaults to the **body**) | a selector for the target | a context object that contains any of the following
 * @return {Promise<void>} Promise that resolves immediately if no request is sent, or when the request is complete
 */
declare function ajaxHelper(verb: HttpVerb, path: string, context: Element | string | HtmxAjaxHelperContext): Promise<void>;
/**
 * Finds an element matching the selector
 *
 * @see https://htmx.org/api/#find
 *
 * @param {Element|Document|DocumentFragment|string} eltOrSelector  the root element to find the matching element in, inclusive | the selector to match
 * @param {string} [selector] the selector to match
 * @returns {Element|null}
 */
declare function find(eltOrSelector: Element | Document | DocumentFragment | string, selector?: string): Element | null;
/**
 * Finds all elements matching the selector
 *
 * @see https://htmx.org/api/#findAll
 *
 * @param {Element|Document|DocumentFragment|string} eltOrSelector the root element to find the matching elements in, inclusive | the selector to match
 * @param {string} [selector] the selector to match
 * @returns {NodeListOf<Element>}
 */
declare function findAll(eltOrSelector: Element | Document | DocumentFragment | string, selector?: string): NodeListOf<Element>;
/**
 * Finds the closest matching element in the given elements parentage, inclusive of the element
 *
 * @see https://htmx.org/api/#closest
 *
 * @param {Element|string} elt the element to find the selector from
 * @param {string} selector the selector to find
 * @returns {Element|null}
 */
declare function closest(elt: Element | string, selector: string): Element | null;
/**
 * Removes an element from the DOM
 *
 * @see https://htmx.org/api/#remove
 *
 * @param {Node} elt
 * @param {number} [delay]
 */
declare function removeElement(elt: Node, delay?: number): void;
/**
 * This method adds a class to the given element.
 *
 * @see https://htmx.org/api/#addClass
 *
 * @param {Element|string} elt the element to add the class to
 * @param {string} clazz the class to add
 * @param {number} [delay] the delay (in milliseconds) before class is added
 */
declare function addClassToElement(elt: Element | string, clazz: string, delay?: number): void;
/**
 * Removes a class from the given element
 *
 * @see https://htmx.org/api/#removeClass
 *
 * @param {Node|string} node element to remove the class from
 * @param {string} clazz the class to remove
 * @param {number} [delay] the delay (in milliseconds before class is removed)
 */
declare function removeClassFromElement(node: Node | string, clazz: string, delay?: number): void;
/**
 * Toggles the given class on an element
 *
 * @see https://htmx.org/api/#toggleClass
 *
 * @param {Element|string} elt the element to toggle the class on
 * @param {string} clazz the class to toggle
 */
declare function toggleClassOnElement(elt: Element | string, clazz: string): void;
/**
 * Takes the given class from its siblings, so that among its siblings, only the given element will have the class.
 *
 * @see https://htmx.org/api/#takeClass
 *
 * @param {Node|string} elt the element that will take the class
 * @param {string} clazz the class to take
 */
declare function takeClassForElement(elt: Node | string, clazz: string): void;
/**
 * Implements complete swapping pipeline, including: focus and selection preservation,
 * title updates, scroll, OOB swapping, normal swapping and settling
 * @param {string|Element} target
 * @param {string} content
 * @param {HtmxSwapSpecification} swapSpec
 * @param {SwapOptions} [swapOptions]
 */
declare function swap(target: string | Element, content: string, swapSpec: HtmxSwapSpecification, swapOptions?: SwapOptions): void;
/**
 * defineExtension initializes the extension and adds it to the htmx registry
 *
 * @see https://htmx.org/api/#defineExtension
 *
 * @param {string} name the extension name
 * @param {HtmxExtension} extension the extension definition
 */
declare function defineExtension(name: string, extension: HtmxExtension): void;
/**
 * removeExtension removes an extension from the htmx registry
 *
 * @see https://htmx.org/api/#removeExtension
 *
 * @param {string} name
 */
declare function removeExtension(name: string): void;
/**
 * Log all htmx events, useful for debugging.
 *
 * @see https://htmx.org/api/#logAll
 */
declare function logAll(): void;
declare function logNone(): void;
/**
 * Parses an interval string consistent with the way htmx does. Useful for plugins that have timing-related attributes.
 *
 * Caution: Accepts an int followed by either **s** or **ms**. All other values use **parseFloat**
 *
 * @see https://htmx.org/api/#parseInterval
 *
 * @param {string} str timing string
 * @returns {number|undefined}
 */
declare function parseInterval(str: string): number | undefined;
/**
 * @param {string} str
 * @returns {any}
 */
declare function internalEval(str: string): any;
