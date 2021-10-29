const { ApolloServer, gql } = require('apollo-server');

var data = require('./data')

const typeDefs = gql`

  type  Blog {
    title: String!
    content: String!
    author: Author!
    likes: Int
    comments: [Comment]
  }

  type Author{
    authorName: String!
    authorEmail: String!
  }

  type Comment{
    id: ID
    comment: String
  }


  type Query {
    blogs: [Blog]
  }

  type Mutation{
    addBlog(title: String!, content: String!, authorName: String!, authorEmail: String!) : Blog,

    likeBlog(id:ID!) : String,

    unlikeBlog(id: ID!) : String,

    addComment(id:ID!, comment: String) : String,

    deleteComment(id:ID!) : String,

    updateBlog(id:ID, title: String, content: String, authorName: String, authorEmail: String) : Blog
  }
`;

const resolvers = {
  Query: {
    blogs: () => data,
  },

  Mutation: {

    addBlog(parent, args, context, info) {

      const { title, content, authorName, authorEmail } = args

      var lastData = data[data.length - 1]

      var dataObj = {
        id: lastData.id++,
        title,
        content,
        author: {
          authorName,
          authorEmail
        }
      }

      data.push(dataObj)

      return dataObj


    },

    likeBlog(parent, args, context, info) {
      const { id } = args;

      for (i = 0; i <= data.length; i++) {
        if (data[i].id == id) {
          temp = data[i]
          if (temp.likes == undefined) {
            temp.likes = 1
          } else {
            temp.likes++
          }

          console.log(temp)

          data.pop(i)

          data.push(temp)

          return "Like added!!!"
        }
      }
    },

    unlikeBlog(parent, args, context, info) {
      const { id } = args;

      for (i = 0; i <= data.length; i++) {
        if (data[i].id == id) {
          temp = data[i]
          if (temp.likes > 1 || temp.likes !== undefined) {
            temp.likes - 1
          }

          console.log(temp)

          data.pop(i)

          data.push(temp)

          return "Blog unliked!!!"
        }
      }
    },

    addComment(parent, args, context, info) {
      const { id, comment } = args;

      for (i = 0; i <= data.length; i++) {
        if (data[i].id == id) {
          temp = data[i]
          if (temp.comment == undefined) {
            temp.comments = [comment]
          } else {
            temp.comments.append(comment)
          }

          console.log(temp)

          data.pop(i)

          data.push(temp)

          return "Comment Added!!!"
        }
      }
    },


    updateBlog(parent, args, context, info) {

      const { id , title, content, authorName, authorEmail } = args

     for (i = 0; i <= data.length; i++) {

        if (data[i].id == id) {

          

          temp = {
            id: i,
            title,
            content,
            author: {
              authorName,
              authorEmail
            }
          }

          data[i] = temp

          return temp
        }

     

   

      
    }
    },


    }




  };

// two parameters required: the schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`Server available at ${url}`);
});
