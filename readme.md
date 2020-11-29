# Bus-Mama

The Bus-Mama is a bus tracking mobile application based on a tracking platform for the transportation of the students of BSMRSTU. It helps the students of our university by showing the available route, bus, and their exact location. This app includes real-time bus tracking which is going to solve a problem that university students have been facing for many years. Students are often seen missing their buses. Often they can't maintain the bus time. Since there are many buses in our university, students can easily catch a bus if they know where and when it will pass by. My goal is to track the buses and make hardware, mobile application, and machine learning solution to solve the issue. This way the students can get relief from missing the bus and use the buses efficiently.
The main idea is to track the buses. GPS trackers will be attached to every bus that will give the current position of them and automatically sync on the server. The Bus-Mama mobile application will show every real-time position of those buses. This application will be installed on students' mobile phones and in this way the students can easily maintain their transportation.
In this application, the current location of the bus can be seen through Google map. Every bus will have a specific marker on Google map and all the details about a specific bus will be shown by clicking on the marker. There will be seen about how far the bus is, from which direction it will come, how much time to reach the bus, how much time it will take if there is any traffic on road, etc. There is also a search option to know about any specific bus details. There is also a list of all buses with sufficient details that will help students to know about all the details. Every student will have an account through which they can access bus data.
Another main objective is the Bus-Mama Chatbot in the Bengali language so that the students can communicate to know about the bus easily. For now, they can make conversation only about bus-related information. The Chatbot is not yet able to make conversation except bus-related questions. If anyone asks anything except bus-related questions, it cannot reply to the question rather it will give a tag to the question as a reply.
As the Chatbot is created in the Bengali language, it has used the "trie" data structure in lemmatization. A library has been designed to lemmatize the Bengali words. Almost 63,205 Bengali words have been lemmatized by using the library to train the SVM machine learning model.
In the BanglaLanguageProcessing file, it will do the following tasks _(after start the python server)_:

1. To Lemmatize, the word lists(63205 Bengali words) are passed to the trie data structure and perform the lemmatization.
2. To clean, It will remove punctuations and some stop words.
3. It does the same things(1 and 2) for the previously written conversations and questions answers.
4. Generate the frequency of words by TfidfVectorizer from the preprocessed sentences.
5. Then it will pass to SVM for training the model.
   _(after a message has been sent)_:
6. It will be pass through the process 1 and 2.
7. Then send to SVM for predictions.
8. Send the predicted tags and reply to the frontend.
9. Frontend sends it to the backend(nodejs) if there are any requirements of bus data then frontend attaches the server reply.
   If anyone sends a message, the message will pass through the python server via socket programming. The reply will be generated in the python server and send back to the frontend and again it will pass the reply to the backend server. This backend server will store the data in the database and provide the bus info to the frontend.

#### Objectives

- Software
  - Can show the bus location, bus details, and user info.
  - Can send messages.
  - Has account for every students.
- Hardware
  - **GPS** data like **date**, **time**, **latitude**, **longitude**, **altitude**.

#### Technical Challenges

- Make the lemmatization process using the **trie** data structure for the Bangla language.
- Make Bengali language classification using **TfidfVectorizer** and **SVM**
- Collects as many as **Bangla words** to feed the trie data structure.
- Make a machine learning **mobile** solution with **H/W**, **S/W** and **ML** with the web technologies like **angular**, **typescript**, **nodejs**, **mongodb**, **python**.
- Make an **API** which will be the middleware between **machine learning** server, **hardware**, **software** and **database**.
- Make use of **Google Map**'s **DistanceMatrixService**, custom **map markers** and show routes.
- Combine hardware and software(mobile application) with each other and build an **IoT** solution.
- Combine **backend(node)**, **frontend(angular)** and **python server**.
- Messages will be rendered like send-reply approach.
- Make a search through the rendered texts.
- Make a mobile solution with a single code base with the web.
- Make all the password related works encrypted.
- Design **NoSQL** schemas for every database with **mongodb**.
- **Socket** connection between python and angular.

#### Disadvantages

- Circuit is designed for demonstration purpose not for production usage.
- Currently it will reply bus related question's answers.
- It can set tags of others topic too but can not send reply of other topic related questions.
- It currently uses **SVM**, but should be tested in other algorithms too.

#### Dependencies

- [bangla](https://github.com/rjarman/bangla)
  It's a package for **Lemmatization** and <u>collections of 63205 unique words of Bengali language</u>.
- [Bus-Mama-Python-Server](https://github.com/rjarman/Bus-Mama-Python-Server)
  It handles the python server for machine learning process and makes reply with tags.

#### Work Flow

![photo no 1](https://drive.google.com/uc?export=view&id=1n-xctPVzQ3_IxRd19wEoQmsQRrit5elo)

#### Installation and Run

- [Frontend](https://github.com/rjarman/House-Rent/tree/master/frontend)

  - To **install** run:

    ```
    npm install
    ```

  - To run on **development** mode _(it will run in http://localhost:4200 by default)_:

    ```
    npm run start
    ```

  - To build on **production** mode _(it will run in http://localhost:4200 by default)_:
    ```
    npm run build
    ```

- [Backend](https://github.com/rjarman/House-Rent/tree/master/backend)

  - To **install** run:

    ```
    npm install
    ```

  - To run **development server** _(it will run in http://localhost:3000 by default)_:

    ```
    npm run dev:server
    npm run start:tsc
    ```

  - To run **server** _(it will run in http://localhost:3000 by default)_:
    ```
    npm run server
    ```

#### Screenshots

![photo no 1](https://drive.google.com/uc?export=view&id=1Ag_ysNOma_IlnqRZ68xhJbEPr0eulA6u)
![photo no 2](https://drive.google.com/uc?export=view&id=1NhcqgA4zQweVRXTzAX46wNOpXIyRdPOn)
![photo no 3](https://drive.google.com/uc?export=view&id=12S0LwmljsPEnUbPmNxStiINThJXckSkv)
![photo no 4](https://drive.google.com/uc?export=view&id=1PWR4NZgEV0pGA2q2VMquYLcyKxle_yk3)
