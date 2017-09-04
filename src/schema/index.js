const type = require("tcomb");
const { maybe, list, enums, struct } = type;

module.exports = {
  Animal: struct(
    {
      adoptFee: maybe(type.Number),
      age: maybe(type.Number),
      animalType: maybe(type.String),
      breed: maybe(type.String),
      color: maybe(list(type.String)),
      dateAvailable: maybe(type.Number),
      description: maybe(type.String),
      id: maybe(type.String),
      imageUrl: maybe(type.String),
      kennel: maybe(type.String),
      location: maybe(type.String),
      name: maybe(type.String),
      sex: maybe(enums.of("M F", "sex")),
      weight: maybe(type.Number)
    },
    "Animal"
  )
};
