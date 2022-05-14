const Joi = require("Joi"); // Joi validator

//registrering av konto validering
const registerValidation = (data) => {
  const schema = Joi.object({
    name: {
      first: Joi.string().min(2).max(50).required(),
      last: Joi.string().min(2).max(50).required(),
    },
    company: Joi.string().min(0).max(100),
    email: Joi.string().min(2).max(100).required().lowercase().email(),
    password: Joi.string().min(8).max(1024).required(),
    role: Joi.string().min(2).max(100).required(),
  });
  return schema.validate(data);
};
//uppdatera användare validering
const updateProfileValidation = (data) => {
  const schema = Joi.object({
    name: {
      first: Joi.string().min(2).max(50).required(),
      last: Joi.string().min(2).max(50).required(),
    },
    company: Joi.string().min(0).max(100),
    bio: Joi.string().min(0).max(500),
    profilePicture: Joi.string().min(0).max(120),
  });
  return schema.validate(data);
};

//validering av inloggning
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(10).max(100).required().lowercase().email(),
    password: Joi.string().min(8).max(1024).required(),
  });
  return schema.validate(data);
};

//validering av skapa album
const createAlbumValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    description: Joi.string().min(10).max(500),
    tags: Joi.string().min(2).max(100),
    cover: Joi.string().min(2).max(200),
    owner: Joi.string().min(2).max(200).required(),
  });
  return schema.validate(data);
};

//Validering av att skapa fotografier
const createPhotoValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    owner: Joi.string().min(2).max(200).required(),
    album: Joi.string().min(2).max(200).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.updateProfileValidation = updateProfileValidation;
module.exports.loginValidation = loginValidation;
module.exports.createAlbumValidation = createAlbumValidation;
module.exports.createPhotoValidation = createPhotoValidation;
