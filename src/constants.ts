
export const HEIGHT = 100
export const WIDTH = 150
export const CELL_SIZE = 5
export const sandColors = ['#fff2f9', '#f2d2a9'];
export enum PARTICLE_TYPES {
  MOVABLE_SOLID = 'MOVABLE_SOLID',
  IMMOVABLE_SOLID = 'IMMOVABLE_SOLID',
  LIQUID = 'LIQUID',
  GAZ = 'GAZ'
}
export interface Position {
  x: number;
  y: number;
}