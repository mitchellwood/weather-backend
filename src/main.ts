import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const mysql = require('mysql');
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
});

con.connect((err) => {
  if(err){
    // console.log(err)
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
