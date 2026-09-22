const mongoose = require("mongoose");

const laundryServiceSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
        trim: true 
    },

    description: { 
        type: String,
        trim: true
    },
    price: { 
        type: Number,
        required: true,
        min: 0 
    },
    turnaroundHours: { 
        type: Number,
        required: true,
        min: 1 
    },
    
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LaundryService", laundryServiceSchema);