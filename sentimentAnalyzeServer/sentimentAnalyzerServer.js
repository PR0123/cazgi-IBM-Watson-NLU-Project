const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');
    
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
     const analyzeParams = {
  'url': req.query.url,
  'features': {
    'entities': {
      'emotion': true
    }, 
    'keywords': {
      'emotion': true
    }, 
  }
};

getNLUInstance().analyze(analyzeParams)
  .then(analysisResults => {
    //console.log(JSON.stringify(analysisResults, null, 2));
    tmp = analysisResults.result.entities[0].emotion
    res.send({emotions: tmp});
    //res.send(req.query.text)
  })
  .catch(err => {
    console.log('error:', err);
  });
    //return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {

    const analyzeParams = {
  'url': req.query.url,
  'features': {
    'entities': {
      'sentiment': true,
      'limit': 1
    }
  }
};

getNLUInstance().analyze(analyzeParams)
  .then(analysisResults => {
    console.log(JSON.stringify(analysisResults, null, 2));
    res.send(JSON.stringify(analysisResults.result.entities[0].sentiment.label));
  })
  .catch(err => {
    console.log('error:', err);
  });



    //return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
   const analyzeParams = {
  'text': req.query.text,
  'features': {
    'entities': {
      'emotion': true,
      'limit': 1
    }, 
    'keywords': {
      'emotion': true
    }, 
  }
};

getNLUInstance().analyze(analyzeParams)
  .then(analysisResults => {
    //console.log(JSON.stringify(analysisResults, null, 2));
    res.send({emotions: analysisResults.result.keywords[0].emotion});
    //res.send(req.query.text)
  })
  .catch(err => {
    console.log('error:', err);
  });

   //return res.send({"happy":"90","sad":"10"});
});

app.get("/text/sentiment", (req,res) => {

    const analyzeParams = {
  'text': req.query.text,
  'features': {
    'entities': {
      'sentiment': true,
      'limit': 1
    }, 
    'keywords': {
      'sentiment': true
    }, 
  }
};

getNLUInstance().analyze(analyzeParams)
  .then(analysisResults => {
    console.log(JSON.stringify(analysisResults, null, 2));
    res.send(JSON.stringify(analysisResults.result.keywords[0].sentiment.label));
    //res.send(req.query.text)
  })
  .catch(err => {
    console.log('error:', err);
  });


    //return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

