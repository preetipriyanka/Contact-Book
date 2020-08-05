# Error-handlers

This is a simple error handling package who's functions can be used throughout a node application.

# Documentation
First:
<code> npm i error-handlers </code>
## Error handlers:
### 1) ErrorResponse
The ErrorResponse function takes three parameters, the response, error, and http status code.
<br><code>ErrorResponse(response, error, http_status_code)</code>
### 2) SuccessResponse
The SuccessResponse function takes the same parameters as above but since it returns a response object, instead of an error.
<br><code>SuccessResponse(response, response_data, http-status-code)</code>
### 3) CatchError
The CatchError function takes a promise as the parameter, and handles the promise effectively with the <code>.catch()</code> function.
<br><code>CatchError(promise)</code>
### 4) ThrowError
It does just that - but also has an extra parameter <code>log: boolean</code> which will log the error in the server.
<br><code>ThrowError(error_message, log)</code>
### 5) ParseError
This is from the npm package 'parse-error' you can read about it here: https://www.npmjs.com/package/parse-error

## Example usage:
To use these error handlers throughout your application:
<code>const handler = require('error-handlers')</code>
You can either require this module wherever necessary, or in the express app.js you can add something like this:
```
const handle = require('error-handlers');
// Global functions for handling errors
global.pe = handler.ParseError;
global.to = handler.CatchError;
global.TE = handler.ThrowError;
global.ReE = handler.ErrorResponse;
global.ReS = handler.SuccessResponse;
```
You could also make a separate file containing all (if any) global functions and declare add the code there instead.
Below is an example of these functions in use.
In this example, the author is using the Sequelize ORM.
```
const update = async function(req, res){
    let err, user, data, client, able;
    user = req.user;
    client = req.client;
    data = req.body;
    user.set(data);

    [err, user] = await to(user.save());
    if(err) return ReE(res, err, 422);
    return ReS(res, {message :'Updated User: '+ client.clientId});
}
```

