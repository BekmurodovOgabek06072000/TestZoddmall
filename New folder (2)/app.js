const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const multer = require('multer');
const uuid = require('uuid').v4;
const path = require('path');
const files = [];
const fileInArray = []
const Schema = mongoose.Schema;
//Environment Variable
require('dotenv').config()

app.use(cors());
app.use(express.json())

app.use(express.static('./uploads'))

//======================MONGODB SCHEMA=============================================================
const BrandSchema = new Schema({
    name: { type: String, required: true },
    uploaded_Image: {
        type: [[String]],
        required: true
    }
});

const UserSchema = new Schema({
    first: String,
    last: String,
    email: String,
    password: String
})
const KategoriyaSchema = new Schema({
    name: { type: String, required: true },
    uploaded_Image: {
        type: [[String]],
        required: true
    }
})
const MahsulotSchema = new Schema({
    name: { type: String, required: true },
    uploaded_Image: {
        type: [[String]],
        required: true
    },
    price: { type: String, required: true },
    kategoriya: { type: String },
    brand: { type: String },
    information: { type: String },
    foiz: { type: String, required: true },
})
const ShikoyatSchema=new Schema({
    shikoyat:String
})
const TaklifSchema=new Schema({
    taklif:String
})


//. <------------------MONGODB CONNECTION--------------------------------------------------------->
//=================================================================================================
const uri = 'mongodb://localhost:27017/MERN';
//const uri='mongodb+srv://bekmurodov06072000:bekmurodov06072000@cluster0.4nbzw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Mongo DB CONNECTED"))
    .catch((err) => console.log("DB CONNECTION ERR", err));

const User = mongoose.model('User', UserSchema);
const Brand = mongoose.model('Brand', BrandSchema);
const Kategoriya = mongoose.model("Kategoriya", KategoriyaSchema);
const Mahsulot = mongoose.model('Mahsulot', MahsulotSchema);
 const Shikoyat=mongoose.model('Shikoyat',ShikoyatSchema)
 const Taklif=mongoose.model('Taklif',TaklifSchema)

//==========================MULTER SRORAGE=================================================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads")
    },
    filename: (req, file, cb) => {
        let filePath = [];
        console.log("MULTER ENTRY ", file.originalname)
        console.log("files", req.files)

        const ext = path.extname(file.originalname);
        const id = uuid();
        filePath = `${id}${ext}`;
        fileInArray.push([(filePath)])
        console.log("IN ARRAY ", filePath)
        files.push(fileInArray)
        console.log("PUSHED MAIN ARRAY", fileInArray)
        cb(null, filePath)
        console.log("current length", files.length)
    }


})
const uploadBrand = multer({

    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
    storage: storage,
})

const UploadKategoriya = multer({

    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
    storage: storage,
})
const UploadMahsulot = multer({

    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
    storage: storage,
})

//==========================USER LOGIN REGISTER==========================================================
app.post("/userlogin", (req, res) => {
    User.find({ email: req.body.email ,password:req.body.password})
        .then(respons => {
            if (respons.length == 0) {
                res.send("email yoki parol xato kiritildi")
            }
            else {
                res.send(respons)
            }

        })
        .catch(err => {
            console.log(`Xatoo:${err}`)

        })


})


app.post("/userregister", (req, res) => {

    let users
    User.find({ email: req.body.email })
        .then(respons => {
            if (respons.length > 0) {
                res.send("oldin register bolgan")
            }
            else {
                const user = new User({
                    email: req.body.email,
                    first: req.body.first,
                    last: req.body.last,
                    password: req.body.password
                })

                user.save()
                res.send("Registratsiya qilindi")
            }

        })
        .catch(err => {

        })
})
app.get('/user', async (req, res) => {
    await User.find()
        .then(respons => {
            res.json(respons)
        })
        .catch(err => {
            console.log(err);
        })
})
//========================BRAND ====================================================================



app.get('/brand', async (req, res) => {
    await Brand.find()
        .then((img) => { console.log(img); res.json(img); })
        .then(console.log("GET request "))
        .catch(err => { res.status(400).json(`Error: ${err}`) })
})



app.post('/brandadd', uploadBrand.array("uploaded_Image", 5), (req, res) => {
    console.log("Files", fileInArray)
    const newImage = new Brand({
        name: req.body.name,
        uploaded_Image: fileInArray

    })

    newImage.save()
        .then(() => { res.send('Brand saqlandi'); })

        .catch(err => console.log(`Saqlashda xato: ${err}`));
    console.log("AFTER MONGO")

    files.length = 0
    fileInArray.length = 0

})
app.delete('/deleteBrand/:id', (req, res) => {
    Brand.findByIdAndDelete(req.params.id)
        .then(() => {
            res.send("deleted")
        })
        .catch(err => {
            console.log(err);
        })
})

//============================KATEGORIYA==========================================================
app.get('/kategoriya', async (req, res) => {
    await Kategoriya.find()
        .then((img) => { console.log(img); res.json(img); })
        .then(console.log("GET request "))
        .catch(err => { res.status(400).json(`Error: ${err}`) })
})

app.post('/kategoriyaadd', UploadKategoriya.array("uploaded_Image", 5), (req, res) => {
    console.log("Files", fileInArray)
    const newImage = new Kategoriya({
        name: req.body.name,
        uploaded_Image: fileInArray

    })

    newImage.save()
        .then(() => { res.send('Brand saqlandi'); })

        .catch(err => console.log(`Saqlashda xato: ${err}`));
    console.log("AFTER MONGO")

    files.length = 0
    fileInArray.length = 0

})
app.delete('/deletekategoriya/:id', (req, res) => {
    Kategoriya.findByIdAndDelete(req.params.id)
        .then(() => {
            res.send("deleted")
        })
        .catch(err => {
            console.log(err);
        })
})


