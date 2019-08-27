// JobcardList.js

import React, { Component } from 'react';
import {  View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

export default class JobcardList extends Component {

  static propTypes = {
      jobcards: PropTypes.array.isRequired
  }; 
  render() {
    return (
      <View style={styles.jobcardsList}>
        {this.props.jobcards.map((jobcard) => {
            return (
                <View key={jobcard.id}><Text style={styles.jobcardtext}>{jobcard.name} | { jobcard.price }</Text></View>
            )
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    jobcardsList: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    jobcardtext: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});