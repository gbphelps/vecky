declare module '*.scss' {
    const styles: { [key: string]: string };
    export default styles;
}

// eslint-disable-next-line no-underscore-dangle
declare let __user__: {
    username: string,
    id: string
};
