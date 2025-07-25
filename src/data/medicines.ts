export interface Medicine {
  id: number;
  name: string;
  genericName: string;
  category?: string;
  manufacturer?: string;
  dosage?: string;
  description?: string;
  sideEffects?: string[];
  price: number;
  inStock?: boolean;
}

export const medicines: Medicine[] = [
  {
    id: 1,
    name: "Paracetamol",
    genericName: "Acetaminophen",
    category: "Pain Relief",
    manufacturer: "PharmaCorp",
    price: 5.99,
    dosage: "500mg",
    description: "Used for pain relief and fever reduction",
    sideEffects: ["Nausea", "Allergic reactions"],
    inStock: true
  },
  {
    id: 2,
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    category: "Pain Relief",
    manufacturer: "MediHealth",
    price: 8.50,
    dosage: "200mg",
    description: "Anti-inflammatory pain reliever",
    sideEffects: ["Stomach upset", "Drowsiness"],
    inStock: true
  },
  {
    id: 3,
    name: "Amoxicillin",
    genericName: "Amoxicillin",
    category: "Antibiotic",
    manufacturer: "BioMed",
    price: 12.75,
    dosage: "250mg",
    description: "Broad-spectrum antibiotic for bacterial infections",
    sideEffects: ["Diarrhea", "Nausea", "Skin rash"],
    inStock: true
  },
  {
    id: 4,
    name: "Aspirin",
    genericName: "Acetylsalicylic acid",
    category: "Pain Relief",
    manufacturer: "HealthPlus",
    price: 4.25,
    dosage: "100mg",
    description: "Pain reliever and blood thinner",
    sideEffects: ["Stomach irritation", "Bleeding"],
    inStock: false
  },
  {
    id: 5,
    name: "Lisinopril",
    genericName: "Lisinopril",
    category: "Blood Pressure",
    manufacturer: "CardioMed",
    price: 15.99,
    dosage: "10mg",
    description: "ACE inhibitor for high blood pressure",
    sideEffects: ["Dry cough", "Dizziness"],
    inStock: true
  },
  {
    id: 6,
    name: "Metformin",
    genericName: "Metformin HCl",
    category: "Diabetes",
    manufacturer: "DiabetCare",
    price: 18.50,
    dosage: "500mg",
    description: "Type 2 diabetes medication",
    sideEffects: ["Nausea", "Diarrhea", "Metallic taste"],
    inStock: true
  },
  {
    id: 7,
    name: "Omeprazole",
    genericName: "Omeprazole",
    category: "Digestive",
    manufacturer: "GastroHealth",
    price: 22.99,
    dosage: "20mg",
    description: "Proton pump inhibitor for acid reflux",
    sideEffects: ["Headache", "Diarrhea", "Abdominal pain"],
    inStock: true
  },
  {
    id: 8,
    name: "Cetirizine",
    genericName: "Cetirizine HCl",
    category: "Allergy",
    manufacturer: "AllergyFree",
    price: 7.75,
    dosage: "10mg",
    description: "Antihistamine for allergies",
    sideEffects: ["Drowsiness", "Dry mouth"],
    inStock: true
  },
  {
    id: 9,
    name: "Simvastatin",
    genericName: "Simvastatin",
    category: "Cholesterol",
    manufacturer: "HeartCare",
    price: 25.50,
    dosage: "20mg",
    description: "Statin for cholesterol management",
    sideEffects: ["Muscle pain", "Liver problems"],
    inStock: false
  },
  {
    id: 10,
    name: "Levothyroxine",
    genericName: "Levothyroxine Sodium",
    category: "Hormone",
    manufacturer: "EndoMed",
    price: 19.99,
    dosage: "50mcg",
    description: "Thyroid hormone replacement",
    sideEffects: ["Rapid heartbeat", "Insomnia"],
    inStock: true
  }
];
