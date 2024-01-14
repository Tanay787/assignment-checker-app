import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import CreateAssignment from './CreateAssignment';
import ManageAssignments from './ManageAssignments';

const TeacherMode = ({ uid }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const renderOption = () => {
    switch (selectedOption) {
      case 'create':
        return <CreateAssignment uid={uid} />;
      case 'manage':
        return <ManageAssignments uid={uid} />;
      default:
        return null;
    }
  };

  return (
    <View>
      <Text>Teacher Mode</Text>
      <Button title="Create an Assignment" onPress={() => setSelectedOption('create')} />
      <Button title="Manage Assignments" onPress={() => setSelectedOption('manage')} />
      {renderOption()}
    </View>
  );
};

export default TeacherMode;
