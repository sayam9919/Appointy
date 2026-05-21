import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

import mongoose from "mongoose";
import doctorModel from "./models/doctorModel.js";
import userModel from "./models/userModel.js";
import appointmentModel from "./models/appointmentModel.js";

const seedAppointments = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database Connected");

        // Get a sample user (or create one)
        let user = await userModel.findOne({ email: "test@user.com" });
        
        if (!user) {
            const bcrypt = await import("bcrypt");
            const salt = await bcrypt.default.genSalt(10);
            const hashedPassword = await bcrypt.default.hash("test1234", salt);
            
            user = await userModel.create({
                name: "Test User",
                email: "test@user.com",
                password: hashedPassword
            });
            console.log("✅ Created test user");
        }

        // Get doctors
        const doctors = await doctorModel.find({});
        if (doctors.length === 0) {
            console.log("❌ No doctors found. Run seedDoctors.js first!");
            process.exit(1);
        }

        // Clear existing appointments
        await appointmentModel.deleteMany({});
        console.log("🗑️ Cleared existing appointments");

        // Create sample appointments
        const today = new Date();
        const appointments = [
            {
                userId: user._id.toString(),
                docId: doctors[0]._id.toString(),
                slotDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                slotTime: "10:00 AM",
                userData: { name: user.name, email: user.email, phone: "0000000000" },
                docData: { name: doctors[0].name, speciality: doctors[0].speciality, image: doctors[0].image },
                amount: doctors[0].fees,
                date: Date.now() - 2 * 24 * 60 * 60 * 1000,
                cancelled: false,
                payment: true,
                isCompleted: true
            },
            {
                userId: user._id.toString(),
                docId: doctors[2]._id.toString(),
                slotDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                slotTime: "2:00 PM",
                userData: { name: user.name, email: user.email, phone: "0000000000" },
                docData: { name: doctors[2].name, speciality: doctors[2].speciality, image: doctors[2].image },
                amount: doctors[2].fees,
                date: Date.now() + 1 * 24 * 60 * 60 * 1000,
                cancelled: false,
                payment: true,
                isCompleted: false
            },
            {
                userId: user._id.toString(),
                docId: doctors[4]._id.toString(),
                slotDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                slotTime: "11:00 AM",
                userData: { name: user.name, email: user.email, phone: "0000000000" },
                docData: { name: doctors[4].name, speciality: doctors[4].speciality, image: doctors[4].image },
                amount: doctors[4].fees,
                date: Date.now() + 3 * 24 * 60 * 60 * 1000,
                cancelled: false,
                payment: true,
                isCompleted: false
            },
            {
                userId: user._id.toString(),
                docId: doctors[1]._id.toString(),
                slotDate: today.toISOString().split('T')[0],
                slotTime: "4:00 PM",
                userData: { name: user.name, email: user.email, phone: "0000000000" },
                docData: { name: doctors[1].name, speciality: doctors[1].speciality, image: doctors[1].image },
                amount: doctors[1].fees,
                date: Date.now(),
                cancelled: false,
                payment: true,
                isCompleted: false
            }
        ];

        await appointmentModel.insertMany(appointments);
        console.log(`✅ Added ${appointments.length} sample appointments`);

        console.log("\n📋 Sample Appointments:");
        console.log("   1. Past appointment (completed)");
        console.log("   2. Today's appointment");
        console.log("   3. Tomorrow's appointment");
        console.log("   4. Future appointment (pending)");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

seedAppointments();