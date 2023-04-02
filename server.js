import app from './app/app.js'

const PORT = process.env.PORT || 7000

app.listen(PORT, console.log(`server is running on ${process.env.PORT}`));
