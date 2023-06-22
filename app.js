//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.encodeURI({extended:true}));


app.get("/",(req,res) => {
   res.sendFile(__dirname + "/signup.html");
})

app.post("/",(req,res) => {
    const firstName=req.body.first;
    const lastName=req.body.last;
    const email = req.body.email;
    console.log(firstName +" " +lastName);


    const data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                     FNAME:firstName,
                     LNAME:lastName
                }
            }
        ]
    }

    const jsonData =JSON.stringify(data);

    const url="https://us21.api.mailchimp.com/3.0/lists/2e8f909bdb";


    const options={
        method:"POST",
        auth:"soumya:0d2d191b1f0215bbd47ff12490984612-us21"
    }

    const req_est=https.request(url,options,(response) => {

/*           if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
          }
          else{
            res.sendFile(__dirname+"/failure.html");
          } */
          response.on("data",(data) => {
            const dataObject = JSON.parse(data);
            if(response.statusCode===200){
                res.sendFile(__dirname+"/success.html");
            }
            else{
                res.sendFile(__dirname+"/failure.html");
            }
            console.log(dataObject);
          })
                    
    })
    req_est.write(jsonData);
    req_est.end();
})


app.post("/failure",(req,res) => {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,() => {
    console.log("server stared at port 3000");
})