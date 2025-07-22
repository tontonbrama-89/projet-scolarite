Élève (id, nom, prénom, sexe, date de naissance, classe_id, année_id, contact parent)

Classe (id, nom, niveau, salle, année_id)

Enseignant (id, nom, spécialité, contact)

Matière (id, nom, enseignant_id, classe_id)

Note (id, eleve_id, matière_id, période, note)

Paiement (id, eleve_id, type_frais, montant, date_paiement, statut)

Utilisateur (id, nom_utilisateur, mot_de_passe_hashé, rôle_id)

Rôle (id, nom)

Année scolaire (id, libellé, date_début, date_fin)