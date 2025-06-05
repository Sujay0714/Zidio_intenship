import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI)
        if (mongoose.connection.on) {
            console.log('Database connected successfully');
        }
    } catch (error) {
        console.log(error.message);
        process.exit(1)
    }
}

export default connectDB