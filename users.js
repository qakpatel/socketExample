const users = require('./userModal');

module.exports={
    signup:(req,res)=>{
       
        if(!req.body.name || !req.body.email || !req.body.password || req.body.contact || req.body.address.city || req.body.address.state || req.body.address.pincode){
            res.send({status:304,message:'Required field missing'})
         }else{
            
             users.findOne({email:req.body.email},(err,result)=>{
                 if(result===null){
                    var userData=new users(req.body)
                    userData.save((err,result1)=>{
                      if(err){
                          res.send({status:500,message:'Internal server error'})
                      }else{
                          res.send({status:200,message:'Successfully signup'})
                      }
                   })
                 }else{
                    res.send({status:202,message:'Email already register',email:result.email})
                 }
             })
         }
    },
    login:(req,res)=>{
         
        if(!req.body.email || !req.body.password){
            res.send({status:304,message:'Required field missing'})
        }else{
               users.findOne({email:req.body.email}, (err,result)=>{
                if(err){
                    res.send({status:500,message:'Internal server error'})
                }
                else if(result){
                    if(req.body.email===result.email && req.body.password===result.password){
                        res.send({status:200,message:'Successfully login'})
                    }else{
                        res.send({status:201,message:'Wrong password'})
                    }
                }
                else{
                    res.send({status:404,message:'User not found'})
                }
            })
        }   
 },
getProfile:(req,res)=>{
    jwt.verify(req.headers["authorization"], 'qqqq',(err,decoded)=>{
        console.log(decoded)
            if(!decoded.id){
            res.send({status:403,message:'Unauthorized token'})
            }else{
            users.findOne({_id:decoded.id},{password:0,__v:0,_id:0},(err,result)=>{
                console.log(err)
                if(err){
                    res.send({status:500,message:'Internal server error'}) 
                }else{
                    res.send({status:200,message:'get profile successfully',result})
                }
            })
            }
    });
 }, 
}