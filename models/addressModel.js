const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  address: [
    {
      level1_id: String,
      name: String, 
      type: String,    
      level2s: [
        {
          level2_id: String,
          name: String,   
          type: String,  
          level3s: [
            {
              level3_id: String,
              name: String,  
              type: String   
            }
          ]
        }
      ]
    }
  ]
});

module.exports = mongoose.model("Address", new mongoose.Schema({}, { strict: false }), "address");