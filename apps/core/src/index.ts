import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
// import morgan from 'morgan';
// import cors from 'cors';
// import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';


const app = express();
const port = process.env.PORT || 3000;
const RedisStore = require("connect-redis").default
const redis = require('redis');
const url = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient = redis.createClient({
    url
});

//------------redis connection------------

(async () => { 
    await redisClient.connect(); 
})(); 
  
console.log("Connecting to the Redis"); 
  
redisClient.on("ready", () => { 
    console.log("Connected!"); 
}); 
  
redisClient.on("error", (err:any) => { 
    console.log("Error in the Connection"); 
}); 


//------------url for client-------------
// createClient({
//     url: 'redis[s]://[[username][:password]@][host][:port][/db-number]'
//   });



// ---------Use middleware-------------
// app.use(morgan('combined')); // Logging requests
// app.use(cors()); // Enable CORS
// app.use(helmet()); // Enhance security
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies


// --------Set up session middleware------------
app.use(session({ 
    name: 'sid',  
    store: new RedisStore({ client: redisClient }),
    secret: 'your-session-secret', 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge:1000*60*60*2,  //2h
        secure: false,
        sameSite:true,
        httpOnly:true,
    },
}));

declare module 'express-session' {
    export interface SessionData {
      user: { [key: string]: any };
      views: number;
      
    }
  }
 
//   -------Session Management Route--------
app.get('/session', (req, res) => {
    req.session.views = (req.session.views || 0) + 1;
    res.send({ views: req.session.views });
  });


// -----Middleware to ensure user is authenticated------------
const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.status(401).send('Unauthorized');
};


//-------ROUTES------------------
// --------Route to log in (set session data)---------
app.post('/login', (req: Request, res: Response) => {
    // Dummy authentication logic
    const { username, password } = req.body;
    if (username === 'user' && password === 'password') {
        req.session.user = { username };
        res.send('Logged in!');
    } else {
        res.status(401).send('Invalid credentials');
    }
});
// -----Protected route-------
app.get('/profile', ensureAuthenticated, (req: Request, res: Response) => {
    res.send(`Hello, ${req.session.user}!`);
});

// ----Logout route------------
app.post('/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.send('Logged out!');
    });
});


//-------home route--------------
app.get('/', (req: Request, res: Response) => {
    res.send(`
        <h1>Hello, TypeScript Express!</h1>
       <h2> <a href="/login">Login</a>
        <a href="/register">Register</a>
        <a href="/profile">Profile</a></h2>
        <form method='post' action='/logout'>
            <button>Logout</button>
        </form>
        `);
});


// -----------Error handling------------
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send('404 Not Found');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


//----------server start-----------
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
  