const type = require("tcomb");
const { maybe, list, enums, struct } = type;

module.exports = {
  Animal: struct(
    {
      adoptFee: type.Number,
      age: type.Number,
      animalType: type.String,
      breed: type.String,
      color: list(type.String),
      dateAvailable: type.Any,
      description: type.String,
      id: type.String,
      imageUrl: type.String,
      kennel: maybe(type.String),
      location: maybe(type.String),
      name: type.String,
      sex: enums.of("NA M F", "sex"),
      weight: type.Number
    },
    "Animal"
  )
};
