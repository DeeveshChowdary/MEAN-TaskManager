const mongoose=require('mongoose');
mongoose.Promise=global.Promise;
mongoose.connect("mongodb://localhost:27017/Taskmanager",{useNewUrlParser : true,useUnifiedTopology : true}).then(() => {
  
    console.log("connected to mongoDb successfully")}).catch((e)=>{
    console.log("error while attempting to connect to mongodb");
    console.log(e);
});

//to prevent deprecation warnings
mongoose.set('useCreateIndex',true);
mongoose.set('useFindAndModify',false);
module.exports={
    mongoose
};