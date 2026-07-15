/**
 * Basis-Pfad für Deployments unter einem Unterordner (z. B. GitHub Pages:
 * https://d-gulyas.github.io/paul-grunau-website/).
 *
 * Wird zur Build-Zeit über die Env-Variable NEXT_PUBLIC_BASE_PATH gesetzt.
 * Ohne die Variable (Standard, z. B. Deployment auf grunau.mobi) ist er leer,
 * sodass alles wie gewohnt vom Root aus läuft.
 *
 * next/link und next/image berücksichtigen basePath automatisch. Nur bei
 * nackten <img src="/..."> und <a href="/..."> muss der Pfad manuell mit
 * asset() vorangestellt werden.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) => `${basePath}${path}`;
