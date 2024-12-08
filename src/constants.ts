
export const HEIGHT = 100
export const WIDTH = 100
export const CELL_SIZE = 6
export const FPS = 120;
export const SPAWN_AMOUNT_Y = 5;
export const SPAWN_AMOUNT_X = 5;
export const sandColors = ['#fff2f9', '#f2d2a9'];
export const waterColor = '#00bdf7';
export enum ACTION_TYPE_STEP {
  'MOVE' = 'MOVE',
  'STILL' = 'STILL',
  'SWAP' = 'SWAP',
}
export enum MATERIAL_TYPES {
  WATER = 'WATER',
  SAND = 'SAND',
  EMPTY = 'EMPTY',
}
export enum PARTICLE_FAMILY_TYPES {
  SOLID = 'SOLID',
  LIQUID = 'LIQUID',
  GAZ = 'GAZ',
  EMPTY = 'EMPTY',
}
export enum PARTICLE_SOLID_FAMILY_TYPES {
  MOVABLE_SOLID = 'MOVABLE_SOLID',
  IMMOVABLE_SOLID = 'IMMOVABLE_SOLID',
}
export interface Position {
  x: number;
  y: number;
}

export enum DIRECTION {
  DOWN = 'DOWN',
  DOWN_LEFT = 'DOWN_LEFT',
  DOWN_RIGHT = 'DOWN_RIGHT',
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
  STILL = 'STILL',
}