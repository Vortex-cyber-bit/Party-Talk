import Database from "better-sqlite3";
import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))

const db = new Database("data.db");
db.exec(`
    CREATE TABLE IF NOT EXISTS notices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);


export async function updatePost(id, content){
  const updateCommand = db.prepare(`
    UPDATE notices SET content = ? WHERE id = ?
`);

updateCommand.run(content, id);

}


export async function deletePost(id){
  
  const deleteCommand = db.prepare(`
    DELETE FROM notices WHERE id = ?
`);

deleteCommand.run(id);

}



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  }) 

  app.post('/create-post', async (req, res) => {
    console.log(req.body);
    if (!req.body){
      return res.status(400).send('No body found');
    }
    const { content } = req.body;
  console.log(content);
  console.log(req.body);
    if (!content || content.length < 5){
      return res.status(400).send('Content is required and must be at least 5 characters long');
    }
    const insertStoryCommand = db.prepare(`
        INSERT INTO notices (content)
        VALUES ($content)
    `);
    insertStoryCommand.run({content});
    // res.send(story)
    res.redirect('/');
  }) 

  app.post('/update-post/:id', (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    console.log(id)
    updatePost(id, content);
    res.redirect('/');
  });

  app.delete('/delete-post/:id', (req, res) => {
    const { id } = req.params;
    console.log(id)
    deletePost(id);
    res.json({success: true});
  });
  
  app.get('/notices', (req, res) => {
    const selectCommand = db.prepare(`
      SELECT * FROM notices
    `);
    const notices = selectCommand.all();
    res.json(notices);
  });
