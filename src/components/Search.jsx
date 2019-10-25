import React from "react";
import Link from "./Link";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

class Search extends React.Component {
  state = {
    links: [],
    filter: ""
  };

  render() {
    return (
      <div>
        <form onSubmit={(event) => {
            event.preventDefault();
            this._executeSeach(this.state.filter);
          }}
        >
          Search
          <input
            type="text"
            onChange={({ target }) => {this.setState({ filter: target.value })}}
          />
          <button type="submit">OK</button>
        </form>
        {
          this.state.links.map((link, index) => (
            <Link key={link.id} link={link} index={index} />
          ))
        }
      </div>
    );
  }

  async _executeSeach() {
    const { filter } = this.state;
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter }
    });
    const { links } = result.data.feed;

    this.setState({ links });
  }
}

export default withApollo(Search);
