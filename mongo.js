const mongoose = require("mongoose");

// if (process.argv.length < 5) {
//   console.log("missing arguments");
//   process.exit(1);
// }

const password = process.argv[2];

const url = `mongodb+srv://rumbawajomar:${password}@cluster0.ndnuu0s.mongodb.net/phonebookApp?appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const personSchema = {
  name: String,
  number: String,
};

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  person.save().then((result) => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log("missing arguments");
  process.exit(1);
}
