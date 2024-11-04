import { fetchPosts, fetchTags, addPost } from './api/api';
import './App.css';
import {useQuery, useMutation} from '@tanstack/react-query'
function App() {
  const { data:postData, isLoading, isError, error} = useQuery({
    queryKey : ["posts"],
    queryFn : fetchPosts
  });
  console.log(postData, isLoading)
  const {data: tagsData, isLoading: isTagsLoading} = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    // 👇 Since this wont change we dont want to refetch it
    staleTime: Infinity,
  });

  const {
    mutate,
    isPending,
    isError: isPostError,
    reset,
  } = useMutation({
    mutationFn: addPost,
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const tags = Array.from(formData.keys()).filter(
      (key) => formData.get(key) === "on"
    );

    if (!title || !tags) return;

    mutate({id: postData?.items + 1, title, tags});

    e.target.reset(); // reset form
  };
  return (
    <div className="container">
       <form onSubmit={handleSubmit}>
        {isPostError && <h5 onClick={() => reset()}>Unable to Post</h5>}
        <input
          type="text"
          placeholder="Enter your post.."
          className="postbox"
          name="title"
        />
        <div className="tags">
          {tagsData?.map((tag) => {
            return (
              <div key={tag}>
                <input name={tag} id={tag} type="checkbox" />
                <label htmlFor={tag}>{tag}</label>
              </div>
            );
          })}
        </div>
        <button disabled={isPending}>
          {isPending ? "Posting..." : "Post"}
        </button>
      </form>
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
