import { SqlDatabase } from 'langchain/sql_db';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import { GooglePaLM } from '@langchain/community/llms/googlepalm';
import { NextRequest, NextResponse } from 'next/server';
import { DataSource } from 'typeorm';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { createSqlAgent, SqlToolkit } from 'langchain/agents/toolkits/sql';
import { ChatOpenAI } from '@langchain/openai';

export const POST = async (req) => {
  try {
    const { query } = await req.json();

    const MODEL_NAME = process.env.PALM_MODEL_NAME;
    const API_KEY = process.env.PALM_API_KEY;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const llm = new GooglePaLM({ apiKey: API_KEY });

    const generationConfig = {
      temperature: 0.9,
      topK: 3,
      topP: 0.95,
      maxOutputTokens: 8192,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const datasource = new DataSource({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Creole@123',
      database: 'atliq_tshirts',
    });

    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: datasource,
    });

    const tableInfo = await db.getTableInfo();

    const chat = model.startChat({
      generationConfig,
      safetySettings,
    });

    const few_shots = [
      {
        Question:
          'How many t-shirts do we have left for Nike in XS size and white color?',
        SQLQuery:
          "SELECT sum(stock_quantity) FROM t_shirts WHERE brand = 'Nike' AND color = 'White' AND size = 'XS'",
        SQLResult: 'Result of the SQL query',
        Answer: '91',
      },
      {
        Question:
          'How much is the total price of the inventory for all S-size t-shirts?',
        SQLQuery:
          "SELECT SUM(price*stock_quantity) FROM t_shirts WHERE size = 'S'",
        SQLResult: 'Result of the SQL query',
        Answer: '22292',
      },
      {
        Question:
          'If we have to sell all the Levi’s T-shirts today with discounts applied. How much revenue  our store will generate (post discounts)?',
        SQLQuery:
          "SELECT sum(a.total_amount * ((100-COALESCE(discounts.pct_discount,0))/100)) as total_revenue from (select sum(price*stock_quantity) as total_amount, t_shirt_id from t_shirts where brand = 'Levi' group by t_shirt_id) a left join discounts on a.t_shirt_id = discounts.t_shirt_id",
        SQLResult: 'Result of the SQL query',
        Answer: '16725.4',
      },
      {
        Question:
          'If we have to sell all the Levi’s T-shirts today. How much revenue our store will generate without discount?',
        SQLQuery:
          "SELECT SUM(price * stock_quantity) FROM t_shirts WHERE brand = 'Levi'",
        SQLResult: 'Result of the SQL query',
        Answer: '17462',
      },
      {
        Question: "How many white color Levi's shirt I have?",
        SQLQuery:
          "SELECT sum(stock_quantity) FROM t_shirts WHERE brand = 'Levi' AND color = 'White'",
        SQLResult: 'Result of the SQL query',
        Answer: '290',
      },
      {
        Question:
          'how much sales amount will be generated if we sell all large size t shirts today in nike brand after discounts?',
        SQLQuery:
          "SELECT sum(a.total_amount * ((100-COALESCE(discounts.pct_discount,0))/100)) as total_revenue from (select sum(price*stock_quantity) as total_amount, t_shirt_id from t_shirts where brand = 'Nike' and size='L' group by t_shirt_id) a left join discounts on a.t_shirt_id = discounts.t_shirt_id",
        SQLResult: 'Result of the SQL query',
        Answer: '290',
      },
    ];

    let promptMessage = `You are a MySQL expert. Given an input question, first create a syntactically correct MySQL query to run, then look at the results of the query and return the answer to the input question. create mysql query for following ${query}. Also, give me sql query in string format only. Remember I want pure sql query woth no pre-amble that I can execute in mysql. it should only be in string. not 3 backtick and nothing. only pure string that i can directly execute in mysql workbench. 
    
     Here's is user query that you need to convert in mysql query. 
     User Query : ${query}
     
     Use the following format:
       SQL Query:Query to run with no pre-amble

       Also, if user query is related to creating, altering or deleting anything then directly give below this response. Do not give and execute these type of queries in any condition. You must give below error. Don't give SQL Query then. Only give error.
       
       Use the following format for giving error: 
       Error: I am so sorry but I am not allowed to execute any type of create, alter or delete queries. 


       Also, if user is asking anything outside sql database related question then simply give error in below format : 
       Error: I don't know about that. Please, ask database queries related questions.
     `;

    // Adding few_shots examples to the prompt message
    few_shots.forEach((example) => {
      promptMessage += `
      Few-shot Example:
      Question: ${example.Question}
      SQLQuery: ${example.SQLQuery}
      Answer: ${example.Answer}
    `;
    });

    const gen_query = await chat.sendMessage(promptMessage);
    const gen_response = gen_query.response;

    console.log(gen_response.text(), 'azizizizizzzzzzzzzzzzzz');

    // for extracting sql query
    const responseText = gen_response.text(); // Assuming gen_response is the response object
    const lines = responseText?.split('\n'); // Split the response into lines
    const queryLine = lines.find((line) => line.startsWith('SQL Query:')); // Find the line containing the SQL query
    const errorLine = lines.find((line) => line.startsWith('Error'));

    if (errorLine && errorLine?.startsWith('Error')) {
      const error_query = errorLine.split(':')[1].trim();
      return NextResponse.json(error_query); // Directly return the response
    } else {
      const final_query = queryLine.split(':')[1].trim(); // Extract the query part and remove leading/trailing spaces
      console.log('final query', final_query);

      // Formulate a SQL query based on the user's input question

      // Execute the SQL query against the database
      const queryResult = await db.run(final_query);

      console.log(queryResult, 'responsssssssssssssssssseeeeeeeeeeeeee');

      const mysql_reply_prompt = `You are an expert in converting mysql answers in layman language. So, any human can understand in simple language. You will be given what user    
       originally asked then converted sql query and then the answer. So, from user's asked query you need to give answer in simple language that you receive from database. If you don't know the answer. Simply say "I don't know the answer. Please, try again." Don't try to make up an answer. 

    Here's the example on what you need to do everytime. 
    Example: 
    User Question: How many t-shirts do we have left for Nike in XS size and white color? 
    SQL response: [ RowDataPacket { 'sum(stock_quantity)': '27' } ]
    Answer: We have total 27 t-shirts left for XS size and white color. 

    Example: 
    User Question: How much is the total price of the inventory for all S-size t-shirts? 
    SQL response: RowDataPacket { 'SUM(price*stock_quantity)': '22953' }
    Answer: The total price of inventory of all sized t-shirt is 22953 rupees. 

    You need to see sql response. It will be in object And give answer in layman language.Don't say that provided SQL response is in an unsupported format '[object Object]'. Just read that object and read numerical value from that object and give answer in layman language. let's say you are getting [ RowDataPacket { 'SUM(price*stock_quantity)': '22953' } ] that means the answer is 22953. If you are getting  [ RowDataPacket { 'sum(stock_quantity)': '27' } ] that means answer is 27.

    So, here you can see that you need to give answer in layman language.
    
    here's user asked query and related sql response for that is given below. You need to convert this sql response into layman language. 
    User Question : ${query}
    SQL Response : ${queryResult}
    
    Now, You need to give answer in following format : 
    User Question: User query
    SQL Query: SQL query
    Answer : Final answer here
    `;

      const result = await chat.sendMessage(mysql_reply_prompt);
      const final_response = result.response;

      return NextResponse.json(final_response.text()); // Directly return the response
    }
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json(
      'An error occurred while processing your request.'
    );
  }
};
