const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// port on which server will run
let port = 1234;

// import postgresdatabase
const { Client } = require('pg')


// set connection details for AccentureApp database with credentials
const client = new Client({
  user: 'accentureUser',
  host: 'localhost',
  database: 'AccentureApp',
  password: '1234',
  port: 5432,
})

// connect to database
const connectionToPostgres = async (dbClient) => {
  await dbClient.connect();
  console.log("Connected successfully to database.");
}

connectionToPostgres(client);



// USER PERSISTENCE ==================================================================================================================


const insertUser = async (dbClient, userEmail, fullname, password) => {
  try {
    await dbClient.query(
      `
      INSERT INTO public.user (fullname, email, password)
      VALUES ($1, $2, $3)
      ON CONFLICT (email)
      DO NOTHING
      `, 
      [
        fullname,
        email,
        password
      ]
    )
  } catch (error) {
    console.log(error.stack);
  }
}


const findUser = async (dbClient, email) => {
  try {
    const user = await dbClient.query(
      `
      SELECT * FROM public.user
      WHERE email = $1
      `, [
        email
      ]
      );

    return user.rows;

  } catch (e) {
    console.log(e.stack);
  }
}


const fetchUsers = async (dbClient) => {
  try {
    const users = await dbClient.query(
      `
      SELECT * FROM public.user
      ORDER BY public.user.fullname ASC
      `
      );

    return users.rows
  } catch (error) {
    console.log(error.stack);
  }
}


// =====================================================================================================================================
// LESSON PERSISTENCE ==================================================================================================================


const findLessonById = async (dbClient, id) => {
  try {
    const lesson = await dbClient.query(
      `
      SELECT * FROM public.lesson
      WHERE id = $1
      `, [
        id
      ]
      );

    return lesson.rows[0];

  } catch (e) {
    console.log(e.stack);
  }
}

const insertLesson = async (dbClient, title, description) => {
  try {
    const id = Date.now();
    await dbClient.query(
      `
      INSERT INTO public.lesson (id, title, description)
      VALUES ($1, $2, $3)
      ON CONFLICT (id)
      DO NOTHING
      `, 
      [
        id,
        title,
        description
      ]
    )
  } catch (error) {
    console.log(error.stack);
  }
}

const updateLesson = async (dbClient, id, lesson) => {
  try {
    await dbClient.query(
      `
      UPDATE public.lesson
      SET title = $1 AND description = $2
      WHERE id = $3
      `, [
        lesson.title,
        lesson.description,
        id
      ]
    )
  } catch (error) {
    console.log(error.stack);
  }
}

const deleteLesson = async (dbClient, id) => {
  try {
    await dbClient.query(
      `
      DELETE FROM public.lesson WHERE id = $1
      `, [
        id,
      ]
    )
  } catch (error) {
    console.log(error.stack);
  }
}

const fetchLessons = async (dbClient) => {
  try {
    const lessons = await dbClient.query(
      `
        SELECT * FROM public.lesson
      `
    );

    return lessons.rows;
  } catch (error) {
    console.log(error.stack);
  }
}


// =====================================================================================================================================
// EVENT PERSISTENCE ==================================================================================================================


const findEventById = async (dbClient, id) => {
  try {
    const event = await dbClient.query(
      `
      SELECT * FROM public.event
      WHERE id = $1
      `, [
        id
      ]
      );

    return event.rows[0];

  } catch (e) {
    console.log(e.stack);
  }
}

const insertEvent = async (dbClient, eventName, date, listItemsToTank, description) => {
  try {
    const id = Date.now();
    await dbClient.query(
      `
      INSERT INTO public.event (id, name, duedate, password)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id)
      DO NOTHING
      `, 
      [
        id,
        eventName,
        date,
        description
      ]
    )

    for(item of listItemsToTank) {
      await dbClient.query(
        `
        INSERT INTO public.eventranking (eventid, item)
        VALUES ($1, $2)
        ON CONFLICT (eventid, item)
        DO NOTHING
        `, 
        [
          id,
          item
        ]
      )
    }

  } catch (error) {
    console.log(error.stack);
  }
}

const updateEvent = async (dbClient, id, event) => {
  try {
    const eventFromDb = await findEventById(id);
    // check if exists that event in database
    if (eventFromDb !== undefined) {

      // edit items to be ranked
      //delete items to be ranked

      await dbClient.query(
        `
        DELETE FROM public.eventranking WHERE eventid = $1
        `, [
          id,
        ]
      )

      // insert new ones
      for(item of event.items) {
        await dbClient.query(
          `
          INSERT INTO public.eventranking (eventid, item)
          VALUES ($1, $2)
          ON CONFLICT (eventid, item)
          DO NOTHING
          `, 
          [
            id,
            item
          ]
        )
      }

      // edit all other fields no matter what items we updated
      await dbClient.query(
        `
        UPDATE public.event
        SET name = $1 AND duedate = $2 AND description = $3
        WHERE id = $4
        `, [
          event.name,
          event.duedate,
          event.description,
          id
        ]
      )

    }
  } catch (error) {
    console.log(error.stack);
  }
}

