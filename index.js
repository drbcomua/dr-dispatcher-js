const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

let storage = {}

function stringToHash(string) {
  let hash = 0;

  if (string.length === 0) return hash;

  let char;
  for (let i = 0; i < string.length; i++) {
    char = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return hash;
}

function nameToHash(name) {
  return stringToHash(name.firstName) ^ stringToHash(name.lastName)
}

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.post('/name', (request, response) => {
  const names = request.body
  let resp = {}
  let temp = {}
  names.forEach(name => {
    if(nameToHash(name) in storage) {
      resp[nameToHash(name)] = name
    } else {
      temp[nameToHash(name)] = name
    }
  })
  Object.keys(temp).forEach(key => storage[key] = temp[key])
  response.status(200).send(Object.values(resp))
})

app.delete('/name', (request, response) => {
  request.body.forEach(name => delete storage[nameToHash(name)])
  response.status(200).send("")
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})