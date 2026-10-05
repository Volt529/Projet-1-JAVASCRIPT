import type { Participation } from './Participation'

/**
 * Les statistiques olympiques d'un pays, sur l'ensemble de ses participations.
 */
export interface Olympic {
  id: number
  country: string
  participations: Participation[]
}
