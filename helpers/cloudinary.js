import cloudinary from 'cloudinary'
import multer from 'multer'


cloudinary.config({
  cloud_name: 'dagfnwi1d',
  api_key : "245626317688613",
  api_secret: 'OHT4f6cap1UMVt1B8rxgAMiHIa0'
});

const storage = new multer.memoryStorage();

async function ImageUploadUtil(file){
  const result = await cloudinary.uploader.upload(file, {
    resource_type: 'auto',
  })

  return result;

}

const upload = multer({storage})

export  {upload, ImageUploadUtil}