const deleteEvent = async (dbClient, id) => {
  try {
    await dbClient.query(
      `
      DELETE FROM public.event WHERE id = $1
      `, [
        id,
      ]
    )
  } catch (error) {
    console.log(error.stack);
  }
}


const fetchEvents = async (dbClient) => {
  try {
    const events = await dbClient.query(
      `
        SELECT * FROM public.event
      `
    );

    for(event in events.row) {
      const itemsTobeRanked = await dbClient.query(
        `
          SELECT * FROM public.eventranking
          WHERE eventid = $1
        `, 
        [
          event.id
        ]
      );

      event.items = itemsTobeRanked.rows;
    }

    return events.rows;
  } catch (error) {
    console.log(error.stack);
  }
}

// ===============================================================================================================================

// ROUTES ________________________________________________________________________________________________________________________

// ROUTES/Event ==================================================================================================================


app.post('/fetch-events', (req, res) => {
  (async () => {
    const users = await fetchEvents(client);
    res.send(JSON.stringify(users));
  })();
});

app.post('/add-event', (req, res) => {
  (async () => {
    const name = req.body.name;
    const duedate = req.body.duedate;
    const items = req.body.itemsToBeRanked;
    const description = req.body.description

    try {
      const beforeAdd_events = fetchEvents();
      await insertEvent(name, duedate, items, description);
      const afterAdd_events = fetchEvents();
      if (beforeAdd_events.length < afterAdd_events.length) {
        res.status(201).send(afterAdd_events);
      } else {
        console.log("Error! Insert failed.")
      }
    } catch (error) {
      console.log(error.stack);
      res.status(500).send();
    }
  })();
});

app.post('/delete-event', (req, res) => {
  (async () => {
    const id = req.body.id;
    try {
      await deleteEvent(client, id);
      const events = fetchEvents();
        res.status(201).send(events);
    } catch (error) {
      console.log(error.stack);
      res.status(500).send();
    }
  })();
});

app.post('/update-event', (req, res) => {
  (async () => {
    const id = req.body.id;
    const newEvent = req.body.event;
    try {
      await updateEvent(client, id, newEvent);
      const events = fetchEvents();
        res.status(201).send(events);
    } catch (error) {
      console.log(error.stack);
      res.status(500).send();
    }
  })();
});

// ================================================================================================================================
// ROUTES/Lesson ==================================================================================================================


app.post('/fetch-lessons', (req, res) => {
  (async () => {
    const users = await fetchLessons(client);
    res.send(JSON.stringify(users));
  })();
});

app.post('/add-lesson', (req, res) => {
  (async () => {
    const title = req.body.title;
    const description = req.body.description

    try {
      const beforeAdd_lessons = fetchLessons();
      await insertLesson(title, description);
      const afterAdd_lessons = fetchLessons();
      if (beforeAdd_lessons.length < afterAdd_lessons.length) {
        res.status(201).send(afterAdd_lessons);
      } else {
        console.log("Error! Insert failed.")
      }
    } catch (error) {
      console.log(error.stack);
      res.status(500).send();
    }
  })();
});

app.post('/delete-lesson', (req, res) => {
  (async () => {
    const id = req.body.id;

    try {
      await deleteLesson(client, id);
      const lessons = fetchLessons();
        res.status(201).send(lessons);
    } catch (error) {
      console.log(error.stack);
      res.status(500).send();
    }
  })();
});

app.post('/update-lesson', (req, res) => {
  (async () => {
    const id = req.body.id;
    const newLesson = req.body.lesson;
    try {
      await updateLesson(client, id, newLesson);
      const lessons = fetchLessons();
        res.status(201).send(lessons);
    } catch (error) {
      console.log(error.stack);
      res.status(500).send();
    }
  })();
});

// ==================================================================================================================================
// ROUTES/User&Authentication =======================================================================================================


app.post('/sign-up', (req, res) => {
  (async () => {
    const name = req.body.fullname;
    const email = req.body.email;
    const type = req.body.password;

    try {
      const checkUser = await findUser(client, email);
      await insertUser(client, name, email, type);
      const checkUserInserted = await findUser(client, email);
      if (checkUser.length === 1) {
        res.status(201).send("User already exists.");
      } else {
        if(checkUserInserted.length >= 1) {
          res.status(200).send('User inserted successfully');
        }
      }
    } catch (error) {
      console.log(error.stack);
      res.status(500).send();
    }
  })();
});

app.post('/login', (req, res) => {
  (async () => {
    const email = req.body.email;
    const password = req.body.password;

    try {
      const checkUser = await findUser(client, email);
      if (checkUser.length === 1 && checkUser.password === password) {
        res.status(201).send(checkUser);
      } else {
        console.log("Error! Invalid email or password.")
      }
    } catch (error) {
      console.log(error.stack);
      res.status(500).send();
    }
  })();
})


app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
})