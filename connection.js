import mongoose, { connect } from "mongoose";

import dotenv from "dotenv";
dotenv.config();

async function Connect() {
    
  console.log(process.env.DB_URL);

  const ab = await mongoose.connect(process.env.DB_URL, {
      useUnifiedTopology: true,
     
    }).then(() => {

      console.log("DataBase is connected !");

    }).catch((error) => {

      console.log(error);

    });
}

export default Connect;
