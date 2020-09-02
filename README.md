This project was built using [create-react-native-app.](https://github.com/expo/create-react-native-app)


## Get Started:
To download expo's cli:
```
npm install expo-cli -g
```
To download the project's dependencies, run: 
```
 npm install --save
```


## Setting up firebase storage:

The app is running with a test account, but you can easily create your own cloud storage for the application by following this guide:

- Head over to [firebase](https://firebase.google.com/) and sign in using your google account. 
- Click on `go to console ` and then follow the onscreen instructions to `add a project`.
- Click on `Realtime Database` to create your storage - for the purposes of this tutorial you can choose to `start in test mode`. 
- Following this create a collection and name it `messages` then select `Auto-ID` and then click next. 
- Next, head to the menu on the left again and choose `authentication` - follow the prompts and select `anonymous` - this allows users to access the app without needing to register.
- Finally, to get your firebase configuration settings so you can link the project to your database - click on the `gear 'settings'` icon above authentication and select `Project settings`, click on the web app tab `</>` and then follow the instructions until you are presented with your firebase configuration details. 
- Now you can copy the `firebaseConfig` into your Chat.js file, and you should be ready to get testing!  

### Kanban Board:
[Chat-App - kanban board](https://trello.com/b/2vwmpwqJ/project-5-react-native-chat-app)
    
