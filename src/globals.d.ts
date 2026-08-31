declare module "slip39/src/slip39"
declare module "*.pdf" {
  const src: string
  export default src
}
declare module "virtual:build-info" {
  export const commit: string
  export const date: string
}
