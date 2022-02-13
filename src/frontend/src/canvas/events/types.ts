interface IListenerArgs<T> {
    element: SVGElement,
    callback: (event: T) => void
}

interface IListener {
    destroy: () => void,
}

export type { IListenerArgs, IListener };
