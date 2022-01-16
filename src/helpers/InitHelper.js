/* eslint-disable new-cap */
/* eslint-disable no-underscore-dangle */
import UserModel from "../models/UserModel"

class initHelper {
    async initPlayers() {
        const players = []
        for (let index = 0; index < 20; index += 1) {
            const player = {
                avatar: {
                    fieldname: "images",
                    originalname: "HD-wallpaper-anime-demon-slayer-kimetsu-no-yaiba-tanjirou-kamado.jpeg",
                    encoding: "7bit",
                    mimetype: "image/jpeg",
                    filename:
                        "1639479826489-hire-player-HD-wallpaper-anime-demon-slayer-kimetsu-no-yaiba-tanjirou-kamado.jpeg",
                    size: 52599.0,
                    link: "http://104.248.150.205:3000/storage/images/1639479826489-hire-player-HD-wallpaper-anime-demon-slayer-kimetsu-no-yaiba-tanjirou-kamado.jpeg"
                },
                playerInfo: {
                    costPerHour: 100,
                    totalTimeHired: 0,
                    completionRate: 0,
                    avgRating: 0,
                    timeReceiveHire: [],
                    isReceiveHire: true,
                    timeMaxHire: 1000,
                    images: [
                        {
                            fieldname: "images",
                            originalname: "HD-wallpaper-anime-demon-slayer-kimetsu-no-yaiba-tanjirou-kamado.jpeg",
                            encoding: "7bit",
                            mimetype: "image/jpeg",
                            filename:
                                "1639479826489-hire-player-HD-wallpaper-anime-demon-slayer-kimetsu-no-yaiba-tanjirou-kamado.jpeg",
                            size: 52599.0,
                            link: "http://104.248.150.205:3000/storage/images/1639479826489-hire-player-HD-wallpaper-anime-demon-slayer-kimetsu-no-yaiba-tanjirou-kamado.jpeg"
                        },
                        {
                            fieldname: "images",
                            originalname: "h1.jpeg",
                            encoding: "7bit",
                            mimetype: "image/jpeg",
                            filename: "1639479826648-hire-player-h1.jpeg",
                            size: 97606.0,
                            link: "http://104.248.150.205:3000/storage/images/1639479826648-hire-player-h1.jpeg"
                        }
                    ],
                    statusHire: 1,
                    playerVerified: true,
                    deletedAt: null,
                    status: 1,
                    typePlayer: index % 2 === 0 ? 1 : 3,
                    playerName: `Player Vip ${index}`
                },
                money: 10000,
                isOnline: false,
                isPlayer: true,
                status: 3,
                deletedBy: null,
                roles: [3],
                password: "$2a$08$3HoER64nQ7PlpqAxPWYS2u4PQ9KZAwEZD9ZxdaU3pl/opAfWqMKZ6",
                emailVerifiedAt: new Date()
            }
            player.userName = `player_vip_${index}`
            player.email = `email_player_${index}@gmail.com`
            if (index === 1) {
                player.roles = [3, 2]
            }
            players.push(player)
        }
        await UserModel.insertMany(players)
    }
}

export default new initHelper()
