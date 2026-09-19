#!/usr/bin/env node
/**
 * Regenerates .expo/types/router.d.ts without starting the dev server.
 * Expo only rewrites the typed-routes file from `expo start`, so after adding or
 * renaming a screen, `tsc` sees stale routes until this runs.
 */
const path = require('node:path');

process.env.EXPO_ROUTER_APP_ROOT = path.resolve(__dirname, '..', 'src', 'app');

const typedRoutes = require(require.resolve('@expo/router-server/build/typed-routes', {
  paths: [require.resolve('@expo/cli/package.json', { paths: [require.resolve('expo/package.json')] })],
}));

typedRoutes.regenerateDeclarations(path.resolve(__dirname, '..', '.expo', 'types'), {});
// regenerateDeclarations is debounced (1s); keep the process alive until it has written.
setTimeout(() => console.log('Typed routes regenerated.'), 1500);
