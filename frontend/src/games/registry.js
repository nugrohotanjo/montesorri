import { lazy } from 'react';

export const CUSTOM_GAMES = {
  shape_puzzle: lazy(() => import('./ShapePuzzleGame')),
  bells: lazy(() => import('./SensoryBellsGame')),
  paint: lazy(() => import('./FingerPaintGame')),
  color_sort: lazy(() => import('./ColorSortingGame')),
  pink_tower: lazy(() => import('./PinkTowerGame')),
  missing_apples: lazy(() => import('./MissingApplesGame')),
  body_parts: lazy(() => import('./BodyPartsGame')),
};