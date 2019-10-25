import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { FEED_QUERY } from "./LinkList";

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!){
    post(description: $description, url: $url) {
      id,
      createdAt,
      url,
      description
    }
  }
`;

class CreateLink extends React.Component {
  state = {
    description: "",
    url: ""
  };

  render () {
    const { description, url } = this.state;

    return (
      <div className="flex flex-column mt3">
        <input
          className="mb2"
          placeholder="A description for the link"
          onChange={(e) => this.setState({ description: e.target.value })}
          type="text"
          value={description}
          />
        <input
          className="mb2"
          placeholder="The url of the link"
          onChange={(e) => this.setState({ url: e.target.value })}
          type="text"
          value={url}
          />
        <Mutation
          mutation={POST_MUTATION}
          onCompleted={() => this.props.history.push("/")}
          update={(store, { data: { post }}) => {
            const data = store.readQuery({ query: FEED_QUERY });

            data.feed.links.unshift(post);

            store.writeQuery({ query: FEED_QUERY, data});
          }}
          variables={{ description, url }}
        >
          {(postMutation) => {
            return (
              <button onClick={postMutation}>Submit</button>
            );
          }}
        </Mutation>
      </div>
    );
  };
};

export default CreateLink; 