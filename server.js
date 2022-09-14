const express = require("express");
const cors = require("cors"); // to avoid CORS error: npm install cors
const app = express();
const { cloudinary } = require("./utils/cloudinary");

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

app.get("/api/images", async (req, res) => {
  const { resources } = await cloudinary.search
    .expression("folder:dev_setups")
    .sort_by("public_id", "desc")
    .execute();
  const publicIds = resources.map((file) => file.secure_url);
  res.send(publicIds);
});

app.post("/api/upload", async (req, res) => {
  try {
    const { base64EncodedImage } = req.body.data;
    // console.log('body', req.body);
    const uploadedResponse = await cloudinary.uploader.upload(
      base64EncodedImage,
      {
        upload_preset: "dev_setups",
        /* transformation: {
          width: 350,
        },*/
      }
    );
    res.json({ url: uploadedResponse.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: "Something went wrong" });
  }
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

/* Start server: social/social/server: nodemon server.js*/
