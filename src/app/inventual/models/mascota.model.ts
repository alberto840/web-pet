export interface MascotaModel {
    petId?:         number;
    petName:       string;
    petBreed:      string;
    petAge:        string;
    weight:        number;
    height:        number;
    gender:        string;
    allergies:     string;
    behaviorNotes: string;
    birthDate:     Date;
    species:      string;
    userId:        number;
    imageUrl?:     string;
}
