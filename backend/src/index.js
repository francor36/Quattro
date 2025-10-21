import app from './app.js';

//# Vamos a usar esta libreria para los logs
import pkg from 'signale';
//#traemos su clase constructora
const {Signale} = pkg
import AppDataSource from './providers/datasource.provider.js';

//instanciamos la variable app que hace uso de express
const main = () =>{
    //#le damos el scope
    const logger = new Signale ({ scope: 'Main'});

    const port = app.get('port');

    AppDataSource.initialize()
    .then(() => logger.log('Connected to Database'))
    .catch(() => logger.log('Unable to connect yo Database'))

    app.listen(port);

    //# en vez de usar el console.log usamos signale para los logs
    logger.log('server runnning on port ' + port);
};

main();