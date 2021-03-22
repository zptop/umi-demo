export default{
    'get /ds/list':function(req,res) {//模拟请求返回的数据
        res.json({
            data:[1,2,3,4,5,6,7,8,9,10],
            maxNum:10
        })
    } 
}