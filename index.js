const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
let app = express()

const PORT = 4421;
const PAGESIZE = 8;

app.use(bodyParser.json());
var worldlogs = JSON.parse(fs.readFileSync("worldlogs.json"))
var worldmetadatas = JSON.parse(fs.readFileSync("worldmetadatas.json"))
var worlds = JSON.parse(fs.readFileSync("worlds.json"))


app.get('/info/', (req, res) => {
    res.send(worldlogs)
})

app.get('/getdimensions/', (req, res) => {
    let pagenum = req.query.pagenum
    let searchval = req.query.search
    let totalpages
    if(searchval){
        totalpages = 1
    }else{
        totalpages = Math.ceil(Object.keys(worldmetadatas).length / PAGESIZE)
    }
    res.send(JSON.stringify({page: getPage(pagenum, searchval), totalpages: totalpages}))
})

app.get('/getworld/', (req, res) => {
    let worldtosend = worlds[req.query.uid]
    res.send(JSON.stringify(worldtosend))
})

app.post('/postworld/', (req, res) => {
    saveWorld(req.body)
    res.sendStatus(200);
})

app.listen(PORT, () => {
    console.log(`Void Core world server listening at ${PORT}`);
});

function saveWorld(worlddata){
    worlds[worlddata.uid] = worlddata.worlddata
    worldmetadatas[worlddata.uid] = worlddata
    fs.writeFile('worldmetadatas.json', JSON.stringify(worldmetadatas), 
    (err) => {if(err){console.log(err)}})
    fs.writeFile('worlds.json', JSON.stringify(worlds), 
    (err) => {if(err){console.log(err)}})
}

function getPage(pagenum, searchval){
    var pagearray = []
    var listofkeys = Object.keys(worldmetadatas)
    var startpos = PAGESIZE * pagenum - PAGESIZE
    var searchresults = []

    if(searchval){
        for(w=0; w<listofkeys.length; w++){
            if(worldmetadatas[listofkeys[w]].username == searchval || worldmetadatas[listofkeys[w]].worldname == searchval){
                searchresults.push(worldmetadatas[listofkeys[w]])
            }
        }
        return searchresults
    }
    else{
        for(w=startpos; w<PAGESIZE+startpos; w++){
            if(w < listofkeys.length){
                pagearray.push(worldmetadatas[listofkeys[w]])
            }
        }
    }
    
    return pagearray
}