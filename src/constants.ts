
export const HEIGHT = 50
export const WIDTH = 50
export const CELL_SIZE = 15
export const sandColors = ['#fff2f9', '#f2d2a9'];
export const waterColors = ['#4682b4', '#00bdf7'];
export enum PARTICLE_TYPES {
  MOVABLE_SOLID = 'MOVABLE_SOLID',
  IMMOVABLE_SOLID = 'IMMOVABLE_SOLID',
  SOLID = 'SOLID',
  LIQUID = 'LIQUID',
  GAZ = 'GAZ',
  WATER = 'WATER',
  SAND = 'SAND',
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