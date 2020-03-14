const express = require('express');
const JSON = require('JSON');

const apiServer = express();
apiServer.use(express.json());
const pandemias = [];

apiServer.listen(3000, ()=>{
    console.log('server is running on port 3000');
});

class pandemia{

    constructor(id,nombre,sintomas,recomendaciones){
        this.id = id;
        this.nombre = nombre;
        this.sintomas = sintomas;
        this.recomendaciones = recomendaciones;
        this.paises = [];
        this.numeroPaises = 0;
        this.numeroInfectados = 0;
        this.numeroRecuperados = 0;
        this.numeroMuertos = 0;
    }

    calculate(){
        this.numeroPaises = this.paises.length;

        for(var i = 0; i < this.paises.length;i++){
            this.numeroInfectados += this.paises[i].infectados;
            this.numeroRecuperados += this.paises[i].recuperados;
            this.numeroMuertos += this.paises[i].muertes;
        }
    }

}

class pais{
    
    constructor(id,nombre,infectados,recuperados,muertes,curso){
        this.id = id;
        this.nombre = nombre;
        this.infectados = infectados;
        this.recuperados = recuperados;
        this.muertes = muertes;
        this.curso = curso;
    }

    curar(){
        this.recuperados += this.infectados - this.muertes;
        this.curso = false;
    }

}

apiServer.put('/putPandemia',(req,res)=>{
    var json = req.body;
    var p = new pandemia(json.id,json.nombre,json.sintomas,json.recomendaciones);

    pandemias[pandemias.length] = p; 
    res.send("Se agregó la pandemia");
});

apiServer.post('/actualizar/:id', (req,res)=>{
    var p;
    var ps = req.body;
    
    for(var i = 0; i<pandemias.length;i++){
        if(req.params.id==pandemias[i].id){
            p = pandemias[i];
            break;
        }
    }

    var ind = p.paises.length;
    for(var i = 0; i < p.paises.length;i++){
        if(p.paises[i].id == ps.id){
            ind = i;
            break;
        }
    }

    p.paises[ind] = new pais(ps.id,ps.nombre,ps.infectados,ps.recuperados,ps.muertes,ps.curso);
    res.send("Pais añadido");
});

apiServer.get('/paises/:id',(req,res)=>{
    var p;
    
    for(var i = 0; i<pandemias.length;i++){
        if(req.params.id==pandemias[i].id){
            p = pandemias[i];
            break;
        }
    }

    res.send(p.paises);
});

apiServer.get('/pandemia/:id',(req,res)=>{
    var p;
    
    for(var i = 0; i<pandemias.length;i++){
        if(req.params.id==pandemias[i].id){
            p = pandemias[i];
            break;
        }
    }

    p.calculate();
    res.send(p);
});

apiServer.get('/curar/:id/:pi', (req,res)=>{
    var p;
    
    for(var i = 0; i<pandemias.length;i++){
        if(req.params.id == pandemias[i].id){
            p = pandemias[i];
            break;
        }
    }

    var ind = p.paises.length;
    for(var i = 0; i < p.paises.length;i++){
        if(p.paises[i].id == req.params.pi){
            ind = i;
            break;
        }
    }

    p.paises[i].curar();
    res.send("Pais Curado");
});