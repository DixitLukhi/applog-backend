const mongoose = require("mongoose");
// const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    otp: {
      type: String,
      required: false,
      index: { expires: 120 },
    },
  },
  { timestamps: true, strict: false, autoIndex: true }
);

// userSchema
//   .virtual("pass")
//   .set(function (pass) {
//     this._pass = pass;
//     this.salt = uuidv4();
//     this.password = this.securePassword(pass);
//   })
//   .get(function () {
//     return this._pass;
//   });

// userSchema.methods = {
//   authenticate: function (plainPassword) {
//     return this.securePassword(plainPassword) === this.password;
//   },

//   securePassword: function (plainPassword) {
//     if (!plainPassword) return "";
//     try {
//       return crypto
//         .createHmac("sha256", this.salt)
//         .update(plainPassword)
//         .digest("hex");
//     } catch (error) {
//       console.log(error);
//       return "";
//     }
//   },
// };

const User = mongoose.model("User", userSchema);

module.exports = { User };
