
var neo4j = require('neo4j-driver');
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');


// const { nanoid } = require('nanoid');
const app = express();
// Gy59LKsfSIS7e6ZIvEZtImnU4nry-EQfOAmpDMTbY8w

// APP Stuff
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// Neo4j Stuff
let driver
(async () => {
  // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
  const URI = 'neo4j+s://91f79ffa.databases.neo4j.io'
  const USER = 'neo4j'
  const PASSWORD = 'CNjv9dm79Anu5rH8H3iMPSeDxSUmbIBGB7tobLRSa0o'
  

  try {
    driver = neo4j.driver(URI,  neo4j.auth.basic(USER, PASSWORD))
    const serverInfo = await driver.getServerInfo()
    console.log('Connection established')
    console.log(serverInfo)
  } catch(err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`)
  }
})();


// API Stuff
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.get('/api/sampleget', async (req, res) => {
  // Get the name of all 42 year-olds
const { records, summary, keys } = await driver.executeQuery(
  'MATCH p=()-[:How]->() RETURN DISTINCT nodes(p) AS nodes, p LIMIT 20;'
)

// Summary information
console.log(
  `>> The query ${summary.query.text} ` +
  `returned ${records.length} records ` +
  `in ${summary.resultAvailableAfter} ms.`
)

// Loop through results and do something with them
returnable_data = []
records.forEach(record => {

  returnable_data.push({data : {id : record.get('nodes')[0].identity.low, properties : record.get('nodes')[0].properties , label : record.get('nodes')[0].properties['Cause of Disease'] , type : 'node'} })

  returnable_data.push({data : {id : record.get('nodes')[1].identity.low, properties : record.get('nodes')[1].properties , label : record.get('nodes')[1].properties.Disease , type : 'node'} })

  returnable_data.push({data : {source : record.get('nodes')[0].identity.low, target : record.get('nodes')[1].identity.low, label : 'How', type : 'relationship'} })


})

res.json({ records : returnable_data});
});

app.post('/api/sampleget2', async (req, res) => {

  // get weight and height from req
  const weight = req.body.weight;
  const height = req.body.height;

  // get bmi
  const currentBMI = weight / (height * height);

  const { records, summary, keys } = await driver.executeQuery(
    `MATCH (person:Person)-[:Lifestyle]->(:\`Cause of Disease\`)-[:How]->(disease:Disease) 
    WHERE (${currentBMI} < 19.5 AND toFloat(person.BMI) < 22) 
       OR (${currentBMI} > 23.75 AND toFloat(person.BMI) > 24.5) 
       WITH DISTINCT disease.Disease AS distinctDiseaseName, COLLECT(DISTINCT person) AS persons
       RETURN distinctDiseaseName, SIZE(persons) AS numberOfDistinctPersons
       ORDER BY numberOfDistinctPersons DESC
    `)

    console.log(
      `>> The query ${summary.query.text} ` +
      `returned ${records.length} records ` +
      `in ${summary.resultAvailableAfter} ms.`
    )
    returnable_data = []

    records.forEach(record => {
      returnable_data.push({"name" : record.get('distinctDiseaseName') , "count" : record.get('numberOfDistinctPersons').low})
    })

    res.json({ records : returnable_data});
});

app.get('/api/query1', async (req, res) => {
  
    const { records, summary, keys } = await driver.executeQuery(
      `MATCH (p1:Person)-[c1:Characteristics]-(p2:Diabetes)
WHERE abs(p1.BMI - p2.BMI) < 1.0 AND
      CASE 
        WHEN p1.Age < 18 THEN 'group1'
        WHEN p1.Age >= 18 AND p1.Age <= 60 THEN 'group2'
        WHEN p1.Age > 60 THEN 'group3'
      END =
      CASE 
        WHEN p2.Age < 18 THEN 'group1'
        WHEN p2.Age >= 18 AND p2.Age <= 60 THEN 'group2'
        WHEN p2.Age > 60 THEN 'group3'
      END
MATCH (p3:Blood)-[c2:DiabeticBP]-(p2)
WHERE 
  CASE
    WHEN p2.BloodPressure >= 60 AND p2.BloodPressure <= 80 THEN 'Normal'
    WHEN p2.BloodPressure > 80 THEN 'High'
    WHEN p2.BloodPressure < 60 THEN 'Low'
    ELSE 'Unknown'
  END = p3.\`Blood Pressure\`
MATCH (p4:\`Heart Disease\`)-[c3:HeartvD]-(p2)
WHERE abs(p4.diaBP-p2.BloodPressure) < 10

MATCH (p4)-[:HeartCh]-(p1)
WHERE p4.currentSmoker = p1.Smoker

RETURN p1, p2, p3 , p4, c1 , c2 , c3
      `)
  
      console.log(
        `>> The query ${summary.query.text} ` +
        `returned ${records.length} records ` +
        `in ${summary.resultAvailableAfter} ms.`
      )
      returnable_data = []

      records.forEach(record => {
      p1 = record.get('p1')
      p2 = record.get('p2')
      p3 = record.get('p3')
      p4 = record.get('p4')

      c1 = record.get('c1')
      c2 = record.get('c2')
      c3 = record.get('c3')

      returnable_data.push({p1 : p1 , p2 : p2 , p3 : p3 , p4 : p4 , c1 : c1 , c2 : c2 , c3 : c3})

      })
  
      res.json({ records : returnable_data});
  });

  app.get('/api/query2', async (req, res) => {
  
    const { records, summary, keys } = await driver.executeQuery(
      `
      MATCH (p2:\`Heart Disease\`)-[c1:HeartCh]-(p1:Person)
WHERE p2.currentSmoker = p1.Smoker AND abs(p2.BMI - p1.BMI) < 2.0 AND
      CASE 
        WHEN p1.Age < 18 THEN 'group1'
        WHEN p1.Age >= 18 AND p1.Age <= 60 THEN 'group2'
        WHEN p1.Age > 60 THEN 'group3'
      END =
      CASE 
        WHEN p2.age < 18 THEN 'group1'
        WHEN p2.age >= 18 AND p2.age <= 60 THEN 'group2'
        WHEN p2.age > 60 THEN 'group3'
      END
MATCH (p3:Blood)-[c2:HeartvBlood]-(p2)
WHERE 
  CASE
    WHEN p2.diaBP >= 60 AND p2.diaBP <= 80 THEN 'Normal'
    WHEN p2.diaBP > 80 THEN 'High'
    WHEN p2.diaBP < 60 THEN 'Low'
    ELSE 'Unknown'
  END = p3.\`Blood Pressure\`


MATCH (p2)-[c4:HeartvPres]-(p4:Disease)
WHERE p4.\`Cause of Disease\` IN
  CASE
     WHEN p2.\`Heart_ stroke\` = "yes" THEN ['High cholesterol','Diet and genetics','Genetics','Stress and genetics' , 'Smoking','Stress','Poor diet and sedentary lifestyle']
     WHEN p1.\`Family History\` <> 'None' THEN ['Diet and genetics','Genetics','Stress and genetics']
      WHEN p2.currentSmoker = 1 THEN ['Smoking','Stress','Poor diet and sedentary lifestyle']
      ELSE []
  END 

RETURN p1,  p2 , p3 ,p4, c1 , c2 ,c4

      `)
  
      console.log(
        `>> The query ${summary.query.text} ` +
        `returned ${records.length} records ` +
        `in ${summary.resultAvailableAfter} ms.`
      )
      returnable_data = []

      records.forEach(record => {
      p1 = record.get('p1')
      p2 = record.get('p2')
      p3 = record.get('p3')
      p4 = record.get('p4')
      

      returnable_data.push({p1 : p1 , p2 : p2 , p3 : p3 , p4 : p4 })

      })
  
      res.json({ records : returnable_data});
  });

  app.get('/api/query3', async (req, res) => {
  
    const { records, summary, keys } = await driver.executeQuery(
      `
      MATCH (p1:\`Heart Disease\`)-[c1:OralvHeart]-(p2:OralCancer)
WHERE abs(p1.sysBP-p2.sysBP) < 20 AND p1.prevalentHyp=p2.prevalentHyp 

MATCH (p1)-[c2:HeartvD]-(p3:Diabetes)
WHERE p1.diabetes = p3.Outcome

MATCH (p1)-[c3:HeartvPres]-(p4:Disease)
WHERE p4.\`Cause of Disease\` IN
  CASE
     WHEN p1.\`Heart_ stroke\` = "yes" THEN ['High cholesterol','Diet and genetics','Genetics','Stress and genetics' , 'Smoking','Stress','Poor diet and sedentary lifestyle']
      WHEN p1.currentSmoker = 1 THEN ['Smoking','Stress','Poor diet and sedentary lifestyle']
      ELSE []
  END

RETURN p1 , p2 ,p3,p4 ,c1,c2,c3

      `)
  
      console.log(
        `>> The query ${summary.query.text} ` +
        `returned ${records.length} records ` +
        `in ${summary.resultAvailableAfter} ms.`
      )
      returnable_data = []

      records.forEach(record => {
      p1 = record.get('p1')
      p2 = record.get('p2')
      p3 = record.get('p3')
      p4 = record.get('p4')
      

      returnable_data.push({p1 : p1 , p2 : p2 , p3 : p3 , p4 : p4 })

      })
  
      res.json({ records : returnable_data});
  });


app.post('/api/query4', async (req, res) => {

  console.log(req.body)

  // get weight and height from req
  const weight = parseInt(req.body.weight);
  const height = parseFloat(req.body.height);


  // get bmi
  const currentBMI = weight / (height * height);
  const age = req.body.age;
  // get smoker , cigsperday , sysbp , diabp
  let smoker = req.body.isSmoker;
  let cigsperday = parseInt(req.body.cigarettesPerDay);
  if (smoker === false) {
    smoker = 0;
    cigsperday = 0;
  }
  else{
    smoker = 1;
  }
  const sysbp = req.body.sysBp !== '' ? parseInt(req.body.sysBp) : '';
  const diabp = req.body.diaBp !== '' ? parseInt(req.body.diaBp) : '';
    
  // write 4 queries for 4 cases , if sysbp and diabp are not given ,if sysbp is given , if diabp is given , if both are given
  let query = ""
  if (sysbp === '' && diabp === '') {
    query = `
    MATCH (p1:Person)-[c1:HeartCh]-(p2:\`Heart Disease\`)
WHERE abs(${currentBMI} - p1.BMI) < 2 AND abs(p1.BMI - p2.BMI) < 1 AND abs(${cigsperday} - p1.CigsPerDay) < 10 AND abs(p1.CigsPerDay - p2.cigsPerDay) < 10  AND 
    CASE 
        WHEN p1.Age < 18 THEN 'group1'
        WHEN p1.Age >= 18 AND p1.Age <= 60 THEN 'group2'
        WHEN p1.Age > 60 THEN 'group3'
      END =
    CASE 
        WHEN p2.age < 18 THEN 'group1'
        WHEN p2.age >= 18 AND p2.age <= 60 THEN 'group2'
        WHEN p2.age > 60 THEN 'group3'
      END

MATCH (p1)-[:Health]-(p3:Blood)
WHERE 
  CASE
    WHEN p2.diaBP >= 60 AND p2.diaBP <= 80 THEN 'Normal'
    WHEN p2.diaBP > 80 THEN 'High'
    WHEN p2.diaBP < 60 THEN 'Low'
    ELSE 'Unknown'
  END = p3.\`Blood Pressure\`

RETURN p1, c1, p2
    `
  }
  else if (sysbp === '') {
    query = `
    MATCH (p1:Person)-[c1:HeartCh]-(p2:\`Heart Disease\`)
    WHERE abs(${currentBMI} - p1.BMI) < 2 AND abs(p1.BMI - p2.BMI) < 1 AND abs(${cigsperday} - p1.CigsPerDay) < 10 AND abs(p1.CigsPerDay - p2.cigsPerDay) < 10  AND abs(${diabp} - p2.diaBP) < 10 AND 
        CASE 
            WHEN p1.Age < 18 THEN 'group1'
            WHEN p1.Age >= 18 AND p1.Age <= 60 THEN 'group2'
            WHEN p1.Age > 60 THEN 'group3'
          END =
        CASE 
            WHEN p2.age < 18 THEN 'group1'
            WHEN p2.age >= 18 AND p2.age <= 60 THEN 'group2'
            WHEN p2.age > 60 THEN 'group3'
          END
    
    MATCH (p1)-[:Health]-(p3:Blood)
    WHERE 
      CASE
        WHEN p2.diaBP >= 60 AND p2.diaBP <= 80 THEN 'Normal'
        WHEN p2.diaBP > 80 THEN 'High'
        WHEN p2.diaBP < 60 THEN 'Low'
        ELSE 'Unknown'
      END = p3.\`Blood Pressure\`
    
    RETURN p1, c1, p2
    `
  }
  else if (diabp === '') {
    query = `
    MATCH (p1:Person)-[c1:HeartCh]-(p2:\`Heart Disease\`)
    WHERE abs(${currentBMI} - p1.BMI) < 2 AND abs(p1.BMI - p2.BMI) < 1 AND abs(${cigsperday} - p1.CigsPerDay) < 10 AND abs(p1.CigsPerDay - p2.cigsPerDay) < 10  AND abs(${sysbp} - p2.sysBP) < 10 AND 
        CASE 
            WHEN p1.Age < 18 THEN 'group1'
            WHEN p1.Age >= 18 AND p1.Age <= 60 THEN 'group2'
            WHEN p1.Age > 60 THEN 'group3'
          END =
        CASE 
            WHEN p2.age < 18 THEN 'group1'
            WHEN p2.age >= 18 AND p2.age <= 60 THEN 'group2'
            WHEN p2.age > 60 THEN 'group3'
          END
    
    MATCH (p1)-[:Health]-(p3:Blood)
    WHERE 
      CASE
        WHEN p2.diaBP >= 60 AND p2.diaBP <= 80 THEN 'Normal'
        WHEN p2.diaBP > 80 THEN 'High'
        WHEN p2.diaBP < 60 THEN 'Low'
        ELSE 'Unknown'
      END = p3.\`Blood Pressure\`
    
    RETURN p1, c1, p2
    `
  }
  else {
    query = `
    MATCH (p1:Person)-[c1:HeartCh]-(p2:\`Heart Disease\`)
    WHERE abs(${currentBMI} - p1.BMI) < 2 AND abs(p1.BMI - p2.BMI) < 1 AND abs(${cigsperday} - p1.CigsPerDay) < 10 AND abs(p1.CigsPerDay - p2.cigsPerDay) < 10 AND abs(${diabp} - p2.diaBP) < 10 AND abs(${sysbp} - p2.sysBP) < 10  AND 
        CASE 
            WHEN p1.Age < 18 THEN 'group1'
            WHEN p1.Age >= 18 AND p1.Age <= 60 THEN 'group2'
            WHEN p1.Age > 60 THEN 'group3'
          END =
        CASE 
            WHEN p2.age < 18 THEN 'group1'
            WHEN p2.age >= 18 AND p2.age <= 60 THEN 'group2'
            WHEN p2.age > 60 THEN 'group3'
          END
    
    MATCH (p1)-[:Health]-(p3:Blood)
    WHERE 
      CASE
        WHEN p2.diaBP >= 60 AND p2.diaBP <= 80 THEN 'Normal'
        WHEN p2.diaBP > 80 THEN 'High'
        WHEN p2.diaBP < 60 THEN 'Low'
        ELSE 'Unknown'
      END = p3.\`Blood Pressure\`
    
    RETURN p1, c1, p2
    `
  }
  

    const { records, summary, keys } = await driver.executeQuery(query)
  
      console.log(
        `>> The query ${summary.query.text} ` +
        `returned ${records.length} records ` +
        `in ${summary.resultAvailableAfter} ms.`
      )
      returnable_data = []

      records.forEach(record => {
      p1 = record.get('p1')
      p2 = record.get('p2')
      c1 = record.get('c1')
      

      returnable_data.push({p1 : p1 , p2 : p2 })

      })
  
      res.json({ records : returnable_data});
  })

  app.post('/api/query5', async (req, res) => {

    console.log(req.body)
  
    // get weight and height from req
    const weight = parseInt(req.body.weight);
    const height = parseFloat(req.body.height);
  
  
    // get bmi
    const currentBMI = weight / (height * height);
    const age = req.body.age;
    // get smoker , cigsperday , sysbp , diabp
    const diabp = req.body.diaBp !== '' ? parseInt(req.body.diaBp) : '';
    const glucose = req.body.glucose !== '' ? parseInt(req.body.glucose) : '';
    let family_illness = req.body.family_illness;
    if (family_illness === "false") {
      family_illness = "no";
    }
    else{
      family_illness = "yes";
    }

      
    // write 4 queries for 4 cases , if sysbp and diabp are not given ,if sysbp is given , if diabp is given , if both are given
    let query = ""
    if (diabp === '') {
      query = `
      MATCH (p1:Person)-[c1:DiabetesCh]-(p2:Diabetes)
WHERE abs(${currentBMI} - p1.BMI) < 2 AND abs(p1.BMI - p2.BMI) < 2 AND abs(${glucose} - p2.Glucose) < 10 AND 
    CASE 
        WHEN p1.Age < 18 THEN 'group1'
        WHEN p1.Age >= 18 AND p1.Age <= 60 THEN 'group2'
        WHEN p1.Age > 60 THEN 'group3'
      END =
    CASE 
        WHEN p2.Age < 18 THEN 'group1'
        WHEN p2.Age >= 18 AND p2.Age <= 60 THEN 'group2'
        WHEN p2.Age > 60 THEN 'group3'
      END

      MATCH (p1)-[:Health]-(p3:Blood)
      WHERE 
        CASE
          WHEN p2.BloodPressure >= 60 AND p2.BloodPressure <= 80 THEN 'Normal'
          WHEN p2.BloodPressure > 80 THEN 'High'
          WHEN p2.BloodPressure < 60 THEN 'Low'
          ELSE 'Unknown'
        END = p3.\`Blood Pressure\`
            `
      
            if (family_illness === "yes") {
              query += `
              MATCH (p2)-[c2:DiabetesvPres]-(p4:Disease)
              WHERE p4.\`Cause of Disease\` IN ['Diet and genetics','Genetics','Stress and genetics' ,'High cholesterol','Genetic predisposition' , 'Stress']
              RETURN p1, c1, p2 , p4,c2
              `
            }
            else {
              query += `
              MATCH (p2)-[c2:DiabetesvPres]-(p4:Disease)
              WHERE p4.\`Cause of Disease\` IN
                CASE
                  WHEN p2.Outcome = 1 THEN ['High cholesterol','Diet and genetics','Genetics','Stress and genetics' , 'Smoking','Stress','Poor diet and sedentary lifestyle']
                END
              RETURN p1, c1, p2 , p4,c2
              `
            }
    }
    else {
      query = `
      MATCH (p1:Person)-[c1:DiabetesCh]-(p2:Diabetes)
WHERE abs(${currentBMI} - p1.BMI) < 2 AND abs(p1.BMI - p2.BMI) < 2 AND abs(${glucose} - p2.Glucose) < 10 AND (${diabp} - p2.BloodPressure)<10 AND 
    CASE 
        WHEN p1.Age < 18 THEN 'group1'
        WHEN p1.Age >= 18 AND p1.Age <= 60 THEN 'group2'
        WHEN p1.Age > 60 THEN 'group3'
      END =
    CASE 
        WHEN p2.Age < 18 THEN 'group1'
        WHEN p2.Age >= 18 AND p2.Age <= 60 THEN 'group2'
        WHEN p2.Age > 60 THEN 'group3'
      END

MATCH (p1)-[:Health]-(p3:Blood)
WHERE 
  CASE
    WHEN p2.BloodPressure >= 60 AND p2.BloodPressure <= 80 THEN 'Normal'
    WHEN p2.BloodPressure > 80 THEN 'High'
    WHEN p2.BloodPressure < 60 THEN 'Low'
    ELSE 'Unknown'
  END = p3.\`Blood Pressure\`
      `

      if (family_illness === "yes") {
        query += `
        MATCH (p2)-[c2:DiabetesvPres]-(p4:Disease)
        WHERE p4.\`Cause of Disease\` IN ['Diet and genetics','Genetics','Stress and genetics' ,'High cholesterol','Genetic predisposition' , 'Stress']
        RETURN p1, c1, p2 , p4,c2
        `
      }
      else {
        query += `
        MATCH (p2)-[c2:DiabetesvPres]-(p4:Disease)
        WHERE p4.\`Cause of Disease\` IN
          CASE
            WHEN p2.Outcome = 1 THEN ['High cholesterol','Diet and genetics','Genetics','Stress and genetics' , 'Smoking','Stress','Poor diet and sedentary lifestyle']
          END
        RETURN p1, c1, p2 , p4,c2
        `
      }
    }
    
    
  
      const { records, summary, keys } = await driver.executeQuery(query)
    
        console.log(
          `>> The query ${summary.query.text} ` +
          `returned ${records.length} records ` +
          `in ${summary.resultAvailableAfter} ms.`
        )
        returnable_data = []
  
        records.forEach(record => {
        p1 = record.get('p1')
        p2 = record.get('p2')
        p4 = record.get('p4')
        
  
        returnable_data.push({p1 : p1 , p2 : p2 , p4 : p4 })
  
        })
    
        res.json({ records : returnable_data});
    })

app.get('/api/query6', async (req, res) => {

  const { records, summary, keys } = await driver.executeQuery(
    `
    MATCH (p2:\`Heart Disease\`)-[c:HeartCh]-(p1:Person)
    WHERE p1.Smoker = p2.currentSmoker AND
        CASE 
            WHEN p1.Age < 18 THEN 'group1'
            WHEN p1.Age >= 18 AND p1.Age <= 40 THEN 'group2'
            WHEN p1.Age > 40 AND p1.Age < 55 THEN 'group3'
            WHEN p1.Age >=55 THEN 'group4'
          END =
        CASE 
            WHEN p2.age < 18 THEN 'group1'
            WHEN p2.age >= 18 AND p2.age <= 40 THEN 'group2'
            WHEN p2.age > 40 AND p2.age < 55 THEN 'group3'
            WHEN p2.age >=55 THEN 'group4'
          END
      
    RETURN p1,p2,c 
    `
  )

  console.log(
    `>> The query ${summary.query.text} ` +
    `returned ${records.length} records ` +
    `in ${summary.resultAvailableAfter} ms.`
  )
  
  returnable_data = []

  records.forEach(record => {
    p1 = record.get('p1')
    p2 = record.get('p2')

    returnable_data.push({p1 : p1 , p2 : p2})

  })

  res.json({ records : returnable_data});
});

app.get('/api/query7', async (req, res) => {

  const { records, summary, keys } = await driver.executeQuery(
    `
    MATCH (p2:Diabetes)-[c:DiabetesCh]-(p1:Person)
WHERE
    CASE 
        WHEN p1.Age < 18 THEN 'group1'
        WHEN p1.Age >= 18 AND p1.Age <= 40 THEN 'group2'
        WHEN p1.Age > 40 AND p1.Age < 55 THEN 'group3'
        WHEN p1.Age >=55 THEN 'group4'
      END =
    CASE 
        WHEN p2.Age < 18 THEN 'group1'
        WHEN p2.Age >= 18 AND p2.Age <= 40 THEN 'group2'
        WHEN p2.Age > 40 AND p2.Age < 55 THEN 'group3'
        WHEN p2.Age >=55 THEN 'group4'
      END
  
RETURN p1,p2,c
    `
  )

  console.log(
    `>> The query ${summary.query.text} ` +
    `returned ${records.length} records ` +
    `in ${summary.resultAvailableAfter} ms.`
  )
  
  returnable_data = []

  records.forEach(record => {
    p1 = record.get('p1')
    p2 = record.get('p2')

    returnable_data.push({p1 : p1 , p2 : p2})

  })

  res.json({ records : returnable_data});
});

app.listen(3001, () => {
  console.log('Server started on port 3001');
});