require("dotenv").config()

// מודולים חיצוניים
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

// קבצים פנימיים
const corsOptions = require("./config/corsOptions")
const connectDB = require("./config/dbconn")

// הגדרות כלליות
const PORT = process.env.PORT || 1234
const app = express()

// התחברות למסד נתונים
connectDB()

// מידלוורים
app.use(cors(corsOptions))
app.use(express.json())

// ראוטים
app.use('/api/lesson', require("./routes/lessonRoute"))
app.use('/api/student', require("./routes/studentRoute"))
app.use('/api/user', require("./routes/userRoute"))
app.use('/api/schedule', require("./routes/weeklyScheduleRoute"))

// ראוט ברירת מחדל
app.get('/', (req, res) => res.send("welcome!!"))

// התחלת האזנה לשרת לאחר חיבור למסד נתונים
mongoose.connection.once('open', () => {
    app.listen(PORT, () => console.log(`The project is running on port ${PORT}`))
})

// טיפול בשגיאות במסד נתונים
mongoose.connection.on('error', err => {
    console.log(err)
})
