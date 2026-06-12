import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "./s3";

console.log(
  "REGION =>",
  process.env.AWS_REGION
);

console.log(
  "BUCKET =>",
  process.env.AWS_BUCKET_NAME
);

export const upload = multer({

  limits: {
    fileSize:
      500 * 1024 * 1024, // 500MB
  },

  fileFilter: (
    req,
    file,
    cb
  ) => {

    const allowedMimeTypes = [

      // Videos
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
      "video/webm",

      // PDF
      "application/pdf",

      // Images
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (
      allowedMimeTypes.includes(
        file.mimetype
      )
    ) {

      cb(null, true);

    } else {

      cb(
        new Error(
          "Only PDF, Image and Video files are allowed"
        )
      );
    }
  },

  storage: multerS3({

    s3,

    bucket:
      process.env
        .AWS_BUCKET_NAME!,

    contentType:
      multerS3.AUTO_CONTENT_TYPE,

    key: (
      req,
      file,
      cb
    ) => {

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