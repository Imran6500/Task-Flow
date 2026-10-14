const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
    name:{
        type:String,
        required:true
        ,
        trim:true,
        minlength:3,
        maxlength:100,

    },

    description:{
        type:String,
        trim:true,
        default:""
    },

    status:{
        type:String,
        enum:["ACTIVE", "ARCHIVED"],
        default:"ACTIVE"
    },
},
{
    timestamps:true
}
);

projectSchema.index({ status: 1, createdAt: -1, _id: -1 });

module.exports = mongoose.model("Project", projectSchema);