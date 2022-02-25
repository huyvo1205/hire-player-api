/* eslint-disable new-cap */
/* eslint-disable no-underscore-dangle */
import UserModel from "../models/UserModel"

class initHelper {
    async initPlayers() {
        const listImages = [
            "30_1645717405431_62179b122188febf9f4cb71f.jpeg",
            "30_1645718027211_62179b122188fe6aac4cb71c.png",
            "30_1645718310885_62179b122188fe28ac4cb71d.jpeg",
            "30_1645717556919_62179b122188fe6d294cb71e.jpeg",
            "30_1645718064260_62179b122188fe28ac4cb71d.png",
            "30_1645717582309_62179b122188fe6d294cb71e.png",
            "30_1645718274724_62179b122188fe6aac4cb71c.jpeg"
        ]
        const players = []
        for (let index = 0; index < 20; index += 1) {
            const numberRandom = Math.floor(Math.random() * 8)
            const numberRandom2 = Math.floor(Math.random() * 8)
            const image = listImages[numberRandom]
            const image2 = listImages[numberRandom2]
            const player = {
                avatar: {
                    fieldname: "images",
                    mimetype: "image/jpeg",
                    filename: "1645713965905_6217602e4222c8c8d00243f9.jpeg",
                    size: 52599.0,
                    link: `https://hireplayer.xyz/storage/avatar/${image}`
                },
                playerInfo: {
                    costPerHour: 100,
                    totalTimeHired: 0,
                    completionRate: 0,
                    avgRating: 0,
                    timeReceiveHire: [],
                    isReceiveHire: true,
                    timeMaxHire: 1000,
                    playerAvatar: {
                        encoding: "7bit",
                        mimetype: "image/jpeg",
                        filename: "1645713965905_6217602e4222c8c8d00243f9.jpeg",
                        size: 52599.0,
                        link: `https://hireplayer.xyz/storage/avatar/${image}`
                    },
                    images: [
                        {
                            encoding: "7bit",
                            mimetype: "image/jpeg",
                            filename: "1645713965905_6217602e4222c8c8d00243f9.jpeg",
                            size: 52599.0,
                            link: `https://hireplayer.xyz/storage/avatar/${image}`
                        },
                        {
                            mimetype: "image/jpeg",
                            filename: "1645713965905_6217602e4222c8c8d00243f9.jpeg",
                            size: 97606.0,
                            link: `https://hireplayer.xyz/storage/avatar/${image2}`
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
