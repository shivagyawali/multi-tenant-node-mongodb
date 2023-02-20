

exports.profile = async(req,res)=>{
 return res.status(200).json({ tenant: req.tenant });
}
