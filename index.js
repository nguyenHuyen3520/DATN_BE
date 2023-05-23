const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const mainRoutes = require("./routes");

app.use(express.json());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ credentials: true }));
app.use(bodyParser.json({ limit: '1000mb' }));
app.use(express.json({ limit: '1000mb' }));
app.use(bodyParser.urlencoded({ limit: '1000mb', extended: true }));
const db = require("./models");
// Routers
app.use('/api/', mainRoutes);

db.sequelize.sync().then(() => {
    app.listen(4000, () => {
        console.log("Server running on port 4000");
    });
}); 