//declare module 'react' {}

declare module '*.module.scss' {
    const module: Record<string, string>;
    export default module;
}

declare module "*.module.css" {
    const module: Record<string, string>;
    export default module;
}
