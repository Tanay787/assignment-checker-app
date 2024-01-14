import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-community/picker';
import firebase from 'firebase';
import ViewAssignments from './ViewAssignment'

const StudentForm = () => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [nameError, setNameError] = useState('');
  const [rollNumberError, setRollNumberError] = useState('');
  const [courseError, setCourseError] = useState('');
  const [yearError, setYearError] = useState('');

  const validateForm = () => {
    let isValid = true;

    if (name.trim() === '') {
      setNameError('Please enter a name');
      isValid = false;
    } else {
      setNameError('');
    }

    if (rollNumber.trim() === '') {
      setRollNumberError('Please enter a roll number');
      isValid = false;
    } else {
      setRollNumberError('');
    }

    if (course === 'None') {
      setCourseError('Please select a course');
      isValid = false;
    } else {
      setCourseError('');
    }

    if (year === 'None') {
      setYearError('Please select a year');
      isValid = false;
    } else {
      setYearError('');
    }

    return isValid;
  };

  const handleFormSubmit = () => {
    const isValid = validateForm();
    if (isValid) {
      const studentData = {
        name,
        rollNumber,
        course,
        year,
      };

      // Check for unique roll number using Firestore query
      firebase
        .firestore()
        .collection('students')
        .where('rollNumber', '==', rollNumber)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            Alert.alert('Error', 'The roll number must be unique.');
          } else {
            firebase
              .firestore()
              .collection('students')
              .add(studentData)
              .then(() => {
                console.log('Data added to Firestore successfully!');
                // Reset form fields
                setName('');
                setRollNumber('');
                setCourse('');
                setYear('');
              })
               
              .catch((error) => {
                console.log('Error adding data to Firestore:', error);
              });
          }
        })
        .catch((error) => {
          console.log('Error querying Firestore:', error);
        });
          return <ViewAssignments course={course} year={year} />;
    }
      
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      {nameError ? <Text style={styles.error}>{nameError}</Text> : null}

      <Text style={styles.label}>Roll Number:</Text>
      <TextInput
        style={styles.input}
        value={rollNumber}
        onChangeText={setRollNumber}
      />
      {rollNumberError ? <Text style={styles.error}>{rollNumberError}</Text> : null}

      <Text style={styles.label}>Course:</Text>
      <Picker
        selectedValue={course}
        style={styles.input}
        onValueChange={(itemValue) => setCourse(itemValue)}
      >
        <Picker.Item label="Course" value="None" />
        <Picker.Item label="BScIT" value="BScIT" />
        <Picker.Item label="BAF" value="BAF" />
        <Picker.Item label="BMS" value="BMS" />
      </Picker>
      {courseError ? <Text style={styles.error}>{courseError}</Text> : null}

      <Text style={styles.label}>Year:</Text>
      <Picker
        selectedValue={year}
        style={styles.input}
        onValueChange={(itemValue) => setYear(itemValue)}
      >
        <Picker.Item label="Year" value="None" />
        <Picker.Item label="FY" value="FY" />
        <Picker.Item label="SY" value="SY" />
        <Picker.Item label="TY" value="TY" />
      </Picker>
      {yearError ? <Text style={styles.error}>{yearError}</Text> : null}

      <Button title="Submit" onPress={handleFormSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 24,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default StudentForm;
