const express = require('express');
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
var fileupload = require('express-fileupload')
const authorize = require('./middleware/authorize')
// require("dotenv").config();
// const { TOKEN_KEY } = secret.env;


const pool = require('./db')

app.use(express.json())
app.use(cors())
app.use(fileupload())
app.use("/uploads",express.static("uploads"))


app.post('/login', async (req, res) => {
    try {
        console.log(req.body)
        var details = req.body
        var query = await pool.query("SELECT * FROM accounts WHERE email = $1 AND password = $2", [details.email, details.password])
        if (query.rows.length > 0) {
            console.log("Login Successfully")
            const token = jwt.sign({
                    user_id: query.rows[0].id,
                },
                "heya", {
                    expiresIn: "2h",
                }
            )
            res.json({
                success: true,
                msg: "You have logged in successfully",
                token: token
            })
        } else {
            console.log("Wrong Username or Password")
            res.json({
                success: false,
                msg: "Wrong Username or Password"
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            error: error
        })
    }

})

app.post('/register', async (req, res) => {
    console.log(req.body)
    var details = req.body
    var today = new Date()
    var query = await pool.query("INSERT INTO accounts(username,email,password,created_date) VALUES($1,$2,$3,$4) RETURNING * ", [details.username, details.email, details.password1, today])
    console.log(query)
    const token = jwt.sign({
            user_id: query.rows[0].id,
        },
        "heya", {
            expiresIn: "2h",
        }
    )
    res.json(token)

})

app.get('/vault',authorize, async (req, res) => {
    try {
        if(res.locals.user){
            var user = res.locals.user
            const query = await pool.query("SELECT DISTINCT folder FROM data WHERE user_id = $1", [user])
    
            res.json(query.rows)
        }
        else{
            console.log(res.locals.error)
            res.json(res.locals.error)
        }
        
    } catch (error) {
        console.log(error)
        res.json(error)
    }
})

app.get('/folder/:folder',authorize, async (req, res) => {
    try {
        var user = res.locals.user
        var folder_name = req.params.folder
        const query = await pool.query("SELECT * FROM data WHERE folder = $1 AND user_id = $2", [folder_name, user])

        res.json(query.rows)

    } catch (error) {
        console.log(error)
        res.json(error)
    }
})

app.post('/add', async (req, res) => {
    try {
        token = req.headers['authorization']
        const decoded = jwt.verify(token, "heya")
        var data = req.body;
        const user = decoded.user_id
        const today = new Date()
        const query = await pool.query("INSERT INTO data(name,user_id,email,website,password,folder,notes,created_date) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *", [data.name, user, data.email, data.website, data.password, data.folder, data.notes, today])

        res.json(query.rows[0])
    } catch (error) {
        console.log(error)
        res.json(error)
    }
})

app.put("/updatefile", async (req, res) => {
    try {
        token = req.headers['authorization']
        const decoded = jwt.verify(token, 'heya')
        var data = req.body
        const user = decoded.user_id
        console.log(data)
        const query = await pool.query("UPDATE data SET name=$1, email = $2, password = $3, website = $4, folder = $5, notes = $6 WHERE id = $7 RETURNING *", [data.name, data.email, data.password, data.website, data.folder, data.notes, data.id])
        console.log(query.rows)
        res.json(query.rows[0])

    } catch (error) {
        console.log(error)
        res.json(error)
    }
})

app.post('/uploadss', (req, res) => {
    let image = req.files.photo;

    image.mv('./uploads/' + 'Screenshot 2021-09-03 at 8.30.51 PM.png', function (err, result) {
        if (err) {
            console.log(err)
            res.send({
                error: err
            })
        } else
            res.send({
                success: "cool"
            })
    })

})

app.listen(5001, () => {
    console.log("Server is listening on port 5000")
})