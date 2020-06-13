// function untuk memvalidasi input registrasi user baru
module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  //initial error object
  const errors = {};
  //   cek username agar tidak kosong dan mengembalikan errors object dengan properties username
  if (username.trim() === "") {
    errors.username = "Username tidak boleh kosong";
  }

  //   // cek email agar tidak kosong dan memvalidasi dengan regular expresi dan jika ada error
  //   akan mengembalikan errors object dengan properties email
  if (email.trim() === "") {
    errors.email = "email tidak boleh kosong";
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = " email tidak valid";
    }
  }

  //check password apakah tidak kosong dan sama dengan konfirmasi passsword
  if (password === "") {
    errors.password = "password tidak boleh kosong";
  } else if (password !== confirmPassword) {
    errors.password = "password harus sama";
  }

  // mengembalikan hasil validasi object jika object errors kosong maka valif object akan bernial true
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

//function untuk menvalidasi form Login
module.exports.validateLoginInput = (username, password) => {
  // validasi username input agar tidak kosong
  const errors = {};
  if (username.trim() === "") {
    errors.username = " username tidak boleh kosong";
  }

  //validasi password agar tidak kosong

  if (password === "") {
    errors.password = " password tidak boleh kosong";
  }

  //mengembalikan type data object jika tidak ada error maka object valid akan bernilai true

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