//========================================MAHSULOT========================================

app.get('/mahsulot', async (req, res) => {
    await Mahsulot.find()
        .then((img) => { console.log(img); res.json(img); })
        .then(console.log("GET request "))
        .catch(err => { res.status(400).json(`Error: ${err}`) })
})

app.post('/mahsulotadd', UploadMahsulot.array("uploaded_Image", 5), (req, res) => {
    console.log("Files", fileInArray)
    const newImage = new Mahsulot({
        name: req.body.name,
        uploaded_Image: fileInArray,
        price: req.body.price,
        kategoriya: req.body.kategoriya,
        brand: req.body.brand,
        foiz: req.body.foiz,
        information: req.body.desc

    })

    newImage.save()
        .then(() => { res.send('Brand saqlandi'); })

        .catch(err => console.log(`Saqlashda xato: ${err}`));
    console.log("AFTER MONGO")

    files.length = 0
    fileInArray.length = 0

})

app.delete('/deletemahsulot/:id', (req, res) => {
    Mahsulot.findByIdAndDelete(req.params.id)
        .then(() => {
            res.send("deleted")
        })
        .catch(err => {
            console.log(err);
        })
})
//==============================SEARCH PRODUCT======================================================
app.post('/productcopy', async (req, res) => {
    await Mahsulot.find({ kategoriya: req.body.name })
        .then(respons => {
            res.json(respons)
        })
        .catch(err => {
            console.log(err);
        })
})



app.post('/ProductFilterPrise', async (req, res) => {
    const filtir = req.body.filter
    const dan=req.body.dan+1
    const gacha=req.body.gacha+1
    console.log(filtir,req.body.name,dan,gacha);
    switch (filtir) {
        case 'name':
            await Mahsulot.find({ name: req.body.name , price:{$gt:dan, $lt:gacha}})
                .then(respons => {
                    res.json(respons)
                    console.log(respons);
                })
                .catch(err => {
                    console.log(err);
                })
            break;
        case 'brand':
            console.log('kirdi brandga '+filtir,req.body.name);
            await Mahsulot.find({ brand: req.body.name ,price:{$gt:dan,$lt:gacha}})
                .then(respons => {
                    res.json(respons)
                    console.log(respons);
                })
                .catch(err => {
                    console.log(err);
                })
            break;
        case 'kategoriya':
            await Mahsulot.find({ kategoriya: req.body.name, price:{$gt:dan , $lt:gacha} })
                .then(respons => {
                    res.json(respons)
                    console.log(respons);
                })
                .catch(err => {
                    console.log(err);
                })
            break;

        default:
            console.log('kategoriyalarga xatolik ketdi');
            break;
    }

})

app.post('/productfilter', async (req, res) => {
    const filtir = req.body.filter
    console.log(filtir,req.body.name);
    switch (filtir) {
        case 'name':
            await Mahsulot.find({ name: req.body.name })
                .then(respons => {
                    res.json(respons)
                })
                .catch(err => {
                    console.log(err);
                })
            break;
        case 'brand':
            console.log('kirdi brandga '+filtir,req.body.name);
            await Mahsulot.find({ brand: req.body.name })
                .then(respons => {
                    res.json(respons)
                    console.log(respons);
                })
                .catch(err => {
                    console.log(err);
                })
            break;
        case 'kategoriya':
            await Mahsulot.find({ kategoriya: req.body.name })
                .then(respons => {
                    res.json(respons)
                })
                .catch(err => {
                    console.log(err);
                })
            break;

        default:
            break;
    }

})
app.post('/telefon',async(req,res)=>{
    await Mahsulot.find({kategoriya:'telefon'})
    .then(respons=>{
        res.json(respons)
    })
    .catch(err=>{
        console.log(err);
    })
})
app.post('/avto',async(req,res)=>{
    await Mahsulot.find({kategoriya:'avto'})
    .then(respons=>{
        res.json(respons)
    })
    .catch(err=>{
        console.log(err);
    })
})
app.post('/elektrotexnika',async(req,res)=>{
    await Mahsulot.find({kategoriya:'elektrotexnika'})
    .then(respons=>{
        res.json(respons)
    })
    .catch(err=>{
        console.log(err);
    })
})
//============================================SHIKOYAT/Taklif===================================
app.post('/addshikoyat',async (req,res)=>{
    const addshikoyat=new Shikoyat({
        shikoyat:req.body.shikoyat
    })
    addshikoyat.save()
    console.log('shikoyat saqlandi');
})
app.get('/shikoyat',async(req,res)=>{
    await Shikoyat.find()
    .then(respons=>{
        res.json(respons)
        console.log(respons);
    })
    .catch(err=>{
        console.log(err);
    })
})
app.post('/addtaklif',async (req,res)=>{
    const addtaklif=new Taklif({
        taklif:req.body.taklif
    })
    addtaklif.save()
    console.log('taklif saqlandi');
})
app.get('/taklif',async(req,res)=>{
    await Taklif.find()
    .then(respons=>{
        res.json(respons)
    })
    .catch(err=>{
        console.log(err);
    })
})
//&3. <------------------ Contect Port-------------------------->
const PORT = process.env.PORT|| 5000
app.listen(PORT, () => {
    console.log(`Server is Running on Port : ${PORT}`)
})




//&3. <--------------------------End---------------------------->