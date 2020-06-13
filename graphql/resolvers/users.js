const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { UserInputError } = require("apollo-server");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");

const { SECRET_KEY } = require("../../config");

//generate token
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      //inisialisasi validasi input login
      const { valid, errors } = validateLoginInput(username, password);

      //cek validasi dari input login
      if (!valid) {
        throw new UserInputError("errors", { errors });
      }
      //mencari nilai username di server
      const user = await User.findOne({ username });

      //cek jika username tidak ada di server
      if (!user) {
        errors.general = "username tidak ditemukan";
        throw new UserInputError("username tidak di temukan", { errors });
      }

      //mencari dan inisialisai nilai password di server
      const match = await bcrypt.compare(password, user.password);

      //cek jika password tidak sama
      if (!match) {
        errors.general = "Crendtial errors";
        throw new UserInputError("Credentials errors", { errors });
      }

      //membuat token
      const token = generateToken(user);

      //mengembalikan nilai object
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      // TODO: validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      // TODO: Make sure user doesnt already exsist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("username sudah terpakai", {
          errors: {
            username: " username ini sudah ada yg pakai",
          },
        });
      }

      //  hash password and create auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
