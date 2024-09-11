const express =  require ("express");
const bodyParser = require ("body-parser");
const mongoose=require("mongoose");
const _ = require("lodash");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));      
let Item; 
const itemSchema=new mongoose.Schema({  
  name:{
    type: String, 
    required:true,
  }
});
const item1= ({   
  name:"Buy food",
})  
const item2= ({  
 name:"Sleeping"
})                               
const item3=({
 name:"Rest"
})
const defaultItems=[item1,item2,item3];
const listSchema={
  name:String,
  items:[itemSchema]
 }
 const List = mongoose.model("List",listSchema);
async function main(){

try{
  await mongoose.connect("mongodb+srv://vanshika12:Mongodb12@cluster0.nlwif.mongodb.net/todolistDB?retryWrites=true&w=majority");

 Item= mongoose.model("Item",itemSchema);                                                                                      
                                                                            

const founditems= await Item.find();
                

}
catch(err){
  console.log(err);
}

}

app.get("/",async function(req,res){
  console.log("GET / route hit");
  try{
 const itemFind= await Item.find();
//  for (const item of itemFind){
//   console.log(itemFind)
if(itemFind.length==0){             
await Item.insertMany(defaultItems)
console.log("Successfully inserted");
res.redirect("/");
}else{ 
  res.render("list", {listTitle: "Today", newlistItems:itemFind}); 
}
 }
  catch(err){console.log(err)};
});


app.post("/",async function(req,res){
  try{
  let itemName = req.body.newItem;
  const listName=req.body.list;
  const item=new Item({
    name:itemName,
  });
  if(listName==="Today"){
  await item.save();
  res.redirect("/")}
  else{
   const foundList= await List.findOne({name:listName});
   if(foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
   }else{
    console.log("list not found");
   }
    }
  
  }catch(err){
    console.log(err);
  }


});
app.post("/delete",async function(req,res){
  try{
  const checkedId= req.body.checkbox;
  const listName= req.body.listName;

  if(listName=="Today"){
  await Item.findByIdAndDelete(checkedId);
  res.redirect("/")

  }else{
  const update= await List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedId}}}); 
  console.log(update)
  res.redirect("/"+listName)
  }}catch(err){
    console.log(err);
  }
})

app.get("/:customListname", async function(req,res){
  try{
 const customListname= _.capitalize(req.params.customListname);
 const listfind=await List.findOne({name:customListname});
 if (!listfind){
  const list=new List({
    name:customListname,
    items:defaultItems,
   })
   await list.save();
  res.redirect("/"+customListname)
  
 }else{
    res.render("list",{listTitle:listfind.name ,newlistItems:listfind.items});
  }}
catch(err){
 console.log(err);

 }
})

app.get("/about",function(req,res){
    res.render("about")
})

                                  

main().then(()=>{
app.listen(3000, function(){
    console.log("Server is running on port 3000");
}); 
}).catch(console.error);









 