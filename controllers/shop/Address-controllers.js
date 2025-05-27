import { Address } from "../../models/Address.js"

const addAddress = async(req,res) => {
  try{

        console.log("Add address working on frontend")

    const {userId, address, city, pincode, phone, notes} = req.body
    


    if(!userId || !address || !city || !pincode || !phone || !notes) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all data'
      })
    }

    const existing = await Address.findOne({ phone });
if (existing) {
  return res.status(400).json({
    success: false,
    message: "Phone number already exists.",
  });
}


    const newlyCreatedAddress = new Address({
      userId, address, city, pincode, notes, phone
    })
    
    await newlyCreatedAddress.save();

    res.status(200).json({
      success: true,
      data: newlyCreatedAddress
    })
   
  }catch(e){
    console.log(e)
    res.status(500).json({
      success : false,
      message: 'Some error occoured'
    })
  }
}

const fetchAllAddress = async(req,res) => {
  try{

    const {userId} = req.params
    
    if(!userId) {
      return res.status(400).json({
        success: false,
        message: 'User not Found'
      })
    }

    const addressList = await Address.find({userId})

    res.status(200).json({
      success: true,
      data: addressList
    })
  }catch(e){
    console.log(e)
    res.status(500).json({
      success : false,
      message: 'Some error occoured'
    })
  }
}

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required!",
      });
    }

    const address = await Address.findOneAndUpdate(
      {
        _id: addressId,
        userId,
      },
      formData,
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};
const deleteAddress = async(req,res) => {
  try{
    const {userId, addressId} = req.params;

    if(!userId || !addressId){
      return res.status(400).json({
        success: false,
        message: 'User and address id is required!'
      })
    }

    const address = await Address.findOneAndDelete({_id: addressId, userId})

    if(!address){
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    })

  }catch(e){
    console.log(e)
    res.status(500).json({
      success : false,
      message: 'Some error occoured'
    })
  }
}

export {addAddress, editAddress, deleteAddress, fetchAllAddress}