import { fetchPosts } from './api/api';
import './App.css';
import {useQuery} from '@tanstack/react-query'
function App() {
  const { data:postData, isLoading, isError, error} = useQuery({
    queryKey : ["posts"],
    queryFn : fetchPosts
  });
  console.log(postData, isLoading)
  return (
    <div className="container">
      <h1 className="title">My Posts</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>{error?.message}</p>}
      {postData?.map((post)=>{
        return <div key={post.key} className="post">
          <div>{post.title}</div>
          {post.tags.map((tag)=><span key={tag}>{tag}</span>)}
        </div>
      })}
    </div>
  );
}

export default App;
