import axios from 'axios';
import { User } from './App';
import { Notification } from './lists/UnreadMessage';

export class Api {
    link: string
    constructor() {
        this.link = process.env.REACT_APP_SERVER_LINK as string
    }
    async getUser(id: number): Promise<User> {
        const responce = await axios.get(`${this.link}/users/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const data = responce.data
        return data.user[0]
    }
    async getUsersExceptChosen(user: User): Promise<User[]> {
        const responce = await axios.get(`${this.link}/users/${user.id}/usersExceptChosen`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = responce.data
        return data.otherUsers
    }
    async sendMessage(sender: User, getter: User, text: string) {
        await axios.post(`${this.link}/users/${sender.id}/notifications`, {
            created_by: sender.id,
            sent_to: getter.id,
            text: text
        })
    }
    async readMessage(notificationId: number): Promise<boolean> {
        const responce = await axios.post(`${this.link}/notifications/${notificationId}`)
        if (responce.status == 200) {
            return true
        }
        else {
            return false
        }
    }
    async getNotifications(userId: Number): Promise<Notification[]> {
        const response = await axios.get(`${this.link}/users/${userId}/notifications/notRead`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data.notifications;
    }
    async getUsers(): Promise<User[]> {
        const responce = await axios.get(`http://localhost:5000/users`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return responce.data.user
    }

}
