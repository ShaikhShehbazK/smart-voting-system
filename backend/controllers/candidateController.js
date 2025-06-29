const Candidate = require("../models/candidate");
const Voter = require("../models/user");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const cloudinary = require("../cloudinaryconfige");

//multer
const multer = require("multer");
const path = require("path");

const randomString = (length) => {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder to save images
  },
  filename: (req, file, cb) => {
    const fileName = randomString(10) + "-" + file.originalname;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true); // Accept the file
  } else {
    cb(null, false); // Reject the file
  }
};

const upload = multer({ storage, fileFilter });
//multer done

const checkUserRole = async (userId) => {
  try {
    const user = await Voter.findById(userId);
    if (user.role === "admin") return true;
  } catch (error) {
    return false;
  }
};

exports.postCreateCandidate = [
  upload.single("image"),
  async (req, res, next) => {
    if (!req.session.voter) {
      return res.status(403).json({ message: "You Must Login First" });
    } else {
      const userId = req.session.voter._id.toString();
      if (!(await checkUserRole(userId))) {
        return res.status(403).json({ message: "Your role is not admin" });
      }
      try {
        const upload = await cloudinary.uploader.upload(req.file.path);
        console.log(upload);
        const { name, age, party } = req.body;
        const image = upload.secure_url || null;
        const newCandidate = new Candidate({
          name,
          age,
          party,
          image,
        });

        const response = await newCandidate.save();

        res.status(200).json({ response: response });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
];

exports.putUpdateCandidate = [
  upload.single("image"),
  async (req, res, next) => {
    const userId = req.session.voter._id;
    if (!(await checkUserRole(userId)))
      return res.status(403).json({ message: "Your role is not admin" });
    try {
      const candidateId = req.params.candidateId;
      const { name, age, party } = req.body;
      console.log(name, age, party);
      const candidate = await Candidate.findById(candidateId);
      candidate.name = name;
      candidate.age = age;
      candidate.party = party;
      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        candidate.image ? candidate.image : ""
      );
      if (req.file) {
        if (imagePath) {
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }
        candidate.image = req.file.filename;
      }

      await candidate.save();

      if (!candidate) {
        return res.status(404).json({ message: "candidate is not found" });
      }
      res.status(200).json({ response: candidate });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
];

exports.deleteCandidate = async (req, res, next) => {
  const userId = req.session.voter._id;
  if (!(await checkUserRole(userId)))
    return res.status(403).json({ message: "Your role is not admin" });
  try {
    const candidateId = req.params.candidateId;
    console.log(candidateId);
    const candidate = await Candidate.findById(candidateId);

    const imagePath = path.join(
      __dirname,
      "..",
      "uploads",
      candidate.image ? candidate.image : ""
    );

    if (imagePath) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    const response = await Candidate.findByIdAndDelete(candidateId);

    if (!response) {
      return res.status(404).json({ message: "candidate is not found" });
    }
    console.log("candidate deleted sucessfully");
    res.status(200).json({ message: "candidate deleted sucessfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCandidate = async (req, res, next) => {
  try {
    const response = await Candidate.find();

    if (!response) {
      return res.status(404).json({ message: "candidate is not found" });
    }
    res.status(200).json({ response: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.postVote = async (req, res, next) => {
  try {
    const candidateId = req.params.candidateId;
    const userId = req.session.voter._id;
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const user = await Voter.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json("Admin are not allowed to vote");
    }
    if (user.isVoted) {
      return res.status(403).json("User can only vote at once");
    }

    candidate.votes.push({
      user: userId,
    });
    candidate.voteCount++;
    await candidate.save();

    user.isVoted = true;
    await user.save();

    res.status(200).json({ message: "vote recorded successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getVoteCount = async (req, res, next) => {
  try {
    const candidate = await Candidate.find().sort({ voteCount: "desc" });

    const voteRecord = candidate.map((data) => {
      return {
        id: data._id,
        name: data.name,
        party: data.party,
        count: data.voteCount,
      };
    });

    res.status(200).json(voteRecord);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
