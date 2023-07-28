const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_URI;

main().catch((err: any) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);
    console.log("I connected");
}
