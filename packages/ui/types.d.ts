// Do not throw TS errors, as the package will be transpiled by Next JS
declare module "*.module.css" {
  const content: any;
  export default content;
}
