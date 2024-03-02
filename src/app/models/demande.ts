export type Demande = {
    _id?: string
    nom_emetteur: string
    nom_destinataire: string
    numero_emetteur: string
    numero_destinataire: string
    service_emetteur: Service
    service_destinataire: Service
    montant: number
    statut: Statut
    message?: string
}

export type Service = 'Bankily' | 'Massrivi'

export type Statut = 0 | 1 | 2
