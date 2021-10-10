const express=require('express');
const app=express();
const{mongoose}=require('./db/mongoose');
const bodyparser=require('body-parser');
const { List, Task, User } = require('./db/models');
const jwt=require('jsonwebtoken');
const nodemailer = require('nodemailer');
// CORS MIDDLEWARE

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});


//Load middleware
app.use(bodyparser.json());
// check whether the request has a valid JWT access token
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');  
    // verify the JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {      
        if (err) {
            // there was an error
            // jwt is invalid - * DO NOT AUTHENTICATE *
            res.status(401).send(err);
        } else {
            // jwt is valid
            req.user_id = decoded._id;
            next();
        }
    });
}
//verify refresh token middleware(which will be verifying the session)
let verifySession = (req, res, next) => {
    // grab the refresh token from the request header
    let refreshToken = req.header('x-refresh-token');

    // grab the _id from the request header
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            // user couldn't be found
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct'
            });
        }


        // if the code reaches here - the user was found
        // therefore the refresh token exists in the database - but we still have to check if it has expired or not

        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;    

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if the session has expired
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // refresh token has not expired
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            // the session is VALID - call next() to continue with processing this web request
            next();
        } else {
            // the session is not valid
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
}

/* END MIDDLEWARE  */


/* route handlers */
/*List routes */
/**
 * get/lists
 * purpose:get all lists
 */
app.get('/lists',authenticate,(req,res) => {
    //we want to return an array of all lists that belong to authenticated user
   
    List.find({
         _userId:req.user_id
     }).then((lists) => {
        res.send(lists);
    }).catch((e)=> {
        res.send(e);
    });
})

/**
 * post/lists
 * purpose:create a list
 */
app.post('/lists',authenticate,(req,res) =>{
    //we want to create a new list and return the new list documents back to the user(which includes id)
    let title=req.body.title;
    let newList=new List({
        title,
        _userId:req.user_id
    });
    newList.save().then((listDoc) =>{
        //the full list document is returned(id)
        res.send(listDoc);
    })
});
/**
 * path/lists/:id
 * purpose: update a specified list
 */
app.patch('/lists/:id',authenticate, (req,res) =>{
    //we want to update the specified list with the new values specified in the json body of the request

    List.findOneAndUpdate({_id: req.params.id,_userId:req.user_id},{
        $set: req.body
    }).then(() => {
        res.send({'message':'updated successfully'});
    });
});
/**
 * delete /lists/:id
 * purpose:delete a lists
 */
app.delete('/lists/:id',authenticate,(req,res) =>{
    List.findOneAndRemove({
        _id: req.params.id,
        _userId:req.user_id
    }).then((removedListDoc)=>{
        res.send(removedListDoc);
        //delete all the tasks that are in the deleted list
        deleteTasksFromList(removedListDoc._id);
    })
});
/**
 * GET: /lists/:listsId/tasks
 * purpose:create a new task in a specified list
 */
app.get('/lists/:listId/tasks',authenticate,(req,res)=>{
    //we want to create a new task in a specified list by listId
    Task.find({
        _listId: req.params.listId
    }).then((tasks) =>{
        res.send(tasks);
    })
});

/**
 * Post /lists/:listId/tasks
 * purpose: create a new task in a specified list
 */
app.post('/lists/:listId/tasks',authenticate,(req,res) =>{
    //we want to create a new task in a list specified by listid


    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id,
      
    }).then((list) => {
        if (list) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can create new tasks
            return true;
        }

        // else - the list object is undefined
        return false;
    }).then((canCreateTask) => {
        if (canCreateTask) {
            let newTask = new Task({
                _userId:req.user_id,
                title: req.body.title,
                _listId: req.params.listId,
                 date:req.body.date,
            });
            newTask.save().then((newTaskDoc) => {
                res.send(newTaskDoc);
            })
        } else {
            res.sendStatus(404);
        }
    })
})
/**
 * Path:/list:/id
 * purpose: update a specified list
 */
app.patch('/lists/:listId/tasks/:taskId',authenticate,(req,res) =>{
    // We want to update an existing task (specified by taskId)

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can make updates to tasks within this list
            return true;
        }

        // else - the list object is undefined
        return false;
    }).then((canUpdateTasks) => {
        if (canUpdateTasks) {
            // the currently authenticated user can update tasks
            Task.findOneAndUpdate({
                _id: req.params.taskId,
                _listId: req.params.listId
            }, {
                    $set: req.body
                }
            ).then(() => {
                res.send({ message: 'Updated successfully.' })
            })
        } else {
            res.sendStatus(404);
        }
    })
});

/**
 * delete:/lists/:listsId/tasks/:taskId
 * purpose:delete a task
 */
app.delete('/lists/:listId/tasks/:taskId',authenticate,(req,res) =>{

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can make updates to tasks within this list
            return true;
        }

        // else - the list object is undefined
        return false;
    }).then((canDeleteTasks) => {
        if(canDeleteTasks){
            Task.findOneAndRemove({
                _id: req.params.taskId,
                _listId: req.params.listId
            }).then((removedTaskDoc) =>{
            res.send(removedTaskDoc)
            })
        }else{
            res.sendStatus(404);
        }
    });
   
});

/* USER ROUTES */

/**
 * POST /users
 * Purpose: Sign up
 */
