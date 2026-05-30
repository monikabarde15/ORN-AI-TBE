import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "./s3";

console.log("REGION =>", process.env.AWS_REGION);
console.log("BUCKET =>", process.env.AWS_BUCKET_NAME);

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME!,

    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: (req, file, cb) => {
      console.log(
        "UPLOADING =>",
        file.originalname
      );

      cb(
        null,
        `omi-file/${Date.now()}-${file.originalname}`
      );
    },
  }),
});