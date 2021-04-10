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
    /*
    const analyzeParams = {
        'html': '<html><head><title>Fruits</title></head><body><h1>Apples and Oranges</h1><p>I love apples! I don\'t like oranges.</p></body></html>',

        'features': {
            'emotion': {
                'targets': [
                    'apples',
                    'oranges'
                ]
            }
        }
    };
    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults, null, 2));
        res.send(JSON.stringify(analysisResults));
    })
    .catch(err => {
        console.log('error:', err);
    });*/
    return res.send({"happy":"90","sad":"10"});
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
    res.send(JSON.stringify(analysisResults.result.entities[0].sentiment.label) + "for" + req.query.url);
  })
  .catch(err => {
    console.log('error:', err);
  });



    //return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    /*
    const analyzeParams = {
        'html': '<html><head><title>Fruits</title></head><body><h1>Apples and Oranges</h1><p>I love apples! I don\'t like oranges.</p></body></html>',

        'features': {
            'emotion': {
                'targets': [
                    'apples',
                    'oranges'
                ]
            }
        }
    };
    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults, null, 2));
        res.send(JSON.stringify(analysisResults));
    })
    .catch(err => {
        console.log('error:', err);
    });*/
    return res.send({"happy":"90","sad":"10"});
});

app.get("/text/sentiment", (req,res) => {

    const analyzeParams = {
  'text': req.query.text,
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
    res.send(JSON.stringify(analysisResults.result.entities[0].sentiment.label) + "for" + req.query.text);
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

