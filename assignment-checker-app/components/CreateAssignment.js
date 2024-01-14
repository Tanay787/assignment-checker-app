import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import firebase from 'firebase';

const CreateAssignment = (props) => {
  const [assignmentName, setAssignmentName] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dueDate, setDueDate] = useState(new Date()); // Initialize with current date
  const [file, setFile] = useState(null);

  const handleCreateAssignment = async () => {
  if (!assignmentName || !course || !year || course === "None" || year === "None") {
    Alert.alert('Error', "Please Make Sure to fill all fields and don't forget to attach a file.")
    return;

  }

    const isUnique = !assignments.some((assignment) => assignment.assignmentName === assignmentName);
    if (!isUnique) {
      Alert.alert('Error', 'The assignment name must be unique.');
      return;
    }

  try {
      // Upload the file to Firebase Storage
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(
        `users/${props.uid}/assignments/${assignmentName}/${file.name}`
      );
      const response = await fetch(file.uri);
      const blob = await response.blob();

      // Upload the Blob object to Firebase Storage
      const uploadTask = fileRef.put(blob);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          // Handle upload progress or state changes if needed
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${progress}%`);
        },
        (error) => {
          console.log('File upload error:', error);
        },
        async () => {
          const downloadURL = await fileRef.getDownloadURL();

          // Save the assignment details to Firestore
          const assignmentRef = firebase
            .firestore()
            .collection('assignments')
            .doc();
          await assignmentRef.set({
            assignmentName,
            course,
            year,
            dueDate,
            fileURL: downloadURL,
            fileType: file.mimeType.split('/')[1],
            uid: props.uid,
          });

          // Reset the form
          setAssignmentName('');
          setCourse('');
          setYear('');
          setDueDate(new Date());
          setFile(null);

          console.log('Assignment created successfully!');

          Alert.alert('Success', 'Assignment created successfully!');
        }
      );
    } catch (error) {
      console.log('Error creating assignment:', error);
    }
  };

  const handleFileUpload = async () => {
    try {
      const fileResult = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (fileResult.type === 'success') {
        setFile(fileResult);
        console.log('File selected:', fileResult.name);
        console.log('File type:', fileResult.mimeType);
      } else {
        Alert.alert('Error', 'Please select a PDF file.');
      }
    } catch (error) {
      console.log('File selection error:', error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    const dateWithoutTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    setDueDate(dateWithoutTime);
    setShowDatePicker(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Assignment</Text>
      <TextInput
        style={styles.input}
        placeholder="Assignment Name"
        value={assignmentName}
        onChangeText={setAssignmentName}
      />
      <Picker
        selectedValue={course}
        onValueChange={(itemValue) => setCourse(itemValue)}>
        <Picker.Item label="Course" value="None" />
        <Picker.Item label="BScIT" value="BScIT" />
        <Picker.Item label="BAF" value="BAF" />
        <Picker.Item label="BMS" value="BMS" />
      </Picker>
      <Picker
        selectedValue={year}
        onValueChange={(itemValue) => setYear(itemValue)}>
        <Picker.Item label="Year" value="None" />
        <Picker.Item label="FY" value="FY" />
        <Picker.Item label="SY" value="SY" />
        <Picker.Item label="TY" value="TY" />
      </Picker>
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowDatePicker(true)}>
        <Text style={styles.buttonText}>Set Due Date</Text>
      </TouchableOpacity>

      <Text style={styles.dateText}>
        Due Date: {dueDate.toLocaleDateString()}
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleFileUpload}>
        <Text style={styles.buttonText}>Attach a File</Text>
      </TouchableOpacity>
      {file && <Text style={styles.fileText}>Attached File: {file.name}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleCreateAssignment}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  fileText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default CreateAssignment;
