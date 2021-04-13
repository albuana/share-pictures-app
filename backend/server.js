const express=require('express');
const mongoose=require('mongoose');
const { MONGO_URI }=require('./config');
var http = require('http');
var debug = require('debug');
// routes
const userRoutes=require('./routes/api/users');
const postRoutes=require('./routes/api/posts');


var cors = require('cors')
const app = express();
app.use(cors())


//BodyParser
app.use(express.json());

// Connect to mongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser:true,
    useUnifiedTopology:true
})
    .then(()=> console.log('MongoDB connected'))
    .catch(err=> console.log(err));
//User routes
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3059');
  next();
});
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

app.get('/', (req, res) => {

})

const PORT = normalizePort(process.env.PORT || 3009);

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);


/**
 * Normalize a port into a number, string, or false.
 */

 function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }
  
  /**
   * Event listener for HTTP server "error" event.
   */
  
  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  
  /**
   * Event listener for HTTP server "listening" event.
   */
  
  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }