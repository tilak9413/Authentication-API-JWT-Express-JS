import mongoose from "mongoose";

async function dbconeection(url) {
  try {
    const DBoptions ={
        dbname:"login"
    }
    await mongoose.connect(url, DBoptions);
  } catch (error) {
    console.log(error);
  }
}
export default dbconeection;
