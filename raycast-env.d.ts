/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `play-game` command */
  export type PlayGame = ExtensionPreferences & {
  /** Include Hidden Games - Show games that are marked as hidden in Playnite */
  "includeHidden": boolean,
  /** Default Filter - The default filter to apply when opening the command */
  "defaultFilter": "installed" | "notInstalled" | "all"
}
}

declare namespace Arguments {
  /** Arguments passed to the `play-game` command */
  export type PlayGame = {}
}

