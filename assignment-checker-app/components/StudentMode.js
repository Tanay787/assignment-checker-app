import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import StudentForm from './StudentForm';
import ViewAssignments from './ViewAssignment';

const StudentMode = ({ uid }) => {
  const [showForm, setShowForm] = useState(true);

  const handleFormSubmit = () => {
    setShowForm(false);
  };

  return (
    <View>
      <Text>Student Mode</Text>
      {showForm ? (
        <StudentForm uid={uid} onSubmit={handleFormSubmit} />
      ) : (
        <ViewAssignments uid={uid} />
      )}
    </View>
  );
};

export default StudentMode;
