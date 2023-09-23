/**
 * Friends Chats component
 */

import FriendItem from "../partial/FriendItem";

/**
 * Builds and renders the friends chats component
 * @returns Friends chats component render
 */

const Friends = ({ friends_list, setFriendsOpt, selectedFriend }) => {
  // dummy friends objects for development.
  // the lastSent flag is denoting if the friend was the last to send a message. If true, the last chat message comes from the friend, else from the logged in user
  // the status flag is set to 0, 1 or 2. 0=offline, 1=busy, 2=online

  const friends = [
    {
      name: "Jack Sparrow",
      img: "something/src.jpg",
      status: 0,
      lastSent: true,
      lastMessage: "Hey, what do you think of my new phone",
    },
    {
      name: "Coco Wood",
      img: "something/src.jpg",
      status: 1,
      lastSent: false,
      lastMessage: "Kevin, meet me there when the sun goes down",
    },
    {
      name: "Juliette Barton",
      img: "something/src.jpg",
      status: 2,
      lastSent: false,
      lastMessage: null,
    },
    {
      name: "Mark Ruffalo",
      img: "something/src.jpg",
      status: 0,
      lastSent: true,
      lastMessage:
        "Dear Rosa, you were not originally meant to pick up groceries",
    },
  ];

  return (
    <div id="friends">
      <div className="friends-display">
        {friends.map((friend, i) => {
          return <FriendItem key={i} friend={friend} />;
        })}
      </div>
      <div className="friends-chat-area"></div>
    </div>
  );
};

//Export the Friends component
export default Friends;
