const express = require ("express") ; 
const bodyParser = require("body-parser"); 
const request = require("request"); 
const https = require("https"); 

const app = express(); 

app.use(express.static("public")); 
app.use(bodyParser.urlencoded({extended:true})); 

app.get("/", function(req,res){ 
  res.sendFile(__dirname + "/signup.html"); 
}); 

app.post("/", function(req,res){ 
   var firstname = req.body.firstName; 
   var lastname = req.body.lastName; 
   var email = req.body.inputEmail; 
   //var password = req.body.inputPassword; 

   var data = { 
        members: [ 
            {
                email_address : email,
                status: "subscribed", 
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname


                }
            }
        ] 
   }; 
   var jsonData = JSON.stringify(data); 
  //console.log(name, email, password); 

  const url = "https://us8.api.mailchimp.com/3.0/lists/84078c6404"; 
  const options = { 
      method: "POST", 
      auth: "yingtee:9b1e40d5b069d22a3d1b93944ca70791-us8"
  }

  const request = https.request(url, options, function(response){ 

    if (response.statusCode === 200) 
    {
        res.sendFile(__dirname + "/success.html"); 
        //res.send("Successfully subscribed!!"); 
    }

    else { 
        res.sendFile(__dirname + "/failure.html"); 
        //res.send("There is an error with signing up, please try it aain!"); 
    }

        response.on("data", function(data){
            console.log(JSON.parse(data)); 
        })
  })
    request.write(jsonData); 
    request.end(); 
}); 
//API key 
//9b1e40d5b069d22a3d1b93944ca70791-us8

//list ID AKA Audience ID 
//84078c6404
app.post("./failure", function (req,res){ 
    res.redirect("/"); 
}); 
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });