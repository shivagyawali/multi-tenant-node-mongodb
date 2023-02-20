
function authorize(role) {
  return function (req, res, next) {
   
       if (req.tenant.role === role){
         next();
       }else{
        return res.status(403).json({
          message: "Resources not allowed",
        });
       }
       
   
   
  };
}

module.exports = authorize;
