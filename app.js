import express from 'express';
import bodyParser from 'body-parser';
import 'isomorphic-fetch';
const url = "https://randomuser.me/api";

//Set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const users = [];

app.get('/api/v1/users', async (req, res) => await getAllUsers(req, res));

app.post('/api/v1/users', (req, res) => postUser(req, res));

app.get('/api/v1/users/firstname/:firstname', async (req, res) => await findFirstName(req, res));



// const user = users.find({ firstname });
// return user;


/* Helper Functions */

const getAllUsers = async (req, res) => {
    try {
        // users = [];?
        for (let number = 0; number < 10; number++) {
            let response = await fetch(url);
            let data = await response.json();
            // Object destructuring
            const { gender, name: { first }, location: { city }, email, cell } = data.results[0];
            const user = {
                gender,
                firstname: first,
                city,
                email,
                cell
            };
            users.push(user);
        }
        res.status(200).send({
            success: true,
            message: 'users retreived successfully',
            users: users
        });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: 'Could not retrieve users',
        })
    }
};

const postUser = (req, res) => {
    try {
        let errValue = '';
        switch (req.body) {
            case !req.body.gender:
                errValue = 'gender';
                throw new Error('No gender');
            case !req.body.firstname:
                errValue = 'firstname';
                throw new Error('No firstname');
            case !req.body.city:
                errValue = 'city';
                throw new Error('No city');
            case !req.body.email:
                errValue = 'email';
                throw new Error('No email');
            case !req.body.cell:
                errValue = 'cell';
                throw new Error('No cell');
        }
        const {
            gender,
            firstname,
            city,
            email,
            cell
        } = req.body;

        const user = {
            gender,
            firstname,
            city,
            email,
            cell
        };

        users.push(user);
        res.status(201).send({
            success: true,
            message: 'User sucessfully created',
            users,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: `Could not create user: need ${errValue}`,
        });
    }
};

const findFirstName = async (req, res) => {
    try {
        const firstname = req.params.firstname;

        const result = await users.find(user => user.firstname === firstname);

        if (!result) {
            throw new Error('User not found');
        } else {
            res.status(200).send({
                user: result,
            });
        }
    } catch (error) {
        res.status(404).send({
            success: false,
            message: 'User not found',
            error,
        });
    }
};

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});