import React from "react";
import Link from "./Link";
import gql from "graphql-tag";
import { Query } from "react-apollo";

export const FEED_QUERY = gql`
  query {
    feed {
      links {
        id,
        createdAt,
        description,
        postedBy {
          id,
          name
        },
        url,
        votes {
          id,
          user {
            id
          }
        }
      }
    }
  }
`;

export const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id,
      createdAt,
      description,
      postedBy {
        id,
        name
      },
      url,
      votes {
        id,
        user {
          id
        }
      }
    }
  }
`;

class LinkList extends React.Component {
  render () {
    return (
      <Query query={FEED_QUERY}>
        {({loading, error, data, subscribeToMore}) => {
          if (loading) return <div> Fetching... </div>
          else if (error) return <div> Error :'( </div>
          
          this._subscribeToNewLiks(subscribeToMore);
          
          return data.feed.links.map((link, index) => (
            <Link
              index={index}
              key={link.id}
              link={link}
              updateStoreAfterVote={this._updateAfterVote}
            />
          ))
        }}
      </Query>
    )
  }

  _subscribeToNewLiks(subscribeToMore) {
    subscribeToMore({
      document: NEW_LINKS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev;

        const newLink = subscriptionData.data.newLink;
        const exists = prev.feed.links.find(({ id }) => id === newLink.id);

        if (exists) return prev;

        return Object.assign({}, prev, {
          feed: {
            count: prev.feed.count + 1,
            links: [newLink, ...prev.feed.links],
            __typename: prev.feed.__typename
          }
        });
      }
    });
  }

  _updateAfterVote = (store, createVote, linkId) => {
    const data = store.readQuery({ query: FEED_QUERY });

    const votedLink = data.feed.links.find(l => l.id === linkId);
    votedLink.votes = createVote.link.votes;

    store.writeQuery({ query: FEED_QUERY, data });
  }
};

export default LinkList;