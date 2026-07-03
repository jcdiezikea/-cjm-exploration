import { SKAPA_PACKAGE_NAME } from './skapaConfig.ts'

export async function probeSkapaPackage(): Promise<string> {
  try {
    // TODO: Replace SKAPA_PACKAGE_NAME with your actual package and provider imports.
    await import(/* @vite-ignore */ SKAPA_PACKAGE_NAME)
    return `Skapa package resolved successfully: ${SKAPA_PACKAGE_NAME}`
  } catch {
    return `Could not resolve ${SKAPA_PACKAGE_NAME}. Configure npm registry/auth and install the package.`
  }
}
