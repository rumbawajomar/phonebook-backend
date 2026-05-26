require('dotenv').config()
const express = require('express')
const Person = require('./models/person')

const app = express()
app.use(express.static('dist'))

app.use(express.json())

const errorHandler = (error, request, response, next) => {
  console.log(error.name)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// TODO: GET DATA LENGTH
// app.get('/info', (request, response) => {
//   response.send(
//     `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`,
//   )
// })

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name must be unique',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedPerson) => {
    response.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
