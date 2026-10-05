import type { Olympic } from '../models/Olympic'

/**
 * Fonctions de calcul pures, réutilisables entre les pages.
 * Extraites du composant pour être testables isolément (voir notes-architecture.md, anti-pattern 6).
 */

export const calculateTotalMedals = (olympic: Olympic): number =>
  olympic.participations.reduce((sum, p) => sum + p.medalsCount, 0)

export const calculateTotalAthletes = (olympic: Olympic): number =>
  olympic.participations.reduce((sum, p) => sum + p.athleteCount, 0)

export const calculateTotalParticipations = (olympic: Olympic): number =>
  olympic.participations.length
