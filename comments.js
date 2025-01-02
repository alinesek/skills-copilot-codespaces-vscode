// Create web server
// Use express.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/comments', (req, res) => {
  const comment = req.body.comment;
  const commentObj = {
    comment,
    id: new Date().getTime()
  };

  fs.readFile('comments.json', 'utf8', (err, data) => {
    if (err) {
      fs.writeFileSync('comments.json', JSON.stringify([commentObj]));
    } else {
      const comments = JSON.parse(data);
      comments.push(commentObj);
      fs.writeFileSync('comments.json', JSON.stringify(comments));
    }
    res.json(commentObj);
  });
});

app.get('/comments', (req, res) => {
  fs.readFile('comments.json', 'utf8', (err, data) => {
    if (err) {
      res.json([]);
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});