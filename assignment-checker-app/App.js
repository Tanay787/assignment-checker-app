import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, TextInput, Text } from 'react-native';
import firebase from 'firebase';
import * as DocumentPicker from 'expo-document-picker';

import StudentMode from './components/StudentMode';
import CreateAssignment from './components/CreateAssignment';
import StudentForm from './components/StudentForm';
import ViewAssignment from './components/ViewAssignment';
import ManageAssignments from './components/ManageAssignments';
import TeacherMode from './components/TeacherMode';

const firebaseConfig = {
  // Add your Firebase config here
  apiKey: 'AIzaSyBdU9Y2KDpvG6tvSzYrrlAZJ2RUpX3GKIY',
  authDomain: 'file-management-system-39da7.firebaseapp.com',
  projectId: 'file-management-system-39da7',
  storageBucket: 'file-management-system-39da7.appspot.com',
  messagingSenderId: '150415198400',
  appId: '1:150415198400:web:5b049796c0947eae98c525',
  //measurementId: "G-KR294CJDRB"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  const handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        setLoggedIn(true);
      })
      .catch((error) => {
        console.log('Login error:', error);
      });
  };

  const handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        setLoggedIn(true);
      })
      .catch((error) => {
        console.log('Sign-up error:', error);
      });
  };

  const handleFileUpload = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync();

      if (file.type === 'success') {
        const uid = firebase.auth().currentUser.uid;
        const storageRef = firebase
          .storage()
          .ref()
          .child(`users/${uid}/${file.name}`);

        const fileRef = storageRef.put(file.uri);

        fileRef.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload progress: ${progress}%`);
          },
          (error) => {
            console.log('Upload error:', error);
          },
          () => {
            console.log('Upload complete');
          }
        );
      }
    } catch (error) {
      console.log('File selection error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {!loggedIn ? (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <Button title="Login" onPress={handleLogin} />
          <Text style={styles.signupText} onPress={handleSignUp}>
            Not a user? Sign Up here
          </Text>
        </View>
      ) : (
        // <TeacherMode uid={firebase.auth().currentUser.uid} />
        <StudentMode uid={firebase.auth().currentUser.uid} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  form: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  signupText: {
    marginTop: 8,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default App;
