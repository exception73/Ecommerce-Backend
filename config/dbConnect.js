import mongoose from 'mongoose';


 const connectDatabase = async () => {
   try{
    mongoose.set('strictQuery', true);
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongo database is connected!!! ${connect.connection.host} `)
   }catch(e){
    console.log(e);
    // process.exit(1);
   }
}


export default connectDatabase;