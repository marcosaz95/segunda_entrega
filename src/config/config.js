process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB
if (process.env.NODE_ENV === 'local') {
    urlDB = 'mongodb://localhost:27017/cursos';
}
else {
    urlDB = 'mongodb+srv://admin:admin1234@cursosnodejs-btobk.mongodb.net/cursos?retryWrites=true&w=majority'
}

process.env.URLDB = urlDB