declare module '*.scss' {
    const styles: { [key: string]: string };
    export default styles;
}

declare module '*.svg' {
    const component: import('react').FunctionComponent;
    export default component;
}

declare module 'complex.js' {
    const type: any;
    export default type;
}

// eslint-disable-next-line no-underscore-dangle
declare let __user__: {
    username: string,
    id: string
};

declare type Constructor = new (...args: any[]) => {};
