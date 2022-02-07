const express = require('express')
const app = express()
const cors = require('cors')
const moment = require('moment-timezone')
app.use(cors())
const PORT = process.env.PORT || 8800
const apiroot = '/api'

app.use((req, res, next) => {
  console.log(`${req.method} : ${req._parsedUrl.path}`)
  next()
})

app.get(`${apiroot}/:inputDate?`, async (req, res) => {
  // input
  let { inputDate } = req.params

  // check if the inout is valid
  const validationRegexp = /[^0-9]/
  const isValid = !!!validationRegexp.exec(inputDate)
  if (isValid) {
    res.json({ error : "Invalid Date" })
    return;
  }
  // do parseInt if input is unix also check if the inout actually contains any date at all or not
  // return current date on empty input
  const regexp = /-/
  const isItUnix = !!!regexp.exec(inputDate)
  inputDate = inputDate && isItUnix ? parseInt(inputDate) : inputDate
  console.log(isItUnix, inputDate);
  // Make sure of the date interpreted as UTC
  const date = moment.tz(inputDate, 'gmt')
  
  // output with the formats required
  res.json({
    unix: parseInt(date.format("x")),
    utc: date.format("ddd, DD MMM YYYY HH:mm:ss z"),
  })
})

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))