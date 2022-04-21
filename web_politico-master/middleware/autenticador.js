module.exports = (req, res, next) => {


//if (req.session){  
if (req.session && req.session.role != undefined){
    return next();
 }
else
  return res.redirect('/auth/login');
}; 
