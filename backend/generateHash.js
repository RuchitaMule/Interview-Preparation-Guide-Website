const bcrypt = require('bcrypt');

const password = "ruchi@123"; // <-- change this to your desired admin password

bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    console.log("Password hash:", hash);
});
