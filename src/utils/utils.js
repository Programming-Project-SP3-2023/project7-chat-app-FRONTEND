/**
 * App-wide utils functions
 */

import { getUserID } from "./localStorage";

/**
 * Filters users array to only get users who are not friends yet or haven't requested a friendship
 * @param {*} users a list of existing users
 * @param {*} friends a list of existing friendships
 * @returns array of users who are not friends
 */

export const getNonfriends = (users, friends) => {

    const areFriends = [];
    const areNotFriends = [];

    users.forEach(user => {
        friends.forEach (friend => {
            if(user.AccountID === friend.AccountID || user.AccountID === getUserID()) areFriends.push(user);
        })
    })

    users.forEach(user => {
        if (!areFriends.includes(user)) areNotFriends.push(user);
    })

    return areNotFriends;
}
