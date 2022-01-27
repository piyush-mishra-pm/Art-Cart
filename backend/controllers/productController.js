exports.getAllProducts = (req,res,next) =>{
    res.status(200).json({
        success:true,
        message:'This route should show all art-products available in the database.'
    })
}