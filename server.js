/**
 * Created by sergey on 17.10.15.
 */
'use strict';
var express = require('express');
var app = express();
var port = 9090;


app.use(express.static('examples'));
app.listen(port, '0.0.0.0',function(){
  console.info('Express server start at ' + port +' port');
});
