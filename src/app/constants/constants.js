import { DataSource } from 'typeorm';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

export const SAFETYSETTINGS = [
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

// export const FEWSHOTS = [
//   {
//     Question:
//       'How many t-shirts do we have left for Nike in XS size and white color?',
//     SQLQuery:
//       "SELECT sum(stock_quantity) FROM t_shirts WHERE brand = 'Nike' AND color = 'White' AND size = 'XS'",
//     SQLResult: 'Result of the SQL query',
//     Answer: '91',
//   },
//   {
//     Question:
//       'How much is the total price of the inventory for all S-size t-shirts?',
//     SQLQuery: "SELECT SUM(price*stock_quantity) FROM t_shirts WHERE size = 'S'",
//     SQLResult: 'Result of the SQL query',
//     Answer: '22292',
//   },
//   {
//     Question:
//       'If we have to sell all the Levi’s T-shirts today with discounts applied. How much revenue  our store will generate (post discounts)?',
//     SQLQuery:
//       "SELECT sum(a.total_amount * ((100-COALESCE(discounts.pct_discount,0))/100)) as total_revenue from (select sum(price*stock_quantity) as total_amount, t_shirt_id from t_shirts where brand = 'Levi' group by t_shirt_id) a left join discounts on a.t_shirt_id = discounts.t_shirt_id",
//     SQLResult: 'Result of the SQL query',
//     Answer: '16725.4',
//   },
//   {
//     Question:
//       'If we have to sell all the Levi’s T-shirts today. How much revenue our store will generate without discount?',
//     SQLQuery:
//       "SELECT SUM(price * stock_quantity) FROM t_shirts WHERE brand = 'Levi'",
//     SQLResult: 'Result of the SQL query',
//     Answer: '17462',
//   },
//   {
//     Question: "How many white color Levi's shirt I have?",
//     SQLQuery:
//       "SELECT sum(stock_quantity) FROM t_shirts WHERE brand = 'Levi' AND color = 'White'",
//     SQLResult: 'Result of the SQL query',
//     Answer: '290',
//   },
//   {
//     Question:
//       'how much sales amount will be generated if we sell all large size t shirts today in nike brand after discounts?',
//     SQLQuery:
//       "SELECT sum(a.total_amount * ((100-COALESCE(discounts.pct_discount,0))/100)) as total_revenue from (select sum(price*stock_quantity) as total_amount, t_shirt_id from t_shirts where brand = 'Nike' and size='L' group by t_shirt_id) a left join discounts on a.t_shirt_id = discounts.t_shirt_id",
//     SQLResult: 'Result of the SQL query',
//     Answer: '290',
//   },
// ];

export const FEWSHOTS = [
  {
    Question: 'give me the details of the deal where record id is 1.',
    SQLQuery: 'SELECT * FROM deals WHERE record_id = 1',
    SQLResult: 'Result of the SQL query',
    Answer: `The deal with record ID 1 is called "Eamia Deal (2021-11-16)". It's currently closed and lost, has no owner assigned, and the amount was 2639.`,
  },
  {
    Question: 'give me the details of the deal where presentation is scheduled',
    SQLQuery: "SELECT * FROM deals WHERE deal_stage = 'Presentation Scheduled'",
    SQLResult: 'Result of the SQL query',
    Answer:
      'There are 5 deals that are scheduled for presentation. The deal names are Plambee Deal (2021-01-08), Wikibox Deal (2020-01-20), Zoozzy Deal (2020-05-28), Blogtags Deal (2021-08-25), Innojam Deal (2021-06-12) with amount 1439, 2199, 2983, 2491, 4108 respectively.',
  },
  {
    Question: 'give me the details of the contact whose first name is hussein',
    SQLQuery: "SELECT * FROM contacts WHERE first_name='hussein'",
    SQLResult: 'Result of the SQL query',
    Answer:
      'The contact is Hussein Bhatia, their email is hussein.bhatia@cogidoo.com and their phone number is 955-720-7013. They are a marketing contact and were created on 2024-05-12T18:30:00.000Z.',
  },
  {
    Question:
      'give me the details of the contact whose phone number is 790-907-8721',
    SQLQuery: "SELECT * FROM contacts WHERE phone_number = '790-907-8721'",
    SQLResult: 'Result of the SQL query',
    Answer:
      'The contact is Britt Bullant, their email is britt.bullant@gmail.com, their phone number is 790-907-8721, and they are a marketing contact. The contact was created on 2024-05-12T18:30:00.000Z.',
  },
  {
    Question: 'give me all company names whose industry is warehousing',
    SQLQuery:
      "SELECT company_name FROM companies WHERE industry = 'Warehousing'",
    SQLResult: 'Result of the SQL query',
    Answer:
      'Skyba, Browsecat, Feednation, Pixonyx, Gigashots, Photofeed, Feedfish are the companies whose industry is warehousing.',
  },
  {
    Question: 'give me all company names who is outside of united states',
    SQLQuery:
      "SELECT company_name FROM companies WHERE country != 'United States'",
    SQLResult: 'Result of the SQL query',
    Answer:
      'The companies outside of the United States are Browsecat, Gabvine, Gevee, Devify, Centizu, Rhycero, Edgeclub, Yakijo, Fanoodle, Youbridge, Jaxworks, Blogtag, Abata, Blogspan, Zoombox, Zava, Yakitri, Babbleopia, Jazzy, Muxo, Skippad, Digitube, Pixope, Gabtype, Voonte, Quinu, Centidel, Vitz, MeejoMeemm, Oodoo, Zoomcast, Minyx, Livetube, Agivu, Omba, Jaxnation, Browseblab, Bluejam, Viva, Kwilith, Cogibox, Skalith, Brainsphere, Twinte, Photobug, Devcast, Avaveo, Eare, Rhynyx, Babbleset, Skyndu, Dynabox, Voolia, Yabox, InnoZ, Wordware, Rhyzio, Realcube, Cogilith, Ntags, Aibox, Tagtune, Dabfeed, Yadel, Eidel, and Yodel.',
  },
  {
    Question: 'give me details of contacts and deals where record id is 1',
    SQLQuery:
      'SELECT * FROM contacts JOIN deals ON contacts.record_id = deals.record_id WHERE contacts.record_id = 1;',
    SQLResult: 'Result of the SQL query',
    Answer: `The deal with record ID 1 is called "Eamia Deal (2021-11-16)". It's currently closed and lost, has no owner assigned, and the amount was 2639. The contact with record ID 1 is Aziz Johnson (Sample Contact). Their email is emailmaria@hubspot.com and they are a marketing contact. Their contact owner is Thor Thunder.`,
  },
  {
    Question:
      'give me details of contacts, companies and deals where record id is 1',
    SQLQuery:
      'SELECT * FROM contacts JOIN deals ON contacts.record_id = deals.record_id JOIN companies ON contacts.record_id = companies.record_id WHERE contacts.record_id = 1;',
    SQLResult: 'Result of the SQL query',
    Answer: `The deal with record ID 1 is called "Eamia Deal (2021-11-16)". It's currently closed and lost, has no owner assigned, and the amount was 2639. The contact with record ID 1 is Aziz Johnson (Sample Contact). Their email is emailmaria@hubspot.com and they are a marketing contact. Their contact owner is Thor Thunder. The company with record ID 1 is named Skyba. The company owner is Thor Thunder. It was created on May 12, 2024. The phone number is (336) 6329839. The company is located in Greensboro, United States, and its industry is Warehousing.`,
  },
  {
    Question:
      'give me details of industry from companies, and amount from deals where record id is 1',
    SQLQuery:
      'SELECT companies.industry, deals.amount FROM companies JOIN deals ON companies.record_id = deals.record_id WHERE companies.record_id = 1;',
    SQLResult: 'Result of the SQL query',
    Answer:
      'The industry name of record id 1 is warehousing and the amount is 2639.',
  },
  {
    Question:
      'give me details of industry from companies, and deal stage from deals where record id is 1',
    SQLQuery:
      'SELECT companies.industry, deals.deal_stage FROM companies JOIN deals ON companies.record_id = deals.record_id WHERE companies.record_id = 1;',
    SQLResult: 'Result of the SQL query',
    Answer:
      'The industry name of record id 1 is warehousing and the deal stage is closed lost.',
  },
];

export const datasource = new DataSource({
  type: process.env.DATA_SOURCE_TYPE,
  host: process.env.DATA_SOURCE_HOST,
  port: process.env.DATA_SOURCE_PORT,
  username: process.env.DATA_SOURCE_USERNAME,
  password: process.env.DATA_SOURCE_PASSWORD,
  database: process.env.DATA_SOURCE_DATABASE,
});
