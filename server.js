const express = require("express");
const client = require("./pgManager");
const app = express();
require("./redis")
app.use(express.json());

app.post("/api/investor/create", async (request, response) => {
  const {
    investor_id,
    first_name,
    middle_name,
    last_name,
    pancard_no,
    aadhaar_no,
    date_of_birth,
    gender,
    occupation,
    passport_no,
  } = request.body;

  client
    .query(
      `INSERT into investor(investor_id,first_name,middle_name,last_name,pancard_no,aadhaar_no,date_of_birth,gender,occupation,passport_no)
            values ('${investor_id}', '${first_name}', '${middle_name}', '${last_name}', '${pancard_no}', '${aadhaar_no}', '${date_of_birth}', '${gender}', '${occupation}', '${passport_no}');`,
    )
    .then(async (value) => {
      console.log(JSON.stringify(value));
      //await client.end();
      response.send(value);
    })
    .catch(async (error) => {
      console.error(`Error ${error}`);
     //await client.end();
      response.json(error);
    });
});

app.listen(4000, () => {
  console.log("Server started");
});



// const express = require('express')
// const app = express()
const investorRoutes = require('./routes/investorRoutes')
const db = require('./utility/dbManager')
const fundRoutes = require("./routes/fundRoutes");
const sipRoutes = require("./routes/sipRoutes");

app.use(express.json())
app.use('/api/investor', investorRoutes)
app.use("/api/funds", fundRoutes);
app.use("/api/sips", sipRoutes);

// app.listen(3000, ()=>{
//     console.log('Server Started')
// })