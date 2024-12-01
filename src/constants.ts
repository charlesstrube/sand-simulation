
export const HEIGHT = 40
export const WIDTH = 40
export const CELL_SIZE = 10
export const sandColors = ['#fff2f9', '#f2d2a9'];
export const waterColors = ['#a2d2ff', '#4682b4'];
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