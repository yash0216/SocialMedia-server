const mongoose = require("mongoose");

module.exports = async () => {
  const mongoURI = process.env.DATA_BASE_URI;
  // "mongodb+srv://pandeyyash613:pandey022001@cluster0.cqo2rag.mongodb.net/?retryWrites=true&w=majority";
  try {
    const connect = await mongoose.connect(mongoURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
