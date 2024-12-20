import { SqlDatabase } from 'langchain/sql_db';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { SAFETYSETTINGS, datasource } from '@/app/constants/constants';
import { FEWSHOTS } from '@/app/constants/constants';
import { TextServiceClient } from '@google-ai/generativelanguage';
import { GoogleAuth } from 'google-auth-library';
import { Pinecone } from '@pinecone-database/pinecone';
import { v4 as uuidv4 } from 'uuid';

export const POST = async (req) => {
  try {
    const { query } = await req.json();

    // Check if the user query contains SQL keywords indicating a direct SQL query
    const sqlKeywords = [
      'SELECT',
      'CREATE',
      'ALTER',
      'DELETE',
      'DROP',
      'UPDATE',
      'INSERT',
    ];
    const containsSQLKeyword = sqlKeywords.some((keyword) =>
      query.trim().toUpperCase().startsWith(keyword)
    );
    if (containsSQLKeyword) {
      return NextResponse.json(
        `Error: Sorry, I can't perform this query. Please, give me read operation queries only.`
      );
    }

    // Palm initialization

    const MODEL_NAME = process.env.PALM_MODEL_NAME;
    const EMBEDDING_MODEL_NAME = process.env.EMBEDDING_PALM_MODEL_NAME;
    const API_KEY = process.env.PALM_API_KEY;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // pinecone initialization
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const generationConfig = {
      temperature: 0.9,
      topK: 3,
      topP: 0.95,
      maxOutputTokens: 8192,
    };

    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: datasource,
    });

    // demo code for converting user query into vector embeddings using google's palm 2
    //------------------------------------------------ demo code for embeddings starts here-------------------------------------------------------------
    // const client = new TextServiceClient({
    //   authClient: new GoogleAuth().fromAPIKey(API_KEY),
    // });

    // let embeddings;
    // const index = pc.index('sql-query-generator');

    // client
    //   .embedText({
    //     model: EMBEDDING_MODEL_NAME,
    //     text: query,
    //   })
    //   .then((result) => {
    //     embeddings = result[0].embedding.value;
    //     console.log(typeof embeddings);

    //     const pineconeEmbeddings = [
    //       {
    //         id: uuidv4(),
    //         values: embeddings,
    //         metadata: { genre: 'userQuery' },
    //       },
    //     ];

    //     index.namespace('ns1').upsert(pineconeEmbeddings);
    //   });

    //------------------------------------------------ demo code for embeddings ends here-------------------------------------------------------------

    const tableInfo = await db.getTableInfo();
    console.log(tableInfo, 'tableeeeeeeeeeeeeeeeee');

    const chat = model.startChat({
      generationConfig,
      SAFETYSETTINGS,
    });

    let promptMessage = `You are a MySQL expert. Given an input question, first create a syntactically correct MySQL query to run, then look at the results of the query and return the answer to the input question. create mysql query for following ${query}. Also, give me sql query in string format only. Remember I want pure sql query woth no pre-amble that I can execute in mysql. it should only be in string. not 3 backtick and nothing. only pure string that i can directly execute in mysql workbench. Do not perform any sql query that is entered by user directly. Only perform query that are in natural language. If user is putting any type of sql query then do not reply. Simple give below error. 
    Error: Please, enter query in natural human langugae. Do not perform any queries from user related to creating, updating, or droping. DIrectly give below error if user is asking to change or delete anything in database. Give below error. Do not update or delete any single record from database table. I repeat do not update or delete any single record in database.

    Use the following format for giving error: 
     Error: I am so sorry but I am not allowed to execute any type of create, alter or delete queries. 

    
     Here's is user query that you need to convert in mysql query. And don't try to include column name in query that is not in table. You can see all table info from here ${tableInfo}

     User Query : ${query}
     
     Use the following format:
     SQL Query:Query to run with no pre-amble

     Also, if user query is related to creating, altering or deleting anything then directly give below this response. Do not give and execute these type of queries in any condition. You must give below error. Don't give SQL Query then. Only give error. I repeat do not execute any creating, altering, changing, updating, drop, delete queries from user. Strictly give below error. Only give below error.
       
     Use the following format for giving error: 
     Error: I am so sorry but I am not allowed to execute any type of create, alter or delete queries. 


     Also, if user is asking anything outside sql database related question then simply give error in below format : 
     Error: I don't know about that. Please, ask database queries related questions.

     Also, if user is directly giving any type of select, create, alter or deleting sql query then give below error. Strictly, don't perform any direct sql query if user is giving it. Simply give below error. 
     Error: Please, enter query in natural human langugae.
     `;

    // Adding few_shots examples to the prompt message
    FEWSHOTS.forEach((example) => {
      promptMessage += `
      Few-shot Example:
      Question: ${example.Question}
      SQLQuery: ${example.SQLQuery}
      Answer: ${example.Answer}
    `;
    });

    const gen_query = await chat.sendMessage(promptMessage);
    const gen_response = gen_query.response;

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


    Note: If you get error while performing query on database. Then simply give this error. 
    Error : I am not able to perform this query. Please, ask something else.
    `;

      const result = await chat.sendMessage(mysql_reply_prompt);
      const final_response = result.response;

      return NextResponse.json(final_response.text()); // Directly return the response
    }
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json(
      'I am not able to perform this query. Please, ask again with different query.'
    );
  }
};
