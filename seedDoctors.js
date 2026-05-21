import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import doctorModel from "./models/doctorModel.js";

const sampleDoctors = [
    {
        name: "Dr. Sarah Johnson",
        email: "sarah@doctor.com",
        password: "doctor123",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
        speciality: "General Physician",
        degree: "MBBS, MD",
        experience: "10 years",
        about: "Experienced general physician specializing in preventive care and common illnesses.",
        available: true,
        fees: 500,
        address: { line1: "123 Medical Center", line2: "Mumbai" },
        date: Date.now()
    },
    {
        name: "Dr. Michael Chen",
        email: "michael@doctor.com",
        password: "doctor123",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
        speciality: "Dermatologist",
        degree: "MBBS, MD Dermatology",
        experience: "8 years",
        about: "Specialized in skin treatments, acne management, and cosmetic dermatology.",
        available: true,
        fees: 800,
        address: { line1: "456 Skin Clinic", line2: "Delhi" },
        date: Date.now()
    },
    {
        name: "Dr. Emily Williams",
        email: "emily@doctor.com",
        password: "doctor123",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
        speciality: "Gynecologist",
        degree: "MBBS, MD OBGYN",
        experience: "12 years",
        about: "Expert in women's health, pregnancy care, and reproductive medicine.",
        available: true,
        fees: 700,
        address: { line1: "789 Women's Hospital", line2: "Bangalore" },
        date: Date.now()
    },
    {
        name: "Dr. Raj Patel",
        email: "raj@doctor.com",
        password: "doctor123",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
        speciality: "Cardiologist",
        degree: "MBBS, MD Cardiology, DM",
        experience: "15 years",
        about: "Board-certified cardiologist specializing in heart disease prevention and treatment.",
        available: true,
        fees: 1000,
        address: { line1: "101 Heart Care Center", line2: "Hyderabad" },
        date: Date.now()
    },
    {
        name: "Dr. Lisa Anderson",
        email: "lisa@doctor.com",
        password: "doctor123",
        image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop",
        speciality: "Pediatrician",
        degree: "MBBS, MD Pediatrics",
        experience: "9 years",
        about: "Compassionate pediatrician dedicated to children's health and wellness.",
        available: true,
        fees: 600,
        address: { line1: "202 Children's Hospital", line2: "Chennai" },
        date: Date.now()
    },
    {
        name: "Dr. David Kumar",
        email: "david@doctor.com",
        password: "doctor123",
        image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop",
        speciality: "Orthopedic",
        degree: "MBBS, MS Orthopedics",
        experience: "11 years",
        about: "Expert in bone and joint treatments, sports injuries, and orthopedic surgery.",
        available: true,
        fees: 900,
        address: { line1: "303 Bone & Joint Center", line2: "Pune" },
        date: Date.now()
    },
    {
        name: "Dr. Priya Sharma",
        email: "priya@doctor.com",
        password: "doctor123",
        image: "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=400&h=400&fit=crop",
        speciality: "Neurologist",
        degree: "MBBS, MD Neurology, DM",
        experience: "13 years",
        about: "Specialized in brain and nervous system disorders, headache management.",
        available: true,
        fees: 1100,
        address: { line1: "404 Neuro Institute", line2: "Kolkata" },
        date: Date.now()
    },
    {
        name: "Dr. James Wilson",
        email: "james@doctor.com",
        password: "doctor123",
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop",
        speciality: "Ophthalmologist",
        degree: "MBBS, MS Ophthalmology",
        experience: "7 years",
        about: "Expert in eye care, cataract surgery, and vision correction treatments.",
        available: true,
        fees: 750,
        address: { line1: "505 Eye Hospital", line2: "Ahmedabad" },
        date: Date.now()
    },
    {
        name: "Dr. Anita Roy",
        email: "anita@doctor.com",
        password: "doctor123",
        image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop",
        speciality: "Psychiatrist",
        degree: "MBBS, MD Psychiatry",
        experience: "14 years",
        about: "Specialized in mental health, anxiety, depression, and behavioral therapy.",
        available: true,
        fees: 850,
        address: { line1: "606 Mental Health Center", line2: "Jaipur" },
        date: Date.now()
    },
{
        name: "Dr. Robert Singh",
        email: "robert@doctor.com",
        password: "doctor123",
        image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop",
        speciality: "ENT Specialist",
        degree: "MBBS, MS ENT",
        experience: "6 years",
        about: "Expert in ear, nose, throat treatments and sinus care.",
        available: true,
        fees: 550,
        address: { line1: "707 ENT Clinic", line2: "Surat" },
        date: Date.now()
    },
    {
        name: "Dr. Maria Garcia",
        email: "maria@doctor.com",
        password: "doctor123",
        image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400&h=400&fit=crop",
        speciality: "Gastroenterologist",
        degree: "MBBS, MD Gastroenterology",
        experience: "10 years",
        about: "Specialized in digestive system disorders and endoscopy.",
        available: true,
        fees: 950,
        address: { line1: "808 Gastro Center", line2: "Mumbai" },
        date: Date.now()
    },
    {
        name: "Dr. John Smith",
        email: "john@doctor.com",
        password: "doctor123",
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop",
        speciality: "Psychologist",
        degree: "MA Psychology, PhD",
        experience: "15 years",
        about: "Expert in cognitive behavioral therapy and mental health counseling.",
        available: true,
        fees: 700,
        address: { line1: "909 Mind Care", line2: "Delhi" },
        date: Date.now()
    },
    {
        name: "Dr. Priya Nair",
        email: "priyanair@doctor.com",
        password: "doctor123",
        image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop",
        speciality: "Dietitian",
        degree: "BSc Nutrition, MSc Dietetics",
        experience: "8 years",
        about: "Specialized in weight management and therapeutic diets.",
        available: true,
        fees: 450,
        address: { line1: "101 Nutrition Clinic", line2: "Bangalore" },
        date: Date.now()
    },
    {
        name: "Dr. Amit Kumar",
        email: "amit@doctor.com",
        password: "doctor123",
        image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop",
        speciality: "Urologist",
        degree: "MBBS, MS Urology, MCh",
        experience: "12 years",
        about: "Expert in urinary tract disorders and male reproductive health.",
        available: true,
        fees: 850,
        address: { line1: "202 Urology Center", line2: "Hyderabad" },
        date: Date.now()
    },
    {
        name: "Dr. Sophie Lee",
        email: "sophie@doctor.com",
        password: "doctor123",
        image: "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=400&h=400&fit=crop",
        speciality: "Pulmonologist",
        degree: "MBBS, MD Pulmonology",
        experience: "9 years",
        about: "Specialized in respiratory diseases, asthma and TB treatment.",
        available: true,
        fees: 750,
        address: { line1: "303 Lung Care", line2: "Chennai" },
        date: Date.now()
    },
    {
        name: "Dr. Rajesh Gupta",
        email: "rajesh@doctor.com",
        password: "doctor123",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
        speciality: "Nephrologist",
        degree: "MBBS, MD Nephrology, DM",
        experience: "11 years",
        about: "Expert in kidney diseases and dialysis management.",
        available: true,
        fees: 900,
        address: { line1: "404 Kidney Institute", line2: "Pune" },
        date: Date.now()
    },
    {
        name: "Dr. Anna White",
        email: "anna@doctor.com",
        password: "doctor123",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
        speciality: "Endocrinologist",
        degree: "MBBS, MD Endocrinology, DM",
        experience: "14 years",
        about: "Specialized in diabetes, thyroid and hormonal disorders.",
        available: true,
        fees: 1000,
        address: { line1: "505 Hormone Center", line2: "Kolkata" },
        date: Date.now()
    },
    {
        name: "Dr. Vikram Reddy",
        email: "vikram@doctor.com",
        password: "doctor123",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
        speciality: "Oncologist",
        degree: "MBBS, MD Oncology, MCh",
        experience: "16 years",
        about: "Expert in cancer diagnosis, chemotherapy and cancer care.",
        available: true,
        fees: 1200,
        address: { line1: "606 Cancer Center", line2: "Ahmedabad" },
        date: Date.now()
    },
    {
        name: "Dr. Neha Patel",
        email: "neha@doctor.com",
        password: "doctor123",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
        speciality: "Rheumatologist",
        degree: "MBBS, MD Rheumatology",
        experience: "7 years",
        about: "Specialized in arthritis and autoimmune diseases.",
        available: true,
        fees: 800,
        address: { line1: "707 Arthritis Clinic", line2: "Jaipur" },
        date: Date.now()
    }
];

const seedDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database Connected");

        // Clear existing doctors
        await doctorModel.deleteMany({});
        console.log("🗑️ Cleared existing doctors");

        // Add sample doctors
        for (const doctor of sampleDoctors) {
            const salt = await bcrypt.genSalt(10);
            doctor.password = await bcrypt.hash(doctor.password, salt);
            await doctorModel.create(doctor);
        }

        console.log(`✅ Added ${sampleDoctors.length} sample doctors`);
        console.log("\n📋 Doctor Specialties:");
        const specialties = [...new Set(sampleDoctors.map(d => d.speciality))];
        specialties.forEach(s => console.log(`   - ${s}`));

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

seedDoctors();