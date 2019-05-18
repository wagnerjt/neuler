import React, { Component } from 'react';
import {
  Button,
  Card,
  CardGroup,
  Container,
  Header,
  Icon,
} from 'semantic-ui-react';

import { selectGroup } from '../ducks/algorithms';
import { connect } from 'react-redux';

/**
 * @author wagnerjt
 * Contains a list of all of the Algorithms NEuler has a UI for
 */
const AlgorithmCategories = [
  {
    key: 'centralities',
    header: 'Centralities',
    description: `These algorithms determine the importance of distinct nodes in 
      a network.`,
    icon: 'sitemap',
    group: 'Centralities',
  },
  {
    key: 'communityDetection',
    header: 'Community Detection',
    description: `These algorithms evaluate how a group is clustered or
                  partitioned, as well as its tendency to strengthen or break
                  apart.`,
    icon: 'sitemap',
    group: 'Community Detection',
  },
  {
    key: 'pathFinding',
    header: 'Path Finding',
    description: `These algorithms help find the shortest path or evaluate the
                  availability and quality of routes.`,
    icon: 'sitemap',
    group: 'Path Finding',
  },
  {
    key: 'similarity',
    header: 'Similarity',
    description: 'These algorithms help calculate the similarity of nodes.',
    icon: 'sitemap',
    group: 'Similarity',
  },
];

class Home extends Component {
  render() {
    const containerStyle = {
      padding: '1em',
    };

    const { selectGroup } = this.props;

    return (
      <div style={containerStyle}>
        <Container fluid>
          <Header as={'h3'}>Algorithm Categories</Header>
          <p>
            The Neo4j Graph Algorithms Library supports the following categories
            of algorithms.
          </p>

          {/* Render all known algorithm categories in their respective cards */}
          <CardGroup>
            {AlgorithmCategories.map(category => (
              <Card key={category.key}>
                <Card.Content>
                  <Icon name={category.icon} />
                  <Card.Header>{category.header}</Card.Header>
                  <Card.Meta>{category.description}</Card.Meta>
                </Card.Content>
                <Card.Content extra>
                  <div className="ui two buttons">
                    <Button
                      basic
                      color="green"
                      onClick={() => selectGroup(category.group)}
                    >
                      Select
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </CardGroup>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeGroup: state.algorithms.group,
});

const mapDispatchToProps = dispatch => ({
  selectGroup: group => dispatch(selectGroup(group)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
