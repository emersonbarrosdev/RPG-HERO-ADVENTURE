/**
 * Compatibility shim for Phaser 3.90 typings on modern TypeScript/DOM libs.
 * Phaser still references the legacy Internet Explorer ActiveXObject type in
 * its XML parser declaration, although modern browsers use DOMParser.
 *
 * This is type-only and does not add or execute ActiveX at runtime.
 */
type ActiveXObject = unknown;
