import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
// Configuration
cloudinary.config({
  cloud_name: "domcmvqa3",
  api_key: "153453261455218",
  api_secret: "lYrRXHa1AKH2dGp5WURusWwEgco", // Click 'View API Keys' above to copy your API secret
});

export const UploadImageonCloudinary = async (imagepath) => {
  const res = await cloudinary.uploader.upload(imagepath);
  fs.unlinkSync(imagepath);

  return res.url;
};

export const UploadmutipleimagesonCloudinary = async (filearray) => {
  let fileObject = [];
  if (filearray.length > 0) {
    for (let i = 0; i < filearray.length; i++) {
      const res = await cloudinary.uploader.upload( filearray[i],{resource_type:"auto"})
      fs.unlinkSync(filearray[i]);
      fileObject.push(res.url);
    }
  }

  return fileObject;
};
