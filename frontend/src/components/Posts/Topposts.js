import Postcard from "./Postcard"
import classes from "./Posts.module.css";

const Posts = [
    {
        imgs: ["https://i.imgur.com/v7yPDWf.jpg",
        "https://i.imgur.com/FFeDoCE.jpg",
            "https://i.imgur.com/O8iMicr.jpg",],
        title: "Sick S13 Widebody build",
        description: "super raddddd",
        likes: 8,
        username: "Koko2loko",
        Vehicle: {
            id: 2,
            year: 1996,
            make: 'Nissan',
            model: '240sx'
        },
        comments: [{id: 1, userId: 1, username: "bendett", text: "Yoooooo" }]
    }
]
function Topposts(props) {
    const thePosts = Posts.map(post => {
        return (<Postcard vehicle={post.Vehicle} comments={post.comments} description={post.description} title={post.title} imgs={post.imgs} likes={post.likes} username={post.username} />)
    })
    return(
        <div className={classes['Postpage']}>
            <div className={classes['title']}>Top Posts</div>
            {thePosts}
        </div>
    )
}
export default Topposts