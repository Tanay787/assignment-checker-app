import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import firebase from 'firebase';
import * as WebBrowser from 'expo-web-browser';
import { Menu, Divider, Provider, Card } from 'react-native-paper';
import AllotedStudents from './AllotedStudents';

const ViewAssignments = (props) => {
  const [assignments, setAssignments] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const querySnapshot = await firebase
          .firestore()
          .collection('assignments')
          .where('course', '==', props.course)
          .where('year', '==', props.year)
          .get();

        const assignmentsData = querySnapshot.docs.map((doc) => doc.data());
        setAssignments(assignmentsData);
      } catch (error) {
        console.log('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, [props.course, props.year]);

   const handleViewFile = async (fileURL) => {
    const googleDocsURL = `https://docs.google.com/viewer?url=${encodeURIComponent(
      fileURL
    )}`;
    await WebBrowser.openBrowserAsync(googleDocsURL);
  };

  const openMenuHandler = (event, assignmentName) => {
    setOpenMenu(assignmentName);
  };

  const closeMenuHandler = () => {
    setOpenMenu(null);
  };

  const renderAssignment = ({ item }) => {
    const dueDate = item.dueDate.toDate().toLocaleDateString();

    return (
      <Card style={styles.card}>
        <TouchableOpacity
          style={styles.assignmentContainer}
          onPress={() => handleViewFile(item.fileURL)}>
          <View style={styles.assignmentInfo}>
            <Text style={styles.assignmentName}>{item.assignmentName}</Text>
            <Text style={styles.assignmentDetail}>Course: {item.course}</Text>
            <Text style={styles.assignmentDetail}>Year: {item.year}</Text>
            <Text style={styles.assignmentDetail}>Due Date: {dueDate}</Text>
          </View>
        </TouchableOpacity>
        <Menu
          visible={openMenu === item.assignmentName}
          onDismiss={closeMenuHandler}
          anchor={
            <TouchableOpacity
              style={styles.menuButton}
              onPress={(event) => openMenuHandler(event, item.assignmentName)}>
              <Text style={styles.menuButtonText}>...</Text>
            </TouchableOpacity>
          }>
          <Menu.Item
            onPress={() => {}}
            title="Alloted Students"
            component={AllotedStudents}
          />
          <Menu.Item onPress={() => {}} title="View Responses" />
          <Menu.Item onPress={() => {}} title="Remaining Students" />
          <Menu.Item onPress={() => {}} title="Delete Assignment" />
        </Menu>
      </Card>
    );
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.title}>Manage Assignments</Text>
        {assignments.length > 0 ? (
          <FlatList
            data={assignments}
            renderItem={renderAssignment}
            keyExtractor={(item) => item.assignmentName}
          />
        ) : (
          <Text>No assignments found.</Text>
        )}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  assignmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  assignmentDetail: {
    fontSize: 14,
    marginBottom: 4,
  },
  menuButton: {
    padding: 8,
  },
  menuButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
  },
});

export default ViewAssignments;