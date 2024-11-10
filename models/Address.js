import mongoose from 'mongoose'

const AddressSchema = new mongoose.Schema ( {
  userId : String,
  address : String,
  city: String,
  pincode: String,
  phone: {
    type: String,
    unique: true
  },
  notes: String
}, {timestamps : true})

export const Address = mongoose.model("Address", AddressSchema
)