app.post('/users', (req, res) => {
    // User sign up

    let body = req.body;
    let newUser = new User(body);
    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // Session created successfully - refreshToken returned.
        // now we geneate an access auth token for the user

        return newUser.generateAccessAuthToken().then((accessToken) => {
          
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken }
            
        });
    }).then((authTokens) => {
     try{
            //sending confirmation email
            const emailToken=jwt.sign({
                user:newUser._id
            },
            User.getJWTSecret(),
            {
                expiresIn:"1d"
            },);
            const url=`http://localhost:5555/confirmation/${emailToken}/${newUser._id}`;
            let transporter = nodemailer.createTransport({
                service:'Gmail',
                auth: {
                  user: // your email id
                  pass:  // your password
                },
              });
            transporter.sendMail({
               to:newUser.email,
               subject:'confirm your email',
               html:`please click this link to confirm your email:<a href="${url}">${url}</a>`
            });
        }catch(e){
            console.log(e);
        } 
        // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
       
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser+"\n"+"SUCESSFULLY REGISTERED PLEASE CONFIRM YOUR MAIL TO LOGIN");
           
    
    }).catch((e) => {
        res.status(400).send(e);
    })
})



/**
 * POST /users/login
 * Purpose: Login
 */
app.post('/users/login' ,(req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    User.findByCredentials(email, password).then((user) => {
       if(!user.confirmed){
           res.send('confirm your email');
        }   
                
       
        return user.createSession().then((refreshToken) => {
            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken}
            
            });
            
        }).then((authTokens) => {
            
            console.log(user._id);
            try {
           
             // To check the pending task under the particular userid
              var pending1=new Array();
                Task.find({
                    _userId:user._id
                }).then((tasks) =>{
                    console.log(tasks);

                   for (let index = 0; index < tasks.length; index++) {
                           var element = tasks[index].title;
                           var c =new Date().toLocaleDateString();
                           var f=tasks[index].date;
                           var b=new Date(f).toLocaleDateString();
                           var com=tasks[index].completed;
                           var id=tasks[index]._userId;
                           var d=b-c;
                           var e=b==c;
                          
                           if((b>c)&&(com==false)){
                               pending1.push("Task name"+" "+element+" \n"+"Due:"+" "+f+"\n");                       
                            } 
                            else if((b==c)&&(com==false)){
                               pending1.push("Task name"+" "+element+" \n"+"Due:"+" "+f+"\n");
                              
                            }                      
                     }
                    
                    let transporter = nodemailer.createTransport({
                       service:'Gmail',
                       auth: {
                        user:  // your email id
                        pass:  // your password
                       },
                    });
                    
                    transporter.sendMail({
                    to:user.email,
                    subject:"REMAINDER!!",
                    text:pending1.toString()
                   
                });                     
              })         
               
            } catch (error) {
                console.log(error);
            }
           
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);               
               
         
               
        })
    }).catch((e) => {  
        res.status(400).send(e);       

    });
})
/**
 * Get:/users/me/access-token
 * purpose:generates and returns an access token
 */
app.get('/users/me/access-token', verifySession, (req, res) => {
    // we know that the user/caller is authenticated and we have the user_id and user object available to us
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})
/* HELPER METHODS */
let deleteTasksFromList=(_listId)=>{
    Task.deleteMany({
        _listId
    }).then(()=>{
        console.log("tasks from"+ _listId +"were deleted");
    })
}


app.get('/confirmation/:token/:id', async (req, res) => {
   
    try {
        var  a=User.getJWTSecret();
       
        jwt.verify(req.params.token, a);
        User.findByIdAndUpdate(
            id1=req.params.id,
        {
            $set:{confirmed:true}
        }).then(()=>{
            console.log('updated!!!');
        })
    } catch (e) {
      res.send('error');
    }
  
     return res.redirect('http://localhost:4200/login');
});
app.get('/notifications',authenticate,(req,res)=>{ 
    var pending=new Array();
    Task.find({
        _userId:req.user_id
    }).then((tasks) =>{
       for (let index = 0; index < tasks.length; index++) {
         var element = tasks[index].title;
         var c =new Date().toDateString();
         var f=tasks[index].date;
         var b=new Date(f).toDateString();
         var com=tasks[index].completed;
         var id=tasks[index]._userId;
         var d=b-c;
         var e=b==c;
         if((b>c)&&(com==false)){
            pending.push("Task name"+" "+element+" \n"+"Due:"+" "+b+"\n");         
           
        } 
        else if((b==c)&&(com==false)){
            pending.push("Task Name:"+" "+element+" \n"+"Due:"+" "+b+"\n");
        }
           
    }
    
     res.redirect(`http://localhost:5555/sendmail/${id}/${pending}`);
      
    })
});


app.get('/sendmail/:id/:pending',authenticate,(req,res)=>{
    
    var id=req.params.id;
    User.findById(id).then((user)=>{
        var email=user.email;
 
let transporter = nodemailer.createTransport({
    service:'Gmail',
    auth: {
      user:  // your email id
      pass:  //your password
    },
  });
var mailoptions={
    from: // your email id
    to:email,
    subject:'REMAINDER!!',
    text:"YOUR PENDING TASKS"+"\n"+req.params.pending
    
};
transporter.sendMail(mailoptions,function(error,info){
    if(error){
        console.log(error);
       
    }
    else{
        console.log('email sent:'+info.response)
      
    }
});
})
})


app.listen(5555,() =>{
    console.log("server is running on port 5555");
})
