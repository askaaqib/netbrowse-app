// Jobcard.js

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ajax from '../services/FetchJobcards';
import JobcardList from '../components/JobcardList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#B6A6BB',
  }
})

export class Jobcard extends Component {

  state = {
    jobcards: []
  }

  async componentDidMount() {
    const jobcards = await ajax.fetchJobcards();
    this.setState({jobcards});
  }

  render() {
    return (
      <View style={styles.container}>
      {
        this.state.jobcards && this.state.jobcards.length > 0
        ? <JobcardList jobcards={this.state.jobcards} />
        : <Text>No jobcards</Text>  
      }
      </View>
    )
  }
}

export default Jobcard;